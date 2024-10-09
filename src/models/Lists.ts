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
}
