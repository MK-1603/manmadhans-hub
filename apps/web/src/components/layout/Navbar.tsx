"use client";

import React, { useState, useEffect } from "react";
import Button3D from "../ui/Button3D";
import { Moon, Sun, LogIn, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import LoginModal from "../auth/LoginModal";

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  useEffect(() => {
    // Check local storage for active session
    const token = localStorage.getItem("session_token");
    setIsLoggedIn(!!token);

    // Check local storage for theme
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const handleOpenLogin = () => setIsLoginOpen(true);
    window.addEventListener("openLogin", handleOpenLogin);

    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("theme") || "dark";
      setTheme(currentTheme);
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("openLogin", handleOpenLogin);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (pathname === "/login" || params.get("login") === "true") {
      setIsLoginOpen(true);
    }
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleScrollTo = (id: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] px-[5%] flex items-end justify-between transition-all duration-350 ${
          scrolled
            ? "bg-[var(--glass2)] backdrop-blur-[20px] border-b border-[var(--border)]"
            : "bg-transparent border-b border-transparent"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          minHeight: "calc(64px + env(safe-area-inset-top))",
        }}
      >
        {/* Inner content row — fixed 64px height sits below the safe-area inset */}
        <div className="flex items-center justify-between w-full h-[64px] md:h-[72px]">
          <a href="#" className="flex items-center gap-2 md:gap-2.5 no-underline shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-[8px] md:rounded-[10px] overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="Manmadhan's Hub Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-sans font-bold text-[13px] md:text-[15px] text-[var(--text)] tracking-[1px] md:tracking-[1.5px] uppercase whitespace-nowrap">
              MANMADHAN&apos;S HUB
            </span>
          </a>

          <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
            <button
              onClick={toggleTheme}
              className="w-[36px] h-[36px] md:w-[42px] md:h-[42px] rounded-full border-[1.5px] border-[var(--border2)] bg-transparent text-[var(--text)] cursor-pointer text-base md:text-lg flex items-center justify-center transition-all duration-250 hover:border-[var(--border3)] hover:bg-[var(--glass)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            {isLoggedIn ? (
              <Button3D 
                variant="primary" 
                style={{ padding: '7px', minWidth: '36px' }} 
                className="md:!px-5 md:!py-2 md:!text-[13px]"
                onClick={() => window.location.href = '/dashboard'}
              >
                <LayoutDashboard size={16} className="md:w-3.5 md:h-3.5" /> 
                <span className="hidden md:inline ml-1.5 font-bold uppercase tracking-wider">Dashboard</span>
              </Button3D>
            ) : (
              <Button3D 
                variant="primary" 
                style={{ padding: '7px', minWidth: '36px' }} 
                className="md:!px-5 md:!py-2 md:!text-[13px]"
                onClick={() => setIsLoginOpen(true)}
              >
                <LogIn size={16} className="md:w-3.5 md:h-3.5" /> 
                <span className="hidden md:inline ml-1.5 font-bold uppercase tracking-wider">Login</span>
              </Button3D>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => {
          setIsLoginOpen(false);
          const params = new URLSearchParams(window.location.search);
          if (pathname === "/login" || params.get("login") === "true") {
            window.history.replaceState(null, "", "/");
          }
        }} 
      />
    </>
  );
}
