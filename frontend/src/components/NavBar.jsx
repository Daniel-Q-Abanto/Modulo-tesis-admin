import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, CssBaseline, Toolbar, List, Typography,
  ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton,
  Avatar, Menu, MenuItem
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ImageIcon from '@mui/icons-material/Image';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import FaceIcon from '@mui/icons-material/Face';
import BrushIcon from '@mui/icons-material/Brush';
import GavelIcon from '@mui/icons-material/Gavel';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';

import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import profileImage from '../images/daniel.jpg'; // asegúrate que exista

const NavBar = ({ drawerWidth, children }) => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const changeOpenStatus = () => setOpen(!open);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMenuItemClick = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login', { replace: true });
  };

  const myDrawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/home" selected={path === "/home"} >
              <ListItemIcon><HomeIcon fontSize="large" sx={{ color: grey[900] }} /></ListItemIcon>
              <ListItemText primary="Inicio" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/usuarios" selected={path === "/usuarios"} >
              <ListItemIcon><FaceIcon fontSize="large" /></ListItemIcon>
              <ListItemText primary="Usuarios" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/historiales" selected={path === "/historiales"} >
              <ListItemIcon><HistoryEduIcon fontSize="large" /></ListItemIcon>
              <ListItemText primary="Historial IA" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/roles" selected={path === "/roles"} >
              <ListItemIcon><SettingsIcon fontSize="large" /></ListItemIcon>
              <ListItemText primary="Roles y Permisos" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/about" selected={path === "/about"} >
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary="Sobre Selta" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundImage: 'linear-gradient(to right, rgba(47, 49, 72, 0.9), rgba(61, 120, 128, 0.8))'
        }}>
        <Toolbar>
          <IconButton color="inherit" onClick={changeOpenStatus} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            SELTA ADMIN
          </Typography>
          <Box sx={{ flexGrow: 1}} />
          <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
            <Avatar alt="Profile" src={profileImage} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => handleMenuItemClick('/perfil')}>Perfil</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/cuenta')}>Cuenta</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/home')}>Panel</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer permanente */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {myDrawer}
      </Drawer>

      {/* Drawer temporal para pantallas pequeñas */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={changeOpenStatus}
        sx={{
          display: { xs: "block", sm: "none" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {myDrawer}
      </Drawer>,

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default NavBar;
