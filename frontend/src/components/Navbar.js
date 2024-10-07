import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { motion, AnimatePresence } from 'framer-motion';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '0.2em',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  flexGrow: 1,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 400,
  fontSize: '0.9rem',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const WhiteTextButton = styled(NavButton)(({ theme }) => ({
  color: 'white',
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '8px',
    marginTop: '8px',
    minWidth: 180,
    boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
  },
}));

const AnimatedMenuItem = motion(MenuItem);

function Navbar({ onViewChange, onNewTask, isDemo = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [currentView, setCurrentView] = useState('calendar');

  const isAuthenticated = location.pathname === '/tasks' || location.pathname === '/profile' || isDemo;
  const isProfilePage = location.pathname === '/profile';

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    if (!isDemo) {
      localStorage.removeItem('token');
    }
    navigate('/');
    handleProfileMenuClose();
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
    handleMobileMenuClose();
  };

  const handleNewTask = () => {
    if (onNewTask) {
      onNewTask();
    } else {
      navigate('/tasks/new');
    }
    handleMobileMenuClose();
  };

  const renderAuthButtons = () => (
    <>
      <NavButton component={Link} to="/login">Iniciar Sesión</NavButton>
      <NavButton component={Link} to="/register">Registrarse</NavButton>
    </>
  );

  const renderTaskButtons = () => (
    <>
      {isDemo ? (
        <>
          <NavButton 
            onClick={() => handleViewChange('calendar')} 
            startIcon={<CalendarTodayIcon />}
            color={currentView === 'calendar' ? 'secondary' : 'primary'}
          >
            Calendario
          </NavButton>
          <NavButton 
            onClick={() => handleViewChange('list')} 
            startIcon={<ViewListIcon />}
            color={currentView === 'list' ? 'secondary' : 'primary'}
          >
            Lista
          </NavButton>
          <WhiteTextButton 
            onClick={handleNewTask} 
            startIcon={<AddIcon />} 
          >
            Nueva Tarea
          </WhiteTextButton>
          <NavButton 
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
          >
            Salir de Demo
          </NavButton>
        </>
      ) : (
        <>
          {isProfilePage && (
            <NavButton 
              component={Link} 
              to="/tasks"
              startIcon={<AssignmentIcon />}
            >
              Mis Tareas
            </NavButton>
          )}
          {!isProfilePage && (
            <>
              <NavButton 
                onClick={() => handleViewChange('calendar')} 
                startIcon={<CalendarTodayIcon />}
                color={currentView === 'calendar' ? 'secondary' : 'primary'}
              >
                Calendario
              </NavButton>
              <NavButton 
                onClick={() => handleViewChange('list')} 
                startIcon={<ViewListIcon />}
                color={currentView === 'list' ? 'secondary' : 'primary'}
              >
                Lista
              </NavButton>
              <WhiteTextButton 
                onClick={handleNewTask} 
                startIcon={<AddIcon />} 
              >
                Nueva Tarea
              </WhiteTextButton>
            </>
          )}
          <IconButton
            onClick={handleProfileMenuOpen}
            size="large"
            edge="end"
            aria-label="cuenta del usuario"
            aria-controls="profile-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </>
      )}
    </>
  );

  const menuItems = isDemo
    ? [
        { icon: <CalendarTodayIcon />, text: 'Calendario', onClick: () => handleViewChange('calendar') },
        { icon: <ViewListIcon />, text: 'Lista', onClick: () => handleViewChange('list') },
        { icon: <AddIcon />, text: 'Nueva Tarea', onClick: handleNewTask },
        { icon: <ExitToAppIcon />, text: 'Salir de Demo', onClick: handleLogout },
      ]
    : isAuthenticated
    ? [
        ...(isProfilePage 
          ? [{ icon: <AssignmentIcon />, text: 'Mis Tareas', to: '/tasks' }]
          : [
              { icon: <CalendarTodayIcon />, text: 'Calendario', onClick: () => handleViewChange('calendar') },
              { icon: <ViewListIcon />, text: 'Lista', onClick: () => handleViewChange('list') },
              { icon: <AddIcon />, text: 'Nueva Tarea', onClick: handleNewTask },
            ]
        ),
        { icon: <AccountCircleIcon />, text: 'Perfil', to: '/profile' },
        { icon: <ExitToAppIcon />, text: 'Cerrar Sesión', onClick: handleLogout },
      ]
    : [
        { text: 'Iniciar Sesión', to: '/login' },
        { text: 'Registrarse', to: '/register' },
      ];

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Logo variant="h6" component={Link} to={isAuthenticated ? (isDemo ? "/demo" : "/tasks") : "/"}>
          EFFIDO
        </Logo>
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
              sx={{ color: theme.palette.primary.main }}
            >
              <MenuIcon />
            </IconButton>
            <StyledMenu
              anchorEl={mobileMenuAnchorEl}
              open={Boolean(mobileMenuAnchorEl)}
              onClose={handleMobileMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <AnimatePresence>
                {menuItems.map((item, index) => (
                  <AnimatedMenuItem
                    key={item.text}
                    onClick={item.onClick || handleMobileMenuClose}
                    component={item.to ? Link : undefined}
                    to={item.to}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {item.icon && <Box component="span" mr={1}>{item.icon}</Box>}
                    {item.text}
                  </AnimatedMenuItem>
                ))}
              </AnimatePresence>
            </StyledMenu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated || isDemo ? renderTaskButtons() : renderAuthButtons()}
          </Box>
        )}
      </Toolbar>
      <Menu
        id="profile-menu"
        anchorEl={profileMenuAnchorEl}
        open={Boolean(profileMenuAnchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to="/profile">
          <AccountCircleIcon sx={{ mr: 1 }} /> Ver Perfil
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToAppIcon sx={{ mr: 1 }} /> Cerrar Sesión
        </MenuItem>
      </Menu>
    </StyledAppBar>
  );
}

export default Navbar;