/*This is just the interface for our Backend. */
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
export interface BackendInterface {
	getAllIngredients: () => Promise<Ingredient[]>;
    getMyLists: () => Promise<List[]>;
}
