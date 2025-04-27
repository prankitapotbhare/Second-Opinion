"use client";

import React from 'react';
import { AuthHeader, LoginForm } from '../../components';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-r from-purple-50 to-blue-50">
          <AuthHeader 
            title="Admin Login" 
            subtitle="Access the administration panel"
            align="center"
          />
        </div>
        
        <div className="p-4 sm:p-6">
          <LoginForm 
            userType="admin"
            redirectPath="/admin/dashboard"
            hideOptions={true}
          />
        </div>
      </div>
    </div>
  );
}