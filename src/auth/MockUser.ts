/*This class is for our Mock User object. It follows the same methods as Auth0User but returns hardcoded values instead*/

import { Recipe } from "models/Recipe";
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
	private allRecipes: Recipe[] = [];

	login() {
		this.isLoggedIn = true;
	}

	logout() {
		this.isLoggedIn = false;
	}

	isProcessing = () => false;
	isAuthenticated = () => this.isLoggedIn;
	isAuth0User = () => false;

	completeLogin() {
		// Does not apply
	}

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
		if (this.allIngredients.length === 0) {
			this.setAllIngredients();
		}
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
		const ingredientExists = this.allIngredients.some((ingredient) => ingredient.name === customIngredient.name);
		if (ingredientExists) {
			console.error(`Ingredient with the name '${customIngredient.name}' already exists in allIngredients.`);
		} else {
			this.allIngredients.push(customIngredient);
		}
	}

	removeCustomIngredient(name: string) {
		const ingredientIndex = this.allIngredients.findIndex(
			(ingredient) => ingredient.name === name && ingredient.isCustom
		);
		if (ingredientIndex !== -1) {
			this.mylists.forEach((list) => {
				const ingredientToRemove = list.ingredients.find(
					(ingredient) => ingredient.name === name && ingredient.isCustom
				);

				if (ingredientToRemove) {
					list.removeCustomIngredient(ingredientToRemove);
				}
			});
			this.allIngredients.splice(ingredientIndex, 1);
		} else {
			console.error(`Custom ingredient '${name}' not found.`);
		}
	}

	updateList(name: string, updatedIngredients: Ingredient[]) {
		const list = this.mylists.find((list) => list.name === name);
		list?.updateList(updatedIngredients);
	}

	getAllRecipes(): Recipe[] {
		if (this.allRecipes.length === 0) {
			this.setAllRecipes();
		}
		return this.allRecipes;
	}

	//method to set all recipes
	setAllRecipes(): void {
		const recipe1Ing1 = new Ingredient("Custom 1", "Custom Type");
		recipe1Ing1.setCustomFlag(true);
		const recipe1Ing2 = new Ingredient("Custom 2", "Custom Type");
		recipe1Ing2.setCustomFlag(true);
		const recipe2Ing1 = new Ingredient("Custom 3", "Custom Type");
		recipe2Ing1.setCustomFlag(true);
		const recipe2Ing2 = new Ingredient("Custom 4", "Custom Type");
		recipe2Ing2.setCustomFlag(true);
		const recipe2Ing3 = new Ingredient("Custom 5", "Custom Type");
		recipe2Ing3.setCustomFlag(true);

		const recipe1Ingredients = new List("Ingredients", [recipe1Ing1, recipe1Ing2]);
		const recipe2Ingredients = new List("Ingredients", [recipe2Ing1, recipe2Ing2, recipe2Ing3]);

		const recipe1steps = ["Cook Custom 1", "Add Custom 2", "3 table spoons of mock"];
		const recipe2steps = ["Cook Custom 3", "Add Custom 4", "Season with Custom 5", "5 table spoons of mock"];

		const recipe1 = new Recipe("Recipe 1", recipe1Ingredients, recipe1steps);
		const recipe2 = new Recipe("Recipe 2", recipe2Ingredients, recipe2steps);

        if(this.allRecipes.length === 0){
            this.allRecipes.push(recipe1, recipe2);
        }
		
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

	getStepsFromRecipe(recipeName: string): Promise<string[]> {
		const recipe = this.allRecipes.find((i) => i.name === recipeName);
		return Promise.resolve(recipe?.getSteps() || []);
	}

	getIngredientsFromRecipe(recipeName: string): Promise<Ingredient[]> {
		const recipe = this.allRecipes.find((i) => i.name === recipeName);
		return Promise.resolve(recipe ? recipe.getIngredients() : []);
	}

	getRecipe(recipeName: string) {
		return this.allRecipes.find((i) => i.name === recipeName);
	}
}
