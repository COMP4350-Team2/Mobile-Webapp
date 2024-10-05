/* This class checks our environment variables and creates an isntance of a user depending on 
    whether we're authenticating through Auth0 or as a mock user */
import { UserAuth } from './UserAuth';
import { Auth0User } from './Auth0User'; 
import { MockUser } from './MockUser';

const UserAuthFactory = (): UserAuth => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN || '';
    const clientId = process.env.REACT_APP_CLIENT_ID || '';

    if (domain && clientId) {
        console.log('Using Auth0User for authentication.');
        return new Auth0User(); // Use Auth0User for Auth0
    } else {
        console.log('No Auth0 environment variables found, using MockUser.'); // Log for debugging
        return new MockUser(); // Fallback to MockUser
    }
};

export default UserAuthFactory;
