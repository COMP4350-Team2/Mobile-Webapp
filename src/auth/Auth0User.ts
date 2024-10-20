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

    /**
        * Purpose: Adds a specified ingredient (with amount) to one of the user's lists.
        * 
        * Example: If a user wants to add 5 tomatoes to their Grocery list:
        * `addToList("Grocery", tomato, 5, "count");`
        * 
        * @param {string} listName - The name of the list (e.g., "Grocery").
        * @param {Ingredient} ingredient - The ingredient object to be added.
        * @param {number} amount - The amount of the ingredient to be added.
        * @param {string} unit - The unit of the ingredient, which can be "mg", "kg", or "count".
 */
	addToList(listName: string, ingredient: Ingredient, amount?: number, unit?: "mg" | "kg" | "count") {
		const list = this.mylists.find((list) => list.name === listName);

		if (list) {
			const newIngredient = new Ingredient(ingredient.name, ingredient.type, amount, unit);
			list.ingredients.push(newIngredient);
		}
	}


    /**
        * Purpose: Retrieves the user's JWT access token using `getAccessToken` and stores it in the user authentication object.
                * Then, it calls the `createUser` method, which sends a request to the `create_user` API endpoint.
                * This checks the database to see if the user associated with the access token already exists or needs to be added.
    */
	storeAccessToken() {
		this.getAccessToken().then((token) => {
			this._accessToken = token;
			this.createUser();
		});
	}

    /**
        * Purpose: This method retrieves the user's JWT access token and updates the instance variable.
    */
	async getAccessToken(): Promise<string> {
        
		if (!this._accessToken) {
			this._accessToken = await this.getAccessTokenValue();
		}
		return this._accessToken;
	}

	/**
        * Purpose: This method makes a POST request to our API endpoint to create a user.
        * The backend checks the database for an existing user and adds the user to the database if it’s a new user.
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

    /**
        * Purpose: This method retrieves the user's JWT access token and returns it.
        * 
        * @return {string} The JWT access token.
    */
	private async getAccessTokenValue(): Promise<string> {
        
		const res = await this.auth0.getAccessTokenSilently({
			authorizationParams: {
				audience: this.audience,
			},
		});
		return res;
	}
}
