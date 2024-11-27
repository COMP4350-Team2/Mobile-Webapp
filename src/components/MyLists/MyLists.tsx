import { Delete, Edit } from "@mui/icons-material";
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
    Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
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
    const [oldName, setOldName] = useState("");
    const [newName, setNewName] = useState("");
    const [openRenameDialog, setOpenRenameDialog] = useState(false);

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
			const listExists = myLists.some((list) => list.name.trim() === trimmedName);

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
					toast.success(`${newList.name} created successfully!`, {
						style: {
							backgroundColor: "white",
							color: "#0f4c75",
							fontWeight: "bold",
						},
					});
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

    const handleOpenRenameDialog = (list: List) => {
        setOldName(list.name);
        setNewName("");
        setNameError(null);
        setOpenRenameDialog(true);
    };
    
    const handleCloseRenameDialog = () => {
        setOpenRenameDialog(false);
        setOldName("");
        setNewName("");
        setNameError(null);
    };
	const deleteList = async () => {
		const newList = await backendInterface.deleteList(activeList?.name ?? "");
		updateMyLists(newList);
		closeConfirmDeleteDialog();
		if (activeList) {
			toast.success(`List ${activeList.name} successfully deleted.`, {
				style: {
					backgroundColor: "white",
					color: "#0f4c75",
					fontWeight: "bold",
				},
			});
		}
	};

    const handleRenameList = async (oldName: string, newName: string) => {
        const trimmedOldName = oldName.trim();
        const trimmedNewName = newName.trim();
    
        if (!trimmedNewName) {
            setNameError("Please enter a valid new list name.");
            return;
        }
    
        const listExists = myLists.some(
            (list) => list.name.trim() === trimmedNewName
        );
    
        if (listExists) {
            setNameError("A list with this name already exists. Please choose a unique name.");
            return;
        }
    
        try {
            setNameError(null);
            await backendInterface.renameList(trimmedOldName, trimmedNewName);
    
            const updatedLists = await backendInterface.getMyLists();
            userAuth.setMyLists?.(updatedLists);
            updateMyLists(updatedLists);
    
            toast.success(`${trimmedOldName} has been renamed to ${trimmedNewName}`, {
                style: {
                    backgroundColor: "white",
                    color: "#0f4c75",
                    fontWeight: "bold",
                },
            });
    
            handleCloseRenameDialog();
        } catch (error) {
            console.error("Error renaming list:", error);
        }
    };
    

	const filteredLists = myLists.filter((list) => list.name.toLowerCase().includes(searchQuery.toLowerCase()));

	const highlightText = (text: string, query: string) => {
		if (!query) return text;

		const parts = text.split(new RegExp(`(${query})`, "gi"));
		return parts.map((part, index) =>
			part.toLowerCase() === query.toLowerCase() ? (
				<span
					key={index}
					style={{ fontWeight: "bold" }}
				>
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
						className="primary-color"
						style={{ marginTop: "20px", marginLeft: "0.75px", fontSize: "0.95rem" }}
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
									<TableCell style={{ fontWeight: "bold", fontSize: "1.1rem" }}>List Name</TableCell>
									<TableCell align="right" /> {/* column for action */}
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredLists.length > 0 ? (
									filteredLists
                                    .slice()
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((list, index) => (
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
											<TableCell style={{ padding: "12px 16px", fontSize: "1.1rem" }}>
												{highlightText(list.name, searchQuery)}
											</TableCell>
											<TableCell align="right">
                                            <Tooltip
                                             title="Rename list" 
                                             arrow
                                            >
                                                <Button
                                                    color="primary"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleOpenRenameDialog(list);
                                                    }}
                                                    sx={{ width: "65px" }}
                                                >
                                                    <Edit />
                                                </Button>

                                                </Tooltip>
												<Tooltip
													title="Delete list"
													arrow
												>
													<Button
														color="error"
														onClick={(event) => {
															event.stopPropagation(); // Prevents the row's onClick from triggering
															handleConfirmDelete(list);
														}}
													>
														<Delete />
													</Button>
												</Tooltip>
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
				PaperProps={{ color: "white" }}
			>
				<DialogTitle sx={{ color: "black" }}>Create New List</DialogTitle>
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
						style={{ color: "white" }}
						onClick={handleCreateList}
						disabled={!newListName.trim()}
						className="secondary-color"
					>
						Create
					</Button>
					<Button
						style={{ color: "black", border: "1px solid #ccc" }}
						onClick={handleCloseNewListDialog}
						className="white"
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			{/* Confirm Delete Dialog */}
			<Dialog
				open={openConfirmDeleteDialog}
				onClose={closeConfirmDeleteDialog}
				PaperProps={{ className: "white" }}
			>
				<DialogTitle
					sx={{
						color: "black",
						textAlign: "center",
						marginBottom: "4px",
						paddingBottom: "4px",
					}}
				>
					<strong>Confirm Deletion</strong>
				</DialogTitle>
				<DialogContent
					sx={{
						color: "black",
						textAlign: "center",
						marginBottom: "4px",
						paddingBottom: "4px",
					}}
				>
					{activeList ? (
						<span>
							Are you sure you want to delete list <strong>{activeList.name}</strong>?
						</span>
					) : null}
				</DialogContent>
				<DialogActions
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "flex-start",
						gap: "20px",
					}}
				>
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
						Delete
					</Button>
					<Button
						onClick={closeConfirmDeleteDialog}
						className="white"
						style={{ color: "black", border: "1px solid #ccc" }}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
            <Dialog
                open={openRenameDialog}
                onClose={handleCloseRenameDialog}
                PaperProps={{ color: "white" }}
            >
            <DialogTitle sx={{ color: "black" }}>Rename List</DialogTitle>
            <DialogContent>
                <TextField
                    label="Current Name"
                    value={oldName}
                    disabled
                    fullWidth
                    margin="dense"
                    InputProps={{ style: { backgroundColor: "white" } }}
                />
                <TextField
                    label="New Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputProps={{ style: { backgroundColor: "white" } }}
                    error={!!nameError}
                    helperText={nameError}
                />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleRenameList(oldName, newName)}
                        disabled={!newName.trim()}
                        className="secondary-color"
                        style={{color: "white"}}
                    >
                        Rename
                    </Button>
                    <Button
                        onClick={handleCloseRenameDialog}
                        style={{ color: "black", border: "1px solid #ccc" }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
                </Dialog>
		</Container>
	);
}

export default MyLists;
