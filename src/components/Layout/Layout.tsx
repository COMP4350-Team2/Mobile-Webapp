import { UserAuth } from "auth/UserAuth";
import Header from "components/Header/Header";
import ToolBar from "components/Toolbar/Toolbar";
import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./Layout.css";

export interface LayoutContext {
	searchQuery: string;
}

function Layout({ userAuth }: { userAuth: UserAuth }) {
	const [searchQuery, searchQueryChange] = React.useState("");
	return (
		<div className="full-screen">
			<ToastContainer
				position="top-center"
				autoClose={2000}
			/>
			<Header
				userAuth={userAuth}
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
