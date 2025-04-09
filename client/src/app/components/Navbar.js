"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const pathname = usePathname();
  const loginRef = useRef(null);
  const signUpRef = useRef(null);

  useOnClickOutside(loginRef, () => setIsLoginOpen(false));
  useOnClickOutside(signUpRef, () => setIsSignUpOpen(false));

  const isActive = (path) => pathname === path;

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white py-4 px-6 sticky top-0 z-50 shadow-sm" role="navigation">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-green-600 font-bold text-2xl">Second Opinion</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className={`md:flex items-center space-x-8 ${isMobileMenuOpen ? 'flex flex-col absolute top-16 left-0 right-0 bg-white shadow-md p-4 space-y-4 md:space-y-0 md:relative md:top-0 md:shadow-none md:p-0 md:flex-row' : 'hidden md:flex'}`}>
          <Link
            href="/"
            className={`text-gray-700 hover:text-green-600 font-medium ${isActive('/') ? 'text-green-600' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/response"
            className={`text-gray-700 hover:text-green-600 font-medium ${isActive('/response') ? 'text-green-600' : ''}`}
          >
            Response
          </Link>

          {/* Login Dropdown */}
          <div className="relative" ref={loginRef}>
            <button
              className="text-gray-700 hover:text-green-600 font-medium flex items-center cursor-pointer"
              onClick={() => {
                setIsLoginOpen(!isLoginOpen);
                setIsSignUpOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={isLoginOpen}
            >
              Login
              <svg
                className={`ml-1 h-4 w-4 transform transition-transform ${isLoginOpen ? 'rotate-180' : ''}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isLoginOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                role="menu"
              >
                <Link
                  href="/login/user"
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 ${isActive('/login/user') ? 'bg-green-50 text-green-600' : ''}`}
                  role="menuitem"
                  onClick={() => setIsLoginOpen(false)}
                >
                  User Login
                </Link>
                <Link
                  href="/login/doctor"
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 ${isActive('/login/doctor') ? 'bg-green-50 text-green-600' : ''}`}
                  role="menuitem"
                  onClick={() => setIsLoginOpen(false)}
                >
                  Doctor Login
                </Link>
              </div>
            )}
          </div>

          {/* Sign-Up Dropdown */}
          <div className="relative" ref={signUpRef}>
            <button
              className="text-gray-700 hover:text-green-600 font-medium flex items-center  cursor-pointer"
              onClick={() => {
                setIsSignUpOpen(!isSignUpOpen);
                setIsLoginOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={isSignUpOpen}
            >
              Sign-Up
              <svg
                className={`ml-1 h-4 w-4 transform transition-transform ${isSignUpOpen ? 'rotate-180' : ''}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSignUpOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                role="menu"
              >
                <Link
                  href="/register/user"
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 ${isActive('/register/user') ? 'bg-green-50 text-green-600' : ''}`}
                  role="menuitem"
                  onClick={() => setIsSignUpOpen(false)}
                >
                  User Sign-Up
                </Link>
                <Link
                  href="/register/doctor"
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 ${isActive('/register/doctor') ? 'bg-green-50 text-green-600' : ''}`}
                  role="menuitem"
                  onClick={() => setIsSignUpOpen(false)}
                >
                  Doctor Sign-Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}