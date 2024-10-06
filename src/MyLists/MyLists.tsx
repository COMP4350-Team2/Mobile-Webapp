import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai'; // Importing Back icon
import {
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
} from '@mui/material';

const MyLists: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <Container 
      maxWidth={false} // Remove maximum width constraints
      disableGutters // Remove padding on the left and right
      style={{ height: '100vh', backgroundColor: '#99D9EA' }} 
    >
      {/* App Bar */}
      <AppBar position="static" style={{ backgroundColor: '#9EAD39' }}>
        <Toolbar>
          <AiOutlineArrowLeft
            style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
            onClick={() => navigate('/logged-in')}
          />
          <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
            My Lists
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>List Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Empty table for future lists */}
            <TableRow>
              <TableCell>No lists available</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyLists;
