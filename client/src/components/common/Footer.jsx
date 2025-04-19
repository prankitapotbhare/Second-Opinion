"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Footer() {
  const { currentUser } = useAuth();
  
  // Add isAuthenticated function
  const isAuthenticated = () => {
    return !!currentUser;
  };
  
  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    return `/${currentUser.role}/dashboard`;
  };
  
  return (
    <footer className="bg-teal-700 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <i className="fas fa-comment-medical"></i>
              Second Opinion
            </h3>
            <p className="text-teal-100 mb-4">
              Connecting patients with medical experts for trusted second opinions.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white hover:text-teal-200 transition-colors cursor-pointer">
                <i className="fab fa-facebook-square text-2xl"></i>
              </a>
              <a href="#" className="text-white hover:text-teal-200 transition-colors cursor-pointer">
                <i className="fab fa-twitter-square text-2xl"></i>
              </a>
              <a href="#" className="text-white hover:text-teal-200 transition-colors cursor-pointer">
                <i className="fab fa-linkedin-square text-2xl"></i>
              </a>
              <a href="#" className="text-white hover:text-teal-200 transition-colors cursor-pointer">
                <i className="fab fa-instagram-square text-2xl"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-teal-100 hover:text-white cursor-pointer">
                  Home
                </Link>
              </li>
              {isAuthenticated() ? (
                <>
                  <li>
                    <Link href={getDashboardLink()} className="text-teal-100 hover:text-white cursor-pointer">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href={`${getDashboardLink()}/profile`} className="text-teal-100 hover:text-white cursor-pointer">
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="text-teal-100 hover:text-white cursor-pointer">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="text-teal-100 hover:text-white cursor-pointer">
                      Sign-Up
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/find-doctors" className="text-teal-100 hover:text-white cursor-pointer">
                  Find Doctors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-3"></i>
                <span>+91-XXXXXXXXXX</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3"></i>
                <span>support@secondopinion.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>123 Health Street, Wellness City, India</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Support Hours</h3>
            <div className="space-y-2">
              <p>Available 24/7</p>
              <p>Priority Support</p>
              <p>For urgent medical requests, response within 24 hours</p>
            </div>
          </div>
        </div>
        <div className="border-t border-teal-600 mt-8 pt-8 text-center text-teal-200">
          <p>&copy; {new Date().getFullYear()} Second Opinion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}