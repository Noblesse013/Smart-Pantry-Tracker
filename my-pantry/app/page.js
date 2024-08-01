"use client";

import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '@/firebase'; // Make sure the alias is set up correctly in jsconfig.json
import { collection, doc, getDocs, query, setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: '#f8c6c6;',
  border: '2px solid  #f8c6c6;', // Bold border
  borderRadius: '3px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const containerStyle = {
  width: '90%',
  maxWidth: '900px',
  minHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  
  alignItems: 'center',
  gap: 5,
  mx: 'auto',
  p: 2,
};

const headerStyle = {
  width: '100%',
  maxWidth: '800px',
  bgcolor: '#f5f5f5',
  border: '2px solid  #f8c6c6;', // Bold border
  borderRadius: '8px',
  p: 2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const itemStyle = {
  width: 'calc(100% - 100px)', // Responsive width minus button width
  height: '50px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  bgcolor: '#f8c6c6',
  borderRadius: '8px',
  border: '2px solid #000', // Bold border
  p: 2,
};

export default function Home() {
  const [pantryList, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [editItem, setEditItem] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setItemName('');
    setEditItem('');
    setNewQuantity(0);
    setOpen(false);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const updatePantry = async () => {
    try {
      const q = query(collection(firestore, 'pantry'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        quantity: doc.data().quantity || 0
      }));
      setPantry(items);
    } catch (error) {
      console.error("Error fetching pantry items: ", error);
    }
  };

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Item exists, update quantity
        await updateDoc(docRef, {
          quantity: (docSnap.data().quantity || 0) + 1
        });
      } else {
        // Item does not exist, create with quantity 1
        await setDoc(docRef, { quantity: 1 });
      }

      updatePantry();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentQuantity = docSnap.data().quantity || 0;

        if (currentQuantity > 1) {
          // Reduce quantity
          await updateDoc(docRef, { quantity: currentQuantity - 1 });
        } else {
          // Delete item if quantity is 0
          await deleteDoc(docRef);
        }

        updatePantry();
      }
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  const changeQuantity = async (item, newQuantity) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      await updateDoc(docRef, { quantity: newQuantity });
      updatePantry();
    } catch (error) {
      console.error("Error changing quantity: ", error);
    }
  };

  const filteredPantryList = pantryList.filter(item =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={containerStyle}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editItem ? 'Change Quantity' : 'Add Items'}
          </Typography>
          {editItem ? (
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                id="quantity-input"
                label="New Quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    changeQuantity(editItem, newQuantity);
                    handleClose();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  changeQuantity(editItem, newQuantity);
                  handleClose();
                }}
              >
                Confirm
              </Button>
            </Stack>
          ) : (
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addItem(itemName);
                    handleClose();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  addItem(itemName);
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>

      <Stack width="100%" maxWidth="800px" direction="row" spacing={2} mb={2}>
        <TextField
          id="search-input"
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
         <Button variant="contained" onClick={handleOpen} bgcolor="#f8c4e9">
        Add Items
      </Button>
      </Stack>
      <Box sx={headerStyle}>
        <Typography variant="h4" color="#333" textAlign="center">
          Pantry Items
        </Typography>
      </Box>

      <Stack
        width="100%"
        maxWidth="800px"
        spacing={2}
        sx={{
          maxHeight: '500px', // Limit height for scroll
          overflowY: 'auto', // Enable vertical scroll
          borderLeft: '16px dotted #ffffff', 
          p: 2, // Padding for better appearance
        }}
      >
        {filteredPantryList.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box sx={itemStyle}>
              <Typography variant="h5" color="common.white">
                {item.id.charAt(0).toUpperCase() + item.id.slice(1)} ({item.quantity})
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => {
                setEditItem(item.id);
                setNewQuantity(item.quantity);
                handleOpen();
  
              }}>
                Update
              </Button>
              <Button variant="contained" color= "error" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}