"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaUserMd, FaUsers, FaCalendarCheck, FaClock } from 'react-icons/fa';
import DashboardSection from "./components/DashboardSection";
import AppointmentSection from "./components/AppointmentSection";
import ProfileSection from "./components/ProfileSection";
import SettingSection from "./components/SettingSection";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctor } from "@/contexts/DoctorContext";

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const { doctor, fetchDashboardStats, dashboardStats, fetchDoctorReviews, reviews, loading } = useDoctor();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Review pagination state
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const REVIEWS_PER_PAGE = 4;

  // Fetch stats and reviews when dashboard tab is active
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardStats();
      loadReviews(reviewPage);
    }
    // eslint-disable-next-line
  }, [activeTab, reviewPage]);

  const loadReviews = useCallback(async (page) => {
    setLoadingReviews(true);
    try {
      const res = await fetchDoctorReviews({ page, limit: REVIEWS_PER_PAGE });
      if (res && res.data) {
        setReviewTotalPages(Math.ceil((res.data.totalReviews || 1) / REVIEWS_PER_PAGE));
      }
    } finally {
      setLoadingReviews(false);
    }
  }, [fetchDoctorReviews]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    if (tab === "dashboard") setReviewPage(1);
  };

  const handleReviewPageChange = (page) => {
    if (page >= 1 && page <= reviewTotalPages) {
      setReviewPage(page);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        handleTabClick={handleTabClick} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        user={currentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setIsSidebarOpen={setIsSidebarOpen}
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        />
        <div className="flex-1 overflow-y-auto pb-6">
          {activeTab === "dashboard" && (
            <DashboardSection
              stats={dashboardStats}
              reviewsData={reviews}
              onReviewPageChange={handleReviewPageChange}
              reviewPage={reviewPage}
              reviewTotalPages={reviewTotalPages}
              loadingReviews={loadingReviews}
            />
          )}
          {activeTab === "appointments" && <AppointmentSection />}
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "settings" && <SettingSection user={currentUser} doctor={doctor} />}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
