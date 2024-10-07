export interface Ingredient {
    name: string;
    type: string;
    amount?: number;
    unit?: "mg" | "kg" | "count" 
}