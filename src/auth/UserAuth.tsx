/*This is just the interface for our Users. Used for MockUser and Auth0User */
export interface UserAuth {
    login: () => void;
    logout: () => void;
    isAuthenticated: () => boolean;
  }
  