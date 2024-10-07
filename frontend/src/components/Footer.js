import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';

function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h6"
          align="center"
          sx={{
            fontFamily: '"Merriweather", serif',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
          }}
        >
          Hecatech Solutions
        </Typography>
        <Typography 
          variant="caption" 
          display="block" 
          align="center"
          sx={{ mt: 1, color: theme.palette.text.secondary }}
        >
          Guiando la innovación desde {currentYear}
        </Typography>
        <Typography 
          variant="caption" 
          display="block" 
          align="center"
          sx={{ mt: 1, color: theme.palette.text.secondary, fontStyle: 'italic' }}
        >
          Desarrollado por Rafael Travado
        </Typography>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            '& > div': {
              width: 6,
              height: 6,
              borderRadius: '50%',
              mx: 0.5,
              backgroundColor: theme.palette.primary.main,
              opacity: 0.7,
              animation: 'pulse 4s infinite',
              '&:nth-of-type(2)': {
                animationDelay: '1s',
                backgroundColor: theme.palette.secondary.main,
              },
              '&:nth-of-type(3)': {
                animationDelay: '2s',
                backgroundColor: theme.palette.primary.light,
              },
            },
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'scale(1)',
                opacity: 0.7,
              },
              '50%': {
                transform: 'scale(1.2)',
                opacity: 1,
              },
            },
          }}
        >
          <div /><div /><div />
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
