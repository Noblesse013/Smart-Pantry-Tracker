import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box } from '@mui/material';

export default function Header({ onOpen }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('login'); // 'login' or 'signup'

  const handleClickOpen = (mode) => {
    setDialogMode(mode);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log(`${dialogMode.charAt(0).toUpperCase() + dialogMode.slice(1)} form submitted`);
    handleClose();
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Smart Pantry Tracker
          </Typography>
          <Button color="inherit" onClick={() => handleClickOpen('login')}>Login</Button>
          <Button color="inherit" onClick={() => handleClickOpen('signup')}>Sign Up</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
