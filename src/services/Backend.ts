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
    * @return {Promise<Ingredient[]>} A promise that resolves to an array of `Ingredient` objects.
*/
	async getAllIngredients(): Promise<Ingredient[]> {
		try {
			const token = await this.userAuth.getAccessToken();
			const response = await axios.get<Ingredient[]>(`${process.env.REACT_APP_BACKEND_HOST}/api/get_all_ingredients`, {
				headers: { Authorization: "Bearer " + token },
			});
            if(response.status === 200){
                const ingredients = response.data.map(item => new Ingredient(item.name, item.type));
                console.log(response.data);
                this.userAuth.setAllIngredients!(ingredients); // Update the user's all ingredients
                return ingredients; // Return the mapped ingredients
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

/**
    * Purpose: This function makes a GET request to an API endpoint and retrieves all of the User's lists
    * 
    * @return {Promise<List[]>} A promise that resolves to an array of `List` objects (each with Ingredients inside it)
*/
    async getMyLists(): Promise<List[]>{
        const myLists : List[]=  [];
        try{
            const token = await this.userAuth.getAccessToken();
            const response = await axios.get<List[]>(`${process.env.REACT_APP_BACKEND_HOST}/api/user_list_ingredients`, {
				headers: { Authorization: "Bearer " + token },
			});
            if(response.status === 200){
                const data = JSON.parse(JSON.stringify(response.data));
                const results = data;
                console.log(data);
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

/**
    * Purpose: This function makes a POST request to an API endpoint to add an ingredient to a specified list.
    * 
    * @param {string} listName - The name of the list to which the ingredient will be added.
    * @param {Ingredient} ingredient - The ingredient to add, including its name, amount, and unit.
    * @return {Promise<void>} A promise that resolves when the ingredient has been added.
*/
    async addIngredient(listName: string, ingredient: Ingredient): Promise<void> {
        try {
            const token = await this.userAuth.getAccessToken();
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_HOST}/api/user_list_ingredients/add_ingredient`,
                {
                    list_name: listName,
                    ingredient: ingredient.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit
                },
                {
                    headers: { Authorization: "Bearer " + token }
                }
            );

            if (response.status === 200) {
                console.log(`Ingredient "${ingredient.name}" added successfully to list "${listName}"`);
                this.userAuth.addToList(listName, ingredient);
            } else {
                console.error(`Error: Received status code ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to add ingredient:", error);
        }
    }

    /**
 * Purpose: This function makes a GET request to an API endpoint and retrieves all measurement units.
 * 
 * @return {Promise<string[]>} A promise that resolves to an array of measurement unit strings. */
async getAllMeasurements(): Promise<string[]> {
    try {
        const token = await this.userAuth.getAccessToken();
        const response = await axios.get<{ unit: string }[]>(`${process.env.REACT_APP_BACKEND_HOST}/api/get_all_measurements`, {
            headers: { Authorization: "Bearer " + token },
        });

        if (response.status === 200) {
            const units = response.data.map(item => item.unit);
            return units; // Return the array of unit strings
        } else {
            console.error(`Error: Received status code ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error("Error fetching measurements:", error);
        return [];
    }
}


}
