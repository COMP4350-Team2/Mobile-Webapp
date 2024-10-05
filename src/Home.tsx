// src/Home.tsx
import React from 'react';
import { UserAuth } from './auth/UserAuth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface HomeProps {
  userAuth: UserAuth; // Receive UserAuth from props
}

const Home: React.FC<HomeProps> = ({ userAuth }) => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = () => {
    userAuth.login(); // Log in the user using Auth0 or Mock User
    if (userAuth.isAuthenticated()) { // Check if the user is authenticated
      navigate('/logged-in'); // Redirect to the Logged_In page
    }
  };

  return (
    <div 
      style={{
        display: 'flex', // Use flexbox for layout
        flexDirection: 'column', // Align items in a column
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        height: '100vh', // Full viewport height
        textAlign: 'center', // Center text alignment
        backgroundColor: '#f0f0f5', // Light background color
        fontFamily: 'Arial, sans-serif', // Font style
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to the App</h1> {/* Title */}
      <button 
        onClick={handleLogin} 
        style={{
          padding: '15px 30px', // Button padding
          fontSize: '18px', // Button font size
          backgroundColor: '#4CAF50', // Green background color
          color: 'white', // White text color
          border: 'none', // No border
          borderRadius: '5px', // Rounded corners
          cursor: 'pointer', // Pointer cursor on hover
        }}
      >
        Log In
      </button>
    </div>
  );
};

export default Home;
