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

    updateStep(step: string, stepNumber: number){
        const stepIndex = stepNumber - 1;
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            console.error(`Step number ${stepNumber} is out of bounds.`);
            return;
        }
        this.steps[stepIndex] = step;
    }
}