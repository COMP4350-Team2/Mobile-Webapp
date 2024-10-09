import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
import { UserAuth } from "./UserAuth";

export class Auth0User implements UserAuth {
	private auth0 = useAuth0();
	private _accessToken;
	private backendHost = process.env.REACT_APP_BACKEND_HOST ?? "";
	private audience = process.env.REACT_APP_AUTH0_AUDIENCE ?? "";
	mylists: List[] = [];
	allIngredients: Ingredient[] = [];

	login() {
		this.auth0.loginWithRedirect().then((test) => console.log(test)); // Logs the user in using Auth0 redirect
	}

	logout() {
		this.auth0.logout();
	}

	isAuthenticated(): boolean {
		return this.auth0.isAuthenticated; // This will be false initially until Auth0 completes login
	}

	isAuth0User = () => true;

	getMyLists(): List[] {
		return this.mylists;
	}

	getAllIngredients(): Ingredient[] {
		return this.allIngredients;
	}

	setAllIngredients(list: Ingredient[]) {
		this.allIngredients = list;
	}

	addToList(listName: string, ingredient: Ingredient, amount?: number, unit?: "mg" | "kg" | "count") {
		const list = this.mylists.find((list) => list.name === listName);

		if (list) {
			const newIngredient = new Ingredient(ingredient.name, ingredient.type, amount, unit);
			list.ingredients.push(newIngredient);
		}
	}

	/**
	 * Retrieve access token and store in user authentication object
	 */
	storeAccessToken() {
		this.getAccessToken().then((token) => {
			this._accessToken = token;
			this.createUser();
		});
	}

	async getAccessToken(): Promise<string> {
		if (!this._accessToken) {
			this._accessToken = await this.getAccessTokenValue();
		}
		return this._accessToken;
	}

	/**
	 * Signal the backend that an user is logged in
	 */
	private createUser() {
		try {
			axios
				.post<string>(
					`${this.backendHost}/api/create_user`,
					{},
					{
						headers: { authorization: "Bearer " + this._accessToken },
					}
				)
				.then((response) => {
					if (response.status === 200) {
						const responseBody = response.data["message"];
						if (responseBody.includes("Item created successfully.")) {
							console.log("new user");
						} else if (responseBody.includes("Item already exists.")) {
							console.log("existing user");
						} else {
							console.log("Unexpected response:", responseBody);
						}
					} else {
						console.error("Unexpected response status");
					}
				})
				.catch((error) => {
					console.error(error);
				});
		} catch (e) {
			console.log(e);
		}
	}

	private async getAccessTokenValue(): Promise<string> {
		const res = await this.auth0.getAccessTokenSilently({
			authorizationParams: {
				audience: this.audience,
			},
		});
		return res;
	}
}
