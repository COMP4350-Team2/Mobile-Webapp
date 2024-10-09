import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
import { UserAuth } from "./UserAuth";

export class Auth0User implements UserAuth {
	private auth0 = useAuth0();
	private _accessToken;
	private backendHost = process.env.BACKEND_HOST ?? "http://localhost:6060";
	mylists: List[] = []; // Initialize as empty
	allIngredients: Ingredient[] = [];

	login() {
		this.auth0.loginWithRedirect().then((test) => console.log(test)); // Logs the user in using Auth0 redirect
	}

	logout() {
		this.auth0.logout(); // Logs the user out using Auth0 logout
	}

	isAuthenticated(): boolean {
		return this.auth0.isAuthenticated; // This will be false initially until Auth0 completes login
	}

	isAuth0User = () => true;

	// Method to return the user's myLists
	getMyLists(): List[] {
		return this.mylists;
	}

	// Method to return all ingredients
	getAllIngredients(): Ingredient[] {
		return this.allIngredients; // Returns the ingredients
	}

	setAllIngredients(list: Ingredient[]) {
		this.allIngredients = list;
	}

	addToList(listName: string, ingredient: Ingredient, amount?: number, unit?: "mg" | "kg" | "count") {
		// Find the list by name
		const list = this.mylists.find((list) => list.name === listName);

		if (list) {
			// Add ingredient to the list with specified amount and unit
			const newIngredient = new Ingredient(ingredient.name, ingredient.type, amount, unit); // Create a new ingredient object with amount and unit
			list.ingredients.push(newIngredient); // Add the ingredient to the list
		}
	}

	/**
	 * Retrieve access token and store in user authentication object
	 */
	storeAccessToken() {
		this.auth0
			.getAccessTokenSilently({
				authorizationParams: {
					audience: "https://cupboard/api", // Specify the audience here
				},
			})
			.then((token) => {
				this._accessToken = token;
				console.log(token);
				this.createUser();
			});
	}

	/**
	 * Signal the backend that an user is logged in
	 */
	private createUser() {
		try {
			axios
				.post(`${this.backendHost}/api/create_user`, {
					header: { authorization: "Bearer " + this._accessToken },
				})
				.catch((error) => {
					console.error(error);
				});
		} catch (e) {
			console.log(e);
		}
	}

	get accessToken(): string {
		return this._accessToken;
	}
}
