import React, { useState, createContext } from 'react';

// Create context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Provide the context value
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the context and the provider
export { AuthContext, AuthProvider };
