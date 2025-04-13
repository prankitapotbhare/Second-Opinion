import React from "react";
const Header = () => {
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
    return(
      <header className="bg-white shadow-sm z-10 ">
      <div className="flex items-center justify-end px-6 py-4">
        <div className="flex items-center">
          <div className="mr-6 text-sm text-gray-500">
            {formattedDate} | {formattedTime}
          </div>
        </div>
      </div>
    </header>
    );
}

export default Header;