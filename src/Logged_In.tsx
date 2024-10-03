import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Logged_In.css'; 

const LoggedInPage = () => {
  const { logout } = useAuth0();

  return (
    <div className="centered">
      <h1>You have been logged in</h1>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Logout
      </button>
    </div>
  );
};

export default LoggedInPage;
