/**
 * This is our real backend. The purpose of this class is to talk to our actual backend and utilize its methods
 */
import axios from "axios";
import { UserAuth } from "../auth/UserAuth";
import { Ingredient } from "../models/Ingredient";
import { List } from "../models/List";
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
			const response = await axios.get<{
                //we're expecting 2 arrays instead of 1
                common_ingredients: { name: string; type: string }[];
                custom_ingredients: { user: string; name: string; type: string }[];
            }
            >(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_ALL_INGREDIENTS}`,
				{
					headers: { Authorization: "Bearer " + token },
				}
			);
			if (response.status === 200) {
				const { common_ingredients, custom_ingredients } = response.data;
                //mapping the common ingredients into its array
                const commonIngredients = common_ingredients.map(
                    (item) => new Ingredient(item.name, item.type)
                );
                //for mapping custom ingredients, we need to set the flag to true (by default in the Ingredient DSO its false)
                const customIngredients = custom_ingredients.map(
                    (item) => {
                        const customIngredient = new Ingredient(item.name, item.type);
                        customIngredient.setCustomFlag(true);
                        return customIngredient;
                    }
                );

                //combine the two lists, flags and all
                const allIngredients = [...commonIngredients, ...customIngredients];
				this.userAuth.setAllIngredients!(allIngredients); 
				return allIngredients;
			} else {
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
	async getMyLists(): Promise<List[]> {
		const myLists: List[] = [];
		try {
			const token = await this.userAuth.getAccessToken();
			const response = await axios.get<List[]>(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_USER_LISTS}`,
				{
					headers: { Authorization: "Bearer " + token },
				}
			);
			if (response.status === 200) {
				const data = JSON.parse(JSON.stringify(response.data));
				const results = data;
				if (!results) {
					console.error("Unexpected data format:", data);
					return [];
				}
				results.forEach((listItem: any) => {
					const listName = listItem.list_name;
					const ingredients: Ingredient[] = (listItem.ingredients || []).map((ingredient: any) => {
						const ingred = new Ingredient(
							ingredient.ingredient_name, // name
							ingredient.ingredient_type, // type
							ingredient.amount, // amount
							ingredient.unit // unit
						);
                        ingred.setCustomFlag(ingredient.is_custom_ingredient)
                        return ingred;
					});
					const list = new List(listName, ingredients);
					myLists.push(list);
				});
				return myLists;
			} else {
				console.error(`Error: Received status code ${response.status}`);
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	/**
	 * Delete a list from the array of user's lists
	 *
	 * @param {string} listName - The name of the list to be deleted.
	 * @return {Promise<List[]>} The updated list of user's ingredient lists.
	 */
	async deleteList(listName: string): Promise<List[]> {
		try {
			const token = await this.userAuth.getAccessToken();
			const response = await axios.delete<any[]>(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_DELETE_LIST}${listName}`,
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

			if (response.status === 200) {
				this.userAuth.deleteList(listName);

				// Map the API response data to List[] with Ingredient objects
				return response.data.map((item: any) => {
					// Map each ingredient in the response to an Ingredient instance
					const ingredients = item.ingredients.map(
						(ingredient: any) =>
							new Ingredient(
								ingredient.ingredient_name,
								ingredient.ingredient_type,
								ingredient.amount,
								ingredient.unit
							)
					);

					const list = new List(item.list_name, ingredients);
					return list;
				});
			}
			return [];
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	/**
	 * Purpose: This function makes a PUT request to an API endpoint to add an ingredient to a specified list.
	 *
	 * @param {string} listName - The name of the list to which the ingredient will be added.
	 * @param {Ingredient} ingredient - The ingredient to add, including its name, amount, and unit.
	 * @return {Promise<void>} A promise that resolves when the ingredient has been added.
	 */
	async addIngredient(listName: string, ingredient: Ingredient): Promise<void> {
		try {
			const token = await this.userAuth.getAccessToken();
            console.log("CUSTOM?", ingredient.isCustom);
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_ADD_INGREDIENT}`,
				{
					list_name: listName,
					ingredient: ingredient.name,
					amount: ingredient.amount,
					unit: ingredient.unit,
                    is_custom_ingredient : ingredient.isCustom
				},
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

			if (response.status === 200) {
				this.userAuth.addToList(listName, ingredient);
			} else {
				console.error(`Error: Received status code ${response.status}`);
			}
		} catch (error) {
			console.error("Failed to add ingredient:", error);
		}
	}

	/**
	 * Purpose: This function makes a PUT request to an API endpoint to remove an ingredient from a specified list.
	 *
	 * @param {string} listName - The name of the list from which the ingredient will be removed.
	 * @param {Ingredient} ingredient - The ingredient to delete, identified by its name and unit.
	 * @return {Promise<void>} A promise that resolves when the ingredient has been deleted.
	 */
	async deleteIngredientFromList(listName: string, ingredient: Ingredient): Promise<void> {
		try {
			const token = await this.userAuth.getAccessToken();
            const url = `${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_DELETE_INGREDIENT}?` +
                        `ingredient=${ingredient.name}` +
                        `&is_custom_ingredient=${ingredient.isCustom}` +
                        `&list_name=${listName}` +
                        `&unit=${ingredient.unit}`;
            
			const response = await axios.delete(url,
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

			if (response.status === 200) {
                const data = JSON.parse(JSON.stringify(response.data));
                const listName = data.list_name;

                const updatedIngredients = data.ingredients.map((ing: any) => {
                    const newIngredient = new Ingredient(ing.ingredient_name, ing.ingredient_type, ing.amount, ing.unit );
                    newIngredient.setCustomFlag(ing.is_custom_ingredient ?? false);
                    return newIngredient;
                });
                console.log((await this.userAuth.getIngredientsFromList(listName)).length);
                console.log(updatedIngredients.length);
				await this.userAuth.updateList(listName, updatedIngredients);
			} else {
				console.error(`Error: Received status code ${response.status}`);
			}
		} catch (error) {
			console.error("Failed to delete ingredient:", error);
		}
	}

	/**
	 * Purpose: This function makes a GET request to an API endpoint and retrieves all measurement units.
	 *
	 * @return {Promise<string[]>} A promise that resolves to an array of measurement unit strings.
	 */
	async getAllMeasurements(): Promise<string[]> {
		try {
			const token = await this.userAuth.getAccessToken();
			const response = await axios.get<{ unit: string }[]>(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_ALL_MEASUREMENTS}`,
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

			if (response.status === 200) {
				const units = response.data.map((item) => item.unit);
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

	/**
	 * Purpose: This function makes a POST request to an API endpoint to create a new list for the user.
	 *
	 * @param {List} toAdd - The List object to be created, containing the list name and any initial ingredients.
	 * @return {Promise<void>} A promise that resolves when the list has been successfully created.
	 */
	async createNewList(toAdd: List): Promise<void> {
		try {
			const token = await this.userAuth.getAccessToken();

			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_CREATE_LIST}${toAdd.name}`,
				{},
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

			if (response.status === 201) {
				this.userAuth.createList(toAdd);
			} else {
				console.error(`Error: Received status code ${response.status}`);
			}
		} catch (error) {
			console.error("Failed to create new list:", error);
		}
	}

	/**
	 * Purpose: This function makes a PUT request to an API endpoint to update an ingredient in a specified list.
	 *
	 * @param {string} listName - The name of the list where the ingredient update should happen.
	 * @param {Ingredient} oldIngredient - The ingredient to be updated, identified by its name and unit.
	 * @param {Ingredient} newIngredient - The new ingredient details including name, amount, and unit.
	 * @return {Promise<void>} A promise that resolves when the ingredient has been updated.
	 */
	async updateIngred(listName: string, oldIngredient: Ingredient, newIngredient: Ingredient): Promise<void> {
		try {
			const token = await this.userAuth.getAccessToken();

			const response = await axios.patch(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_SET_INGREDIENT}`,
				{
					old_list_name: listName,
					old_ingredient: oldIngredient.name,
                    old_amount: oldIngredient.amount,
					old_unit: oldIngredient.unit,
                    old_is_custom_ingredient: oldIngredient.isCustom,
                    new_list_name: listName,
					new_ingredient: newIngredient.name,
					new_amount: newIngredient.amount,
					new_unit: newIngredient.unit,
                    new_is_custom_ingredient: newIngredient.isCustom
				},
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

            if (response.status === 200) {
                this.userAuth.updateIngredient(listName, oldIngredient, newIngredient);
            } else {
                console.error(`Error: Received status code ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to update ingredient:", error);
        }
    }

    async moveIngredient(from: string, to: string, ingredient: Ingredient){
        try {
			const token = await this.userAuth.getAccessToken();
            
			const response = await axios.patch(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_SET_INGREDIENT}`,
				{
					old_list_name: from,
					old_ingredient: ingredient.name,
                    old_amount: ingredient.amount,
					old_unit: ingredient.unit,
                    old_is_custom_ingredient: ingredient.isCustom,
                    new_list_name: to,
					new_ingredient: ingredient.name,
					new_amount: ingredient.amount,
					new_unit: ingredient.unit,
                    new_is_custom_ingredient: ingredient.isCustom
				},
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

            if (response.status === 200) {
                this.userAuth.addToList(to, ingredient);
                this.userAuth.removeIngredient(from, ingredient);
            } else {
                console.error(`Error: Received status code ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to move ingredient:", error);
        }
    }
    
    async renameList(oldName: string, newName: string) {
        try{
            const token = await this.userAuth.getAccessToken();

			const response = await axios.put(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_RENAME_LIST}`,
				{
					old_list_name: oldName,
                    new_list_name: newName,
				},
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

            if (response.status === 200) {
                this.userAuth.setListName(oldName, newName);
            } else {
                console.error(`Error: Received status code ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to rename list:", error);
        }
    }

    async createCustomIngredient(name: string, type: string) {
        try {
			const token = await this.userAuth.getAccessToken();

			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_HOST}${process.env.REACT_APP_API_CREATE_CUSTOM_INGRED}`,
				{
                    ingredient: name,
                    type: type
                },
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

			if (response.status === 201) {
                const customIngred = new Ingredient(name,type);
                customIngred.setCustomFlag(true);
				this.userAuth.addCustomIngredient(customIngred);
			} else {
				console.error(`Error: Received status code ${response.status}`);
			}
		} catch (error) {
			console.error("Failed to create custom ingredient:", error);
		}
    }

    async deleteCustomIngredient(name: string) {
    }
}
