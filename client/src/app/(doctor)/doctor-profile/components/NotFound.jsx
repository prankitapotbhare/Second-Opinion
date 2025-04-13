"use client";

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
      <Link href="/" className="text-green-600 hover:underline">
        Return to Home
      </Link>
    </div>
  );
}