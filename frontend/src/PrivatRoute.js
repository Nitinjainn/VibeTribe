// PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import authUtils from "./utils/authUtils";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = authUtils.isAuthenticated();

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
