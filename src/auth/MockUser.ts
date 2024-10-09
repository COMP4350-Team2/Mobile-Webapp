import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
import { UserAuth } from "./UserAuth";

export class MockUser implements UserAuth {
	private isLoggedIn: boolean = false;
	mylists: List[] = [
		new List("Grocery", [
			new Ingredient("Tomato", "Vegetable", 4, "count"), // Use Ingredient class
			new Ingredient("Chicken", "Meat", 500, "g"), // Use Ingredient class
		]),
		new List("Pantry", [
			new Ingredient("Basil", "Herb", 3, "count"), // Use Ingredient class
			new Ingredient("Cheese", "Dairy", 500, "g"), // Use Ingredient class
		]),
	];

	// Method to return the user's myLists
	getMyLists(): List[] {
		return this.mylists;
	}

	// Method to return all ingredients
	getAllIngredients(): Ingredient[] {
		return [
			new Ingredient("Tomato", "Vegetable"), // Use Ingredient class
			new Ingredient("Chicken", "Meat"), // Use Ingredient class
			new Ingredient("Basil", "Herb"), // Use Ingredient class
			new Ingredient("Cheese", "Dairy"), // Use Ingredient class
		];
	}

	login() {
		this.isLoggedIn = true; // Simulate successful login
	}

	logout() {
		this.isLoggedIn = false; // Simulate logout
	}

	isAuthenticated(): boolean {
		return this.isLoggedIn; // Check if logged in
	}

	addToList(listName: string, ingredient: Ingredient, amount?: number, unit?: "mg" | "kg" | "count" | "g" | "ml"): void {
		const list = this.mylists.find((list) => list.name === listName);
		if (list) {
			const newIngredient = new Ingredient(ingredient.name, ingredient.type, amount, unit); // Create a new Ingredient instance
			list.ingredients.push(newIngredient); // Add ingredient to the list
		}
	}

	isAuth0User = () => false;

	async getAccessToken(): Promise<string> {
		return "";
	}
}
