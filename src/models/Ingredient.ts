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

    // Method to compare two ingredients
    equalTo(other: Ingredient): boolean {
        return this.name === other.name && this.unit === other.unit;
    }
}

