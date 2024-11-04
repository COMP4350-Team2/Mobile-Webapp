/*This class is for our Mock User object. It follows the same methods as Auth0User but returns hardcoded values instead*/

import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
import { UserAuth } from "./UserAuth";

export class MockUser implements UserAuth {
	private isLoggedIn: boolean = true;
	mylists: List[] = [
		new List("Grocery", [
			new Ingredient("Tomato", "Vegetable", 4, "count"),
			new Ingredient("Chicken", "Meat", 500, "g"),
		]),
		new List("Pantry", [new Ingredient("Basil", "Herb", 3, "count"), new Ingredient("Cheese", "Dairy", 500, "g")]),
	];

	login() {
		this.isLoggedIn = true;
	}

	logout() {
		this.isLoggedIn = false;
	}

	isProcessing = () => false;
	isAuthenticated = () => this.isLoggedIn;
	isAuth0User = () => false;

	storeAccessToken() {
		// Does not apply
	}

	async getAccessToken(): Promise<string> {
		return "";
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

	// Method to return all ingredients
	getAllIngredients(): Ingredient[] {
		return [
			new Ingredient("Tomato", "Vegetable"),
			new Ingredient("Chicken", "Meat"),
			new Ingredient("Basil", "Herb"),
			new Ingredient("Cheese", "Dairy"),
		];
	}

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
}
