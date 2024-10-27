/**
  * This page will be used in our Sprint 2. As it stands, it doesn't do anything.
 */
import { AppBar, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { BackendInterface } from "services/BackendInterface";
import { UserAuth } from "../../auth/UserAuth";
import { List } from "../../models/Lists";

interface MyListsProps{
    userAuth: UserAuth;
    backendInterface: BackendInterface;
}

function MyLists({ userAuth, backendInterface }: MyListsProps) {
	const navigate = useNavigate();
    const [myLists, updateMyLists] = useState<List[]>([]);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                // Fetch the lists from the backend
                const lists = await backendInterface.getMyLists();
                // Update the userAuth DSO with the fetched lists
                userAuth.setMyLists?.(lists); 
                // Set the state with the lists from userAuth
                updateMyLists(lists); 
            } catch (error) {
                console.error("Error fetching lists:", error);
            }
        };
        fetchLists();
    }, [userAuth, backendInterface]);

	return (
		<Container maxWidth={false} disableGutters className="sub-color" style={{ height: "100vh" }}>
			{/* App Bar */}
			<AppBar position="static" className="header-color">
				<Toolbar>
					<AiOutlineArrowLeft
						style={{ fontSize: "24px", color: "white", cursor: "pointer" }}
						onClick={() => navigate("/logged-in")}
					/>
					<Typography variant="h6" style={{ flexGrow: 1, textAlign: "center", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
						My Lists
					</Typography>
				</Toolbar>
			</AppBar>

			{/* Main Content */}
			<TableContainer component={Paper} style={{ marginTop: "20px" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{ fontWeight: "bold" }}>List Name</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{myLists.length > 0 ? (
							myLists.map((list, index) => (
								<TableRow
									key={index}
									onClick={() => navigate(`/view-list/${encodeURIComponent(list.name)}`)} // we will pass the list name onto the next page
									sx={{
										cursor: "pointer",
										backgroundColor: "white",
										"&:hover": {
											backgroundColor: "#f5f5f5", 
										},
									}}
									style={{
										borderBottom: "1px solid #ddd",
									}}
								>
									<TableCell style={{ padding: "12px 16px" }}>{list.name}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell style={{ fontSize: "1.1rem", color: "#555" }} colSpan={1}>No lists available</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}

export default MyLists;

