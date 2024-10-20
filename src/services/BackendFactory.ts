/**
 * This factory is similar to our UserFactory. It checks which instance of the Backend to call depending on the environment variables
 */

import { UserAuth } from "../auth/UserAuth";
import { Backend } from "./Backend";
import { BackendInterface } from "./BackendInterface";
import { MockBackend } from "./MockBackend";

/**
    * Purpose: This function checks the environment variables of our app and determines what instance of 
                Backend to call (and return)
    * @return {Backend} Either `Backend` or `MockBackend` 
*/
const BackendFactory = (userAuth: UserAuth): BackendInterface => {
	// Check if the user is an Auth0 user or a mock user
	if (userAuth.isAuth0User()) {
		return new Backend(userAuth);
	} else {
		return new MockBackend(userAuth);
	}
};

export default BackendFactory;
