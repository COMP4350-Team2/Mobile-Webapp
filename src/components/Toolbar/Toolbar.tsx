import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import homeIcon from "../../assets/icons/ToolBar/Home/home_col.png";
import ingredientIcon from "../../assets/icons/ToolBar/Ingredients/ingredients_col.png";
import listIcon from "../../assets/icons/ToolBar/My Lists/myLists_col.png";
import recipeIcon from "../../assets/icons/ToolBar/Recipes/recipe_col.png";
import "./Toolbar.css";

function ToolBar() {
	const navigate = useNavigate();
	const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
	// To make button looks selected while on that page
	const isActive = (path: string) => location.pathname === path;

	const goToPage = (path: string) => {
		if (location.pathname !== path) {
			navigate(path);
		}
	};

    const handleRecipesClick = () => {
        setIsDialogOpen(true);
      };
    
      const handleCloseDialog = () => {
        setIsDialogOpen(false);
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
				className={`toolbar-button 
                ${isActive("/recipes") ? "selected" : ""} `}
                onClick={handleRecipesClick}
			>
				<img
					src={recipeIcon}
					alt="Recipes"
					className="toolbar-button-icon"
				/>
				<span className="toolbar-button-text">Recipes</span>
			</div>

            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                sx={{
                    color: "#0f4c75",
                    textAlign: "center",
                    marginBottom: "4px",
                    paddingBottom: "4px",
                }}
                >
                <strong>Let Team Teacup COOK!</strong>
                </DialogTitle>
                <DialogContent
                sx={{
                    color: "black",
                    textAlign: "center",
                    marginBottom: "4px",
                    paddingBottom: "4px",
                }}
                >
                <span>We got our best people working to bring this feature to you. Stay tuned!</span>
                </DialogContent>
                <DialogActions
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                }}
                >
                <Button
                    onClick={handleCloseDialog}
                    sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "primary.dark",
                    },
                    }}
                >
                    Close
                </Button>
                </DialogActions>
            </Dialog>
		</div>
	);
}

export default ToolBar;
