"use client";

import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}