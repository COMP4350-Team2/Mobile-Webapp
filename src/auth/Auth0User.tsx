// src/auth/Auth0User.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { UserAuth } from './UserAuth';

export class Auth0User implements UserAuth {
  private auth0 = useAuth0();

  login() {
    this.auth0.loginWithRedirect(); //logs the user in using auth0 redirect
  }

  logout() {
    this.auth0.logout(); //logs the user out using auth0 logout
  }

  isAuthenticated(): boolean {
    return this.auth0.isAuthenticated; // This will be false initially until Auth0 completes login
  }
}
