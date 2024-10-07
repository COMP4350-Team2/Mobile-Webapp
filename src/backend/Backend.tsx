import { Ingredient } from '../models/Ingredient';
import { BackendInterface } from './BackendInterface';

// Backend class implementing BackendInterface
export class Backend implements BackendInterface {

    // Method that returns an empty list of Ingredient objects
    getAllIngredients(): Ingredient[] {
        return [];
    }
}
