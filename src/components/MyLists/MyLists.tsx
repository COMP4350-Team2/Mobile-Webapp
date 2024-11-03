import { Delete } from "@mui/icons-material";
import {
	AppBar,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Toolbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { BackendInterface } from "services/BackendInterface";
import { UserAuth } from "../../auth/UserAuth";
import { List } from "../../models/List";

interface MyListsProps {
	userAuth: UserAuth;
	backendInterface: BackendInterface;
}

function MyLists({ userAuth, backendInterface }: MyListsProps) {
	const navigate = useNavigate();
	const [myLists, updateMyLists] = useState<List[]>([]);
	const [dialogOpenned, setDialogOpen] = useState(false);
	const [activeList, setActiveList] = useState<List | null>(null);

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

	const openConfirmDialog = (list: List) => {
		setActiveList(list);
		setDialogOpen(true);
	};

	const closeConfirmDialog = () => {
		setDialogOpen(false);
		setActiveList(null);
	};

	const deleteList = async () => {
		await backendInterface.deleteList(activeList?.name ?? "");
		closeConfirmDialog();
	};

	return (
		<Container
			maxWidth={false}
			disableGutters
			className="sub-color"
			style={{ height: "100vh" }}
		>
			{/* App Bar */}
			<AppBar
				position="static"
				className="header-color"
			>
				<Toolbar>
					<AiOutlineArrowLeft
						style={{ fontSize: "24px", color: "white", cursor: "pointer" }}
						onClick={() => navigate("/logged-in")}
					/>
					<Typography
						variant="h6"
						style={{
							flexGrow: 1,
							textAlign: "center",
							color: "white",
							fontWeight: "bold",
							fontSize: "1.5rem",
						}}
					>
						My Lists
					</Typography>
				</Toolbar>
			</AppBar>

			{/* Main Content */}
			<TableContainer
				component={Paper}
				style={{ marginTop: "20px" }}
			>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{ fontWeight: "bold" }}>List Name</TableCell>
							<TableCell></TableCell> {/* column for action */}
						</TableRow>
					</TableHead>
					<TableBody>
						{myLists.length > 0 ? (
							myLists.map((list, index) => (
								<TableRow
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
									<TableCell>
										<Button
											color="error"
											onClick={(event) => {
												event.stopPropagation(); // Prevents the row's onClick from triggering
												openConfirmDialog(list);
											}}
										>
											<Delete />
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									style={{ fontSize: "1.1rem", color: "#555" }}
									colSpan={1}
								>
									No lists available
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Confirm Delete Dialog */}
			<Dialog
				open={dialogOpenned}
				onClose={closeConfirmDialog}
				PaperProps={{ className: "secondary-color" }}
			>
				<DialogTitle style={{ color: "white" }}>Confirm Deletion</DialogTitle>
				<DialogContent style={{ color: "white" }}>
					{activeList ? <span>Are you sure you want to delete list {activeList.name}?</span> : null}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={closeConfirmDialog}
						className="primary-color"
						style={{ color: "white" }}
					>
						No
					</Button>
					<Button
						onClick={deleteList}
						sx={{
							backgroundColor: "error.main",
							color: "white",
							"&:hover": {
								backgroundColor: "error.dark",
							},
						}}
					>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}

export default MyLists;
