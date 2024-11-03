import { Add, Delete, Edit } from "@mui/icons-material";
import { AppBar, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Fab, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { UserAuth } from "auth/UserAuth";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { BackendInterface } from "services/BackendInterface";
import { Ingredient } from "../../models/Ingredient";


interface ListNavProps {
    backendInterface: BackendInterface;
    userAuth: UserAuth;
}

function ListNav({ userAuth, backendInterface }: ListNavProps) {
    const { listName } = useParams<{ listName: string }>();
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [open, setOpen] = useState(false); //first dialogue for all ingredients
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [chosenIngredient, setChosenIngredient] = useState<Ingredient | null>(null);
    const [amount, setAmount] = useState<number | ''>('');
    const [units, setUnits] = useState<string[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>("g");
    const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null); // Ingredient to delete
    const [openUnitDialog, setOpenUnitDialog] = useState(false); //second dialogue
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Confirm deletion dialog
    const [ingredientToEdit, setIngredientToEdit] = useState<Ingredient | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editAmount, setEditAmount] = useState<number | ''>('');
    const [editUnit, setEditUnit] = useState<string>("g");
    const [amountError, setAmountError] = useState<string>('');


    useEffect(() => {
        const fetchIngredients = async () => {
            if (listName) {
                try {
                    const ingredients = await userAuth.getIngredientsFromList(listName);
                    setIngredients(ingredients);
                } catch (error) {
                    console.error("Error fetching ingredients:", error);
                }
            }
        };
        fetchIngredients();
    }, [listName, userAuth]);


    //the hook for fetching measurements
    useEffect(() => {
		const fetchUnits = async () => {
			try {
				const fetchedUnits = await backendInterface.getAllMeasurements();
				setUnits(fetchedUnits);
				if (fetchedUnits.length > 0) {
					setSelectedUnit(fetchedUnits[0]); // Set the default unit to the first fetched unit
				}
			} catch (error) {
				console.error("Error fetching units:", error);
			}
		};

		fetchUnits();
	}, [backendInterface]);

    const handleAddIngredient = async () => {
        const allIngreds = await backendInterface.getAllIngredients();
        setAllIngredients(allIngreds);
        setOpen(true);
    }

    const handleIngredientClick = (ingredient: Ingredient) =>{
        setChosenIngredient(ingredient);
        setOpen(false);
        setAmount('');
        setSelectedUnit(units.length > 0 ? units[0] : "g");
        setOpenUnitDialog(true); //open the second dialogue
    }

    const handleDeleteIngredient = async () => {
        if (ingredientToDelete && listName) {
            await backendInterface.deleteIngredientFromList(listName, ingredientToDelete);
            const updatedIngredients = await userAuth.getIngredientsFromList(listName);
            setIngredients(updatedIngredients);
            handleCloseConfirmDialog();
        }
    };

    const handleOpenConfirmDialog = (ingredient: Ingredient) => {
        setIngredientToDelete(ingredient);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setTimeout(() => {
            setIngredientToDelete(null);
        }, 100); //to handle some rendering issues when closing the box
    };



    const handleUnitDialogClose = () => {
        setOpenUnitDialog(false);
        setOpen(true); // reopen first dialog when closing second dialog
    };
    
    const handleClose = () => {
        setOpen(false);
    }

    const handleAdd = async () => {
        if (!chosenIngredient || !listName || amount === '' || !selectedUnit) {
            console.error("Missing required fields: ingredient, list, amount, or unit");
            return;
        }
        
        if (amount <= 0) {
            setAmountError("Please enter a valid amount.");
            return;
        } else {
            setAmountError(''); 
        }

        try {
            const ingredientToAdd = new Ingredient(
                chosenIngredient.name,
                chosenIngredient.type,
                amount,
                selectedUnit 
            );
    
            // Call the addIngredient method on the backend
            await backendInterface.addIngredient(listName, ingredientToAdd);
            console.log(`Added ${ingredientToAdd.name} to ${listName}`);
    
            const updatedIngredients = await userAuth.getIngredientsFromList(listName);
            setIngredients(updatedIngredients);
    
        } catch (error) {
            console.error("Error adding ingredient:", error);
        } finally {
            handleUnitDialogClose(); // Close the unit dialog
        }
    };
    
    const handleUpdateIngredient = async () => {
        if (!ingredientToEdit || !listName || editAmount === '' || !editUnit) {
            console.error("Missing required fields: ingredient, list, amount, or unit");
            return;
        }
        
        if (editAmount <= 0) {
            setAmountError("Please enter a valid amount.");
            return;
        } else {
            setAmountError(''); // Clear error if valid
        }

        try {
            const updatedIngredient = new Ingredient(
                ingredientToEdit.name,
                ingredientToEdit.type,
                editAmount,
                editUnit
            );
    
            await backendInterface.updateIngred(listName, ingredientToEdit, updatedIngredient);
            console.log(`Updated ${updatedIngredient.name} in ${listName}`);
    
            // Fetch updated ingredients for the list to refresh the UI
            const updatedIngredients = await userAuth.getIngredientsFromList(listName);
            setIngredients(updatedIngredients);
    
        } catch (error) {
            console.error("Error updating ingredient:", error);
        } finally {
            handleCloseEditDialog(); // Close the edit dialog
        }
    };
    

    const handleOpenEditDialog = (ingredient: Ingredient) => {
        setIngredientToEdit(ingredient);
        setEditAmount(ingredient.amount ?? ''); // Set initial amount
        setEditUnit(ingredient.unit ?? "g"); // Set initial unit
        setOpenEditDialog(true);
    };
    
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setTimeout(() => {
            setIngredientToEdit(null);
        }, 100); // Small delay to avoid rendering issues
    };
    
    
    return (
        <Container maxWidth={false} disableGutters className="sub-color" style={{ height: "100vh", position: "relative" }}>
            {/* App Bar */}
            <AppBar position="static" className="header-color">
                <Toolbar>
                    <AiOutlineArrowLeft
                        style={{ fontSize: "24px", color: "white", cursor: "pointer" }}
                        onClick={() => navigate("/my-lists")}
                    />
                    <Typography variant="h6" style={{ flexGrow: 1, textAlign: "center", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                        {listName}
                    </Typography>
                </Toolbar>
            </AppBar>
            
            {/* Ingredient Table */}
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>Ingredient Name</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Type</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Unit</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell> {/* New column for actions */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ingredients.length > 0 ? (
                            ingredients.map((ingredient, index) => (
                                <TableRow
                                    key={index}
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
                                    <TableCell style={{ padding: "12px 16px" }}>{ingredient.name}</TableCell>
                                    <TableCell>{ingredient.type}</TableCell>
                                    <TableCell>{ingredient.amount ?? "N/A"}</TableCell>
                                    <TableCell>{ingredient.unit ?? "N/A"}</TableCell>
                                    <TableCell>
                                        <Button
                                            color="error"
                                            onClick={() => handleOpenConfirmDialog(ingredient)} // Open confirm dialog
                                        >
                                            <Delete />
                                        </Button>
                                            <Button color="primary" onClick={() => handleOpenEditDialog(ingredient)}>
                                            <Edit />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell style={{ fontSize: "1.1rem", color: "#555" }} colSpan={5}>No ingredients available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirm Delete Dialog */}
            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog} PaperProps={{ className: "secondary-color" }}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                {ingredientToDelete ? (
                <span>Are you sure you want to delete {ingredientToDelete.name} from your list?</span>) : null}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseConfirmDialog}
                        className="primary-color" 
                        style={{ color: 'black' }} 
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleDeleteIngredient}
                        sx={{
                            backgroundColor: 'error.main', 
                            color: 'black',
                            '&:hover': {
                                backgroundColor: 'error.dark', 
                            },
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                className="primary-color"
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                }}
                onClick={handleAddIngredient}
            >
                <Add />
            </Fab>
            
            {/* Dialog for Adding Ingredients */}
            <Dialog open={open} onClose={handleClose} PaperProps={{ className: "secondary-color" }}>
            <DialogTitle>Select Ingredients</DialogTitle>
            <DialogContent>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {allIngredients.map((ingredient, index) => (
                <div
                    key={index}
                    onClick={() => handleIngredientClick(ingredient)}
                    style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #ddd',
                        backgroundColor: 'inherit',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'inherit'}
                >
                    {ingredient.name}
                </div>
                ))}
            </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} className="primary-color" style= {{color : 'black'}}>
                    Close
                </Button>
            </DialogActions>
            </Dialog>

        {/*Dialogue for editing amounts*/ }
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} PaperProps={{ className: "secondary-color" }}>
            <DialogTitle>{ingredientToEdit ? `Edit ${ingredientToEdit.name}` : 'Edit Ingredient'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Amount"
                    type="number"
                    value={editAmount}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                            setEditAmount("");
                        } else if (!isNaN(Number(value))) {
                            setEditAmount(Number(value));
                            setAmountError('');
                        }
                    }}
                    fullWidth
                    margin="normal"
                    style={{ backgroundColor: 'white' }}
                />
                {amountError && <div style={{ color: 'red' }}>{amountError}</div>}

                <div style={{ marginBottom: '0.5px', color: 'black' }}>
                    Unit
                </div>
                <TextField
                    select
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{ backgroundColor: 'white' }}
                >
                    {units.map((unitOption) => (
                        <MenuItem key={unitOption} value={unitOption}>
                            {unitOption}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseEditDialog} className="primary-color" style={{ color: 'black' }}>
                    Close
                </Button>
                <Button onClick={handleUpdateIngredient} className="primary-color" style={{ color: 'black' }}>
                    Update
                </Button>
            </DialogActions>
            </Dialog>


        {/* Dialog for Unit and Amount Input */}
        <Dialog open={openUnitDialog} onClose={handleUnitDialogClose} PaperProps={{ className: "secondary-color" }}>
                <DialogTitle>{chosenIngredient ? `Add ${chosenIngredient.name}` : 'Add Ingredient'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                                setAmount(""); 
                            } else if (!isNaN(Number(value))) {
                                setAmount(Number(value));
                                setAmountError('');
                            }
                        }}                        
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: 'white' }} // Set background color to white
                    />
                    {amountError && <div style={{ color: 'red' }}>{amountError}</div>}
                    <div style={{ marginBottom: '0.5px', color: 'black' }}>
                         Unit
                    </div>
                    <TextField
                        select
                        //label="Unit"
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: 'white' }}
                    >
                        {units.map((unitOption) => ( // **Use fetched units**
                            <MenuItem key={unitOption} value={unitOption}>
                                {unitOption}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAdd} className="primary-color" style={{ color: 'black' }}>
                        Add
                    </Button>
                    <Button onClick={handleUnitDialogClose} className="primary-color" style={{ color: 'black' }}>
                        Back
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ListNav;

