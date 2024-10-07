// Our mock class for a user when environment variables arent set
import { UserAuth } from "./UserAuth";

export class MockUser implements UserAuth {
	private isLoggedIn: boolean = false;

	login() {
		this.isLoggedIn = true; // Simulate successful login
	}

	logout() {
		this.isLoggedIn = false; // Simulate logout
	}

	isAuthenticated(): boolean {
		return this.isLoggedIn; // Check if logged in
	}

	isAuth0User = () => false;

	get accessToken() {
		return "";
	}
}
