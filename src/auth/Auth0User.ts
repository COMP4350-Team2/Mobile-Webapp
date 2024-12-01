import axios from "axios";
import Cookies from "js-cookie";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
import { UserAuth } from "./UserAuth";

const ACCESS_TOKEN = "access_token";
const EMAIL_NOT_VERIFIED = "Email not verified";

export class Auth0User implements UserAuth {
	private mylists: List[] = [];
	private allIngredients: Ingredient[] = [];
	private isLoading = false;
	private authenticated = true;
	private userEmail = EMAIL_NOT_VERIFIED;

	login(): Promise<void> {
		this.isLoading = true;
		return axios
			.get<{
				access_token: string;
				refresh_token: string;
				issued_time: Date;
				expire_time: Date;
				user_info: {
					nickname: string;
					name: string;
					picture: URL;
					updated_at: Date;
					email: string;
					email_verified: boolean;
					sid: string;
				};
			}>(`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_LOGIN}`)
			.then((response) => {
				this.isLoading = false;
				let data;
				if (response.status === 200) {
					data = response.data;
					Cookies.set(ACCESS_TOKEN, data.access_token, {
						path: "/",
						secure: true,
						sameSite: "Strict",
					});
					this.authenticated = true;
					this.userEmail = data.user_info.email ?? EMAIL_NOT_VERIFIED;
				} else {
					this.authenticated = false;
					throw new Error("Loggin unsuccessful.");
				}
			})
			.catch((e) => {
				this.isLoading = false;
				throw e;
			}) as Promise<void>;
	}

	logout() {
		this.isLoading = true;
		axios
			.get<{ message: string }>(`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_LOGIN}`)
			.then((response) => {
				if (response.status !== 200) {
					throw new Error(response.data.message);
				}
			});

		Cookies.remove(ACCESS_TOKEN);
		this.isLoading = false;
		this.authenticated = false;
	}

	isAuthenticated = () => this.authenticated && !["", undefined].includes(Cookies.get(ACCESS_TOKEN));
	isProcessing = () => this.isLoading;
	isAuth0User = () => true;

	/**
	 * Purpose: Retrieve access token from the app's cookie `access_token`,
	 *          or refresh token if token not found
	 *
	 * @return {Promise<string>} The JWT access token.
	 */
	async getAccessToken(): Promise<string> {
		if (!Cookies.get(ACCESS_TOKEN)) {
			const response = await axios.get<{
				access_token: string;
				message: string;
			}>(`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_REFRESH_TOKEN}`);

			let data;
			if (response.status === 200) {
				data = response.data;
				if (!Cookies.get(ACCESS_TOKEN)) {
					Cookies.set(ACCESS_TOKEN, data.access_token, {
						path: "/",
						secure: true,
						sameSite: "Strict",
					});
				}
				return data.access_token;
			} else {
				throw new Error(response.data.message);
			}
		}
		return Cookies.get(ACCESS_TOKEN)!;
	}

	getEmail = () => this.userEmail;

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
		this.allIngredients.push(customIngredient);
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
}
