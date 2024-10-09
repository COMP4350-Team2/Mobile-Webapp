import { AppBar, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai"; // Importing Back icon
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../auth/UserAuth"; // Import UserAuth
import { List } from "../../models/Lists";

function MyLists({ userAuth }: { userAuth: UserAuth }) {
	const navigate = useNavigate(); // Initialize navigate
	const [myLists, setMyLists] = useState<List[]>([]); // State for user's lists

	useEffect(() => {
		// Fetch the user's lists when the component mounts
		const lists = userAuth.getMyLists(); // Get the user's lists
		setMyLists(lists); // Update state with the lists
	}, [userAuth]);

	return (
		<Container
			maxWidth={false} // Remove maximum width constraints
			disableGutters // Remove padding on the left and right
			style={{ height: "100vh", backgroundColor: "#99D9EA" }}
		>
			{/* App Bar */}
			<AppBar position="static" style={{ backgroundColor: "#9EAD39" }}>
				<Toolbar>
					<AiOutlineArrowLeft style={{ fontSize: "24px", color: "white", cursor: "pointer" }} onClick={() => navigate("/logged-in")} />
					<Typography variant="h6" style={{ flexGrow: 1, textAlign: "center" }}>
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
						{/* Populate the table with the user's lists */}
						{myLists.length > 0 ? (
							myLists.map((list, index) => (
								<TableRow
									key={index}
									onClick={() => {
										console.log(`Clicked on list: ${list.name}`);
										// Navigate to the specific list details page here
										navigate(`/view-list/${list.name}`); // Navigate to the ViewList page with the list ID
									}}
									sx={{
										cursor: "pointer", // Change cursor to pointer
										"&:hover": {
											backgroundColor: "#EDDC7E", // Change background color on hover
										},
									}}
								>
									<TableCell>{list.name}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell>No lists available</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}

export default MyLists;
