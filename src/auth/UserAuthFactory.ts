/* This class checks our environment variables and creates an isntance of a user depending on 
    whether we're authenticating through Auth0 or as a mock user */
import { Auth0User } from "./Auth0User";
import { MockUser } from "./MockUser";
import { UserAuth } from "./UserAuth";

export const UserAuthFactory = (): UserAuth => {
	const domain = process.env.REACT_APP_AUTH0_DOMAIN ?? "";
	const clientId = process.env.REACT_APP_CLIENT_ID ?? "";

	if (domain && clientId) {
		return new Auth0User();
	} else {
		return new MockUser();
	}
};

export default UserAuthFactory;
