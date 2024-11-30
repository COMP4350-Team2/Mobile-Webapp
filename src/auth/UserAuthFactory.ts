/* This class checks our environment variables and creates an isntance of a user depending on 
    whether we're authenticating through Auth0 or as a mock user */
import { Auth0User } from "./Auth0User";
import { MockUser } from "./MockUser";
import { UserAuth } from "./UserAuth";

/**
    * Purpose: This function checks the environment variables of our app and determines what instance of 
                UserAuth to call (and return)
    * @return {UserAuth} Either `Auth0User` or `MockUser` 
*/
export const UserAuthFactory = (): UserAuth => {
	const server_url = process.env.REACT_APP_BACKEND_HOST;

	if (server_url && server_url !== "") {
		return new Auth0User();
	} else {
		return new MockUser();
	}
};

export default UserAuthFactory;
