import React from "react";
import { Outlet } from "react-router-dom";
import Header from "components/Header/Header";
import ToolBar from "components/Toolbar/Toolbar";
import "./Layout.css";
import { UserAuth } from "auth/UserAuth";

export interface LayoutContext {
    searchQuery: string;
}

function Layout({ userAuth }: { userAuth: UserAuth }) {
    const [searchQuery, searchQueryChange] = React.useState("");
    return (
        <div className="full-screen">
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
