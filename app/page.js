"use client";
import { Box, Stack, Typography, Button, TextField, Modal } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, query, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 400,
  bgcolor: '#FFC0CB',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: '8px',
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Home() {
  const [pantry, setPantryList] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const q = query(collection(firestore, "pantry"));
    const querySnapshot = await getDocs(q);
    const pantryList = [];
    querySnapshot.forEach((doc) => {
      pantryList.push({ name: doc.id, count: doc.data().count });
    });
    setPantryList(pantryList);
    setFilteredPantry(pantryList);
  };

  useEffect(() => {
    setIsClient(true);
    updatePantry();
  }, []);

  const addItem = async (item) => {
    try {
      const normalizedItem = item.toLowerCase();
      const docRef = doc(collection(firestore, 'pantry'), normalizedItem);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          count: docSnap.data().count + 1
        });
      } else {
        await setDoc(docRef, { count: 1 });
      }

      updatePantry();
      handleClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item.name.toLowerCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentCount = docSnap.data().count;
        if (currentCount > 1) {
          await updateDoc(docRef, {
            count: currentCount - 1
          });
        } else {
          await deleteDoc(docRef);
        }
      }

      updatePantry();
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredPantry(pantry);
    } else {
      const filtered = pantry.filter(item => item.name.includes(query.toLowerCase()));
      setFilteredPantry(filtered);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (itemName.trim() !== "") {
      addItem(itemName);
      setItemName("");
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor={'#FFEBEF'}
      p={2}
      pt={16}
      pb={18}
    >
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        gap={2} 
        width="100%" 
        maxWidth="600px"
        mb={2}
      >
        <TextField
          id="search"
          label="Looking for something?"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          fullWidth
          sx={{ bgcolor: '#fff', borderRadius: '14px' }}
        />
        <Button 
          variant="contained" 
          onClick={handleOpen} 
          sx={{ 
            bgcolor: '#FF69B4', 
            '&:hover': { bgcolor: '#FF1493' },
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            fontSize: '0.75rem',
            padding: '4px 8px',
            mt: 0.5
          }}
        >
          Add New Items
        </Button>
      </Box>
      <Box 
        borderLeft="9px dotted grey"
        width="100%" 
        maxWidth="500px" 
 
        boxShadow={'0 4px 8px rgba(0, 0, 0, 0.1)'} 
        mt={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          width="100%"
          height="60px"
          bgcolor={'#FFB6C1'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderBottom={'1px solid #333'}
          sx={{ borderRadius: '6px 6px 0 0' }}
        >
          <Typography variant={'h5'} color={'#333'} textAlign={'center'} fontWeight={'bold'} >
            Pantry Tracker
          </Typography>
        </Box>
        <Stack
          width="100%"
          height="300px"
          spacing={2}
          overflowY={'auto'}
          padding={2}
        >
          {filteredPantry.length > 0 ? filteredPantry.map((item) => (
            <Box
              key={item.name}
              width="100%"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f8f8f8'}
              border={'1px solid #ccc'}
              borderRadius={4}
              p={2}
              boxShadow={'0 2px 4px rgba(0, 0, 0, 0.1)'}
              maxWidth="90%"
              mx="auto"
            >
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                <Typography variant={'h6'} color={'#333'} fontWeight={'bold'}>
                  {capitalizeFirstLetter(item.name)}
                </Typography>
                <Typography variant={'body2'} color={'#666'}>
                  Quantity: {item.count}
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => removeItem(item)} 
                sx={{
                  bgcolor: '#FFB6C1',
                  '&:hover': { bgcolor: '#FF69B4' },
                  padding: '4px 8px',
                  fontSize: '0.875rem',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                Remove
              </Button>
            </Box>
          )) : (
            <Typography variant={'h6'} color={'#333'} textAlign={'center'} fontWeight={'bold'}>
              Your Pantry is Empty
            </Typography>
          )}
        </Stack>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" textAlign="center">
            Add Item
          </Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleAddItem}
            sx={{
              bgcolor: '#FF69B4',
              '&:hover': { bgcolor: '#FF1493' },
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem',
              padding: '8px 16px',
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}