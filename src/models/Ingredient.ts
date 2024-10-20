/**
 * This is our Ingredient class.
 */
export class Ingredient {
    name: string;
    type: string;
    amount?: number;
    unit?: "mg" | "kg" | "g" | "count" | "ml";

    constructor(name: string, type: string, amount?: number, unit?: "mg" | "kg" | "g" | "count" | "ml") {
        this.name = name;
        this.type = type;
        this.amount = amount;
        this.unit = unit;
    }

    /**
        * Purpose: Method to compare two ingredients. We check the name and unit so that we can identify an existing ingredient
        For example, if we have `5 counts of tomatoes` and we add `3 counts of tomatoes` to it, we should end up with
        `8 counts of tomatoes`. Alternatively, the user shouldnt be able to add `5 counts of tomatoes` to `1.5kg of tomatoes`

        * @param {Ingredient} other - The ingredient to compare with.
        * @return {boolean} - True if equal
    */
    equalTo(other: Ingredient): boolean {
        return this.name === other.name && this.unit === other.unit;
    }
}

