import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es'; // Importa la localización española
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile'; // Asegúrate de importar el componente Profile
import { XAxis, YAxis } from 'recharts';

// Configuración de Recharts
XAxis.defaultProps = {
  ...XAxis.defaultProps,
  allowDecimals: false,
};

YAxis.defaultProps = {
  ...YAxis.defaultProps,
  allowDecimals: false,
};

function App() {
  useEffect(() => {
    console.log('Entorno:', process.env.NODE_ENV);
    console.log('API URL:', process.env.REACT_APP_API_URL);
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<><Navbar /><Outlet /></>}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
          <Route path="/demo" element={<Home isDemo={true} />} />
          <Route element={<PrivateRoute />}>
            <Route path="/tasks" element={<Home />} />
          </Route>
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;