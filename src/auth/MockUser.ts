/*This class is for our Mock User object. It follows the same methods as Auth0User but returns hardcoded values instead*/

import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
import { UserAuth } from "./UserAuth";

export class MockUser implements UserAuth {
	private isLoggedIn: boolean = false;
	mylists: List[] = [new List("Grocery", [new Ingredient("Tomato", "Vegetable", 4, "count"), new Ingredient("Chicken", "Meat", 500, "g")]), new List("Pantry", [new Ingredient("Basil", "Herb", 3, "count"), new Ingredient("Cheese", "Dairy", 500, "g")])];

	getMyLists(): List[] {
		return this.mylists;
	}

	getAllIngredients(): Ingredient[] {
		return [new Ingredient("Tomato", "Vegetable"), new Ingredient("Chicken", "Meat"), new Ingredient("Basil", "Herb"), new Ingredient("Cheese", "Dairy")];
	}

	login() {
		this.isLoggedIn = true;
	}

	logout() {
		this.isLoggedIn = false;
	}

	isProcessing = () => false;
	isAuthenticated = () => this.isLoggedIn;

	//placeholder method for the next sprint
	addToList(listName: string, ingredient: Ingredient, amount?: number, unit?: "mg" | "kg" | "count" | "g" | "ml"): void {
		const list = this.mylists.find((list) => list.name === listName);
		if (list) {
			const newIngredient = new Ingredient(ingredient.name, ingredient.type, amount, unit);
			list.ingredients.push(newIngredient);
		}
	}

	isAuth0User = () => false;

	storeAccessToken() {
		// Does not apply
	}

	async getAccessToken(): Promise<string> {
		return "";
	}
}
