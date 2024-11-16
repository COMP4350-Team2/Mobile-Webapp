import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import { useNavigate } from "react-router-dom";
import "./Toolbar.css";
import React from "react";

function ToolBar() {

    const navigate = useNavigate();
    const isDisabled = React.useState(true);

    return (
        <div className="toolbar">
          <div
            className="toolbar-button"
            onClick={() => navigate("/logged-in")}
          >
            <HomeIcon className="toolbar-button-icon" />
            <span className="toolbar-button-text">Home</span>
          </div>
    
          <div
            className="toolbar-button"
            onClick={() => navigate("/my-lists")}
          >
            <ListIcon className="toolbar-button-icon" />
            <span className="toolbar-button-text">My Lists</span>
          </div>
    
          <div
            className="toolbar-button"
            onClick={() => navigate("/all-ingredients")}
          >
            <ListIcon className="toolbar-button-icon" />
            <span className="toolbar-button-text">Ingredients</span>
          </div>
    
          <div className={`toolbar-button ${isDisabled ? "disabled" : ""}`}>
            <ListIcon className="toolbar-button-icon" />
            <span className="toolbar-button-text">Recipes</span>
          </div>
        </div>
      );
}

export default ToolBar;
