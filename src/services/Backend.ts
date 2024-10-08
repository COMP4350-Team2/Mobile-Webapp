import { UserAuth } from '../auth/UserAuth';
import { Ingredient } from '../models/Ingredient';
import { List } from '../models/Lists';
import { BackendInterface } from './BackendInterface';

// Backend class implementing BackendInterface
export class Backend implements BackendInterface {
    private userAuth: UserAuth;

    constructor(userAuth: UserAuth) {
        this.userAuth = userAuth; // Store the userAuth instance
    }

    // Method that returns all ingredients
    getAllIngredients(): Ingredient[] {     
        return this.userAuth.getAllIngredients(); 
    }

    // Method to return the user's myLists
    getAllLists(): List[] { // Correct return type
        return this.userAuth.getMyLists(); 
    }
}
