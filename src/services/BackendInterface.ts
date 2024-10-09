/*This is just the interface for our Backend. */
import { Ingredient } from "../models/Ingredient";

export interface BackendInterface {
	getAllIngredients: () => Promise<Ingredient[]>;
	// getAllLists: () => Promise<List[]>;
    //createUser: () => void;
}
