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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact information</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span>Ph no. +91 657357459465</span>
              </li>
              <li className="flex items-start">
                <span>Gmail - secop@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Social Media</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-teal-100 hover:text-white cursor-pointer">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="text-teal-100 hover:text-white cursor-pointer">
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Support Hours</h3>
            <div className="space-y-2">
              <p>Available 24X7</p>
              <p>Priority Support:</p>
              <p>For urgent medical inquiries, responses within 2 hours</p>
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