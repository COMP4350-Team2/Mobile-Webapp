import React from "react";
import { useNavigate } from "react-router-dom";
import homeIcon from "../../assets/icons/Home/home_col.png";
import ingredientIcon from "../../assets/icons/Ingredients/ingredients_col.png";
import listIcon from "../../assets/icons/My Lists/myLists_col.png";
import recipeIcon from "../../assets/icons/Recipes/recipe_col.png";
import "./Toolbar.css";

function ToolBar() {

    const navigate = useNavigate();
    const isDisabled = React.useState(true);

    return (
        <div className="toolbar">
          <div
            className="toolbar-button"
            onClick={() => navigate("/logged-in")}
          >
            <img src={homeIcon} alt="Home" className="toolbar-button-icon" />
            <span className="toolbar-button-text">Home</span>
          </div>
    
          <div
            className="toolbar-button"
            onClick={() => navigate("/my-lists")}
          >
            <img src={listIcon} alt="MyLists" className="toolbar-button-icon" />
            <span className="toolbar-button-text">My Lists</span>
          </div>
    
          <div
            className="toolbar-button"
            onClick={() => navigate("/all-ingredients")}
          >
            <img src={ingredientIcon} alt="AllIngredients" className="toolbar-button-icon" />
            <span className="toolbar-button-text">Ingredients</span>
          </div>
    
          <div className={`toolbar-button ${isDisabled ? "disabled" : ""}`}>
            <img src={recipeIcon} alt="Recipes" className="toolbar-button-icon" />
            <span className="toolbar-button-text">Recipes</span>
          </div>
        </div>
      );
}

export default ToolBar;
