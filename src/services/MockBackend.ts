/**
 * This is our Mock Backend. it just returns our Mock user's allIngredients list.
 */

import { Recipe } from "models/Recipe";
import { UserAuth } from "../auth/UserAuth";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
import { BackendInterface } from "./BackendInterface";

export class MockBackend implements BackendInterface {
	private userAuth: UserAuth;

	constructor(userAuth: UserAuth) {
		this.userAuth = userAuth;
	}

	// Method that returns a hardcoded list of Ingredient objects
	getAllIngredients(): Promise<Ingredient[]> {
		return new Promise<Ingredient[]>((resolve) => resolve(this.userAuth.getAllIngredients()));
	}

	async getMyLists(): Promise<List[]> {
		return new Promise<List[]>((resolve) => resolve(this.userAuth.getMyLists()));
	}

	async deleteList(listName: string): Promise<List[]> {
		this.userAuth.deleteList(listName);
		return Promise.resolve(this.userAuth.getMyLists());
	}

	async addIngredient(listName: string, ingredient: Ingredient): Promise<void> {
		this.userAuth.addToList(listName, ingredient);
	}

	getAllMeasurements(): Promise<string[]> {
		return Promise.resolve(["g", "mg", "ml", "kg", "L", "count"]);
	}

	async deleteIngredientFromList(listName: string, ingredient: Ingredient): Promise<void> {
		this.userAuth.removeIngredient(listName, ingredient);
	}

	async updateIngred(listName: string, oldIngredient: Ingredient, newIngredient: Ingredient): Promise<void> {
		this.userAuth.updateIngredient(listName, oldIngredient, newIngredient);
	}

	async createNewList(toAdd: List): Promise<void> {
		toAdd.ingredients = [];
		this.userAuth.createList(toAdd);
	}

	async moveIngredient(from: string, to: string, ingredient: Ingredient) {
		const allLists = await this.getMyLists();
		const fromList = allLists.find((list) => list.name === from);
		const toList = allLists.find((list) => list.name === to);

		if (!fromList) {
			console.error(`Source list "${from}" not found.`);
			return;
		}
		if (!toList) {
			console.error(`Target list "${to}" not found.`);
			return;
		}
		toList.addOrUpdateIngredient(ingredient);
		fromList.removeIngredient(ingredient);
	}

	async renameList(oldName: string, newName: string) {
		this.userAuth.setListName(oldName, newName);
	}

	async createCustomIngredient(name: string, type: string) {
		const customIngred = new Ingredient(name, type);
		customIngred.setCustomFlag(true);
		this.userAuth.addCustomIngredient(customIngred);
	}

	async deleteCustomIngredient(name: string) {
		this.userAuth.removeCustomIngredient(name);
	}

	getAllRecipes(): Promise<Recipe[]> {
		return new Promise<Recipe[]>((resolve) => resolve(this.userAuth.getAllRecipes()));
	}

	createRecipe(name: string): void {
		this.userAuth.createRecipe(name);
	}

	async deleteRecipe(name: string): Promise<Recipe[]> {
		this.userAuth.deleteRecipe(name);
		return Promise.resolve(this.userAuth.getAllRecipes());
	}

	addIngredientToRecipe(recipeName: string, ingredient: Ingredient) {
		this.userAuth.addIngredientToRecipe(recipeName, ingredient);
	}

	deleteIngredientFromRecipe(recipeName: string, ingredient: Ingredient) {
		this.userAuth.deleteIngredientFromRecipe(recipeName, ingredient);
	}

	addStepToRecipe(recipeName: string, step: string) {
		this.userAuth.addStepToRecipe(recipeName, step);
	}

	deleteStepFromRecipe(recipeName: string, stepNumber: number) {
		this.userAuth.deleteStepFromRecipe(recipeName, stepNumber);
	}

	updateStep(recipeName: string, step: string, stepNumber: number) {
		this.userAuth.updateStep(recipeName, step, stepNumber);
	}
}
