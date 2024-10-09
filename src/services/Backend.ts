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

    // async createUser(): Promise<any> {
	// 	try {
	// 		const token = await this.userAuth.getAccessToken();
    //         console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //         console.log("ACCESS TOKEN HERE:", token);
	// 		const response = await axios.post<string>("http://localhost:6060/api/create_user", {
	// 			headers: { authorization: "Bearer " + token },
	// 		});
	// 		if(response.status === 200){
    //             const responseBody = response.data;
    //             if (responseBody.includes("Item created successfully.")) {
    //                 console.log("new user");
    //             } else if (responseBody.includes("Item already exists.")) {
    //                 console.log("existing user");
    //             } else {
    //                 console.log("Unexpected response:", responseBody);
    //             }
    //         }
    //         else{
    //             console.error('Unexpected response status');
    //         }
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// }
    
}
