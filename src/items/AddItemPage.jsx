import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const AddItemPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('userId');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      console.error('You are not logged in. Redirecting to login.');
      navigate('/login');
      return;
    }

    const userId = localStorage.getItem('userId');

    try {
      const response = await axios.post(
        'http://localhost:5000/items/create',
        { title, description, categoryId: selectedCategory },
        {
          headers: { 'user-id': userId },
        }
      );

      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <Container maxWidth="sm" className='container'>
      <Typography variant="h4" gutterBottom>
        Add New Item
      </Typography>
      <Box component="form" onSubmit={handleAddItem}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Item
        </Button>
      </Box>
    </Container>
  );
};

export default AddItemPage;
