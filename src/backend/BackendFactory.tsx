// src/backend/BackendFactory.tsx

import { UserAuth } from '../auth/UserAuth';
import { Backend } from './Backend';
import { BackendInterface } from './BackendInterface';
import { MockBackend } from './MockBackend';

const BackendFactory = (userAuth: UserAuth): BackendInterface => {
    // Check if the user is an Auth0 user or a mock user
    if (userAuth.isAuth0User()) {
        console.log('Using real Backend for Auth0 user.');
        return new Backend(); // Use the real backend for Auth0 authenticated users
    } else {
        console.log('Using MockBackend for mock user.');
        return new MockBackend(); // Use the mock backend for mock users
    }
};

export default BackendFactory;
