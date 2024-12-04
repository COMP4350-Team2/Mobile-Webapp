import {Ingredient} from "./Ingredient"
import {List} from "./List"

export class Recipe{
    name: string;
    ingredients: List;
    steps: string[];

    constructor (name: string, ingredients: List, steps: string[]){
        this.name = name;
        this.ingredients = ingredients;
        this.steps = steps;
    }

    addIngredient(toAdd: Ingredient){
        this.ingredients.addOrUpdateIngredient(toAdd);
    }

    updateRecipe(name: string, ingredients: List, steps: string[]){
        this.name = name;
        this.ingredients = ingredients;
        this.steps = steps;
    }
}