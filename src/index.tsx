import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = process.env.REACT_APP_AUTH0_DOMAIN || '';
const clientId = process.env.REACT_APP_CLIENT_ID || '';

const container = document.getElementById('root')!;
const root = createRoot(container); // Create root for React 18

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }} 
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);



