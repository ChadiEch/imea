import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Button, Box, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import './Dashboard.css';
const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track the selected category for filtering
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [openDialog, setOpenDialog] = useState(false); // State to control the Dialog
  const [selectedItem, setSelectedItem] = useState(null); // Track which item is selected
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('userId'); // Check if user is authenticated

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
      setFilteredItems(response.data); // Start by showing all items
    } catch (error) {
      console.error('Error fetching items', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User is not logged in');
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:5000/items/${itemId}`, {
        headers: { 'user-id': userId },
      });
      fetchItems(); // Refresh items
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      // Reset to show all items if the same category is clicked again
      setFilteredItems(items);
      setSelectedCategory(null);
    } else {
      // Filter items by selected category
      const filtered = items.filter((item) => item.categoryId === categoryId);
      setFilteredItems(filtered);
      setSelectedCategory(categoryId);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(storedUserName);
    }
    fetchItems();
    fetchCategories(); // Fetch categories
  }, []);

  // Handle opening the dialog
  const handleOpenDialog = (item) => {
    setSelectedItem(item); // Set the selected item
    setOpenDialog(true); // Open the dialog
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    setSelectedItem(null); // Clear the selected item
  };

  return (
    <Container className='container'>
      <Typography variant="h4" gutterBottom>
        Welcome, {userName}
      </Typography>

      {/* Category Filter Buttons */}
      <Box mb={2}>
        <Button
          variant={!selectedCategory ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => handleCategoryClick(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleCategoryClick(category.id)}
            sx={{ marginLeft: 1 }}
          >
            {category.name}
          </Button>
        ))}
      </Box>

      {isAuthenticated ? (
        <Button variant="contained" color="primary" onClick={() => navigate('/add-item')}>
          Add New Item
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={() => navigate('/login')}>
          Login
        </Button>
      )}

      <Grid container spacing={3} marginTop={2}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card className="card">
              <CardContent>
                <Typography variant="h5">{item.title}</Typography>

                {/* Description: truncated to 2 lines */}
                <Typography variant="body2">
                  {item.description.substring(0, 100)}...
                </Typography>

                {/* Read more button to open the dialog */}
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleOpenDialog(item)}
                  className="read-more"
                >
                  Read more
                </Button>

                <Typography variant="caption">
                  {new Date(item.timestamp).toLocaleString()}
                </Typography>

                {isAuthenticated && userId == item.userId && (
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/edit-item/${item.id}`)}
                      style={{ marginRight: '10px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for showing full description */}
      {selectedItem && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedItem.title}</DialogTitle>
          <DialogContent>
            <Typography>{selectedItem.description}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Exit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Dashboard;
