import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import ToolBar from "../Toolbar/Toolbar";
import "./Layout.css";

export interface LayoutContext {
	searchQuery: string;
}

function Layout() {
	const [searchQuery, searchQueryChange] = React.useState("");

	// return (
	// 	<div className="full-screen">
	// 		<Header
	// 			searchQuery={searchQuery}
	// 			searchQueryChange={(val) => searchQueryChange(val)}
	// 		></Header>
	// 		<Outlet context={{ searchQuery }} />
	// 		{/* Add toolbar here*/}
    //         <ToolBar/>
	// 	</div>
	// );

    return (
        <div className="full-screen">
          <Header
            searchQuery={searchQuery}
            searchQueryChange={(val) => searchQueryChange(val)}
          />
          
          <div className="content-container">
            <Outlet context={{ searchQuery }} />
          </div>
    
          <ToolBar />
        </div>
      );
}

export default Layout;
