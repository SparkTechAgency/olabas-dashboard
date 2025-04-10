import React from "react";
import { useLocation } from "react-router-dom";

function GetPageName() {
  const location = useLocation();
  const pageName = location.pathname.split("/").pop(); // Get last part of URL

  // Convert kebab-case (e.g., "booking-list") to "Booking List"
  const formattedPageName = pageName
    ? pageName
        .split("-") // Split by hyphen
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" ") // Join back with spaces
    : "";

  console.log(formattedPageName);
  return formattedPageName;
}

export default GetPageName;
