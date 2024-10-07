// src/models/List.ts
import { Ingredient } from './Ingredient';

export class List {
    name: string;
    ingredients: Ingredient[];

    constructor(name: string, ingredients: Ingredient[] = []) {
        this.name = name;
        this.ingredients = ingredients;
    }
}
