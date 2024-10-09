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
			const token = await this.userAuth.getAccessToken();
			const response = await axios.get<Ingredient[]>("http://localhost:6060/api/get_all_ingredients", {
				headers: { Authorization: "Bearer " + token },
			});
			this.userAuth.setAllIngredients!(response.data as Ingredient[]);
			return response.data["result"] as Ingredient[];
		} catch (error) {
			console.error(error);
			return [];
		}
	}
}
