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
	Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { UserAuth } from "../../auth/UserAuth";
import { Recipe } from "../../models/Recipe";
import { BackendInterface } from "../../services/BackendInterface";
import { LayoutContext } from "../Layout/Layout";
import Loading from "../Loading/Loading";

interface MyRecipeProps {
	userAuth: UserAuth;
	backendInterface: BackendInterface;
}

function MyRecipe({ userAuth, backendInterface }: MyRecipeProps) {
	const navigate = useNavigate();
	const { searchQuery } = useOutletContext<LayoutContext>();
	const [isLoading, setIsLoading] = useState(true);
	const [myRecipes, updateMyRecipes] = useState<Recipe[]>([]);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [recipeName, setName] = useState("");
	const [nameError, setNameError] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

	useEffect(() => {
		const fetch = async () => {
			try {
				// Fetch the lists from the backend
				const lists = await backendInterface.getAllRecipes();
				// Update the userAuth DSO with the fetched lists
				userAuth.setAllRecipes?.(lists);
				// Set the state with the lists from userAuth
				updateMyRecipes(lists);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching recipes:", error);
			}
		};
		setIsLoading(true);
		fetch();
	}, [userAuth, backendInterface]);

	const openCreateDialog = () => setCreateDialogOpen(true);

	const closeCreateDialog = () => {
		setCreateDialogOpen(false);
		setName("");
	};

	const handleCreate = async () => {
		const trimmedName = recipeName.trim();

		if (trimmedName) {
			const recipeExists = myRecipes.some((r) => r.name.trim() === trimmedName);

			if (recipeExists) {
				setNameError("Name duplicates, please try a different recipe name");
			} else {
				setNameError(null);
				try {
					await backendInterface.createRecipe(trimmedName);
					// Refetch lists to update state after backend operation succeeds
					const updatedLists = await backendInterface.getAllRecipes();
					userAuth.setAllRecipes?.(updatedLists);
					updateMyRecipes(updatedLists);
					toast.success(`${trimmedName} created successfully!`, {
						style: {
							backgroundColor: "white",
							color: "#0f4c75",
							fontWeight: "bold",
						},
					});
				} catch (error) {
					console.error("Error creating new list:", error);
				}
				closeCreateDialog();
			}
		}
	};

	const confirmDelete = (recipe: Recipe) => {
		setActiveRecipe(recipe);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setActiveRecipe(null);
	};

	const deleteRecipe = async () => {
		const newList = await backendInterface.deleteRecipe(activeRecipe?.name ?? "");
		updateMyRecipes(newList);
		closeDeleteDialog();
		if (activeRecipe) {
			toast.success(`Recipe ${activeRecipe.name} successfully deleted.`, {
				style: {
					backgroundColor: "white",
					color: "#0f4c75",
					fontWeight: "bold",
				},
			});
		}
	};

	const filteredLists = myRecipes.filter((recipe) => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
					{/* Create Recipe Button */}
					<Button
						variant="contained"
						color="primary"
						className="primary-color"
						style={{ marginTop: "20px", marginLeft: "0.75px", fontSize: "0.95rem" }}
						onClick={openCreateDialog}
					>
						Create Recipe
					</Button>

					<TableContainer
						component={Paper}
						style={{ marginTop: "10px" }}
					>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Recipe Name</TableCell>
									<TableCell align="right" /> {/* column for action */}
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredLists.length > 0 ? (
									filteredLists
										.slice()
										.sort((a, b) => a.name.localeCompare(b.name))
										.map((recipe, index) => (
											<TableRow
												key={index}
												onClick={() => navigate(`/my-recipes/${encodeURIComponent(recipe.name)}`)}
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
													{highlightText(recipe.name, searchQuery)}
												</TableCell>
												<TableCell align="right">
													<Tooltip
														title="Delete recipe"
														arrow
													>
														<Button
															color="error"
															onClick={(event) => {
																event.stopPropagation(); // Prevents the row's onClick from triggering
																confirmDelete(recipe);
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
											No recipe available
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</>
			)}

			{/* Dialog for creating a new recipe*/}
			<Dialog
				open={createDialogOpen}
				onClose={closeCreateDialog}
				PaperProps={{ color: "white" }}
			>
				<DialogTitle sx={{ color: "black" }}>Create New Recipe</DialogTitle>
				<DialogContent>
					{/* Input field for the new recipe name */}
					<TextField
						variant="outlined"
						value={recipeName}
						onChange={(e) => setName(e.target.value)}
						size="small"
						style={{
							width: "100%",
							backgroundColor: "white",
							marginBottom: "10px",
						}}
						InputLabelProps={{
							shrink: true,
						}}
						placeholder="Recipe Name"
					/>
					{nameError && <div style={{ color: "red" }}>{nameError}</div>}
				</DialogContent>
				<DialogActions>
					<Button
						style={{ color: "white" }}
						onClick={handleCreate}
						disabled={!recipeName.trim()}
						className="secondary-color"
					>
						Create
					</Button>
					<Button
						style={{ color: "black", border: "1px solid #ccc" }}
						onClick={closeCreateDialog}
						className="white"
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			{/* Confirm Delete Dialog */}
			<Dialog
				open={deleteDialogOpen}
				onClose={closeDeleteDialog}
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
					{activeRecipe ? (
						<span>
							Are you sure you want to delete recipe <strong>{activeRecipe.name}</strong>?
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
						onClick={deleteRecipe}
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
						onClick={closeDeleteDialog}
						className="white"
						style={{ color: "black", border: "1px solid #ccc" }}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}

export default MyRecipe;
