"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Key, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, Fingerprint, Activity, ArrowLeft, CheckCircle2, Layers, Play, Shield, AlertTriangle, Search, Plus, MessageSquare, ArrowLeftRight } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Page = "login-email" | "login-password" | "password-change" | "lost-key" | "reset" | "success" | "verifying" | "welcome" | "google-chooser" | "account-not-found" | "create-identity" | "terms" | "activation" | "onboarding";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [currentPage, setCurrentPage] = useState<Page>("login-email");
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveredPassword, setRecoveredPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectedUser, setDetectedUser] = useState<{username?: string, role?: string}>({});

  const [googleStep, setGoogleStep] = useState<"list" | "custom">("list");
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const [identityOTP, setIdentityOTP] = useState<string[]>(Array(6).fill(""));
  const identityInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [failedGoogleEmail, setFailedGoogleEmail] = useState("");
  const [onboardingStep, setOnboardingStep] = useState(0);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1`;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage("login-email");
      setEmail("");
      setPass("");
      setOldPass("");
      setConfirmPass("");
      setRecoveryEmail("");
      setRecoveredPassword("");
      setShowPass(false);
      setShowOldPass(false);
      setShowConfirmPass(false);
      setIsLoading(false);
      setError("");
      setGoogleStep("list");
      setCustomGoogleEmail("");
      setGoogleLoading(false);
      setGoogleError("");
      setFailedGoogleEmail("");
      setIdentityOTP(Array(6).fill(""));
      setTermsAccepted(false);
      setOnboardingStep(0);
    }
  }, [isOpen]);

  // Page navigation with direction
  const goTo = (page: Page) => {
    setDirection(page === 'login-email' || page === 'login-password' ? -1 : 1);
    // Clear passkey fields whenever entering the reset page
    if (page === 'reset' || page === 'password-change') {
      setPass('');
      setOldPass('');
      setConfirmPass('');
      setShowPass(false);
      setShowOldPass(false);
      setShowConfirmPass(false);
    }
    setError('');
    setCurrentPage(page);
  };


  const handleWelcomeContinue = () => {
    const user = { role: typeof window !== "undefined" ? localStorage.getItem("user_role") : "" };
    const loggedInRoleRaw = user.role || 'member';
    const role = loggedInRoleRaw.toLowerCase() === 'owner' ? "owner" : "member";

    if (role === 'owner' || role === 'member') {
      const hasPendingQuery = !!localStorage.getItem("landing_search_query");
      const targetTab = hasPendingQuery ? "search-ai" : "overview";
      localStorage.setItem("dashboard_active_tab", targetTab);
      window.location.href = `/dashboard#${targetTab}`;
    } else {
      window.location.href = "/#hero";
      window.location.reload();
    }
  };

  const handleSuccessfulAuth = (data: any) => {
    // Store JWT Token
    if (data.token) {
      localStorage.setItem("session_token", data.token);
      localStorage.setItem("user_role", data.user.role);
      localStorage.setItem("user_name", data.user.username || data.user.id);
      // Use both sessionStorage AND localStorage flag so dashboard can detect active session
      sessionStorage.setItem("session_active", "true");
      localStorage.setItem("session_active_flag", "true");
      localStorage.setItem("session_start_time", Date.now().toString());
    }

    setIsLoading(false);
    setGoogleLoading(false);

    goTo("verifying");
    setTimeout(() => {
      goTo("welcome");
      // Auto redirect to dashboard after 2.5s
      setTimeout(() => {
        handleWelcomeContinue();
      }, 2500);
    }, 1000);
  };

  const loginWithGoogleAccessToken = async (token: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 || data.error?.toLowerCase().includes("not authorized") || data.error?.toLowerCase().includes("unauthorized")) {
          // Show inline account-not-found page inside modal
          setIsLoading(false);
          setGoogleLoading(false);
          goTo("account-not-found");
          return;
        }
        throw new Error(data.error || "Google authentication failed");
      }

      handleSuccessfulAuth(data);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      setGoogleLoading(false);
    }
  };

  const simulateGoogleLogin = async (mockEmail: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 || data.error?.toLowerCase().includes("not authorized") || data.error?.toLowerCase().includes("unauthorized")) {
          // Show inline account-not-found page inside modal
          setFailedGoogleEmail(mockEmail);
          setIsLoading(false);
          setGoogleLoading(false);
          goTo("account-not-found");
          return;
        }
        throw new Error(data.error || "Google authentication failed");
      }

      handleSuccessfulAuth(data);
    } catch (err: any) {
      setGoogleError(err.message || "Authentication failed");
      setIsLoading(false);
      setGoogleLoading(false);
    }
  };

  // Message listener for popup communication (real Google OAuth flow)
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      // Only process messages that have our expected structure.
      // Do NOT do strict origin check — the API may be on a different domain (e.g. Render).
      // We validate by checking the message type/content instead.
      if (!event.data || typeof event.data !== "object") return;
      if (event.data.type !== "GOOGLE_AUTH_SUCCESS" && event.data.type !== "GOOGLE_AUTH_FAILURE") return;

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        const { token, user } = event.data;
        if (!token || !user) return; // Ignore malformed messages
        handleSuccessfulAuth({ token, user });
      } else if (event.data.type === "GOOGLE_AUTH_FAILURE") {
        const errMsg = event.data.error || "";
        if (errMsg === "Unauthorized account" || errMsg.toLowerCase().includes("unauthorized") || errMsg.toLowerCase().includes("not authorized")) {
          // Show inline account-not-found page inside modal
          setIsLoading(false);
          setGoogleLoading(false);
          goTo("account-not-found");
        } else {
          setError(errMsg || "Google authentication failed");
          setIsLoading(false);
          setGoogleLoading(false);
          setCurrentPage("login-email");
        }
      }
    };

    window.addEventListener("message", handleAuthMessage);
    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, [API_URL]);

  const handleGoogleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1073860505474-mockclientid.apps.googleusercontent.com";
    const isLocalhost = typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (clientId.includes("mockclientid") && isLocalhost) {
      setGoogleStep("list");
      setGoogleError("");
      setCustomGoogleEmail("");
      setGoogleLoading(false);
      goTo("google-chooser");
      return;
    }

    // Real Passport.js Flow
    setIsLoading(true);
    setError("");

    console.log("[Auth] Initiating Google OAuth popup. Target API URL:", API_URL);

    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `${API_URL}/auth/google`,
      "GoogleSignIn",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`
    );

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleSelectGoogleEmail = (selectedEmail: string) => {
    setGoogleLoading(true);
    setGoogleError("");

    // Simulate realistic Google server round-trip delay
    setTimeout(async () => {
      try {
        await simulateGoogleLogin(selectedEmail);
      } catch (err: any) {
        setGoogleError(err.message || "Authentication failed");
        setGoogleLoading(false);
      }
    }, 1500);
  };

  const handleCustomGoogleSubmit = () => {
    if (!customGoogleEmail) return;

    let formattedEmail = customGoogleEmail.trim();
    if (!formattedEmail.includes("@")) {
      formattedEmail += "@gmail.com";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formattedEmail)) {
      setGoogleError("Please enter a valid Gmail address.");
      return;
    }

    handleSelectGoogleEmail(formattedEmail);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError("");
    
    try {
      const fullEmail = email.includes("@") ? email : `${email}@gmail.com`;
      const response = await fetch(`${API_URL}/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fullEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Account not found");
      }

      if (data.user) {
        setDetectedUser({ username: data.user.username, role: data.user.role });
      } else {
        setDetectedUser({});
      }

      setIsLoading(false);
      goTo("login-password");
    } catch (err: any) {
      setIsLoading(false);
      if (err.message === "Account not found" || err.message?.includes("not found")) {
        goTo("account-not-found");
      } else {
        setError(err.message || "An error occurred");
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pass) return;
    setIsLoading(true);
    setError("");

    const fullEmail = email.includes("@") ? email : `${email}@gmail.com`;

    // ── Offline login: use cached credentials ─────────────
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
    if (isOffline) {
      try {
        const { getOfflineAuthRecord, sha256 } = await import("@/lib/offlineCache");
        const record = await getOfflineAuthRecord(fullEmail);
        if (record) {
          const inputHash = await sha256(pass);
          if (inputHash === record.passkeyHash) {
            // Restore session from cached record
            handleSuccessfulAuth({ token: record.token, user: record.user });
            return;
          }
        }
        setError("Offline mode: credentials not recognised. Connect to the internet to log in for the first time.");
      } catch {
        setError("Offline login failed. Please check your connection.");
      }
      setIsLoading(false);
      return;
    }

    // ── Online login ──────────────────────────────────────
    try {
      console.log("[Auth] Initiating standard login. Target API URL:", API_URL);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fullEmail, passkey: pass }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Check if force password change is required (first-time login)
      if (data.user.mustChangePassword) {
        setRecoveryEmail(fullEmail); // Store for the reset flow
        setError("First-time login detected. Please establish your permanent passkey.");
        goTo("password-change");
        setIsLoading(false);
        return;
      }

      // Cache credentials for future offline login
      try {
        const { cacheAuthRecord, sha256 } = await import("@/lib/offlineCache");
        const passkeyHash = await sha256(pass);
        await cacheAuthRecord({
          email: fullEmail,
          passkeyHash,
          token: data.token,
          user: data.user,
          cachedAt: Date.now(),
        });
      } catch { /* non-critical */ }

      // Standard login for existing accounts
      handleSuccessfulAuth(data);

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setIsLoading(true);
    setError("");

    try {
      const fullEmail = recoveryEmail.includes("@") ? recoveryEmail : `${recoveryEmail}@gmail.com`;
      const response = await fetch(`${API_URL}/auth/auto-recover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fullEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Account not found");
      }

      setRecoveredPassword(data.recoveryPassword);
      setIsLoading(false);
      goTo("reset");
    } catch (err: any) {
      setError(err.message || "Account not found");
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass !== confirmPass) {
      setError("Passkeys do not match.");
      return;
    }
    if (pass.length < 8) {
      setError("Permanent passkey must be at least 8 characters.");
      return;
    }
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
    if (!complexityRegex.test(pass)) {
      setError("Passkey must include uppercase, lowercase, a number, and a special character.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const fullEmail = recoveryEmail.includes("@") ? recoveryEmail : `${recoveryEmail}@gmail.com`;
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fullEmail,
          oldPasskey: oldPass,
          newPasskey: pass
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Reset failed. Verify your old passkey.");
      }

      // Store JWT Token and details
      if (data.token) {
        localStorage.setItem("session_token", data.token);
        localStorage.setItem("user_role", data.user.role);
        localStorage.setItem("user_name", data.user.username || data.user.id);
        sessionStorage.setItem("session_active", "true");
        localStorage.setItem("session_active_flag", "true");
        localStorage.setItem("session_start_time", Date.now().toString());
      }

      // After successful reset, show success screen then redirect
      setIsLoading(false);
      goTo("success");
      setTimeout(() => {
        goTo("create-identity");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleCreateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    const identityStr = identityOTP.join('');

    if (!termsAccepted) {
      setError("You must accept the terms & conditions.");
      return;
    }
    const identityRegex = /^[A-Z]{2}\d{4}$/;
    if (!identityRegex.test(identityStr)) {
      setError("Identity must be exactly 2 letters followed by 4 numbers (e.g. AB1234).");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const currentEmail = recoveryEmail || email;
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("session_token")}`
        },
        body: JSON.stringify({
          username: identityStr.toUpperCase(),
          email: currentEmail
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to establish identity.");
      }

      setIsLoading(false);
      goTo("terms");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleTermsAccept = () => {
    goTo("activation");
    setTimeout(() => {
      goTo("onboarding");
    }, 4000); // 4 seconds matrix animation
  };

  const handleOnboardingFinish = () => {
    const hasPendingQuery = !!localStorage.getItem("landing_search_query");
    const targetTab = hasPendingQuery ? "search-ai" : "overview";
    localStorage.setItem("dashboard_active_tab", targetTab);
    window.location.href = `/dashboard#${targetTab}`;
  };
  const handleOTPChange = (index: number, value: string) => {
    let val = value.toUpperCase();
    if (val.length > 1) val = val.slice(-1);

    if (val) {
      if (index < 2 && !/^[A-Z]$/.test(val)) return;
      if (index >= 2 && !/^[0-9]$/.test(val)) return;
    }

    const newOTP = [...identityOTP];
    newOTP[index] = val;
    setIdentityOTP(newOTP);

    if (val && index < 5) {
      identityInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !identityOTP[index] && index > 0) {
      identityInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").toUpperCase().trim().slice(0, 6);
    if (!pastedData) return;

    const newOTP = [...identityOTP];
    let focusIndex = 0;

    for (let i = 0; i < pastedData.length; i++) {
      const char = pastedData[i];
      if (i < 2 && /^[A-Z]$/.test(char)) {
        newOTP[i] = char;
        focusIndex = i;
      } else if (i >= 2 && /^[0-9]$/.test(char)) {
        newOTP[i] = char;
        focusIndex = i;
      } else {
        break;
      }
    }

    setIdentityOTP(newOTP);
    if (focusIndex < 5 && newOTP[focusIndex]) {
      identityInputRefs.current[focusIndex + 1]?.focus();
    } else {
      identityInputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-0 sm:p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
        >
          {/* Animated Mesh Gradient Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[-2] bg-[var(--bg)] overflow-hidden"
          >
            <div className="absolute inset-0 opacity-40 mix-blend-normal sm:mix-blend-screen dark:mix-blend-normal sm:dark:mix-blend-color-dodge">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--emerald)] rounded-full mix-blend-normal sm:mix-blend-multiply filter blur-[60px] sm:blur-[100px] opacity-50 sm:animate-blob" />
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--neon)] rounded-full mix-blend-normal sm:mix-blend-multiply filter blur-[60px] sm:blur-[100px] opacity-50 sm:animate-blob sm:animation-delay-2000" />
              <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[var(--mint)] rounded-full mix-blend-normal sm:mix-blend-multiply filter blur-[60px] sm:blur-[100px] opacity-50 sm:animate-blob sm:animation-delay-4000" />
            </div>
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.05] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          </motion.div>

          {/* Darken Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-[8px] z-[-1]"
          />

          {/* Centered Glass Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15, ease: "easeOut" } }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`relative w-full h-full max-w-[880px] ${currentPage === 'onboarding' ? 'sm:h-[680px]' : 'sm:h-auto sm:min-h-[520px]'} rounded-none sm:rounded-[24px] overflow-hidden border-0 sm:border border-[var(--border2)] shadow-none sm:shadow-[var(--shadow-card),var(--glow)] bg-[var(--bg)] sm:bg-[var(--glass)] backdrop-blur-none sm:backdrop-blur-2xl flex flex-col md:flex-row transition-all duration-500`}
          >
            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="hidden md:flex absolute top-6 right-6 z-[100] w-10 h-10 items-center justify-center rounded-full bg-[var(--bg2)]/50 border border-[var(--border2)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border3)] transition-all duration-250 backdrop-blur-md cursor-pointer outline-none focus:outline-none"
            >
              <X size={20} />
            </button>

            {/* Mobile Back/Close Button */}
            <button
              onClick={() => {
                if (currentPage !== "login-email") goTo("login-email");
                else onClose();
              }}
              className="md:hidden absolute left-4 z-[100] w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg2)]/50 border border-[var(--border2)] text-[var(--muted)] hover:text-[var(--text)] transition-all duration-250 backdrop-blur-md cursor-pointer outline-none focus:outline-none"
              style={{ top: "calc(16px + env(safe-area-inset-top))" }}
            >
              {currentPage !== "login-email" ? <ArrowLeft size={20} /> : <X size={20} />}
            </button>

            {/* Left Branding Panel */}
            <div className={`hidden ${currentPage === 'onboarding' ? '' : 'md:flex md:w-[45%]'} relative flex-col p-[40px] border-r border-[var(--border2)] bg-[var(--bg2)]/30 overflow-hidden`}>
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={currentPage === "lost-key" || currentPage === "reset" ? "lost-key-left" : "login-left"}
                  custom={direction}
                  initial={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full h-full flex flex-col justify-between"
                >
                  {currentPage === "lost-key" || currentPage === "reset" ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-[var(--emerald)]/10 to-transparent opacity-60 pointer-events-none" />
                      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />

                      <div className="relative z-10 flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-[12px] bg-[var(--glass)] border border-[var(--border2)] flex items-center justify-center shadow-[0_0_15px_rgba(var(--particle-rgb),0.2)] backdrop-blur-md">
                          <Key className="w-5 h-5 text-[var(--emerald)]" />
                        </div>
                        <div>
                          <h2 className="font-display text-[26px] font-black text-[var(--text)] tracking-tight leading-[1.1] mb-2">
                            Secure Recovery
                          </h2>
                          <p className="text-[12px] text-[var(--muted)] max-w-[200px] leading-relaxed">
                            Regain access to your encrypted workspace environment.
                          </p>
                        </div>
                      </div>

                      {/* Security Recovery Graphic */}
                      <div className="flex-1 flex items-center justify-center relative pointer-events-none opacity-80 my-8">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-[var(--neon)]/20 blur-[70px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[var(--emerald)]/20 blur-[60px]" />

                        <div className="relative w-48 h-48">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="absolute inset-0 bg-[var(--glass)] border border-[var(--border3)] rounded-[32px] shadow-[0_16px_48px_rgba(var(--particle-rgb),0.1)] backdrop-blur-xl flex items-center justify-center"
                          >
                            <div className="w-24 h-24 rounded-full border-[2px] border-[var(--neon)] border-dashed animate-[spin_10s_linear_infinite] opacity-30 absolute" />
                            <div className="w-16 h-16 rounded-[20px] bg-[var(--bg2)] border border-[var(--emerald)]/50 flex items-center justify-center shadow-[0_0_20px_var(--emerald)] relative z-10">
                              <Fingerprint size={28} className="text-[var(--emerald)]" />
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)] animate-pulse shadow-[0_0_8px_var(--emerald)]" />
                          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--emerald)]">Recovery Protocol</span>
                        </div>
                        <div className="text-[9px] text-[var(--muted2)] font-mono uppercase tracking-wider">
                          Identity Verification
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-[var(--neon)]/10 to-transparent opacity-60 pointer-events-none" />
                      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />

                      <div className="relative z-10 flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-[12px] bg-[var(--glass)] border border-[var(--border2)] flex items-center justify-center shadow-[0_0_15px_rgba(var(--particle-rgb),0.2)] backdrop-blur-md">
                          <ShieldCheck className="w-5 h-5 text-[var(--neon)]" />
                        </div>
                        <div>
                          <h2 className="font-display text-[26px] font-black text-[var(--text)] tracking-tight leading-[1.1] mb-2">
                            Professional Workspace
                          </h2>
                          <p className="text-[12px] text-[var(--muted)] max-w-[200px] leading-relaxed">
                            Secure authentication for your enterprise AI environment.
                          </p>
                        </div>
                      </div>

                      {/* Professional Branding Graphic */}
                      <div className="flex-1 flex items-center justify-center relative pointer-events-none opacity-80 my-8">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[var(--emerald)]/20 blur-[80px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[var(--neon)]/20 blur-[60px]" />

                        {/* Glassmorphic Cards Stack */}
                        <div className="relative w-48 h-48">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="absolute inset-0 bg-[var(--glass)] border border-[var(--border2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl rotate-6 translate-x-4"
                          />
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="absolute inset-0 bg-[var(--glass)] border border-[var(--border3)] rounded-2xl shadow-[0_16px_48px_rgba(var(--particle-rgb),0.1)] backdrop-blur-xl -rotate-3 -translate-x-2 flex items-center justify-center"
                          >
                            <div className="w-20 h-20 rounded-full border-[2px] border-[var(--neon)]/30 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full border border-[var(--emerald)]/50 flex items-center justify-center bg-[var(--neon)]/10 shadow-[0_0_20px_var(--neon)]">
                                <Activity size={20} className="text-[var(--neon)]" />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse shadow-[0_0_8px_var(--neon)]" />
                          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--neon)]">Secure Network</span>
                        </div>
                        <div className="text-[9px] text-[var(--muted2)] font-mono uppercase tracking-wider">
                          Enterprise Node Active
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Form Panel */}
            <div className={`w-full flex-1 overflow-y-auto pt-[calc(80px+env(safe-area-inset-top))] flex flex-col justify-center relative overscroll-none ${
              currentPage === 'onboarding' ? 'p-0 h-full' : 'p-[32px_24px] md:p-[40px_48px] md:w-[55%]'
            }`}>
              {/* Optional top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent opacity-50" />

              <AnimatePresence custom={direction} mode="popLayout">
                {currentPage === "login-email" && (
                  <motion.div
                    key="login-email"
                    custom={direction}
                    initial={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col w-full"
                  >
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-12 h-12 rounded-[16px] bg-[var(--bg2)]/50 border border-[var(--border2)] flex items-center justify-center shadow-inner mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/20 to-transparent" />
                        <ShieldCheck className="w-6 h-6 text-[var(--neon)] relative z-10" />
                      </div>
                      <h1 className="font-display text-[24px] md:text-[28px] font-extrabold text-[var(--text)] tracking-tight mb-2">
                        Welcome back
                      </h1>
                      <p className="text-[12px] md:text-[13px] text-[var(--muted)] leading-relaxed max-w-[280px]">
                        Sign in to <strong className="text-[var(--text)] font-medium">Manmadhan's Hub</strong> — your private AI universe.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <button
                        type="button"
                        onClick={handleGoogleClick}
                        className="group relative flex items-center justify-center gap-3 w-full h-[48px] bg-[var(--bg2)]/80 border border-[var(--border2)] rounded-[14px] hover:border-[var(--border3)] text-[var(--text)] transition-all overflow-hidden cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon)]/0 via-[var(--neon)]/5 to-[var(--neon)]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <svg width="18" height="18" viewBox="0 0 18 18" className="relative z-10">
                          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C18.619 14.083 17.64 11.773 17.64 9.2z" fill="#4285F4" />
                          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                          <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
                          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        <span className="text-[13px] font-bold tracking-wide relative z-10">Continue with Google</span>
                      </button>

                      <div className="flex items-center gap-3 my-1">
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[var(--border2)]" />
                        <span className="text-[10px] uppercase tracking-widest text-[var(--muted2)] font-semibold">Or</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[var(--border2)]" />
                      </div>

                      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] group-focus-within:text-[var(--neon)] transition-colors z-10">
                            <Mail size={16} />
                          </div>
                          <input
                            type="text"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value.replace('@gmail.com', ''))}
                            className="peer w-full h-[48px] bg-[var(--input-bg)]/80 border border-[var(--border2)] rounded-[14px] pl-[44px] pr-[96px] text-[14px] text-[var(--text)] outline-none focus:border-[var(--border3)] focus:bg-[var(--bg2)] transition-all pt-2"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[var(--muted2)] pointer-events-none pt-[8px] peer-focus:text-[var(--neon)] transition-colors">
                            @gmail.com
                          </div>
                          <label className="absolute left-[44px] top-1/2 -translate-y-1/2 text-[13px] text-[var(--muted2)] pointer-events-none transition-all peer-focus:-translate-y-[18px] peer-focus:text-[10px] peer-focus:text-[var(--neon)] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-translate-y-[18px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold">
                            Email Address
                          </label>
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 text-[12px] text-red-500 flex items-start gap-2"
                          >
                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="leading-snug">{error}</span>
                          </motion.div>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading || !email}
                          className="btn-3d-primary group relative w-full h-[48px] rounded-[14px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden cursor-pointer"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span className="text-[14px] font-bold tracking-wide">Next</span>
                              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {currentPage === "login-password" && (
                  <motion.div
                    key="login-password"
                    custom={direction}
                    initial={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col w-full"
                  >
                    <button type="button" onClick={() => goTo("login-email")} className="hidden md:flex items-center gap-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--neon)] transition-colors mb-4 w-fit cursor-pointer">
                      ← Back
                    </button>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6">
                      <h1 className="font-display text-[24px] md:text-[28px] font-extrabold text-[var(--text)] tracking-tight mb-4">
                        Account Found
                      </h1>

                      <div className="w-full flex items-center gap-4 p-3 rounded-[14px] bg-[var(--bg2)]/50 border border-[var(--border2)]">
                        <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[var(--neon)]/20 to-[var(--emerald)]/20 flex items-center justify-center text-[var(--text)] font-bold text-lg border border-[var(--border2)] shadow-sm">
                          {(detectedUser.username || email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-semibold text-[var(--text)]">
                              {detectedUser.username || "ManMadhan Member"}
                            </span>
                            {detectedUser.role && (
                              <span className="px-1.5 py-0.5 rounded-[4px] bg-[var(--neon)]/10 text-[var(--neon)] text-[9px] font-bold uppercase tracking-wider">
                                {detectedUser.role === 'owner' ? 'Owner' : detectedUser.role}
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-[var(--muted)]">{email.includes('@') ? email : email + '@gmail.com'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] group-focus-within:text-[var(--neon)] transition-colors z-10">
                            <Lock size={16} />
                          </div>
                          <input
                            type={showPass ? "text" : "password"}
                            placeholder=" "
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            autoComplete="current-password"
                            className="peer w-full h-[48px] bg-[var(--input-bg)]/80 border border-[var(--border2)] rounded-[14px] pl-[44px] pr-[44px] text-[14px] text-[var(--text)] outline-none focus:border-[var(--border3)] focus:bg-[var(--bg2)] transition-all pt-2"
                          />
                          <label className="absolute left-[44px] top-1/2 -translate-y-1/2 text-[13px] text-[var(--muted2)] pointer-events-none transition-all peer-focus:-translate-y-[18px] peer-focus:text-[10px] peer-focus:text-[var(--neon)] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-translate-y-[18px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold">
                            Enter Passkey
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] hover:text-[var(--neon)] transition-colors z-10 cursor-pointer"
                          >
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 text-[12px] text-red-500 flex items-start gap-2"
                          >
                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="leading-snug">{error}</span>
                          </motion.div>
                        )}

                        <div className="flex items-center justify-between mt-1 mb-2 px-1">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-4 h-4 rounded-[4px] border border-[var(--border2)] bg-[var(--input-bg)] flex items-center justify-center group-hover:border-[var(--neon)] transition-all">
                              <div className="w-2 h-2 rounded-[2px] bg-[var(--neon)] opacity-0 group-active:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[11px] font-medium text-[var(--muted)]">Remember me</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => goTo("lost-key")}
                            className="text-[11px] font-medium text-[var(--neon)] hover:text-[var(--emerald)] transition-colors cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading || !pass}
                          className="btn-3d-primary group relative w-full h-[48px] rounded-[14px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden cursor-pointer"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span className="text-[14px] font-bold tracking-wide">Sign In</span>
                              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {currentPage === "lost-key" && (
                  <motion.div
                    key="lost-key"
                    custom={direction}
                    initial={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col w-full"
                  >
                    <button type="button" onClick={() => goTo("login-email")} className="hidden md:flex items-center gap-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--neon)] transition-colors mb-6 w-fit cursor-pointer">
                      ← Back to login
                    </button>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6">
                      <div className="w-12 h-12 rounded-[16px] bg-[var(--bg2)]/50 border border-[var(--border2)] flex items-center justify-center shadow-inner mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/20 to-transparent" />
                        <Key className="w-6 h-6 text-[var(--neon)] relative z-10" />
                      </div>
                      <h1 className="font-display text-[24px] md:text-[28px] font-extrabold text-[var(--text)] tracking-tight mb-2">
                        Recover Access
                      </h1>
                      <p className="text-[12px] md:text-[13px] text-[var(--muted)] leading-relaxed max-w-[280px]">
                        Enter your registered email ID to begin the secure recovery sequence.
                      </p>
                    </div>

                    <div className="flex flex-col gap-5">
                      <form onSubmit={handleSendCode} className="flex flex-col gap-5 w-full">
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] group-focus-within:text-[var(--neon)] transition-colors z-10">
                            <Mail size={16} />
                          </div>
                          <input
                            type="text"
                            placeholder=" "
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value.replace('@gmail.com', ''))}
                            className="peer w-full h-[48px] bg-[var(--input-bg)]/80 border border-[var(--border2)] rounded-[14px] pl-[44px] pr-[96px] text-[14px] text-[var(--text)] outline-none focus:border-[var(--border3)] focus:bg-[var(--bg2)] transition-all pt-2"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[var(--muted2)] pointer-events-none pt-[8px] peer-focus:text-[var(--neon)] transition-colors">
                            @gmail.com
                          </div>
                          <label className="absolute left-[44px] top-1/2 -translate-y-1/2 text-[13px] text-[var(--muted2)] pointer-events-none transition-all peer-focus:-translate-y-[18px] peer-focus:text-[10px] peer-focus:text-[var(--neon)] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-translate-y-[18px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold">
                            Registered Email
                          </label>
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 text-[12px] text-red-500 flex items-start gap-2"
                          >
                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="leading-snug">{error}</span>
                          </motion.div>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading || !recoveryEmail}
                          className="btn-3d-primary group w-full h-[48px] rounded-[14px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span className="text-[14px] font-bold tracking-wide">Identify Account</span>
                              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {currentPage === "reset" && (
                  <motion.div
                    key="reset"
                    custom={direction}
                    initial={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col w-full"
                  >
                    <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6">
                      <div className="w-12 h-12 rounded-[16px] bg-[var(--bg2)]/50 border border-[var(--border2)] flex items-center justify-center shadow-inner mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--emerald)]/20 to-transparent" />
                        <CheckCircle2 className="w-6 h-6 text-[var(--emerald)] relative z-10" />
                      </div>
                      <h1 className="font-display text-[24px] md:text-[28px] font-extrabold text-[var(--text)] tracking-tight mb-2">
                        Auto Recovery Successful
                      </h1>
                      <p className="text-[12px] md:text-[13px] text-[var(--muted)] leading-relaxed max-w-[280px]">
                        We've generated a temporary recovery passkey for you. Please copy it and use it to log in immediately. You will be prompted to change it upon login.
                      </p>
                    </div>

                    <div className="flex flex-col gap-5 w-full">
                      <div className="p-4 rounded-[14px] bg-[var(--bg2)] border border-[var(--emerald)]/30 flex flex-col gap-2 relative">
                        <span className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">Temporary Passkey</span>
                        <div className="flex items-center justify-between">
                          <span className="text-[16px] font-mono font-bold text-[var(--neon)] tracking-wider select-all">{recoveredPassword}</span>
                          <button 
                            onClick={() => navigator.clipboard.writeText(recoveredPassword)}
                            className="p-2 rounded-lg bg-[var(--bg)] hover:bg-[var(--glass)] border border-[var(--border2)] text-[var(--muted)] hover:text-[var(--text)] transition-all cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => goTo("login-email")}
                        className="btn-3d-primary group w-full h-[48px] rounded-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                      >
                        <span className="text-[14px] font-bold tracking-wide">Back to Login</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentPage === "password-change" && (
                  <motion.div
                    key="password-change"
                    custom={direction}
                    initial={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col w-full"
                  >
                    <button type="button" onClick={() => goTo("login-password")} className="hidden md:flex items-center gap-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--neon)] transition-colors mb-6 w-fit cursor-pointer">
                      ← Back
                    </button>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6">
                      <div className="w-12 h-12 rounded-[16px] bg-[var(--bg2)]/50 border border-[var(--border2)] flex items-center justify-center shadow-inner mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/20 to-transparent" />
                        <Lock className="w-6 h-6 text-[var(--neon)] relative z-10" />
                      </div>
                      <h1 className="font-display text-[24px] md:text-[28px] font-extrabold text-[var(--text)] tracking-tight mb-2">
                        Change Passkey
                      </h1>
                      <p className="text-[12px] md:text-[13px] text-[var(--muted)] leading-relaxed max-w-[280px]">
                        Create a strong, permanent passkey for your account.
                      </p>
                    </div>

                    <div className="flex flex-col gap-5">
                      <form onSubmit={handleReset} className="flex flex-col gap-5 w-full">
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] group-focus-within:text-[var(--neon)] transition-colors z-10">
                            <Lock size={16} />
                          </div>
                          <input
                            type={showOldPass ? "text" : "password"}
                            placeholder=" "
                            value={oldPass}
                            onChange={(e) => setOldPass(e.target.value)}
                            className="peer w-full h-[48px] bg-[var(--input-bg)]/80 border border-[var(--border2)] rounded-[14px] pl-[44px] pr-[44px] text-[14px] text-[var(--text)] outline-none focus:border-[var(--border3)] focus:bg-[var(--bg2)] transition-all pt-2"
                          />
                          <label className="absolute left-[44px] top-1/2 -translate-y-1/2 text-[13px] text-[var(--muted2)] pointer-events-none transition-all peer-focus:-translate-y-[18px] peer-focus:text-[10px] peer-focus:text-[var(--neon)] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-translate-y-[18px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold">
                            Old Passkey (Temporary)
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowOldPass(!showOldPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] hover:text-[var(--neon)] transition-colors z-10 cursor-pointer"
                          >
                            {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] group-focus-within:text-[var(--neon)] transition-colors z-10">
                            <Lock size={16} />
                          </div>
                          <input
                            type={showPass ? "text" : "password"}
                            placeholder=" "
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="peer w-full h-[48px] bg-[var(--input-bg)]/80 border border-[var(--border2)] rounded-[14px] pl-[44px] pr-[44px] text-[14px] text-[var(--text)] outline-none focus:border-[var(--border3)] focus:bg-[var(--bg2)] transition-all pt-2"
                          />
                          <label className="absolute left-[44px] top-1/2 -translate-y-1/2 text-[13px] text-[var(--muted2)] pointer-events-none transition-all peer-focus:-translate-y-[18px] peer-focus:text-[10px] peer-focus:text-[var(--neon)] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-translate-y-[18px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold">
                            New Permanent Passkey
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] hover:text-[var(--neon)] transition-colors z-10 cursor-pointer"
                          >
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] group-focus-within:text-[var(--neon)] transition-colors z-10">
                            <CheckCircle2 size={16} />
                          </div>
                          <input
                            type={showConfirmPass ? "text" : "password"}
                            placeholder=" "
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="peer w-full h-[48px] bg-[var(--input-bg)]/80 border border-[var(--border2)] rounded-[14px] pl-[44px] pr-[44px] text-[14px] text-[var(--text)] outline-none focus:border-[var(--border3)] focus:bg-[var(--bg2)] transition-all pt-2"
                          />
                          <label className="absolute left-[44px] top-1/2 -translate-y-1/2 text-[13px] text-[var(--muted2)] pointer-events-none transition-all peer-focus:-translate-y-[18px] peer-focus:text-[10px] peer-focus:text-[var(--neon)] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-translate-y-[18px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold">
                            Confirm New Passkey
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted2)] hover:text-[var(--neon)] transition-colors z-10 cursor-pointer"
                          >
                            {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 text-[12px] text-red-500 flex items-start gap-2"
                          >
                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="leading-snug">{error}</span>
                          </motion.div>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading || !pass || !confirmPass || !oldPass}
                          className="btn-3d-primary group w-full h-[48px] rounded-[14px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer mt-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span className="text-[14px] font-bold tracking-wide">Finalize Reset</span>
                              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {currentPage === "verifying" && (
                  <motion.div
                    key="verifying"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 text-center h-full w-full"
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-[var(--neon)]/20 rounded-full blur-xl animate-pulse" />
                      <Loader2 className="w-14 h-14 text-[var(--neon)] animate-spin relative z-10" />
                    </div>
                    <h2 className="font-display text-[24px] font-bold text-[var(--text)] mb-2">Authenticating</h2>
                    <p className="text-[14px] text-[var(--muted)]">Verifying your secure identity...</p>
                  </motion.div>
                )}

                {currentPage === "welcome" && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-10 text-center h-full w-full"
                  >
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-[var(--neon)]/20 rounded-full blur-[40px] animate-pulse" />
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="w-24 h-24 rounded-full bg-[var(--bg2)] border border-[var(--border3)] flex items-center justify-center shadow-[0_0_30px_rgba(var(--neon-rgb),0.3)] relative z-10"
                      >
                        <span className="text-[40px]">👋</span>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center w-full"
                    >
                      <h2 className="font-display text-[28px] md:text-[36px] font-extrabold text-[var(--text)] tracking-tight mb-2">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon)] to-[var(--emerald)]">{typeof window !== "undefined" ? localStorage.getItem("user_name") || detectedUser?.username || "there" : "there"}</span>
                      </h2>
                      <p className="text-[14px] text-[var(--muted)] mb-10 max-w-[280px]">
                        Welcome back to ManMadhan's Hub. Your workspace is secured and ready.
                      </p>
                      
                      <div className="flex items-center gap-3 text-[13px] font-bold tracking-widest uppercase text-[var(--muted)]">
                        <Loader2 size={16} className="animate-spin text-[var(--neon)]" />
                        <span>Opening Dashboard</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {currentPage === "create-identity" && (
                  <motion.div
                    key="create-identity"
                    custom={direction}
                    initial={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col w-full"
                  >
                    <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6">
                      <div className="w-12 h-12 rounded-[16px] bg-[var(--bg2)]/50 border border-[var(--border2)] flex items-center justify-center shadow-inner mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/20 to-transparent" />
                        <Fingerprint className="w-6 h-6 text-[var(--neon)] relative z-10" />
                      </div>
                      <h1 className="font-display text-[24px] md:text-[28px] font-extrabold text-[var(--text)] tracking-tight mb-2">
                        Establish Identity
                      </h1>
                      <p className="text-[12px] md:text-[13px] text-[var(--muted)] leading-relaxed max-w-[280px]">
                        Please set your permanent Manmadhan Identity. Format must be 2 letters followed by 4 numbers (e.g. AB1234).
                      </p>
                    </div>

                    <div className="flex flex-col gap-5">
                      <form onSubmit={handleCreateIdentity} className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col gap-2 relative">
                          <label className="text-[13px] text-[var(--muted2)] font-semibold mb-1">
                            Manmadhan Identity
                          </label>
                          <div className="flex gap-2 sm:gap-3 w-full justify-between">
                            {identityOTP.map((val, index) => (
                              <React.Fragment key={`otp-${index}`}>
                                <input
                                  ref={(el) => {
                                    identityInputRefs.current[index] = el;
                                  }}
                                  type="text"
                                  value={val}
                                  onChange={(e) => handleOTPChange(index, e.target.value)}
                                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                  onPaste={index === 0 ? handleOTPPaste : undefined}
                                  maxLength={2}
                                  className={`w-10 sm:w-12 h-12 sm:h-14 bg-[var(--input-bg)]/80 border ${val ? 'border-[var(--neon)]' : 'border-[var(--border2)]'} rounded-[12px] text-center text-[18px] sm:text-[20px] font-bold text-[var(--text)] uppercase outline-none focus:border-[var(--neon)] focus:bg-[var(--bg2)] focus:shadow-[0_0_15px_rgba(0,255,150,0.1)] transition-all`}
                                />
                                {index === 1 && (
                                  <div className="flex items-center justify-center text-[var(--muted2)] px-1 sm:px-2">-</div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer group mt-2">
                          <div className="w-5 h-5 rounded-[6px] border border-[var(--border2)] bg-[var(--input-bg)] flex items-center justify-center shrink-0 group-hover:border-[var(--neon)] transition-colors mt-0.5 relative overflow-hidden">
                            <input
                              type="checkbox"
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              className="absolute opacity-0 w-full h-full cursor-pointer"
                            />
                            <div className={`w-3 h-3 rounded-[2px] bg-[var(--neon)] transition-transform ${termsAccepted ? 'scale-100' : 'scale-0'}`} />
                          </div>
                          <span className="text-[12px] text-[var(--muted)] leading-relaxed">
                            I accept the <strong className="text-[var(--text)] font-medium hover:text-[var(--neon)] transition-colors">Terms & Conditions</strong> and acknowledge that this identity is permanent.
                          </span>
                        </label>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 text-[12px] text-red-500 flex items-start gap-2"
                          >
                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="leading-snug">{error}</span>
                          </motion.div>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading || identityOTP.some(v => v === "") || !termsAccepted}
                          className="btn-3d-primary group w-full h-[48px] rounded-[14px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer mt-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span className="text-[14px] font-bold tracking-wide">Grant Access</span>
                              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {currentPage === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 text-center h-full w-full"
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                      <div className="w-16 h-16 rounded-[16px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative z-10 shadow-inner">
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                      </div>
                    </div>
                    <h2 className="font-display text-[24px] font-bold text-[var(--text)] mb-2">Security Updated</h2>
                    <p className="text-[14px] text-[var(--muted)]">Your passkey has been successfully reset. Redirecting...</p>
                  </motion.div>
                )}

                {currentPage === "account-not-found" && (
                  <motion.div
                    key="account-not-found"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-10 text-center h-full w-full"
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                      <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(239,68,68,0.2)] transform -rotate-3 hover:rotate-0 transition-transform">
                        <AlertTriangle className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 mb-5 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">403 Access Denied</span>
                    </div>
                    <h2 className="font-display text-[26px] md:text-[30px] font-extrabold text-[var(--text)] tracking-tight mb-3">
                      Account Not Found
                    </h2>
                    <p className="text-[14px] text-[var(--muted)] leading-relaxed max-w-[320px] mb-10">
                      The account <strong className="text-[var(--text)] font-semibold">{failedGoogleEmail || email || 'you entered'}</strong> is not authorized.
                      <br className="mt-2" />
                      Please contact a Super Admin to register your email before logging in.
                    </p>
                    <button 
                      onClick={() => goTo("login-email")} 
                      className="group w-full max-w-[280px] h-[52px] rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer bg-[var(--bg2)] border border-[var(--border2)] hover:border-[var(--border3)] hover:bg-[var(--bg3)]"
                    >
                      <ArrowLeft size={18} className="text-[var(--muted)] group-hover:text-[var(--text)] group-hover:-translate-x-1 transition-all" />
                      <span className="text-[14px] font-bold tracking-wide text-[var(--text)]">Back to Login</span>
                    </button>
                  </motion.div>
                )}

                {currentPage === "google-chooser" && (
                  <motion.div
                    key="google-chooser"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-6 h-full w-full max-w-[340px] mx-auto"
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                      <svg width="24" height="24" viewBox="0 0 18 18">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C18.619 14.083 17.64 11.773 17.64 9.2z" fill="#4285F4" />
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                      </svg>
                    </div>
                    <h2 className="font-display text-[22px] font-extrabold text-[var(--text)] tracking-tight mb-2">
                      Mock Sign In
                    </h2>
                    <p className="text-[12px] text-[var(--muted)] text-center mb-6">
                      (Development Only) Select an account to simulate Google OAuth login.
                    </p>

                    {googleError && (
                      <div className="w-full bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 text-[12px] text-red-500 mb-4 flex items-center gap-2">
                        <X size={14} className="shrink-0" />
                        <span>{googleError}</span>
                      </div>
                    )}

                    {googleStep === "list" ? (
                      <div className="w-full flex flex-col gap-3">
                        <button
                          onClick={() => handleSelectGoogleEmail("superadmin@manmadhanshub.com")}
                          disabled={googleLoading}
                          className="w-full p-4 flex items-center gap-4 border border-[var(--border2)] rounded-[14px] hover:border-[var(--neon)] hover:bg-[var(--neon)]/5 transition-all text-left group disabled:opacity-50 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-[var(--neon)]/20 text-[var(--neon)] font-bold flex items-center justify-center uppercase shrink-0">
                            S
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[var(--text)]">Super Admin</span>
                            <span className="text-[11px] text-[var(--muted)]">superadmin@manmadhanshub.com</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleSelectGoogleEmail("user@manmadhanshub.com")}
                          disabled={googleLoading}
                          className="w-full p-4 flex items-center gap-4 border border-[var(--border2)] rounded-[14px] hover:border-[var(--neon)] hover:bg-[var(--neon)]/5 transition-all text-left group disabled:opacity-50 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-[var(--emerald)]/20 text-[var(--emerald)] font-bold flex items-center justify-center uppercase shrink-0">
                            U
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[var(--text)]">Demo User</span>
                            <span className="text-[11px] text-[var(--muted)]">user@manmadhanshub.com</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setGoogleStep("custom")}
                          disabled={googleLoading}
                          className="w-full p-3 mt-2 text-[13px] font-bold text-[var(--text)] border border-[var(--border)] rounded-[12px] hover:bg-[var(--bg2)] transition-all cursor-pointer"
                        >
                          Use another account
                        </button>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col gap-4">
                        <input
                          type="text"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          placeholder="Email or phone"
                          className="w-full h-[48px] bg-transparent border border-[var(--border2)] rounded-[12px] px-4 text-[14px] text-[var(--text)] outline-none focus:border-[var(--neon)] focus:bg-[var(--bg2)]/30 transition-all"
                        />
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => setGoogleStep("list")}
                            className="flex-1 h-[44px] rounded-[12px] border border-[var(--border2)] text-[13px] font-bold text-[var(--text)] hover:bg-[var(--bg2)] transition-all cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleCustomGoogleSubmit}
                            disabled={googleLoading || !customGoogleEmail}
                            className="flex-1 h-[44px] rounded-[12px] bg-[var(--text)] text-[var(--bg)] text-[13px] font-bold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            {googleLoading ? <Loader2 size={16} className="animate-spin" /> : 'Next'}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentPage === "terms" && (
                  <motion.div
                    key="terms"
                    custom={direction}
                    initial={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col w-full h-full"
                  >
                    <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6">
                      <div className="w-12 h-12 rounded-[16px] bg-[var(--bg2)]/50 border border-[var(--border2)] flex items-center justify-center shadow-inner mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon)]/20 to-transparent" />
                        <ShieldCheck className="w-6 h-6 text-[var(--neon)] relative z-10" />
                      </div>
                      <h1 className="font-display text-[24px] md:text-[28px] font-extrabold text-[var(--text)] tracking-tight mb-2">
                        Terms & Conditions
                      </h1>
                      <p className="text-[12px] md:text-[13px] text-[var(--muted)] leading-relaxed max-w-[280px]">
                        Please review and accept our policies to finalize your account activation.
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 mb-4">
                      <div className="p-4 rounded-[14px] bg-[var(--bg2)]/50 border border-[var(--border2)] text-[12px] text-[var(--muted)] space-y-4">
                        <p><strong>1. Data Privacy:</strong> All your data in ManMadhan's Hub is encrypted locally. We cannot read your personal workspace.</p>
                        <p><strong>2. Permitted Use:</strong> You agree to use this AI system only for legal and authorized purposes.</p>
                        <p><strong>3. Identity Lock:</strong> The Identity Code you just generated is permanent and acts as your master recovery key. Do not lose it.</p>
                        <p><strong>4. Experimental Features:</strong> You acknowledge that some AI modules are experimental and may produce inaccurate results.</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleTermsAccept}
                      className="btn-3d-primary group w-full h-[48px] rounded-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer mt-auto"
                    >
                      <span className="text-[14px] font-bold tracking-wide">Accept & Initiate</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {currentPage === "activation" && (
                  <motion.div
                    key="activation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center h-full w-full"
                  >
                    <div className="relative mb-8 w-24 h-24">
                      {/* Matrix style scanning ring */}
                      <div className="absolute inset-0 rounded-full border-[2px] border-[var(--neon)]/20" />
                      <div className="absolute inset-0 rounded-full border-[2px] border-t-[var(--neon)] border-r-[var(--neon)] animate-spin" style={{ animationDuration: '2s' }} />
                      <div className="absolute inset-2 rounded-full border-[2px] border-l-[var(--emerald)] border-b-[var(--emerald)] animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-[var(--neon)] animate-pulse" />
                      </div>
                    </div>
                    <h2 className="font-display text-[22px] font-bold text-[var(--text)] mb-2 tracking-widest uppercase">
                      Initiating
                    </h2>
                    <p className="text-[13px] font-mono text-[var(--neon)] animate-pulse">
                      Activating Enterprise Node...
                    </p>
                  </motion.div>
                )}

                {currentPage === "onboarding" && (
                  <motion.div
                    key="onboarding"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full w-full bg-[var(--bg)] absolute inset-0 z-50 rounded-[24px] overflow-hidden"
                  >
                    {/* Top Massive Visual Section */}
                    <div className="flex-1 relative w-full flex items-center justify-center bg-[var(--bg2)]/30 border-b border-[var(--border2)] overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center pointer-events-none" />
                      
                      <AnimatePresence mode="wait">
                        {onboardingStep === 0 && (
                          <motion.div 
                            key="img-0"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0, transition: { duration: 0.2 } }}
                            className="relative flex items-center justify-center w-full h-full"
                          >
                            <div className="absolute w-[300px] h-[300px] bg-[var(--neon)]/10 blur-[80px] rounded-full" />
                            <motion.div 
                              animate={{ y: [0, -10, 0] }} 
                              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                              className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--glass)] border border-[var(--neon)]/50 shadow-[0_0_40px_rgba(var(--neon-rgb),0.3)] backdrop-blur-xl flex items-center justify-center"
                            >
                              <Search size={48} className="text-[var(--neon)] drop-shadow-[0_0_15px_rgba(var(--neon-rgb),0.8)]" />
                            </motion.div>
                          </motion.div>
                        )}
                        {onboardingStep === 1 && (
                          <motion.div 
                            key="img-1"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0, transition: { duration: 0.2 } }}
                            className="relative flex items-center justify-center w-full h-full"
                          >
                            <div className="absolute w-[300px] h-[300px] bg-[var(--emerald)]/10 blur-[80px] rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-40 h-40 md:w-48 md:h-48 rounded-full border-[2px] border-[var(--emerald)] border-dashed animate-[spin_10s_linear_infinite] opacity-30" />
                            <div className="relative z-20 w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--glass)] border border-[var(--emerald)]/50 shadow-[0_0_40px_rgba(16,185,129,0.3)] backdrop-blur-xl flex items-center justify-center">
                              <Plus size={48} className="text-[var(--emerald)] drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                            </div>
                          </motion.div>
                        )}
                        {onboardingStep === 2 && (
                          <motion.div 
                            key="img-2"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0, transition: { duration: 0.2 } }}
                            className="relative flex items-center justify-center w-full h-full"
                          >
                            <div className="absolute w-[300px] h-[300px] bg-[#a855f7]/10 blur-[80px] rounded-full" />
                            <motion.div 
                              animate={{ scale: [1, 1.05, 1] }} 
                              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                              className="relative z-20 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-[var(--glass)] border border-[#a855f7]/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] backdrop-blur-xl flex items-center justify-center"
                            >
                              <MessageSquare size={48} className="text-[#a855f7] drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                            </motion.div>
                          </motion.div>
                        )}
                        {onboardingStep === 3 && (
                          <motion.div 
                            key="img-3"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0, transition: { duration: 0.2 } }}
                            className="relative flex items-center justify-center w-full h-full"
                          >
                            <div className="absolute w-[300px] h-[300px] bg-[#3b82f6]/10 blur-[80px] rounded-full" />
                            <div className="relative z-10 w-[240px] md:w-[320px] h-[100px] md:h-[120px] bg-[var(--bg2)] border border-[var(--border3)] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-center gap-8">
                               <div className="w-12 h-12 rounded-full bg-[var(--glass)] flex items-center justify-center border border-[var(--border3)]">
                                 <Search size={20} className="text-[var(--text)]" />
                               </div>
                               <ArrowLeftRight size={32} className="text-[#3b82f6] animate-[pulse_1.5s_ease-in-out_infinite]" />
                               <div className="w-12 h-12 rounded-full bg-[var(--glass)] flex items-center justify-center border border-[var(--border3)]">
                                 <Activity size={20} className="text-[var(--text)]" />
                               </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Content Section */}
                    <div className="h-[260px] md:h-[280px] w-full p-6 md:p-10 flex flex-col justify-between bg-[var(--bg)] shrink-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`text-${onboardingStep}`}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0, transition: { duration: 0.15 } }}
                          className="flex flex-col text-center items-center h-[120px]"
                        >
                          <h2 className="font-display text-[28px] md:text-[32px] font-extrabold text-[var(--text)] tracking-tight mb-3">
                            {onboardingStep === 0 && "Search AI Tools"}
                            {onboardingStep === 1 && "Add New Tools"}
                            {onboardingStep === 2 && "Intelligent AI Chatbot"}
                            {onboardingStep === 3 && "Compare Features"}
                          </h2>
                          <p className="text-[15px] text-[var(--muted)] max-w-[420px] leading-relaxed">
                            {onboardingStep === 0 && "Discover the perfect AI tools for your workflow with our powerful, centralized search engine."}
                            {onboardingStep === 1 && "Expand your workspace by effortlessly adding and integrating new AI tools into your personalized registry."}
                            {onboardingStep === 2 && "Get instant assistance and guidance from our built-in AI chatbot, designed to optimize your experience."}
                            {onboardingStep === 3 && "Evaluate intelligent applications side-by-side to find the absolute best fit for your unique needs."}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 mt-4 max-w-[600px] mx-auto">
                        {/* Dot Indicators */}
                        <div className="flex gap-3 shrink-0 order-2 md:order-1">
                          {[0, 1, 2, 3].map(i => (
                            <div 
                              key={i} 
                              onClick={() => setOnboardingStep(i)}
                              className={`h-2.5 rounded-full transition-all cursor-pointer ${onboardingStep === i ? 'w-8 bg-[var(--neon)] shadow-[0_0_10px_var(--neon)]' : 'w-2.5 bg-[var(--border3)] hover:bg-[var(--muted)]'}`} 
                            />
                          ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 order-1 md:order-2">
                          {onboardingStep > 0 && (
                            <button
                              onClick={() => setOnboardingStep(onboardingStep - 1)}
                              className="w-[52px] h-[52px] rounded-full flex items-center justify-center border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] hover:border-[var(--border3)] hover:bg-[var(--bg3)] transition-all cursor-pointer shrink-0"
                            >
                              <ArrowLeft size={20} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (onboardingStep === 3) handleOnboardingFinish();
                              else setOnboardingStep(onboardingStep + 1);
                            }}
                            className="btn-3d-primary h-[52px] w-full md:w-[180px] rounded-full flex items-center justify-center gap-2 text-[15px] cursor-pointer"
                          >
                            <span className="font-bold tracking-wide">{onboardingStep === 3 ? "Enter Dashboard" : "Continue"}</span>
                            {onboardingStep !== 3 && <ArrowRight size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {(currentPage === "login-email" || currentPage === "login-password") && (
                <div className="mt-6 pt-4 border-t border-[var(--border)] opacity-60 flex justify-center gap-4 text-[11px] text-[var(--muted)]">
                  <span className="hover:text-[var(--text)] transition-colors cursor-pointer">Privacy Policy</span>
                  <span>•</span>
                  <span className="hover:text-[var(--text)] transition-colors cursor-pointer">Terms of Service</span>
                </div>
              )}
            </div>
          </motion.div>

          <style jsx global>{`
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
