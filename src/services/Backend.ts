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
            if(response.status === 200){
                this.userAuth.setAllIngredients!(response.data as Ingredient[]);
			    return response.data["result"] as Ingredient[];
            }
			else{
                console.error(`Error: Received status code ${response.status}`);
                return [];
            }
		} catch (error) {
			console.error(error);
			return [];
		}
	}


    async getMyLists(): Promise<List[]>{
        const myLists : List[]=  [];
        try{
            const token = await this.userAuth.getAccessToken();
            const response = await axios.get<List[]>(`${process.env.REACT_APP_BACKEND_HOST}/api/user_list_ingredients`, {
				headers: { Authorization: "Bearer " + token },
			});
            if(response.status === 200){
                const data = JSON.parse(JSON.stringify(response.data));
                const results = data.result;
                if (!results) {
                    console.error("Unexpected data format:", data);
                    return [];
                }
                results.forEach((listItem: any) => {
                    const listName = listItem.list_name;
                    const ingredients: Ingredient[] = (listItem.ingredients || []).map((ingredient: any) => {
                        return new Ingredient(
                            ingredient.ingredient_name,  // name
                            ingredient.ingredient_type,  // type
                            ingredient.amount,           // amount
                            ingredient.unit              // unit
                        );
                    });
                    const list = new List(listName, ingredients);
                    myLists.push(list);
                });
            }
            else{
                console.error(`Error: Received status code ${response.status}`);
                return [];
            }
        }catch(error){
            console.error(error);
            return [];
        }
        return myLists;
    }
}
