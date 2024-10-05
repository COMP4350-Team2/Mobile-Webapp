/* This page is the logged in page for the user */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from './auth/UserAuth'; 
import { MockUser } from './auth/MockUser'; 

interface LoggedInProps {
  userAuth: UserAuth; // Define the prop type
}

const LoggedIn: React.FC<LoggedInProps> = ({ userAuth }) => {
  const navigate = useNavigate();

  // Check authentication state
  if (!userAuth.isAuthenticated()) {
    // If not authenticated, redirect to home
    navigate('/');
    return null; // Prevent rendering of the component
  }

  const handleLogout = () => {
    userAuth.logout(); // Log out the user
    navigate('/'); // Navigate back to the home page
  };

  const userType = userAuth instanceof MockUser ? "Mock User" : "Auth0 User"; // Determine user type

  return (
    <div 
      style={{
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', // Full viewport height
        textAlign: 'center', // Center text alignment
        backgroundColor: '#f0f0f5', // Light background color
        fontFamily: 'Arial, sans-serif', // Font style
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{userType}</h1> {/* Display the user type */}
      <button 
        onClick={handleLogout} 
        style={{
          padding: '15px 30px', // Button padding
          fontSize: '18px', // Button font size
          backgroundColor: '#f44336', // Red background color for logout
          color: 'white', // White text color
          border: 'none', // No border
          borderRadius: '5px', // Rounded corners
          cursor: 'pointer', // Pointer cursor on hover
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default LoggedIn;
