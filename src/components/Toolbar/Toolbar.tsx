import { useLocation, useNavigate } from "react-router-dom";
import homeIcon from "../../assets/icons/ToolBar/Home/home_col.png";
import ingredientIcon from "../../assets/icons/ToolBar/Ingredients/ingredients_col.png";
import listIcon from "../../assets/icons/ToolBar/My Lists/myLists_col.png";
import recipeIcon from "../../assets/icons/ToolBar/Recipes/recipe_col.png";
import "./Toolbar.css";

function ToolBar() {
	const navigate = useNavigate();
	const location = useLocation();

	// To make button looks selected while on that page
	const isActive = (path: string) => location.pathname === path;

	const goToPage = (path: string) => {
		if (location.pathname !== path) {
			navigate(path);
		}
	};

	return (
		<div className="toolbar">
			<div
				className={`toolbar-button ${isActive("/home") ? "selected" : ""}`}
				onClick={() => goToPage("/home")}
			>
				<img
					src={homeIcon}
					alt="Home"
					className="toolbar-button-icon"
				/>
				<span className="toolbar-button-text">Home</span>
			</div>

			<div
				className={`toolbar-button ${isActive("/my-lists") ? "selected" : ""}`}
				onClick={() => goToPage("/my-lists")}
			>
				<img
					src={listIcon}
					alt="MyLists"
					className="toolbar-button-icon"
				/>
				<span className="toolbar-button-text">My Lists</span>
			</div>

			<div
				className={`toolbar-button ${isActive("/all-ingredients") ? "selected" : ""}`}
				onClick={() => goToPage("/all-ingredients")}
			>
				<img
					src={ingredientIcon}
					alt="AllIngredients"
					className="toolbar-button-icon"
				/>
				<span className="toolbar-button-text">Ingredients</span>
			</div>

			<div
				className={`toolbar-button ${isActive("/my-recipes") ? "selected" : ""} `}
				onClick={() => goToPage("/my-recipes")}
			>
				<img
					src={recipeIcon}
					alt="Recipes"
					className="toolbar-button-icon"
				/>
				<span className="toolbar-button-text">Recipes</span>
			</div>
		</div>
	);
}

export default ToolBar;
