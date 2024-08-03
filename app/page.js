'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Paper, List, ListItem, ListItemText, Grid } from '@mui/material';
import { collection, getDocs, query, setDoc, getDoc, deleteDoc, doc } from 'firebase/firestore';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Fastfood } from '@mui/icons-material'; // Import the food icon
import axios from 'axios';

// Replace this with your actual Spoonacular API key
const SPOONACULAR_API_KEY = '4f9ffa37adb0463da6fcc38482a9710f';

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
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: parseInt(quantity) });
    } else {
      await setDoc(docRef, { quantity: parseInt(quantity) });
    }
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
    const ingredients = inventory.map(item => item.name).join(', ');
    const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${SPOONACULAR_API_KEY}`);
    setRecipes(response.data);
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
        main: '#8e24aa', // Violet color
      },
      secondary: {
        main: '#ba68c8', // Lighter violet color
      },
      background: {
        default: '#f3e5f5',
      },
    },
  });

  const backgroundImageUrl = 'https://source.unsplash.com/featured/?pantry'; // URL for pantry-themed background

  return (
    <ThemeProvider theme={theme}>
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
        <Box display="flex" alignItems="center" mb={2}>
          <Fastfood fontSize="large" color="primary" sx={{ mr: 1 }} /> {/* Food icon */}
          <Typography variant="h3" color="primary">
            Your Pantry Tracker
          </Typography>
        </Box>
        <Grid container spacing={2} mb={2} width="100%" maxWidth="800px">
          <Grid item xs={12} sm={8}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search for an item"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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
                No items found.
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
                   


// 'use client'
// import { useState, useEffect } from 'react';
// import { firestore } from '@/firebase';
// import { Box, Modal, Typography, Stack, TextField, Button, Paper, List, ListItem, ListItemText, Grid } from '@mui/material';
// import { collection, getDocs, query, setDoc, getDoc, deleteDoc, doc } from 'firebase/firestore';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { Fastfood } from '@mui/icons-material'; // Import the food icon
// import axios from 'axios';

// // Replace this with your actual Spoonacular API key
// const SPOONACULAR_API_KEY = '4f9ffa37adb0463da6fcc38482a9710f';

// export default function Home() {
//   const [inventory, setInventory] = useState([]);
//   const [filteredInventory, setFilteredInventory] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [itemName, setItemName] = useState('');
//   const [itemQuantity, setItemQuantity] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isUpdate, setIsUpdate] = useState(false);
//   const [currentItem, setCurrentItem] = useState('');
//   const [recipes, setRecipes] = useState([]);
//   const [recipesOpen, setRecipesOpen] = useState(false);

//   const updateInventory = async () => {
//     const snapshot = query(collection(firestore, 'inventory'));
//     const docs = await getDocs(snapshot);
//     const inventoryList = [];

//     docs.forEach((doc) => {
//       inventoryList.push({
//         name: doc.id,
//         ...doc.data()
//       });
//     });

//     setInventory(inventoryList);
//     setFilteredInventory(inventoryList);
//   };

//   const removeItem = async (item) => {
//     if (!item) {
//       console.error('Invalid item:', item);
//       return;
//     }

//     const docRef = doc(collection(firestore, 'inventory'), item);
//     await deleteDoc(docRef);
//     await updateInventory();
//   };

//   const addItem = async (item, quantity) => {
//     if (!item) {
//       console.error('Invalid item:', item);
//       return;
//     }

//     const docRef = doc(collection(firestore, 'inventory'), item);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       await setDoc(docRef, { quantity: parseInt(quantity) });
//     } else {
//       await setDoc(docRef, { quantity: parseInt(quantity) });
//     }
//     await updateInventory();
//   };

//   const handleOpen = (item = '', quantity = 1) => {
//     setCurrentItem(item);
//     setItemName(item);
//     setItemQuantity(quantity);
//     setIsUpdate(!!item);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setItemName('');
//     setItemQuantity(1);
//     setIsUpdate(false);
//     setCurrentItem('');
//   };

//   const handleRecipesOpen = () => {
//     setRecipesOpen(true);
//   };

//   const handleRecipesClose = () => {
//     setRecipesOpen(false);
//   };

//   const fetchRecipes = async () => {
//     const ingredients = inventory.map(item => item.name).join(', ');
//     const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${SPOONACULAR_API_KEY}`);
//     setRecipes(response.data);
//   };

//   useEffect(() => {
//     updateInventory();
//   }, []);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query === '') {
//       setFilteredInventory(inventory);
//     } else {
//       setFilteredInventory(inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
//     }
//   };

//   const theme = createTheme({
//     palette: {
//       primary: {
//         main: '#8e24aa', // Violet color
//       },
//       secondary: {
//         main: '#ba68c8', // Lighter violet color
//       },
//       background: {
//         default: '#f3e5f5',
//       },
//     },
//   });

//   const backgroundImageUrl = 'https://source.unsplash.com/featured/?pantry'; // URL for pantry-themed background

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         width="100vw"
//         height="100vh"
//         display="flex"
//         flexDirection="column"
//         justifyContent="center"
//         alignItems="center"
//         gap={4}
//         p={3}
//         sx={{ 
//           backgroundImage: `url(${backgroundImageUrl})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundColor: theme.palette.background.default 
//         }}
//       >
//         <Box display="flex" alignItems="center" mb={2}>
//           <Fastfood fontSize="large" color="primary" sx={{ mr: 1 }} /> {/* Food icon */}
//           <Typography variant="h3" color="primary">
//             Your Pantry Tracker
//           </Typography>
//         </Box>
//         <Grid container spacing={2} mb={2} width="100%" maxWidth="800px">
//           <Grid item xs={12} sm={8}>
//             <TextField
//               variant="outlined"
//               fullWidth
//               placeholder="Search for an item"
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12} sm={2}>
//             <Box height="100%">
//               <Button 
//                 variant="contained" 
//                 color="primary" 
//                 fullWidth 
//                 sx={{ height: '100%' }} 
//                 onClick={() => handleOpen()}
//               >
//                 Add Item
//               </Button>
//             </Box>
//           </Grid>
//           <Grid item xs={12} sm={2}>
//             <Box height="100%">
//               <Button 
//                 variant="contained" 
//                 color="secondary" 
//                 fullWidth 
//                 sx={{ height: '100%' }} 
//                 onClick={() => {
//                   fetchRecipes();
//                   handleRecipesOpen();
//                 }}
//               >
//                 Get Recipes
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//         <Paper elevation={3} sx={{ width: '100%', maxWidth: '800px', p: 3 }}>
//           <Stack spacing={2}>
//             {filteredInventory.length === 0 ? (
//               <Typography variant="h6" color="textSecondary" align="center">
//                 No items found.
//               </Typography>
//             ) : (
//               filteredInventory.map(({ name, quantity }) => (
//                 <Paper key={name} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
//                   <Typography variant="h6">Amount: {quantity}</Typography>
//                   <Box>
//                     <Button
//                       variant="outlined"
//                       color="primary"
//                       onClick={() => handleOpen(name, quantity)}
//                       sx={{ mr: 1 }}
//                     >
//                       Update
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       color="secondary"
//                       onClick={() => removeItem(name)}
//                     >
//                       Delete
//                     </Button>
//                   </Box>
//                 </Paper>
//               ))
//             )}
//           </Stack>
//         </Paper>
//         <Modal open={open} onClose={handleClose}>
//           <Box
//             position="absolute"
//             top="50%"
//             left="50%"
//             sx={{ transform: "translate(-50%, -50%)", width: '90%', maxWidth: 400, bgcolor: "background.paper", borderRadius: 1, boxShadow: 24, p: 4 }}
//           >
//             <Typography variant="h6" color="textPrimary" mb={2}>
//               {isUpdate ? 'Update Item' : 'Add Item'}
//             </Typography>
//             <Stack spacing={2}>
//               <TextField
//                 variant='outlined'
//                 fullWidth
//                 label="Item Name"
//                 value={itemName}
//                 onChange={(e) => setItemName(e.target.value)}
//               />
//               <TextField
//                 variant='outlined'
//                 fullWidth
//                 type="number"
//                 label="Quantity"
//                 value={itemQuantity}
//                 onChange={(e) => setItemQuantity(e.target.value)}
//               />
//               <Button
//                 variant='contained'
//                 color="primary"
//                 onClick={() => {
//                   addItem(itemName, itemQuantity);
//                   handleClose();
//                 }}
//               >
//                 {isUpdate ? 'Update' : 'Add'}
//               </Button>
//             </Stack>
//           </Box>
//         </Modal>
//         <Modal open={recipesOpen} onClose={handleRecipesClose}>
//           <Box
//             position="absolute"
//             top="50%"
//             left="50%"
//             sx={{ transform: "translate(-50%, -50%)", width: '90%', maxWidth: 600, bgcolor: "background.paper", borderRadius: 1, boxShadow: 24, p: 4 }}
//           >
//             <Typography variant="h6" color="textPrimary" mb={2}>
//               Recipe Suggestions
//             </Typography>
//             <List>
//               {recipes.length === 0 ? (
//                 <Typography variant="body1" color="textSecondary">
//                   No recipes found.
//                 </Typography>
//               ) : (
//                 recipes.map(recipe => (
//                   <ListItem key={recipe.id}>
//                     <ListItemText
//                       primary={recipe.title}
//                       secondary={`Used ingredients: ${recipe.usedIngredientCount}, Missed ingredients: ${recipe.missedIngredientCount}`}
//                     />
//                   </ListItem>
//                 ))
//               )}
//             </List>
//           </Box>
//         </Modal>
//       </Box>
//     </ThemeProvider>
//   );
// }

// 'use client'
// import { useState, useEffect } from 'react';
// import { firestore } from '@/firebase';
// import { Box, Modal, Typography, Stack, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
// import { collection, getDocs, query, setDoc, getDoc, deleteDoc, doc } from 'firebase/firestore';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { Fastfood } from '@mui/icons-material'; // Import the food icon
// import axios from 'axios';

// // Replace this with your actual Spoonacular API key
// const SPOONACULAR_API_KEY = '4f9ffa37adb0463da6fcc38482a9710f';

// export default function Home() {
//   const [inventory, setInventory] = useState([]);
//   const [filteredInventory, setFilteredInventory] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [itemName, setItemName] = useState('');
//   const [itemQuantity, setItemQuantity] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isUpdate, setIsUpdate] = useState(false);
//   const [currentItem, setCurrentItem] = useState('');
//   const [recipes, setRecipes] = useState([]);
//   const [recipesOpen, setRecipesOpen] = useState(false);

//   const updateInventory = async () => {
//     const snapshot = query(collection(firestore, 'inventory'));
//     const docs = await getDocs(snapshot);
//     const inventoryList = [];

//     docs.forEach((doc) => {
//       inventoryList.push({
//         name: doc.id,
//         ...doc.data()
//       });
//     });

//     setInventory(inventoryList);
//     setFilteredInventory(inventoryList);
//   };

//   const removeItem = async (item) => {
//     if (!item) {
//       console.error('Invalid item:', item);
//       return;
//     }

//     const docRef = doc(collection(firestore, 'inventory'), item);
//     await deleteDoc(docRef);
//     await updateInventory();
//   };

//   const addItem = async (item, quantity) => {
//     if (!item) {
//       console.error('Invalid item:', item);
//       return;
//     }

//     const docRef = doc(collection(firestore, 'inventory'), item);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       await setDoc(docRef, { quantity: parseInt(quantity) });
//     } else {
//       await setDoc(docRef, { quantity: parseInt(quantity) });
//     }
//     await updateInventory();
//   };

//   const handleOpen = (item = '', quantity = 1) => {
//     setCurrentItem(item);
//     setItemName(item);
//     setItemQuantity(quantity);
//     setIsUpdate(!!item);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setItemName('');
//     setItemQuantity(1);
//     setIsUpdate(false);
//     setCurrentItem('');
//   };

//   const handleRecipesOpen = () => {
//     setRecipesOpen(true);
//   };

//   const handleRecipesClose = () => {
//     setRecipesOpen(false);
//   };

//   const fetchRecipes = async () => {
//     const ingredients = inventory.map(item => item.name).join(', ');
//     const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${SPOONACULAR_API_KEY}`);
//     setRecipes(response.data);
//   };

//   useEffect(() => {
//     updateInventory();
//   }, []);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query === '') {
//       setFilteredInventory(inventory);
//     } else {
//       setFilteredInventory(inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
//     }
//   };

//   const theme = createTheme({
//     palette: {
//       primary: {
//         main: '#8e24aa', // Violet color
//       },
//       secondary: {
//         main: '#ba68c8', // Lighter violet color
//       },
//       background: {
//         default: '#f3e5f5',
//       },
//     },
//   });

//   const backgroundImageUrl = 'https://source.unsplash.com/featured/?pantry'; // URL for pantry-themed background

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         width="100vw"
//         height="100vh"
//         display="flex"
//         flexDirection="column"
//         justifyContent="center"
//         alignItems="center"
//         gap={4}
//         p={3}
//         sx={{ 
//           backgroundImage: `url(${backgroundImageUrl})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundColor: theme.palette.background.default 
//         }}
//       >
//         <Box display="flex" alignItems="center" mb={2}>
//           <Fastfood fontSize="large" color="primary" sx={{ mr: 1 }} /> {/* Food icon */}
//           <Typography variant="h3" color="primary">
//             Your Pantry Tracker
//           </Typography>
//         </Box>
//         <Stack direction="row" spacing={2} mb={2} width="100%" maxWidth="800px">
//           <TextField
//             variant="outlined"
//             fullWidth
//             placeholder="Search for an item"
//             value={searchQuery}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
//           <Button variant="contained" color="primary" onClick={() => handleOpen()}>
//             Add Item
//           </Button>
//           <Button variant="contained" color="secondary" onClick={() => {
//             fetchRecipes();
//             handleRecipesOpen();
//           }}>
//             Get Recipes
//           </Button>
//         </Stack>
//         <Paper elevation={3} sx={{ width: '100%', maxWidth: '800px', p: 3 }}>
//           <Stack spacing={2}>
//             {filteredInventory.length === 0 ? (
//               <Typography variant="h6" color="textSecondary" align="center">
//                 No items found.
//               </Typography>
//             ) : (
//               filteredInventory.map(({ name, quantity }) => (
//                 <Paper key={name} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
//                   <Typography variant="h6">{quantity}</Typography>
//                   <Box>
//                     <Button
//                       variant="outlined"
//                       color="primary"
//                       onClick={() => handleOpen(name, quantity)}
//                       sx={{ mr: 1 }}
//                     >
//                       Update
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       color="secondary"
//                       onClick={() => removeItem(name)}
//                     >
//                       Delete
//                     </Button>
//                   </Box>
//                 </Paper>
//               ))
//             )}
//           </Stack>
//         </Paper>
//         <Modal open={open} onClose={handleClose}>
//           <Box
//             position="absolute"
//             top="50%"
//             left="50%"
//             sx={{ transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", borderRadius: 1, boxShadow: 24, p: 4 }}
//           >
//             <Typography variant="h6" color="textPrimary" mb={2}>
//               {isUpdate ? 'Update Item' : 'Add Item'}
//             </Typography>
//             <Stack spacing={2}>
//               <TextField
//                 variant='outlined'
//                 fullWidth
//                 label="Item Name"
//                 value={itemName}
//                 onChange={(e) => setItemName(e.target.value)}
//               />
//               <TextField
//                 variant='outlined'
//                 fullWidth
//                 type="number"
//                 label="Quantity"
//                 value={itemQuantity}
//                 onChange={(e) => setItemQuantity(e.target.value)}
//               />
//               <Button
//                 variant='contained'
//                 color="primary"
//                 onClick={() => {
//                   addItem(itemName, itemQuantity);
//                   handleClose();
//                 }}
//               >
//                 {isUpdate ? 'Update' : 'Add'}
//               </Button>
//             </Stack>
//           </Box>
//         </Modal>
//         <Modal open={recipesOpen} onClose={handleRecipesClose}>
//           <Box
//             position="absolute"
//             top="50%"
//             left="50%"
//             sx={{ transform: "translate(-50%, -50%)", width: 600, bgcolor: "background.paper", borderRadius: 1, boxShadow: 24, p: 4 }}
//           >
//             <Typography variant="h6" color="textPrimary" mb={2}>
//               Recipe Suggestions
//             </Typography>
//             <List>
//               {recipes.length === 0 ? (
//                 <Typography variant="body1" color="textSecondary">
//                   No recipes found.
//                 </Typography>
//               ) : (
//                 recipes.map(recipe => (
//                   <ListItem key={recipe.id}>
//                     <ListItemText
//                       primary={recipe.title}
//                       secondary={`Used ingredients: ${recipe.usedIngredientCount}, Missed ingredients: ${recipe.missedIngredientCount}`}
//                     />
//                   </ListItem>
//                 ))
//               )}
//             </List>
//           </Box>
//         </Modal>
//       </Box>
//     </ThemeProvider>
//   );
// }

