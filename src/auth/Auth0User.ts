import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Recipe } from "models/Recipe";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
import { UserAuth } from "./UserAuth";

const EMAIL_NOT_VERIFIED = "Email not verified";

export class Auth0User implements UserAuth {
	private auth0 = useAuth0();
	private backendHost = process.env.REACT_APP_BACKEND_HOST ?? "";
	private audience = process.env.REACT_APP_AUTH0_AUDIENCE ?? "";
	private mylists: List[] = [];
	private allIngredients: Ingredient[] = [];
	private allRecipes: Recipe[] = [];

	async login() {
		await this.auth0
			.loginWithRedirect({
				authorizationParams: {
					audience: this.audience,
					scope: "openid profile email offline_access",
					useRefreshTokens: true,
				},
			})
			.then();
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
		return await this.auth0.getAccessTokenSilently({
			authorizationParams: {
				audience: this.audience,
				scope: "openid profile email offline_access",
				useRefreshTokens: true,
			},
		});
	}

	getEmail(): string {
		return this.auth0.user?.email ?? EMAIL_NOT_VERIFIED;
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

	addCustomIngredient(customIngredient: Ingredient) {
		const exists = this.allIngredients.some(
			(ingredient) => ingredient.name === customIngredient.name && ingredient.isCustom
		);
		if (!exists) {
			this.allIngredients.push(customIngredient);
		}
	}

	removeCustomIngredient(name: string) {
		const ingredientIndex = this.allIngredients.findIndex(
			(ingredient) => ingredient.name === name && ingredient.isCustom //must be a custom ingredient
		);
		if (ingredientIndex !== -1) {
			this.allIngredients.splice(ingredientIndex, 1);
		} else {
			console.error(`Custom ingredient '${name}' not found.`);
		}
	}
	updateList(name: string, updatedIngredients: Ingredient[]) {
		this.mylists.find((list) => list.name === name)?.updateList(updatedIngredients);
	}
	getAllRecipes(): Recipe[] {
		return this.allRecipes;
	}

	setAllRecipes(recipes: Recipe[]) {
		this.allRecipes = recipes;
	}

	createRecipe(name: string): void {
		const recipeExists = this.allRecipes.some((existingRecipe) => existingRecipe.name === name);

		if (recipeExists) {
			console.error(`A recipe with the name '${name}' already exists.`);
			return;
		}
		this.allRecipes.push(new Recipe(name));
		console.log(`Recipe '${name}' has been added successfully.`);
	}

	deleteRecipe(name: string): void {
		const index = this.allRecipes.findIndex((recipe) => recipe.name === name);
		if (index !== -1) {
			this.allRecipes.splice(index, 1);
		}
	}

	addIngredientToRecipe(recipeName: string, ingredient: Ingredient) {
		const recipe = this.allRecipes.find((i) => i.name === recipeName);
		recipe?.addIngredient(ingredient);
	}

	deleteIngredientFromRecipe(recipeName: string, ingredient: Ingredient) {
		const recipe = this.allRecipes.find((i) => i.name === recipeName);
		if (!recipe) {
			console.error(`Recipe with name ${recipeName} not found.`);
			return;
		}
		recipe.ingredients.removeIngredient(ingredient);
	}

	updateRecipe(recipeName: string, ingredients: List, steps: string[]) {
		const recipe = this.allRecipes.find((i) => i.name === recipeName);
		if (!recipe) {
			console.error(`Recipe with name ${recipeName} not found.`);
			return;
		}
		recipe.updateRecipe(recipeName, ingredients, steps);
	}

	addStepToRecipe(recipeName: string, step: string) {
		const recipe = this.allRecipes.find((i) => i.name === recipeName);
		if (!recipe) {
			console.error(`Recipe with name ${recipeName} not found.`);
			return;
		}
		recipe.steps.push(step);
	}

	deleteStepFromRecipe(recipeName: string, stepNumber: number) {
		const recipe = this.allRecipes.find((i) => i.name === recipeName);
		if (!recipe) {
			console.error(`Recipe with name ${recipeName} not found.`);
			return;
		}

		if (stepNumber < 1 || stepNumber > recipe.steps.length) {
			console.error(`Step number ${stepNumber} is out of bounds.`);
			return;
		}
		recipe.steps.splice(stepNumber - 1, 1);
	}

	updateStep(recipeName: string, step: string, stepNumber: number) {
		const recipe = this.allRecipes.find((i) => i.name === recipeName);
		if (!recipe) {
			console.error(`Recipe with name ${recipeName} not found.`);
			return;
		}
		recipe.updateStep(step, stepNumber);
	}
}
