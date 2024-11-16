import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './Context/AuthContext';

function ProtectedRoute({ element }) {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? element : <Navigate to="/" />; // Change the path if needed for your login page.
}

export default ProtectedRoute;
