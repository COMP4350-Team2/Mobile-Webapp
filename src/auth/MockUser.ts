/*This class is for our Mock User object. It follows the same methods as Auth0User but returns hardcoded values instead*/

import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
import { UserAuth } from "./UserAuth";

export class MockUser implements UserAuth {
	private isLoggedIn: boolean = true;
	mylists: List[] = [new List("Grocery", [new Ingredient("Tomato", "Vegetable", 4, "count"), new Ingredient("Chicken", "Meat", 500, "g")]), new List("Pantry", [new Ingredient("Basil", "Herb", 3, "count"), new Ingredient("Cheese", "Dairy", 500, "g")])];

	getMyLists(): List[] {
		return this.mylists;
	}

	setMyLists(lists: List[]) {
		this.mylists = lists;
	}

	// Method to return all ingredients
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

	
	// addToList(listName: string, ingredient: Ingredient): void {
	// 	const list = this.mylists.find((list) => list.name === listName);
	// 	if (!list) {
	// 		return;
	// 	}
	// 	const found = list.ingredients.some((i) => {
	// 		if (i.equalTo(ingredient)) {
	// 			i.amount = (i.amount || 0) + (ingredient.amount || 0);
	// 			return true;
	// 		}
	// 		return false;
	// 	});
	// 	if (!found) {
	// 		list.ingredients.push(new Ingredient(ingredient.name, ingredient.type, ingredient.amount, ingredient.unit));
	// 	}
	// }
	addToList(listName: string, ingredient: Ingredient): void {
		const list = this.mylists.find(list => list.name === listName);
		if (list) {
			list.addOrUpdateIngredient(ingredient);
		}
	}
	

	isAuth0User = () => false;

	storeAccessToken() {
		// Does not apply
	}

	async getAccessToken(): Promise<string> {
		return "";
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
		// Find the index of the ingredient to remove
		const ingredientIndex = list.ingredients.findIndex((i) => i.equalTo(ingredient));
		// Remove the ingredient from the list
		list.ingredients.splice(ingredientIndex, 1);
		console.log(`Removed ${ingredient.name} from ${listName}.`);
	}
	
}
