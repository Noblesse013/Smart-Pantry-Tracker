'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Paper, List, ListItem, ListItemText, Grid, Link } from '@mui/material';
import { collection, getDocs, query, setDoc, getDoc, deleteDoc, doc } from 'firebase/firestore';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Fastfood, Book } from '@mui/icons-material'; // Import the food and book icons
import axios from 'axios';
import Header from './Header'; // Import the Header component

const EDAMAM_APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [error, setError] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });

    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item) => {
    if (!item) {
      console.error('Invalid item:', item);
      return;
    }

    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const addItem = async (item, quantity) => {
    if (!item) {
      console.error('Invalid item:', item);
      return;
    }

    const docRef = doc(collection(firestore, 'inventory'), item);
    await setDoc(docRef, { quantity: parseInt(quantity) });
    await updateInventory();
  };

  const handleOpen = (item = '', quantity = 1) => {
    setCurrentItem(item);
    setItemName(item);
    setItemQuantity(quantity);
    setIsUpdate(!!item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setItemQuantity(1);
    setIsUpdate(false);
    setCurrentItem('');
  };

  const handleRecipesOpen = () => {
    setRecipesOpen(true);
  };

  const handleRecipesClose = () => {
    setRecipesOpen(false);
  };

  const fetchRecipes = async () => {
    try {
      const ingredients = inventory.map(item => item.name).join(',');
      const response = await axios.get(`https://api.edamam.com/search?q=${ingredients}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&to=5`);
      setRecipes(response.data.hits.map(hit => hit.recipe));
      setError(null);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes. Please try again later.');
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#8B4513', // SaddleBrown
      },
      secondary: {
        main: '#A0522D', // Sienna
      },
      background: {
        default: '#FAF0E6', // Linen
      },
    },
  });

  const backgroundImageUrl = 'https://www.popularwoodworking.com/review/wp-content/uploads/2023/12/iStock-1453229786-1024x751.jpg'; // URL for pantry-themed background

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={4}
        p={3}
        sx={{ 
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: theme.palette.background.default 
        }}
      >
        <Box display="flex" alignItems="center" mb={2} sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            color="white"
            sx={{ 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', 
              mr: 2 
            }}
          >
            Smart Pantry Tracker
          </Typography>
          <Fastfood fontSize="large" color="primary" />
        </Box>
        <Grid container spacing={2} mb={2} width="100%" maxWidth="800px">
          <Grid item xs={12} sm={8}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search for an item"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box height="100%">
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ height: '100%' }} 
                onClick={() => handleOpen()}
              >
                Add Item
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box height="100%">
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth 
                sx={{ height: '100%' }} 
                onClick={() => {
                  fetchRecipes();
                  handleRecipesOpen();
                }}
              >
                Get Recipes
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Paper elevation={3} sx={{ width: '100%', maxWidth: '800px', p: 3 }}>
          <Stack spacing={2}>
            {filteredInventory.length === 0 ? (
              <Typography variant="h6" color="textSecondary" align="center">
                Your pantry is empty.
              </Typography>
            ) : (
              filteredInventory.map(({ name, quantity }) => (
                <Paper key={name} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                  <Typography variant="h6">Amount: {quantity}</Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(name, quantity)}
                      sx={{ mr: 1 }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeItem(name)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              ))
            )}
          </Stack>
        </Paper>
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: "translate(-50%, -50%)", width: '90%', maxWidth: 400, bgcolor: "background.paper", borderRadius: 1, boxShadow: 24, p: 4 }}
          >
            <Typography variant="h6" color="textPrimary" mb={2}>
              {isUpdate ? 'Update Item' : 'Add Item'}
            </Typography>
            <Stack spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                label='Item Name'
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                variant='outlined'
                fullWidth
                type='number'
                label='Quantity'
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
              />
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  if (isUpdate) {
                    addItem(itemName, itemQuantity);
                  } else {
                    addItem(itemName, itemQuantity);
                  }
                  handleClose();
                }}
              >
                {isUpdate ? 'Update Item' : 'Add Item'}
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Modal open={recipesOpen} onClose={handleRecipesClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: "translate(-50%, -50%)", width: '90%', maxWidth: 600, bgcolor: "background.paper", borderRadius: 1, boxShadow: 24, p: 4 }}
          >
            <Typography variant="h6" color="textPrimary" mb={2} display="flex" alignItems="center">
              <Book fontSize="small" sx={{ mr: 1 }} />
              Recipe Suggestions
            </Typography>
            {error && (
              <Typography variant="body1" color="error" mb={2}>
                {error}
              </Typography>
            )}
            <List>
              {recipes.length === 0 ? (
                <Typography variant="body1">No recipes found.</Typography>
              ) : (
                recipes.map((recipe) => (
                  <ListItem key={recipe.uri}>
                    <ListItemText
                      primary={<Link href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.label}</Link>}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}
