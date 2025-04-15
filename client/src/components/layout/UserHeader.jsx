import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const UserHeader = () => {
  const { currentUser } = useAuth();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
          Welcome, {currentUser?.name || "User"}
        </h1>
        <div className="flex items-center">
          <div className="mr-6 text-sm text-gray-500">
            {formattedDate} | {formattedTime}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;