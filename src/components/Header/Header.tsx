import { AppBar, IconButton, Input, InputAdornment, Toolbar, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import "./Header.css";

interface HeaderProp {
	searchQuery: string;
	searchQueryChange: (val: string) => void;
}

function Header({ searchQuery, searchQueryChange }: HeaderProp) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [searchBarOpenned, toggleSearchBar] = React.useState(false);
	const open = Boolean(anchorEl);
	const location = useLocation();

	const routeNames = useMemo(
		() => ({
			"/logged-in": "Logged In",
			"/all-ingredients": "Ingredient Selections",
			"/my-lists": "My Lists",
			"/view-list/:listName": ":listName",
		}),
		[]
	);

	// Determine the active screen name based on the current path
	const activeScreenName = useMemo(() => {
		const path = location.pathname;

		// Match path with route names. Adjust dynamic routes if needed
		for (const [route, name] of Object.entries(routeNames)) {
			if (route === path || new RegExp(`^${route.replace(/:\w+/g, "([\\w%]+)")}$`).test(path)) {
				if (name.includes(":")) {
					// Replace the dynamic part (e.g., ":listName") with the actual value from the path
					return decodeURIComponent(path.split("/").pop()!);
				}
				return name;
			}
		}

		return "404 Page Not Found";
	}, [location.pathname, routeNames]);

	const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
		// Add code to handle opening/closing menu here
	};

	return (
		<>
			<AppBar
				position="static"
				className="header-color"
			>
				<Toolbar>
					<IconButton
						aria-label="menu"
						aria-controls={open ? "long-menu" : undefined}
						aria-expanded={open ? "true" : undefined}
						aria-haspopup="true"
						onClick={toggleMenu}
						sx={{ color: "white" }}
					>
						<AiOutlineMenu />
					</IconButton>
					<Typography
						variant="h6"
						style={{
							flexGrow: 1,
							textAlign: "center",
							color: "white",
						}}
					>
						{activeScreenName}
					</Typography>
					<IconButton
						aria-label="menu"
						aria-controls={open ? "long-menu" : undefined}
						aria-expanded={open ? "true" : undefined}
						aria-haspopup="true"
						onClick={() => toggleSearchBar(!searchBarOpenned)}
						sx={{ color: "white" }}
					>
						<AiOutlineSearch />
					</IconButton>
				</Toolbar>
			</AppBar>

			{searchBarOpenned ? (
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
			) : null}
		</>
	);
}

export default Header;
