"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function WelcomePwaScreen({ onContinue }: { onContinue: () => void }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showManualInstall, setShowManualInstall] = useState(false);
  const [hasInstalled, setHasInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already running as a standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      if (typeof onContinue === 'function') onContinue();
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also listen for successful installation
    window.addEventListener("appinstalled", () => {
      setHasInstalled(true);
      if (typeof onContinue === 'function') onContinue();
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [onContinue]);

  const handleInstallClick = () => {
    // Check if device is mobile
    const ua = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|windows phone/i.test(ua);
    
    if (isMobile) {
      // Show custom modal on mobile first
      setShowModal(true);
    } else {
      // On desktop, go straight to the native browser prompt (manifest)
      confirmInstall();
    }
  };

  const confirmInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setHasInstalled(true);
        if (typeof onContinue === 'function') onContinue();
      }
      setDeferredPrompt(null);
      setShowModal(false);
    } else {
      // If we don't have the prompt, show manual installation instructions
      setShowModal(false);
      setShowManualInstall(true);
    }
  };

  const getManualInstructions = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      return (
        <>
          <li>Tap the <strong>Share</strong> icon in your browser menu (usually at the bottom of the screen).</li>
          <li>Scroll down and select <strong>"Add to Home Screen"</strong>.</li>
          <li>Confirm by tapping <strong>"Add"</strong>.</li>
        </>
      );
    } else if (/android/.test(ua)) {
      return (
        <>
          <li>Tap the <strong>Menu</strong> icon (three dots) in your browser.</li>
          <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
          <li>Confirm by tapping <strong>"Install"</strong>.</li>
        </>
      );
    } else {
      return (
        <>
          <li>Click the <strong>Install</strong> icon on the right side of your browser's address bar.</li>
          <li>Or click the browser's menu (three dots) and select <strong>"Install ManMadhan Hub"</strong>.</li>
        </>
      );
    }
  };

  if (isStandalone) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
          __html: `
        .welcome-screen-container {
          position: fixed;
          inset: 0;
          z-index: 9998; /* Just below booting screen */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #FFFFFF; /* Light theme background */
          color: #111111; /* Dark text */
          padding: 24px;
          text-align: center;
        }

        .welcome-logo-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 40px;
          animation: floatIn 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .welcome-title {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          color: #000000 !important; /* Forces black text, overriding global dark mode */
          opacity: 0;
          transform: translateY(20px);
          animation: floatIn 1.5s cubic-bezier(0.25, 1, 0.5, 1) 0.2s forwards;
        }

        .welcome-tagline {
          font-size: 1.1rem;
          color: rgba(0, 0, 0, 0.6); /* Darker subtle text for light mode */
          max-width: 480px;
          line-height: 1.5;
          margin-bottom: 48px;
          opacity: 0;
          transform: translateY(20px);
          animation: floatIn 1.5s cubic-bezier(0.25, 1, 0.5, 1) 0.4s forwards;
        }

        .welcome-buttons {
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 12px;
          width: 100%;
          max-width: 400px;
          opacity: 0;
          transform: translateY(20px);
          animation: floatIn 1.5s cubic-bezier(0.25, 1, 0.5, 1) 0.6s forwards;
        }

        @media (min-width: 640px) {
          .welcome-title {
            font-size: 2.5rem;
          }
          .welcome-tagline {
            font-size: 1.25rem;
          }
          .welcome-buttons {
            gap: 16px;
          }
        }

        .btn-install {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #000000; /* Dark primary button for light theme */
          color: #ffffff; /* White text */
          font-weight: 600;
          padding: 14px 20px;
          border-radius: 12px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
          flex: 1;
          white-space: nowrap;
        }

        .btn-install:hover {
          background-color: #333333;
          transform: scale(1.02);
        }

        .btn-learn-more {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: transparent;
          color: #111111; /* Dark text */
          font-weight: 600;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.15); /* Subtle dark border */
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
          flex: 1;
          white-space: nowrap;
        }

        .btn-learn-more:hover {
          background-color: rgba(0, 0, 0, 0.05); /* Subtle dark hover */
          transform: scale(1.02);
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* --- Install Modal --- */
        .install-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .install-modal {
          background-color: #ffffff;
          border: 2px solid #000000;
          box-shadow: 16px 16px 0px rgba(0,0,0,0.06);
          padding: 32px 24px;
          max-width: 480px;
          width: 100%;
          text-align: center; /* Center aligned */
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .modal-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #000000;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .modal-version {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #000000;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px; /* Slight rounding for the pill */
          margin-bottom: 24px;
          letter-spacing: 0.05em;
        }

        .modal-desc {
          font-size: 1rem;
          color: #4B5563;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .btn-modal-cancel {
          flex: 1;
          padding: 14px 20px;
          background-color: transparent;
          border: 2px solid #E5E7EB;
          color: #000000;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-modal-cancel:hover {
          border-color: #000000;
        }

        .btn-modal-confirm {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          background-color: #000000;
          border: 2px solid #000000;
          color: #ffffff;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-modal-confirm:hover {
          background-color: #ffffff;
          color: #000000;
        }

        @keyframes floatIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
        <div className="welcome-screen-container">
          <div className="welcome-logo-container">
            <Image
              src="/favicon.ico"
              alt="ManMadhan Hub Logo"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>

          <h1 className="welcome-title">Welcome to ManMadhan Hub</h1>
          <p className="welcome-tagline">
            A futuristic AI ecosystem engineered for creators, developers, and intelligent teams to discover, automate, and orchestrate next-generation tools.
          </p>
          <div className="welcome-buttons">
            <button className="btn-install" onClick={handleInstallClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M21 15v4H3v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Install ManMadhan Hub
            </button>
          </div>
        </div>

        {showModal && (
          <div className="install-modal-overlay">
            <div className="install-modal">
              <h2 className="modal-title">Install ManMadhan Hub</h2>
              <div className="modal-version">VERSION 1.0</div>
              <p className="modal-desc">
                Install the full application directly to your device for immediate offline access, ultra-fast native performance, and deep OS integration.
              </p>
              <div className="modal-actions">
                <button className="btn-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-modal-confirm" onClick={confirmInstall}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                    <path d="M21 15v4H3v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Install
                </button>
              </div>
            </div>
          </div>
        )}

        {showManualInstall && (
          <div className="install-modal-overlay">
            <div className="install-modal">
              <h2 className="modal-title">Manual Installation</h2>
              <div className="modal-version">REQUIRED</div>
              <div className="modal-desc text-left space-y-4">
                <p>Your browser requires you to install the application manually.</p>
                <ul className="list-decimal pl-5 space-y-2 text-sm">
                  {getManualInstructions()}
                </ul>
                <p className="font-semibold text-center mt-4">Once added, open the app from your home screen!</p>
              </div>
              <div className="modal-actions mt-6">
                <button className="btn-modal-confirm w-full" onClick={() => setShowManualInstall(false)}>
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
