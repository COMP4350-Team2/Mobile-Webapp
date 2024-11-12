import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import "./Layout.css";

export interface LayoutContext {
	searchQuery: string;
}

function Layout() {
	const searchBarOpenned = true;
	const [searchQuery, searchQueryChange] = React.useState("");

	return (
		<div className="full-screen">
			<Header
				searchQuery={searchQuery}
				searchQueryChange={(val) => searchQueryChange(val)}
			></Header>
			<Outlet context={{ searchQuery }} />
			{/* Add toolbar here*/}
		</div>
	);
}

export default Layout;
