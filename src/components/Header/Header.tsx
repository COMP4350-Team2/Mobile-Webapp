import { AppBar, Box, IconButton, Input, InputAdornment, Toolbar, Typography } from "@mui/material";
import { UserAuth } from "auth/UserAuth";
import SideMenu from 'components/SideMenu/SideMenu';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import "./Header.css";

interface HeaderProp {
	userAuth: UserAuth;
	searchQuery: string;
	searchQueryChange: (val: string) => void;
}

function Header({ userAuth, searchQuery, searchQueryChange}: HeaderProp) {
	const [menuOpenned, toggleMenu] = React.useState(false);
	const [searchBarOpenned, toggleSearchBar] = useState(false);
	const location = useLocation();
	const prevScreenName = useRef<string | null>(null);
	const routeNames = useMemo(
		() => ({
			"/home": "Home",
			"/all-ingredients": "Ingredients",
			"/my-lists": "My Lists",
			"/view-list/:listName": ":listName",
		}),
		[]
	);

	const searchInapplicableScreens = useMemo(() => ["Home"], []);

	// Determine the active screen name based on the current path
	const activeScreenName = useMemo(() => {
		const path = location.pathname;

		// Match path with route names. Adjust dynamic routes if needed
		for (const [route, name] of Object.entries(routeNames)) {
			if (route === path || new RegExp(`^${route.replace(/:\w+/g, "([\\w%-]+)")}$`).test(path)) {
				if (name.includes(":")) {
					// Replace the dynamic part (e.g., ":listName") with the actual value from the path
					return decodeURIComponent(path.split("/").pop()!);
				}
				return name;
			}
		}

		return "404 Page Not Found";
	}, [location.pathname, routeNames]);

	useEffect(() => {
		if (prevScreenName.current !== activeScreenName) {
			if (searchInapplicableScreens.includes(activeScreenName)) {
				toggleSearchBar(false); // Close the search bar when the route is one where it's not allowed
			}
			searchQueryChange("");
		}
		prevScreenName.current = activeScreenName;
	}, [activeScreenName, searchInapplicableScreens, prevScreenName, searchQueryChange]);

	return (
		<>
			<AppBar
				position="static"
				className="header-color"
			>
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<IconButton
						aria-label="menu"
						aria-controls={menuOpenned ? "menu" : undefined}
						aria-expanded={menuOpenned ? "true" : undefined}
						aria-haspopup="true"
						onClick={() => toggleMenu(true)}
						sx={{ color: "white" }}
					>
						<AiOutlineMenu />
					</IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <Typography
                            variant="h6"
                            style={{
                                color: "white",
                            }}
                        >
                            {activeScreenName}
                        </Typography>
                    </Box>
					{!searchInapplicableScreens.includes(activeScreenName) ? (
						<IconButton
							aria-label="menu"
							aria-controls={searchBarOpenned ? "search-bar" : undefined}
							aria-expanded={searchBarOpenned ? "true" : "false"}
							aria-haspopup="true"
							onClick={() => toggleSearchBar(!searchBarOpenned)}
							sx={{ color: "white" }}
						>
							<AiOutlineSearch />
						</IconButton>
					) : (
						// empty space to avoid disturbing position of other element in the header
						<div style={{ width: "24px" }} />
					)}
				</Toolbar>
			</AppBar>
            {searchBarOpenned && (
				<Input
					value={searchQuery}
					onChange={(e) => searchQueryChange(e.target.value)}
					className="search-bar"
					placeholder="Search Item"
					startAdornment={
						<InputAdornment position="start">
							<AiOutlineSearch className="search-bar-icon" />
						</InputAdornment>
					}
				/>
			)}
            {menuOpenned && (
				<SideMenu
					userAuth={userAuth}
					open={menuOpenned}
					onClose={() => toggleMenu(false)}
				></SideMenu>
			)}

		</>
	);
}

export default Header;
