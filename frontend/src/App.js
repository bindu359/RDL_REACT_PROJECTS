import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Grid, Typography, Box, Card, CardContent, IconButton, Snackbar, Alert, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CRUDApp = () => {
  const [items, setItems] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false); // Success snackbar state
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false); // Error snackbar state

  const apiUrl = 'https://reqres.in/api/users?page=2';

  // Fetch data from the API
  useEffect(() => {
    axios.get(apiUrl).then((res) => {
      if (Array.isArray(res.data.data)) {
        const users = res.data.data.map(user => ({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        }));
        setItems(users);
      }
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  // Add a new user
  const addItem = () => {
    if (!firstName || !lastName || !email) {
      alert("Please fill out all fields");
      return;
    }
    const newUser = {
      id: items.length + 1,
      first_name: firstName,
      last_name: lastName,
      email: email,
    };
    setItems([...items, newUser]);
    setFirstName('');
    setLastName('');
    setEmail('');
    setOpenSuccessSnackbar(true); // Show success snackbar after adding the user
  };

  // Update an existing user
  const updateItem = () => {
    if (!editFirstName || !editLastName || !editEmail) {
      alert("Please fill out all fields for updating");
      return;
    }
    setItems(items.map((item) => (
      item.id === editId ? { ...item, first_name: editFirstName, last_name: editLastName, email: editEmail } : item
    )));
    setEditId(null);
    setEditFirstName('');
    setEditLastName('');
    setEditEmail('');
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  // Delete a user
  const deleteItem = () => {
    setItems(items.filter((item) => item.id !== deleteId));
    setOpenDeleteDialog(false);
    setOpenErrorSnackbar(true); // Show snackbar after deletion
  };

  // Close the delete confirmation dialog
  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Close the success snackbar
  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  // Close the error snackbar
  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        React CRUD App with MUI
      </Typography>

      {/* Form Container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField 
              label="First Name" 
              variant="outlined" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              fullWidth
              sx={{ marginBottom: 2 }} // Add space between fields
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField 
              label="Last Name" 
              variant="outlined" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              fullWidth
              sx={{ marginBottom: 2 }} // Add space between fields
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField 
              label="Email" 
              variant="outlined" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              fullWidth
              sx={{ marginBottom: 2 }} // Add space between fields
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Button variant="contained" color="primary" onClick={addItem} sx={{ width: '100%' }}>
              Add User
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Users List */}
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card>
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="body1">
                      {item.first_name} {item.last_name} - {item.email}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {editId === item.id ? (
                      <>
                        <TextField
                          label="Edit First Name"
                          value={editFirstName}
                          onChange={(e) => setEditFirstName(e.target.value)}
                          fullWidth
                          sx={{ marginBottom: 1 }}
                        />
                        <TextField
                          label="Edit Last Name"
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                          fullWidth
                          sx={{ marginBottom: 1 }}
                        />
                        <TextField
                          label="Edit Email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          fullWidth
                          sx={{ marginBottom: 1 }}
                        />
                        <Button variant="contained" color="primary" onClick={updateItem} sx={{ marginRight: 2 }}>
                          Save
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => setEditId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => { setEditId(item.id); setEditFirstName(item.first_name); setEditLastName(item.last_name); setEditEmail(item.email); }} sx={{ color: 'primary.main' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(item.id)} sx={{ color: 'error.main' }}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%' }}>
          User created successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar for Deletion */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
          User deleted successfully!
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteItem} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default CRUDApp;
