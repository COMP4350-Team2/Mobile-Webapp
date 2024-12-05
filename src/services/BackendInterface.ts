/*This is just the interface for our Backend. */
import { Recipe } from "models/Recipe";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
export interface BackendInterface {
	getAllIngredients: () => Promise<Ingredient[]>;
	getAllMeasurements(): Promise<string[]>;

	getMyLists: () => Promise<List[]>;
	createNewList(toAdd: List): Promise<void>;
	deleteList: (listName: string) => Promise<List[]>;
	renameList(oldName: string, newName: string);
	addIngredient: (listName: string, ingredient: Ingredient) => Promise<void>;
	deleteIngredientFromList(listName: string, ingredient: Ingredient): Promise<void>;
	updateIngred: (listName: string, oldIngredient: Ingredient, newIngredient: Ingredient) => Promise<void>;
	moveIngredient(from: string, to: string, ingredient: Ingredient);

	createCustomIngredient(name: string, type: string);
	deleteCustomIngredient(name: string);

	getAllRecipes: () => Promise<Recipe[]>;
	createRecipe: (name: string) => void;
	deleteRecipe: (name: string) => Promise<Recipe[]>;
	addIngredientToRecipe: (recipeName: string, ingredient: Ingredient) => void;
	deleteIngredientFromRecipe: (recipeName: string, ingredient: Ingredient) => void;
	addStepToRecipe: (recipeName: string, step: string) => void;
	deleteStepFromRecipe: (recipeName: string, stepNumber: number) => void;
	updateStep: (recipeName: string, step: string, stepNumber: number) => void;
}
