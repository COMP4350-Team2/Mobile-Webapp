import { Ingredient } from "../models/Ingredient";

export class MockIngredientApiService {
	getAllIngredient(): Ingredient[] {
		return [
			{
				name: "carrot",
				type: "unknown",
			},
			{
				name: "potato",
				type: "unknown",
			},
			{
				name: "pasta",
				type: "unknown",
			},
			{
				name: "onion",
				type: "unknown",
			},
			{
				name: "sugar",
				type: "unknown",
			},
			{
				name: "tomato",
				type: "unknown",
			},
			{
				name: "egg",
				type: "unknown",
			},
			{
				name: "milk",
				type: "unknown",
			},
			{
				name: "shrimp",
				type: "unknown",
			},
		];
	}

	getIngredientList(name: string) {
		return {
			name: "My list",
			items: [
				{
					name: "carrot",
					type: "unknown",
				},
				{
					name: "potato",
					type: "unknown",
				},
				{
					name: "pasta",
					type: "unknown",
				},
			],
		};
	}
}
