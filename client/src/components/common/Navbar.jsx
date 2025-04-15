"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

const Navbar = ({ scrollToFAQs, simplifiedNav = false }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Create refs for the dropdown menus
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Use the hook to handle clicks outside the mobile menu, excluding the toggle button
  useOnClickOutside(menuRef, (event) => {
    if (isMenuOpen && !menuButtonRef.current?.contains(event.target)) {
      setIsMenuOpen(false);
    }
  });

  // Use the hook to handle clicks outside the profile dropdown
  useOnClickOutside(profileRef, () => {
    if (isProfileOpen) setIsProfileOpen(false);
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    return `/${currentUser.role}/dashboard`;
  };

  return (
    <nav className="bg-teal-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold flex items-center">
            <span>Second Opinion</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-teal-200 transition-colors">
              Home
            </Link>
            
            {!simplifiedNav && (
              <>
                <Link href="/user/responses" className="hover:text-teal-200 transition-colors">
                  Response
                </Link>
                <button 
                  onClick={scrollToFAQs} 
                  className="hover:text-teal-200 transition-colors cursor-pointer"
                >
                  FAQs
                </button>
                <Link href="/contact" className="hover:text-teal-200 transition-colors">
                  Contact
                </Link>
                
                {!isAuthenticated() && (
                  <div className="flex items-center space-x-4">
                    <Link 
                      href="/login" 
                      className="hover:text-teal-200 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="bg-white text-teal-700 px-4 py-2 rounded-md hover:bg-teal-100 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
            
            {/* Always show profile options if authenticated, regardless of simplified nav */}
            {isAuthenticated() && (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 hover:text-teal-200 transition-colors focus:outline-none"
                >
                  <img 
                    src={currentUser?.photoURL || "https://via.placeholder.com/150"} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{currentUser?.displayName}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      href={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-teal-600" ref={menuRef}>
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="hover:text-teal-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {!simplifiedNav && (
                <>
                  <Link 
                    href="/user/responses" 
                    className="hover:text-teal-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Response
                  </Link>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      scrollToFAQs();
                    }} 
                    className="text-left hover:text-teal-200 transition-colors"
                  >
                    FAQs
                  </button>
                  <Link 
                    href="/contact" 
                    className="hover:text-teal-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  
                  {!isAuthenticated() && (
                    <div className="flex flex-col space-y-3 pt-2 border-t border-teal-600">
                      <Link 
                        href="/login" 
                        className="w-full py-2 text-center border border-teal-200 rounded-md hover:bg-teal-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        href="/signup" 
                        className="w-full py-2 text-center bg-white text-teal-700 rounded-md hover:bg-teal-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
              
              {/* Always show profile options if authenticated, regardless of simplified nav */}
              {isAuthenticated() && (
                <>
                  <div className="flex items-center space-x-2 pt-2 border-t border-teal-600">
                    <img 
                      src={currentUser?.photoURL || "https://via.placeholder.com/150"} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{currentUser?.displayName}</span>
                  </div>
                  <Link 
                    href={getDashboardLink()}
                    className="flex items-center space-x-2 hover:text-teal-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 hover:text-teal-200 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;