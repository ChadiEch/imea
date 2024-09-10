import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const AddCategoryPage = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/categories', { name });
      setName(''); 
      navigate('/'); 
    } catch (err) {
      console.error('Error adding category', err);
      setError('Failed to add category');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add New Category
      </Typography>
      <Box component="form" onSubmit={handleAddCategory}>
        <TextField
          label="Category Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Category
        </Button>
      </Box>

      
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate('/')} 
        fullWidth
        style={{ marginTop: '10px' }} 
      >
        Back
      </Button>
    </Container>
  );
};

export default AddCategoryPage;
