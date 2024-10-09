import { UserAuth } from "../auth/UserAuth";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
import { BackendInterface } from "./BackendInterface";

// MockBackend class implementing BackendInterface
export class MockBackend implements BackendInterface {
	private userAuth: UserAuth;

	constructor(userAuth: UserAuth) {
		this.userAuth = userAuth; // Store the userAuth instance
	}

	// Method that returns a hardcoded list of Ingredient objects
	getAllIngredients(): Promise<Ingredient[]> {
		return new Promise<Ingredient[]>((resolve, reject) => resolve(this.userAuth.getAllIngredients()));
	}

	// Method to return the user's myLists
	// getAllLists(): List[] { // Correct return type
	//     return this.userAuth.getMyLists(); // Now returns List objects
	// }
}
