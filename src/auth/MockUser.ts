/*This class is for our Mock User object. It follows the same methods as Auth0User but returns hardcoded values instead*/

import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
import { UserAuth } from "./UserAuth";

export class MockUser implements UserAuth {
	private isLoggedIn: boolean = true;
	private allIngredients: Ingredient[] = [];
	mylists: List[] = [
		new List("Grocery", [
			new Ingredient("Tomato", "Vegetable", 4, "count"),
			new Ingredient("Chicken", "Meat", 500, "g"),
		]),
		new List("Pantry", [new Ingredient("Basil", "Herb", 3, "count"), new Ingredient("Cheese", "Dairy", 500, "g")]),
	];

	login() {
		this.isLoggedIn = true;
		return Promise.resolve();
	}

	logout() {
		this.isLoggedIn = false;
	}

	isProcessing = () => false;
	isAuthenticated = () => this.isLoggedIn;
	isAuth0User = () => false;

	async getAccessToken(): Promise<string> {
		return "";
	}

	getEmail = () => "mock-user@cupboard.com";

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
		this.setAllIngredients();
		return this.allIngredients;
	}

	//method to set all ingredients
	setAllIngredients(): void {
		const customIngred1 = new Ingredient("Custom 1", "Custom Type");
		customIngred1.setCustomFlag(true);
		const customIngred2 = new Ingredient("Custom 2", "Custom Type");
		customIngred2.setCustomFlag(true);
		const customIngred3 = new Ingredient("Custom 3", "Custom Type");
		customIngred3.setCustomFlag(true);
		const customIngred4 = new Ingredient("Custom 4", "Custom Type");
		customIngred4.setCustomFlag(true);
		const customIngred5 = new Ingredient("Custom 5", "Custom Type");
		customIngred5.setCustomFlag(true);

		const newIngredients = [
			new Ingredient("Tomato", "Vegetable"),
			new Ingredient("Chicken", "Meat"),
			new Ingredient("Basil", "Herb"),
			new Ingredient("Cheese", "Dairy"),
			new Ingredient("Eggs", "Dairy"),
			new Ingredient("Fish", "Meat"),
			new Ingredient("Apples", "Fruits"),
			new Ingredient("Butter", "Dairy"),
			customIngred1,
			customIngred2,
			customIngred3,
			customIngred4,
			customIngred5,
		];
		newIngredients.forEach((ingredient) => {
			const ingredientExists = this.allIngredients.some(
				(existingIngredient) =>
					existingIngredient.name === ingredient.name && existingIngredient.type === ingredient.type
			);

			if (!ingredientExists) {
				this.allIngredients.push(ingredient);
			}
		});
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
