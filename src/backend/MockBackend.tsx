import { Ingredient } from '../models/Ingredient';
import { BackendInterface } from './BackendInterface';

// MockBackend class implementing BackendInterface
export class MockBackend implements BackendInterface {

    // Method that returns a hardcoded list of Ingredient objects
    getAllIngredients(): Ingredient[] {
        return [
            { name: 'Tomato', type: 'Vegetable' },
            { name: 'Chicken', type: 'Meat' },
            { name: 'Basil', type: 'Herb' },
            { name: 'Cheese', type: 'Dairy' }
        ];
    }
}
