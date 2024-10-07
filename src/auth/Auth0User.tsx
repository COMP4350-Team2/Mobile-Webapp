// src/auth/Auth0User.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { Ingredient } from '../models/Ingredient';
import { List } from '../models/Lists';
import { UserAuth } from './UserAuth';

export class Auth0User implements UserAuth {
    private auth0 = useAuth0();
	private _accessToken;
    mylists: List[] = []; // Initialize as empty
    allIngredients: Ingredient[] = [];
  
    login() {
        this.auth0.loginWithRedirect(); // Logs the user in using Auth0 redirect
    }

    logout() {
        this.auth0.logout(); // Logs the user out using Auth0 logout
    }

    isAuthenticated(): boolean {
        return this.auth0.isAuthenticated; // This will be false initially until Auth0 completes login
    }

    isAuth0User = () => true;

    // Method to return the user's myLists
    getMyLists(): List[] {
        return this.mylists;
    }

    // Method to return all ingredients
    getAllIngredients(): Ingredient[] {
        return this.allIngredients; // Returns the ingredients
    }

    addToList(listName: string, ingredient: Ingredient, amount?: number, unit?: "mg" | "kg" | "count") {
        // Find the list by name
        const list = this.mylists.find(list => list.name === listName);
        
        if (list) {
            // Add ingredient to the list with specified amount and unit
            const newIngredient = new Ingredient(ingredient.name, ingredient.type, amount, unit);// Create a new ingredient object with amount and unit
            list.ingredients.push(newIngredient); // Add the ingredient to the list
        }
    }

    /** 
     * Ping message to local back end to test connection
     */
	getAccessMessage(): void {
		axios
			.get("http://localhost:8000/api/private", {
				headers: {
					authorization: "Bearer " + this._accessToken,
				},
			})
			.then(function (response) {
				console.log(response.data);
			})
			.catch(function (error) {
				console.error(error);
			});
	}

    /**
     * Retrieve access token and store in user authentication object
     */
	storeAccessToken() {
		this.auth0.getAccessTokenSilently().then((token) => (this._accessToken = token));
	}

	get accessToken(): string {
		return this._accessToken;
	}
}
