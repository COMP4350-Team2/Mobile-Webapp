import { AppBar, Toolbar, Typography } from "@mui/material";
import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./Header.css";

interface HeaderProps {}

function Header() {
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

	return (
		<div className="full-screen">
			<AppBar
				position="static"
				className="header-color"
			>
				<Toolbar>
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
				</Toolbar>
			</AppBar>
			<Outlet />
		</div>
	);
}

export default Header;
