import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const Navigate = useNavigate()

  const handleLogin = () => {
    setIsAuthenticated(true);
    Navigate('/home')
    // Add navigation logic if needed to redirect to the home page after login
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
