/*This is just the interface for our Backend. */
import { Recipe } from "models/Recipe";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
export interface BackendInterface {
	getAllIngredients: () => Promise<Ingredient[]>;
	getMyLists: () => Promise<List[]>;
	deleteList: (listName: string) => Promise<List[]>;
	addIngredient: (listName: string, ingredient: Ingredient) => Promise<void>;
	getAllMeasurements(): Promise<string[]>;
	deleteIngredientFromList(listName: string, ingredient: Ingredient): Promise<void>;
	updateIngred(listName: string, oldIngredient: Ingredient, newIngredient: Ingredient): Promise<void>;
	createNewList(toAdd: List): Promise<void>;
    moveIngredient(from: string, to: string, ingredient: Ingredient);
    renameList(oldName: string, newName: string);
    createCustomIngredient(name: string, type: string);
    deleteCustomIngredient(name: string);
	getAllRecipes: () => Promise <Recipe[]>;
	createRecipe: (name: string) => void;
	deleteRecipe: (name: string) => void;
	addIngredientToRecipe: (recipeName: string, ingredient: Ingredient) => void;
	deleteIngredientFromRecipe: (recipeName: string, ingredient: Ingredient) => void;
}
