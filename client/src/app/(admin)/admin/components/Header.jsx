"use client";

import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="mb-8 flex justify-center">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    </header>
  );
};

export default Header;