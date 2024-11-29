import FilterListIcon from '@mui/icons-material/FilterList';
import { AppBar, Box, Checkbox, FormControlLabel, IconButton, Input, InputAdornment, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { UserAuth } from "auth/UserAuth";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import "./Header.css";

interface HeaderProp {
	userAuth: UserAuth;
	searchQuery: string;
	searchQueryChange: (val: string) => void;
    setFilter: React.Dispatch<React.SetStateAction<'All' | 'Common' | 'Custom'>>;
    filter: 'All' | 'Common' | 'Custom';
}

function Header({ userAuth, searchQuery, searchQueryChange, setFilter, filter }: HeaderProp) {
	const [menuOpenned, toggleMenu] = React.useState(false);
	const [searchBarOpenned, toggleSearchBar] = useState(false);
	const location = useLocation();
	const prevScreenName = useRef<string | null>(null);
    const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

    //ensuring the filters can be dynamically used with search queries
    useEffect(() => {}, [filter, searchQueryChange]);

    //resetting the filter option when re-rendering
    useEffect(() => {
        setFilter("All");
        setFilterOptionsVisible(activeScreenName === "Ingredients");
    }, [location.pathname, setFilter, activeScreenName]);


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

            {filterOptionsVisible && activeScreenName === "Ingredients" && (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#3282b8",
                    padding: "8px",
                    color: "white",
                }}
            >
                {/* Filter Dropdown */}
                <Box sx={{ marginRight: "auto" }}>
                    <button
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                        style={{
                            backgroundColor: "white",
                            color: "#0f4c75",
                            fontWeight: "bold",
                            padding: "6px 12px",
                            border: "none",
                            borderRadius: "30px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 30,
                        }}
                    >
                        <FilterListIcon sx={{ marginRight: "8px" }} /> Filter
                    </button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{
                            style: {
                                backgroundColor: "white",
                                color: "black",
                            },
                        }}
                    >
                        <MenuItem
                            selected={filter === "All"}
                            onClick={() => {
                                setFilter("All");
                                setAnchorEl(null);
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filter === "All"}
                                        onChange={() => setFilter("All")}
                                        sx={{
                                            color: "#0f4c75",
                                            "&.Mui-checked": { color: "#0f4c75" },
                                        }}
                                    />
                                }
                                label="All"
                            />
                        </MenuItem>
                        <MenuItem
                            selected={filter === "Common"}
                            onClick={() => {
                                setFilter("Common");
                                setAnchorEl(null);
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filter === "Common"}
                                        onChange={() => setFilter("Common")}
                                        sx={{
                                            color: "#0f4c75",
                                            "&.Mui-checked": { color: "#0f4c75" },
                                        }}
                                    />
                                }
                                label="Common"
                            />
                        </MenuItem>
                        <MenuItem
                            selected={filter === "Custom"}
                            onClick={() => {
                                setFilter("Custom");
                                setAnchorEl(null);
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filter === "Custom"}
                                        onChange={() => setFilter("Custom")}
                                        sx={{
                                            color: "#0f4c75",
                                            "&.Mui-checked": { color: "#0f4c75" },
                                        }}
                                    />
                                }
                                label="Custom"
                            />
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
        )}

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


		</>
	);
}

export default Header;
