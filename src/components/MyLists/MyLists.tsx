import { Delete } from "@mui/icons-material";
import {
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
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BackendInterface } from "services/BackendInterface";
import { UserAuth } from "../../auth/UserAuth";
import { List } from "../../models/List";
import { LayoutContext } from "../Layout/Layout";
import Loading from "../Loading/Loading";

interface MyListsProps {
	userAuth: UserAuth;
	backendInterface: BackendInterface;
}

function MyLists({ userAuth, backendInterface }: MyListsProps) {
	const navigate = useNavigate();
    const { searchQuery } = useOutletContext<LayoutContext>();
	const [isLoading, setIsLoading] = useState(true);
	const [myLists, updateMyLists] = useState<List[]>([]);
	const [openNewListDialog, setOpenNewListDialog] = useState(false);
	const [newListName, setNewListName] = useState("");
	const [nameError, setNameError] = useState<string | null>(null);
	const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
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
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching lists:", error);
			}
		};
		setIsLoading(true);
		fetchLists();
	}, [userAuth, backendInterface]);

	const handleOpenNewListDialog = () => setOpenNewListDialog(true);

	const handleCloseNewListDialog = () => {
		setOpenNewListDialog(false);
		setNewListName("");
	};

	const handleCreateList = async () => {
		const trimmedName = newListName.trim();

		if (trimmedName) {
			const listExists = myLists.some((list) => list.name.trim().toLowerCase() === trimmedName.toLowerCase());

			if (listExists) {
				setNameError("Please enter a unique list name");
			} else {
				setNameError(null);
				const newList = new List(trimmedName);
				try {
					await backendInterface.createNewList(newList);
					// Refetch lists to update state after backend operation succeeds
					const updatedLists = await backendInterface.getMyLists();
					userAuth.setMyLists?.(updatedLists);
					updateMyLists(updatedLists);
				} catch (error) {
					console.error("Error creating new list:", error);
				}
				handleCloseNewListDialog();
			}
		}
	};

	const handleConfirmDelete = (list: List) => {
		setActiveList(list);
		setOpenConfirmDeleteDialog(true);
	};

	const closeConfirmDeleteDialog = () => {
		setOpenConfirmDeleteDialog(false);
		setActiveList(null);
	};

	const deleteList = async () => {
		const newList = await backendInterface.deleteList(activeList?.name ?? "");
		updateMyLists(newList);
		closeConfirmDeleteDialog();
	};

    const filteredLists = myLists.filter((list) =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const highlightText = (text: string, query: string) => {
        if (!query) return text;
    
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} style={{fontWeight: "bold" }}>
              {part}
            </span>
          ) : (
            part
          )
        );
    };

	return (
		<Container
			maxWidth={false}
			disableGutters
			className="sub-color"
			style={{ height: "100%" }}
		>
			{/* Main Content */}
			{isLoading ? (
				<Loading />
			) : (
				<>
					{/* Create List Button */}
					<Button
						variant="contained"
						color="primary"
						style={{ marginTop: "20px", marginLeft: "0.75px"}}
						onClick={handleOpenNewListDialog}
					>
						Create List
					</Button>

					<TableContainer
						component={Paper}
						style={{ marginTop: "10px" }}
					>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{ fontWeight: "bold" }}>List Name</TableCell>
									<TableCell></TableCell> {/* column for action */}
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredLists.length > 0 ? (
									filteredLists.map((list, index) => (
										<TableRow
											key={index}
											onClick={() => navigate(`/view-list/${encodeURIComponent(list.name)}`)}
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
											<TableCell style={{ padding: "12px 16px" }}>{highlightText(list.name, searchQuery)}
                                            </TableCell>
											<TableCell>
												<Button
													color="error"
													onClick={(event) => {
														event.stopPropagation(); // Prevents the row's onClick from triggering
														handleConfirmDelete(list);
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
				</>
			)}

			{/* Dialog for creating a new list*/}
			<Dialog
				open={openNewListDialog}
				onClose={handleCloseNewListDialog}
				PaperProps={{ className: "secondary-color" }}
			>
				<DialogTitle>Create New List</DialogTitle>
				<DialogContent>
					{/* Input field for the new list name */}
					<TextField
						variant="outlined"
						value={newListName}
						onChange={(e) => setNewListName(e.target.value)}
						size="small"
						style={{
							width: "100%",
							backgroundColor: "white",
							marginBottom: "10px",
						}}
						InputLabelProps={{
							shrink: true,
						}}
						placeholder="List Name"
					/>
					{nameError && <div style={{ color: "red" }}>{nameError}</div>}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCloseNewListDialog}
						className="primary-color"
					>
						Cancel
					</Button>
					<Button
						onClick={handleCreateList}
						color="primary"
						disabled={!newListName.trim()}
						className="primary-color"
					>
						Create
					</Button>
				</DialogActions>
			</Dialog>

			{/* Confirm Delete Dialog */}
			<Dialog
				open={openConfirmDeleteDialog}
				onClose={closeConfirmDeleteDialog}
				PaperProps={{ className: "secondary-color" }}
			>
				<DialogTitle style={{ color: "white" }}>Confirm Deletion</DialogTitle>
				<DialogContent style={{ color: "white" }}>
					{activeList ? <span>Are you sure you want to delete list {activeList.name}?</span> : null}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={closeConfirmDeleteDialog}
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
