"use client";

import React from 'react';
import {Navbar, Footer} from '@/components';
import DoctorDetailsForm from './components/DoctorDetailsForm';
import { DoctorProvider } from '@/contexts/DoctorContext';

const DoctorPortalPage = () => {
  return (
    <>
      <Navbar
            simplifiedNav={true}
      />
      <DoctorProvider>
        <DoctorDetailsForm />
      </DoctorProvider>
      <Footer/>
    </>
  );
};

export default DoctorPortalPage;