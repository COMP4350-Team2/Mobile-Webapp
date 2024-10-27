/**
 * This is our Mock Backend. it just returns our Mock user's allIngredients list.
 */

import { UserAuth } from "../auth/UserAuth";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
import { BackendInterface } from "./BackendInterface";

export class MockBackend implements BackendInterface {
	private userAuth: UserAuth;

	constructor(userAuth: UserAuth) {
		this.userAuth = userAuth;
	}

	// Method that returns a hardcoded list of Ingredient objects
	getAllIngredients(): Promise<Ingredient[]> {
		return new Promise<Ingredient[]>((resolve, reject) => resolve(this.userAuth.getAllIngredients()));
	}

    getMyLists(): Promise<List[]>{
        return new Promise<List[]>((resolve, reject) => resolve(this.userAuth.getMyLists()));
    }
}
