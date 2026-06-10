"use client";

import { useEffect, useState, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}

export type PushStatus = 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed' | 'loading';

async function doSubscribe() {
  const keyRes = await fetch(`${API}/api/v1/push/vapid-public-key`);
  const { publicKey } = await keyRes.json();

  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  const username = localStorage.getItem('user_name') || 'anonymous';
  await fetch(`${API}/api/v1/push/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('session_token')}`
    },
    body: JSON.stringify({ subscription: sub.toJSON(), username })
  });

  return sub;
}

export function usePushNotifications(options?: { autoEnable?: boolean }) {
  const [status, setStatus] = useState<PushStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    const perm = Notification.permission;
    if (perm === 'denied') { setStatus('denied'); return; }

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setStatus(sub ? 'subscribed' : 'unsubscribed');
    } catch {
      setStatus('unsubscribed');
    }
  }, []);

  // Auto-enable: silently subscribe on first load if permission is not denied
  useEffect(() => {
    if (!options?.autoEnable) { checkStatus(); return; }
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported'); return;
    }

    const alreadyPrompted = localStorage.getItem('push_auto_prompted');

    (async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        if (existing) { setStatus('subscribed'); return; }

        // If already denied, respect it
        if (Notification.permission === 'denied') { setStatus('denied'); return; }

        // If we already prompted before and they dismissed, don't prompt again
        if (alreadyPrompted === 'dismissed') { setStatus('unsubscribed'); return; }

        // Request permission (browser native popup)
        const permission = await Notification.requestPermission();
        localStorage.setItem('push_auto_prompted', permission === 'granted' ? 'granted' : 'dismissed');

        if (permission !== 'granted') { setStatus('unsubscribed'); return; }

        await doSubscribe();
        setStatus('subscribed');
      } catch {
        await checkStatus();
      }
    })();
  }, [options?.autoEnable, checkStatus]);

  useEffect(() => {
    if (!options?.autoEnable) return; // already handled above
  }, [options?.autoEnable]);

  const subscribe = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      await doSubscribe();
      localStorage.setItem('push_auto_prompted', 'granted');
      setStatus('subscribed');
    } catch (err: any) {
      setError(err?.message || 'Failed to subscribe');
      await checkStatus();
    }
  }, [checkStatus]);

  const unsubscribe = useCallback(async () => {
    setStatus('loading');
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch(`${API}/api/v1/push/unsubscribe`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('session_token')}`
          },
          body: JSON.stringify({ endpoint: sub.endpoint })
        });
        await sub.unsubscribe();
      }
      localStorage.setItem('push_auto_prompted', 'dismissed');
      setStatus('unsubscribed');
    } catch (err: any) {
      setError(err?.message || 'Failed to unsubscribe');
      await checkStatus();
    }
  }, [checkStatus]);

  return { status, error, subscribe, unsubscribe };
}
