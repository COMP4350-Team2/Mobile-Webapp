/*This is just the interface for our Users. Used for MockUser and Auth0User */
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
export interface UserAuth {
	login: () => void;
	logout: () => void;
	isAuthenticated: () => boolean;
	isProcessing: () => boolean;
	getAccessToken: () => Promise<string>;
	isAuth0User: () => boolean;
	getMyLists: () => List[];
	getAllIngredients: () => Ingredient[];
	addToList: (listName: string, ingredient: Ingredient) => void;
	storeAccessToken?: () => void;
	setAllIngredients?: (list: Ingredient[]) => void;
    setMyLists?: (lists: List[]) => void;
	getIngredientsFromList: (listName : String) => Promise<Ingredient[]>
	removeIngredient: (listName: string, ingredient: Ingredient) => void;
    updateIngredient: (listName: string, oldIngredient: Ingredient, newIngredient: Ingredient) => void;
    createList: (toAdd : List) => void;
}
