/**
 * This is a List data structure class (that we will be using to keep track of the User's lists)
 * Each list has a name and an array if Ingredient in it.
 */
import { Ingredient } from './Ingredient';

export class List {
    name: string;
    ingredients: Ingredient[];

    constructor(name: string, ingredients: Ingredient[] = []) {
        this.name = name;
        this.ingredients = ingredients;
    }

    /*This method checks if an Ingredient already exists within a list (so that it can update the amount)
    or if it needs to be added as a new Ingredient to the list */
    addOrUpdateIngredient(newIngredient: Ingredient): void {
        const existingIngredient = this.ingredients.find(i => i.equalTo(newIngredient));
        if (existingIngredient) {
            existingIngredient.amount = (existingIngredient.amount || 0) + (newIngredient.amount || 0);
        } else {
            this.ingredients.push(newIngredient);
        }
    }

    removeIngredient(ingredient: Ingredient): void {
        const ingredientIndex = this.ingredients.findIndex(i => i.equalTo(ingredient));
        
        if (ingredientIndex === -1) {
            return;
        }
        this.ingredients.splice(ingredientIndex, 1);
    }

    setListName(newName:string): void {
        this.name = newName;
    }

    updateList(updatedIngredients: Ingredient[]): void {
        this.ingredients = updatedIngredients;
    }

    removeCustomIngredient(customIngredient : Ingredient): void {
        const ingredientIndex = this.ingredients.findIndex(i => i.name === customIngredient.name && i.isCustom === customIngredient.isCustom);
        if (ingredientIndex === -1) {
            return;
        }
        this.ingredients.splice(ingredientIndex, 1);

    }
}
