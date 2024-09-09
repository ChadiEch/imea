import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const EditItemPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');  
    }

    const fetchItemAndCategories = async () => {
      try {
        const itemResponse = await axios.get(`http://localhost:5000/items/${id}`);
        setTitle(itemResponse.data.title);
        setDescription(itemResponse.data.description);
        setSelectedCategory(itemResponse.data.categoryId);

        const categoriesResponse = await axios.get('http://localhost:5000/items/categories');
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching item or categories', error);
      }
    };

    fetchItemAndCategories();
  }, [id, navigate]);

  const handleEditItem = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/items/${id}`, {
        title,
        description,
        categoryId: selectedCategory, 
      }, {
        headers: { 'user-id': userId },
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating item', error);
    }
  };

  return (
    <Container maxWidth="sm"className='container'>
      <Typography variant="h4" gutterBottom>
        Edit Item
      </Typography>
      <Box component="form" onSubmit={handleEditItem}>
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
          Update Item
        </Button>
      </Box>
    </Container>
  );
};

export default EditItemPage;
