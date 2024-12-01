/**
 * This page displays all the ingredients available to the user
 */

import { Delete } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import { UserAuth } from "auth/UserAuth";
import isNumber from "is-number";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import customIngIcon from "../../assets/icons/custom_ingred.png";
import { Ingredient } from "../../models/Ingredient";
import { BackendInterface } from "../../services/BackendInterface";
import { LayoutContext } from "../Layout/Layout";
import Loading from "../Loading/Loading";
import "./AllIngredients.css";


interface AllIngredientsProps {
	backend: BackendInterface;
	user: UserAuth;
}

function AllIngredients({ backend, user }: AllIngredientsProps) {
	const { searchQuery } = useOutletContext<LayoutContext>();

	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [open, setOpen] = useState(false);
	const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
	const [amount, setAmount] = useState<number | string>("");
	const [selectedList, setSelectedList] = useState<string>("");
	const [allLists, setAllLists] = useState<string[]>([]);
	const [units, setUnits] = useState<string[]>([]);
	const [selectedUnit, setSelectedUnit] = useState<string>("g"); //dropdown menu
	const [amountError, setAmountError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filter, setFilter] = useState<"All" | "Common" | "Custom">("All");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newIngredientName, setNewIngredientName] = useState("");
    const [newIngredientType, setNewIngredientType] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);
    
	/**
	 * This hook calls the BackendInterface and retrieves all ingredients by invoking the getAllIngredients method.
	 * Once the result is validated, it calls setIngredients to display all available ingredients.
	 */
    useEffect(() => {
		const fetchIngredients = async () => {
			try {
				// Fetch the ingredients from the backend
				const res = await backend.getAllIngredients();
				// Check if response is an array
				if (Array.isArray(res)) {
					setIngredients(res);
				} else {
					throw new Error("Unexpected response format");
				}
			} catch (error) {
				console.error("Error fetching ingredients:", error);
			} finally {
				setIsLoading(false);  // Set loading to false once the fetch is done
			}
		};

		setIsLoading(true);  // Start loading
		fetchIngredients();  // Fetch ingredients from backend
	}, [backend]);

	//the hook for rendering all the user's lists
	useEffect(() => {
		const fetchLists = async () => {
			try {
				const allLists = await backend.getMyLists();
				const listNames = allLists.map((list) => list.name); // Extracting names
				setAllLists(listNames);
			} catch (error) {
				console.error("Error fetching lists:", error);
			}
		};

		fetchLists();
	}, [backend]);

	//the hook for fetching measurements
	useEffect(() => {
		const fetchUnits = async () => {
			try {
				const fetchedUnits = await backend.getAllMeasurements();
				setUnits(fetchedUnits);
				if (fetchedUnits.length > 0) {
					setSelectedUnit(fetchedUnits[0]); // Set the default unit to the first fetched unit
				}
			} catch (error) {
				console.error("Error fetching units:", error);
			}
		};

		fetchUnits();
	}, [backend]);

	/**
	 * This function handles setting a certain ingredient (so that it can be added to a list)
	 *
	 * @param {Ingredient} ingredient - The ingredient object to be set
	 */
	const handleOpen = (ingredient: Ingredient) => {
		setSelectedIngredient(ingredient);
		setOpen(true);
		setAmountError("");
	};

	const handleClose = () => {
		setOpen(false);
		setAmount("");
		setSelectedUnit(units.length > 0 ? units[0] : "g");
		setSelectedList("");
		setSelectedIngredient(null);
		setAmountError("");
	};

	/**
	 *  Purpose: This function handles adding an ingredient to a certain list
	 */
	const handleAdd = async () => {
		if (!selectedIngredient || !selectedList) {
			console.error("Missing required fields: ingredient or list");
			return;
		}

		try {
			const parsedAmount = parseFloat(amount as string);
			if (parsedAmount <= 0 && isNumber(amount)) {
				setAmountError("Please enter a valid amount.");
				return;
			}
			const ingredientToAdd = new Ingredient(
				selectedIngredient.name,
				selectedIngredient.type,
				parsedAmount,
				selectedUnit,
			);
            ingredientToAdd.setCustomFlag(selectedIngredient.isCustom);
			// Call the addIngredient method on the backend
			await backend.addIngredient(selectedList, ingredientToAdd);
            toast.success(
                `${amount} ${selectedUnit} of ${selectedIngredient.name} added to ${selectedList}`,
                {
                    style: {
                        backgroundColor: "white",
                        color:"#0f4c75",
                        fontWeight: "bold"
                    }
                }
            );
			handleClose();
            
		} catch (error) {
			console.error("Error adding ingredient:", error);
		}
	};
    const getFilteredIngredients = () => {
        switch (filter) {
            case "Common":
                return ingredients.filter((ingredient) => !ingredient.isCustom);
            case "Custom":
                return ingredients.filter((ingredient) => ingredient.isCustom);
            default:
                return ingredients;
        }
    };

	const filteredIngredients = getFilteredIngredients().filter((ingredient) =>
		ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    const handleOpenCreateDialog = () => {
        setCreateDialogOpen(true);
        setNewIngredientName(""); 
        setNewIngredientType("");
      };
      
      // Close the Create Ingredient Dialog
      const handleCloseCreateDialog = () => {
        setCreateDialogOpen(false);
      };
      
      // Handle Create action
      const handleCreateIngredient = async () => {
        if (!newIngredientName || !newIngredientName) {
            console.error("Name and type are required.");
            return;
        }
    
        try {
            // Call backend.createCustomIngredient to create the ingredient
            await backend.createCustomIngredient(newIngredientName, newIngredientType);
    
            toast.success(`Custom ingredient "${newIngredientName}"created!`, {
                style: {
                    backgroundColor: "white",
                    color: "#0f4c75",
                    fontWeight: "bold",
                },
            });
    
            // Close the dialog after successful creation
            handleCloseCreateDialog();
        } catch (error) {
            console.error("Error creating custom ingredient:", error);
            toast.error("Failed to create custom ingredient", {
                style: {
                    backgroundColor: "white",
                    color: "red",
                    fontWeight: "bold",
                },
            });
        }
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleFilterClose = () => {
        setAnchorEl(null);
    };
    
    const handleFilterChange = (newFilter: "All" | "Common" | "Custom") => {
        setFilter(newFilter);
        setAnchorEl(null); // Close the menu after selection
    };

    //open the confirm delete custom ingredient dialog
    const handleOpenConfirmDialog = (ingredient) => {
        setIngredientToDelete(ingredient);
        setOpenConfirmDialog(true);
    };

    // Method to close the custom ingredient delete confirmation dialog
    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setIngredientToDelete(null);
    };

    const handleDeleteIngredient = async () => {
        if (!ingredientToDelete) {
            console.error("No such ingredient found");
            return;
        }
        try {
            await backend.deleteCustomIngredient(ingredientToDelete.name);
            const updatedIngredients = await backend.getAllIngredients();
            setIngredients(updatedIngredients);
            toast.success(`${ingredientToDelete.name} deleted!`, {
                style: {
                    backgroundColor: "white",
                    color: "#0f4c75",
                    fontWeight: "bold",
                },
            });
            handleCloseConfirmDialog();
        } catch (error) {
            console.error("Error deleting custom ingredient:", error);
            toast.error("Failed to delete custom ingredient", {
                style: {
                    backgroundColor: "white",
                    color: "red",
                    fontWeight: "bold",
                },
            });
        }
    };
    
    return (
        <>
            {/* Sticky Box */}
            <Box
                sx={{
                    position: "fixed",
                    top: 55,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    width: "100%",
                    backgroundColor: "#1b262c", 
                    padding: "13px 16px", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    height: 40,
                    boxSizing: "border-box"
                }}
            >
                <Button
                    onClick={handleFilterClick} 
                    style={{
                        backgroundColor: "white",
                        color: "#0f4c75",
                        fontWeight: "bold",
                        padding: "6px 40px",
                        border: "none",
                        borderRadius: "30px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 30,
                        textTransform: "none",
                    }}
                >
                    <FilterListIcon /> Filter
                </Button>
                <Menu
                    anchorEl={anchorEl} 
                    open={Boolean(anchorEl)}  
                    onClose={handleFilterClose}
                >
                    <MenuItem onClick={() => handleFilterChange("All")}>
                        <Checkbox checked={filter === "All"} />
                        <ListItemText primary="All" />
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterChange("Common")}>
                        <Checkbox checked={filter === "Common"} />
                        <ListItemText primary="Common" />
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterChange("Custom")}>
                        <Checkbox checked={filter === "Custom"} />
                        <ListItemText primary="Custom" />
                    </MenuItem>
                </Menu>
    
                <Button
                    variant="contained"
                    onClick={handleOpenCreateDialog}
                    style={{
                        backgroundColor: "white",
                        color: "#0f4c75",
                        fontWeight: "bold",
                        padding: "6px 8px",
                        border: "none",
                        borderRadius: "30px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textTransform: "none",
                        width: "140px",
                        height: "30px",
                    }}
                >
                    Create Ingredient
                </Button>
            </Box>
    
            <Container
                maxWidth={false}
                disableGutters
                className="sub-color"
                style={{ height: "100%", marginTop: 6 }}
            >
                {/* Ingredient Cards */}
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <Grid container spacing={2} style={{ marginTop: "30px" }}>
                            {filteredIngredients
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((ingredient, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                        <Card style={{ position: "relative" }}>
                                            <CardContent>
                                                <Typography variant="h6" style={{ color: 'black', fontWeight: 'bold' }}>
                                                    {highlightText(ingredient.name, searchQuery)}
                                                </Typography>
    
                                                <Typography
                                                    variant="body2"
                                                    style={{
                                                        color: 'black',
                                                        fontSize: '0.98rem',
                                                        position: 'relative',
                                                        top: '8px'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 'bold' }}>Type:</span> {ingredient.type}
                                                </Typography>
                                            </CardContent>
                                            <CardActions
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    padding: "8px 15px",
                                                }}
                                            >
                                                {/* Custom Ingredient Icon at Bottom Left */}
                                                {ingredient.isCustom && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "flex-start",
                                                            alignItems: "center",
                                                            width: "33%",
                                                        }}
                                                    >
                                                        <img
                                                            src={customIngIcon}
                                                            alt="Custom Ingredient"
                                                            style={{
                                                                width: "30px",
                                                                height: "30px",
                                                            }}
                                                        />
                                                    </div>
                                                )}
    
                                                {/* Delete Icon at Bottom Middle */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        width: "33%",
                                                        padding: "0 5px",
                                                    }}
                                                >
                                                {ingredient.isCustom && (
                                                    <Tooltip title="Delete" arrow>
                                                        <Button
                                                            color="error"
                                                            onClick={() => handleOpenConfirmDialog(ingredient)}
                                                            sx={{ width: "65px", height: "30px" }}
                                                        >
                                                            <Delete sx={{ fontSize: 35 }}/>
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                                </div>
    
                                                {/* Add Ingredient Button at Bottom Right */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                        alignItems: "center",
                                                        width: "33%",
                                                    }}
                                                >
                                                    <Tooltip title="Add to List" arrow>
                                                        <IconButton
                                                            className="primary-color"
                                                            onClick={() => handleOpen(ingredient)}
                                                            sx={{
                                                                color: "white",
                                                                backgroundColor: "white",
                                                                borderRadius: "50%",
                                                                width: "40px",
                                                                height: "40px",
                                                                marginBottom: "4px"
                                                            }}
                                                        >
                                                            <AiOutlinePlus />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    </>
                )}
    
                {/* Popup Dialog for Adding Ingredients */}
                <Dialog open={open} onClose={handleClose} PaperProps={{ color: "white" }}>
                    <DialogTitle sx={{ color: "black" }}>Add Ingredient</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Amount section */}
                        <Box>
                            <div style={{ marginBottom: "2px", color: "black" }}><strong>Amount</strong></div>
                            <TextField
                                autoFocus
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setAmount(value);
                                    if (parseFloat(value) > 0 && isNumber(value)) {
                                        setAmountError("");
                                    }
                                }}
                                fullWidth
                                inputProps={{ step: "0.1", min: "0" }}
                                style={{ backgroundColor: "white", marginTop: "0px" }}
                            />
                            {amountError && <div style={{ color: "red" }}>{amountError}</div>}
                        </Box>
                        
                        {/* Unit Dropdown */}
                        <Box>
                            <div style={{ marginBottom: "2px", color: "black" }}><strong>Unit</strong></div>
                            <TextField
                                select
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                fullWidth
                                style={{ backgroundColor: "white" }}
                            >
                                {units.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        
                        {/* List Name Dropdown */}
                        <Box>
                            <div style={{ marginBottom: "2px", color: "black" }}><strong>List Name</strong></div>
                            <TextField
                                select
                                value={selectedList}
                                onChange={(e) => setSelectedList(e.target.value)}
                                fullWidth
                                style={{ backgroundColor: "white" }}
                            >
                                {allLists.length === 0 ? (
                                    <MenuItem value="">No lists available</MenuItem>
                                ) : (
                                    allLists.map((listItem) => (
                                        <MenuItem key={listItem} value={listItem}>
                                            {listItem}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAdd} className="secondary-color" style={{ color: "white" }}>
                            Add
                        </Button>
                        <Button onClick={handleClose} className="#808080" style={{ color: "black", border: "1px solid #ccc" }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
    
                {/* Create Ingredient Dialog */}
                <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} PaperProps={{ color: "white" }}>
                    <DialogTitle sx={{ color: "black" }}>Create New Ingredient</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Ingredient Name */}
                        <Box>
                            <div style={{ marginBottom: "2px", color: "black" }}><strong>Name</strong></div>
                            <TextField
                                autoFocus
                                value={newIngredientName}
                                onChange={(e) => setNewIngredientName(e.target.value)}
                                fullWidth
                                style={{ backgroundColor: "white" }}
                            />
                        </Box>
    
                        {/* Ingredient Type */}
                        <Box>
                            <div style={{ marginBottom: "2px", color: "black" }}><strong>Type</strong></div>
                            <TextField
                                value={newIngredientType}
                                onChange={(e) => setNewIngredientType(e.target.value)}
                                fullWidth
                                style={{ backgroundColor: "white" }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCreateIngredient} className="secondary-color" style={{ color: "white" }}>
                            Create
                        </Button>
                        <Button onClick={handleCloseCreateDialog} className="#808080" style={{ color: "black", border: "1px solid #ccc" }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
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
                    {ingredientToDelete ? (
                        <span>
                            Are you sure you want to delete <strong>{ingredientToDelete.name}</strong> from your list?
                        </span>
                    ) : null}
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    <Button
                        onClick={handleDeleteIngredient}
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
                        onClick={handleCloseConfirmDialog}
                        className="white"
                        style={{ color: "black", border: "1px solid #ccc" }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            </Container>
        </>
    );
    
}

export default AllIngredients;
