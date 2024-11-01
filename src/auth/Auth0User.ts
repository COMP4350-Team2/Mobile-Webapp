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
	private mylists: List[] = [];
	private allIngredients: Ingredient[] = [];
   
	login() {
		this.auth0.loginWithRedirect().then(); // Logs the user in using Auth0 redirect
	}

	logout() {
		this.auth0.logout();
	}

	isAuthenticated = () => this.auth0.isAuthenticated; // auth0.isAuthenticated is false initially until Auth0 completes login
	isProcessing = () => this.auth0.isLoading;
	isAuth0User = () => true;

	getMyLists(): List[] {
		return this.mylists;
	}

    setMyLists(lists: List[]){
        this.mylists = lists;
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
	 * `addToList("Grocery", Ingredient);`
	 *
	 * @param {string} listName - The name of the list (e.g., "Grocery").
	 * @param {Ingredient} ingredient - The ingredient object to be added.
	 */
	addToList(listName: string, ingredient: Ingredient): void {
		const list = this.mylists.find((list) => list.name === listName);
		if (!list) {
			return;
		}
		const found = list.ingredients.some((i) => {
			if (i.equalTo(ingredient)) {
				i.amount = (i.amount || 0) + (ingredient.amount || 0);
				return true;
			}
			return false;
		});
		if (!found) {
			list.ingredients.push(new Ingredient(ingredient.name, ingredient.type, ingredient.amount, ingredient.unit));
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
					`${this.backendHost}/api/user`,
					{},
					{
						headers: { authorization: "Bearer " + this._accessToken },
					}
				)
				.then((response) => {
					if (response.status === 201) {
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

	getIngredientsFromList(listName: String): Promise<Ingredient[]>{
		const foundList = this.mylists.find(list => list.name === listName);
    	return Promise.resolve(foundList ? foundList.ingredients : []);
	}
}
