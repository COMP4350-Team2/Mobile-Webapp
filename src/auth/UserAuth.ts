/*This is just the interface for our Users. Used for MockUser and Auth0User */
import { Recipe } from "models/Recipe";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
export interface UserAuth {
	// Authenticating methods
	login: () => void;
	logout: () => void;
	isAuthenticated: () => boolean;
	isProcessing: () => boolean;
	completeLogin: () => void;
	getAccessToken: () => Promise<string>;
	getEmail: () => string;
	isAuth0User: () => boolean;

	// Functional methods
	getMyLists: () => List[];
	deleteList: (name: string) => void;
	getAllIngredients: () => Ingredient[];
	addToList: (listName: string, ingredient: Ingredient) => void;
	setAllIngredients?: (list: Ingredient[]) => void;
	setMyLists?: (lists: List[]) => void;
	getIngredientsFromList: (listName: String) => Promise<Ingredient[]>;
	removeIngredient: (listName: string, ingredient: Ingredient) => void;
	updateIngredient: (listName: string, oldIngredient: Ingredient, newIngredient: Ingredient) => void;
	createList: (toAdd: List) => void;
    setListName: (oldName: string, newName: string) => void;
    addCustomIngredient: (customIngredient: Ingredient) => void;
    removeCustomIngredient: (name: string) => void;
    updateList: (name: string, updatedIngredients: Ingredient[]) => void;
	getAllRecipes: () => Recipe[];
	setAllRecipes?: (recipes: Recipe[]) => void;
	createRecipe: (name: string) => void;
	deleteRecipe: (name: string) => void;
	addIngredientToRecipe: (recipeName: string, ingredient: Ingredient) => void;
	deleteIngredientFromRecipe: (recipeName: string, ingredient: Ingredient) => void;
	updateRecipe: (recipeName: string, ingredients: List, steps: string[]) => void;
	addStepToRecipe: (recipeName: string, steps: string) => void;
	deleteStepFromRecipe: (recipeName: string, stepNumber: number) => void;
	updateStep: (recipeName: string, step: string, stepNumber: number) => void;
}
