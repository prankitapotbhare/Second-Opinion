"use client";

import React from 'react';
import {Navbar, Footer} from '@/components';
import DoctorDetailsForm from './components/DoctorDetailsForm';

const DoctorPortalPage = () => {
  return (
    <>
      <Navbar
            simplifiedNav={true}
      />
      <DoctorDetailsForm />
      <Footer/>
    </>
  );
};

export default DoctorPortalPage;