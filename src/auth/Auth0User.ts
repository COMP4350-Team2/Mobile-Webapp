import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Cookies from "js-cookie";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
import { UserAuth } from "./UserAuth";

export class Auth0User implements UserAuth {
	private auth0 = useAuth0();
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

	/**
	 * Purpose: Store access token to app's cookie and send a new user login update to backend
	 */
	completeLogin() {
		this.getAccessToken().finally(() => this.createUser().then());
	}

	/**
	 * Purpose: Retrieve access token, either from auth0 if retrieving for the first time,
	 * otherwise, from the app's cookie `access_token`
	 *
	 * @return {Promise<string>} The JWT access token.
	 */
	async getAccessToken(): Promise<string> {
		if (!Cookies.get("access_token")) {
			const token = await this.auth0.getAccessTokenSilently({
				authorizationParams: {
					audience: this.audience,
				},
			});
			// Store the access token in a cookie using js-cookie
			Cookies.set("access_token", token, {
				path: "/",
				secure: true,
				sameSite: "Strict",
			});
			return token;
		}
		return Cookies.get("access_token")!;
	}

	getEmail(): string {
		// TODO this.auth0.user?.email doesn't have any data,
		// would need to get this from BE ideally
		return "auth0-user@cupboard.com";
	}

	/**
	 * Purpose: This method makes a POST request to our API endpoint to create a user.
	 * The backend checks the database for an existing user and adds the user to the database if it’s a new user.
	 */
	private async createUser() {
		try {
			axios
				.post<string>(
					`${this.backendHost}${process.env.REACT_APP_API_CREATE_USER}`,
					{},
					{
						headers: { authorization: "Bearer " + (await this.getAccessToken()) },
					}
				)
				.then((response) => {
					if (response.status === 201) {
						const responseBody = response.data["message"];
						if (responseBody.includes("Item created successfully.")) {
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

	getMyLists(): List[] {
		return this.mylists;
	}

	setMyLists(lists: List[]) {
		this.mylists = lists;
	}

	deleteList(name: string) {
		const index = this.mylists.findIndex((list) => list.name === name);

		if (index !== -1) {
			this.mylists.splice(index, 1);
		}
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
		if (list) {
			list.addOrUpdateIngredient(ingredient);
		}
	}

	getIngredientsFromList(listName: String): Promise<Ingredient[]> {
		const foundList = this.mylists.find((list) => list.name === listName);
		return Promise.resolve(foundList ? foundList.ingredients : []);
	}

	removeIngredient(listName: string, ingredient: Ingredient): void {
		const list = this.mylists.find((list) => list.name === listName);
		if (!list) {
			console.error(`List with name ${listName} not found.`);
			return;
		}
		list.removeIngredient(ingredient);
	}

	updateIngredient(listName: string, oldIngredient: Ingredient, newIngredient: Ingredient): void {
		const list = this.mylists.find((list) => list.name === listName);
		if (!list) {
			console.error(`List with name ${listName} not found.`);
			return;
		}
		const ingredientToUpdate = list.ingredients.find((ingredient) => ingredient.equalTo(oldIngredient));
		if (!ingredientToUpdate) {
			console.error(`Ingredient ${oldIngredient.name} not found in list ${listName}.`);
			return;
		}
		this.removeIngredient(listName, ingredientToUpdate);
        newIngredient.setCustomFlag(oldIngredient.isCustom);
		list.addOrUpdateIngredient(newIngredient);
	}

	createList(toAdd: List): void {
		this.mylists.push(toAdd);
	}
    
    setListName(oldName: string, newName: string): void {
        const list = this.mylists.find((list) => list.name === oldName);
        if (list) {
            list.setListName(newName);
        } else {
            console.error(`List with name "${oldName}" not found.`);
        }
    }

    addCustomIngredient(customIngredient: Ingredient){
        this.allIngredients.push(customIngredient);
    }

    removeCustomIngredient(name: string){
        const ingredientIndex = this.allIngredients.findIndex(
            (ingredient) => 
                ingredient.name === name && 
                ingredient.isCustom //must be a custom ingredient
        );
        if (ingredientIndex !== -1) {
            this.allIngredients.splice(ingredientIndex, 1);
        } else {
            console.error(`Custom ingredient '${name}' not found.`);
        }
    }
    updateList(name: string, updatedIngredients: Ingredient[]){
        // const list = this.mylists.find((list) => list.name === name);
        // list?.updateList(updatedIngredients);
        this.mylists.find((list) => list.name === name)?.updateList(updatedIngredients);
    }
}
