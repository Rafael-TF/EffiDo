import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, ThemeProvider, createTheme, useMediaQuery, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a1a1a',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
      letterSpacing: '0.1em',
    },
  },
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
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

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '0.2em',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  flexGrow: 1,
}));

const MenuIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledDrawer = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  width: '250px',
  height: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
  zIndex: theme.zIndex.appBar + 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(5, 2),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const AnimatedLink = styled(motion.div)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));

function AuthNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Iniciar Sesión', path: '/login' },
    { text: 'Registrarse', path: '/register' },
  ];

  const drawerVariants = {
    closed: {
      x: '100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    })
  };

  const drawer = (
    <StyledDrawer
      initial="closed"
      animate="open"
      exit="closed"
      variants={drawerVariants}
    >
      <CloseButton onClick={handleDrawerToggle}>
        <CloseIcon />
      </CloseButton>
      {menuItems.map((item, i) => (
        <AnimatedLink
          key={item.text}
          custom={i}
          variants={linkVariants}
        >
          <Typography
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            style={{ 
              textDecoration: 'none', 
              color: theme.palette.primary.main,
              display: 'block',
              padding: '1rem',
              fontSize: '1.2rem',
              textAlign: 'center',
            }}
          >
            {item.text}
          </Typography>
        </AnimatedLink>
      ))}
    </StyledDrawer>
  );

  return (
    <ThemeProvider theme={theme}>
      <StyledAppBar position="static">
        <Toolbar>
          <Logo variant="h6" component={Link} to="/">
            EFFIDO
          </Logo>
          {isMobile ? (
            <MenuIconButton
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </MenuIconButton>
          ) : (
            <Box>
              {menuItems.map((item) => (
                <NavButton key={item.text} component={Link} to={item.path}>
                  {item.text}
                </NavButton>
              ))}
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>
      <AnimatePresence>
        {mobileOpen && drawer}
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default AuthNavbar;
