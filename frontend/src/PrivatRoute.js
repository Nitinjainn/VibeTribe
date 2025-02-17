// PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn"); // Check login status from localStorage

  return isLoggedIn ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
