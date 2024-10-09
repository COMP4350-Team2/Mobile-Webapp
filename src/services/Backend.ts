import axios from "axios";
import { UserAuth } from "../auth/UserAuth";
import { Ingredient } from "../models/Ingredient";
import { BackendInterface } from "./BackendInterface";

// Backend class implementing BackendInterface
export class Backend implements BackendInterface {
	private userAuth: UserAuth;

	constructor(userAuth: UserAuth) {
		this.userAuth = userAuth; // Store the userAuth instance
	}

	// Method that returns all ingredients
	async getAllIngredients(): Promise<Ingredient[]> {
		try {
			const response = await axios.get<Ingredient[]>("http://localhost:6060/api/get_all_ingredients", {
				headers: { authorization: "Bearer " + this.userAuth.accessToken },
			});
			this.userAuth.setAllIngredients!(response.data as Ingredient[]);
			return response.data["result"] as Ingredient[];
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	// getAllIngredients(): Promise<Ingredient[]> {
	// 	return axios
	// 		.get<Ingredient[]>("http://localhost:6060/api/get_all_ingredients", {
	// 			headers: { authorization: "Bearer " + this.userAuth.accessToken },
	// 		})
	// 		.then((response) => {
	// 			this.userAuth.setAllIngredients!(response.data as Ingredient[]);
	// 			return response.data as Ingredient[];
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 			return [];
	// 		})
	// 		.finally();
	// }

	// Method to return the user's myLists
	// getAllLists(): List[] {
	// 	// Correct return type
	// 	return this.userAuth.getMyLists();
	// }
}
