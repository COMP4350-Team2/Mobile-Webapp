import { UserAuth } from "../auth/UserAuth";
import { IngredientApiService } from "./IngredientApiService";
import { MockIngredientApiService } from "./MockIngredientApiService";

const IngredientApiServiceFactory = (userAuth: UserAuth): IngredientApiService | MockIngredientApiService => {
	return userAuth.isAuth0User() ? new IngredientApiService() : new MockIngredientApiService();
};

export default IngredientApiServiceFactory;
