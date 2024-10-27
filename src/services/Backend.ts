/**
 * This is our real backend. The purpose of this class is to talk to our actual backend and utilize its methods
 */
import axios from "axios";
import { UserAuth } from "../auth/UserAuth";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/Lists";
import { BackendInterface } from "./BackendInterface";

export class Backend implements BackendInterface {
	private userAuth: UserAuth;

	constructor(userAuth: UserAuth) {
		this.userAuth = userAuth;
	}

/**
    * Purpose: This function makes a GET request to an API endpoint and retrieves a list of ingredients.
    * 
    * @return {Promise<Ingredient[]>} A promise that resolves to a list of `Ingredient` objects.
*/
	async getAllIngredients(): Promise<Ingredient[]> {
		try {
			const token = await this.userAuth.getAccessToken();
			const response = await axios.get<Ingredient[]>(`${process.env.REACT_APP_BACKEND_HOST}/api/get_all_ingredients`, {
				headers: { Authorization: "Bearer " + token },
			});
			this.userAuth.setAllIngredients!(response.data as Ingredient[]);
			return response.data["result"] as Ingredient[];
		} catch (error) {
			console.error(error);
			return [];
		}
	}


    async getMyLists(): Promise<List[]>{
        const myLists : List[]=  [new List("Grocery", []), new List("Pantry", [])];
        return myLists;
    }
}
