import React, { useState, useEffect, createContext } from 'react';

// Create context
const AuthContext = createContext();

function AuthProvider({ children }) {
  // Initialize state with the value from localStorage (if available)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true'; // 'true' as string from localStorage
  });

  // Update localStorage whenever the authentication state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  // Provide the context value
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the context and the provider
export { AuthContext, AuthProvider };
