import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Fade,
  IconButton,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Switch,
  FormControlLabel,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
  uploadAvatar,
  getUserStats,
  getUserAchievements,
} from "../services/api";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { useNavigate } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductivityChart from "../components/ProductivityChart";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 40px -12px rgba(0,0,0,0.2)",
  transition: "box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    transform: "translateY(-4px)",
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 40,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
      transition: "border-color 0.3s ease-in-out",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "none",
  transition: "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
    transform: "translateY(-2px)",
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const AchievementBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontSize: 10,
    height: 20,
    minWidth: 20,
    padding: "0 4px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Profile() {
  const [user, setUser] = useState({ username: "", email: "", avatarUrl: "" });
  const [userStats, setUserStats] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [achievements, setAchievements] = useState([]);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile();
        // console.log("Datos de usuario recibidos:", JSON.stringify(userData, null, 2));
        setUser(userData);

        // Usar weeklyProductivity del perfil del usuario
        setUserStats({
          ...userData,
          weeklyProductivity: userData.weeklyProductivity || []
        });

        const achievementsData = await getUserAchievements();
        // console.log("Datos de logros recibidos:", JSON.stringify(achievementsData, null, 2));
        setAchievements(achievementsData);

        setLoading(false);
      } catch (error) {
        // console.error("Error al cargar los datos del usuario:", error);
        setSnackbar({
          open: true,
          message: "Error al cargar los datos del usuario",
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderStatisticsTabPanel = () => (
    <TabPanel value={tabValue} index={1}>
      <SectionTitle variant="h6">Estadísticas de Productividad</SectionTitle>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      ) : userStats ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard>
                <TrendingUpIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">
                  {userStats.productivityScore || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Puntuación de Productividad
                </Typography>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard>
                <AssignmentIcon
                  color="secondary"
                  sx={{ fontSize: 40, mb: 1 }}
                />
                <Typography variant="h4">
                  {userStats.taskCompletionRate
                    ? `${userStats.taskCompletionRate.toFixed(2)}%`
                    : "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tasa de Finalización de Tareas
                </Typography>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard>
                <EmojiEventsIcon
                  sx={{
                    fontSize: 40,
                    mb: 1,
                    color: theme.palette.warning.main,
                  }}
                />
                <Typography variant="h4">
                  {userStats.streakDays || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Días Consecutivos Activo
                </Typography>
              </StatCard>
            </Grid>
          </Grid>
          <Box mt={4}>
            <ProductivityChart
              weeklyProductivity={userStats.weeklyProductivity}
            />
          </Box>
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Total de tareas: {userStats.totalTasks}, Completadas:{" "}
              {userStats.completedTasks}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Datos del gráfico: {JSON.stringify(userStats.weeklyProductivity)}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography color="error">
          No se han cargado las estadísticas del usuario.
        </Typography>
      )}
    </TabPanel>
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      await updateUserProfile(user);
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Perfil actualizado con éxito",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al actualizar el perfil",
        severity: "error",
      });
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setSnackbar({
        open: true,
        message: "Las nuevas contraseñas no coinciden",
        severity: "error",
      });
      return;
    }
    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSnackbar({
        open: true,
        message: "Contraseña cambiada con éxito",
        severity: "success",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      // console.error("Error al cambiar la contraseña:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Error al cambiar la contraseña",
        severity: "error",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate("/login");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar la cuenta",
        severity: "error",
      });
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // console.log("Iniciando carga de avatar");
        const avatarUrl = await uploadAvatar(file);
        // console.log("Avatar subido exitosamente:", avatarUrl);
        setUser({ ...user, avatarUrl });
        setSnackbar({
          open: true,
          message: "Avatar actualizado con éxito",
          severity: "success",
        });
      } catch (error) {
        // console.error("Error detallado al subir el avatar:", error);
        setSnackbar({
          open: true,
          message:
            "Error al actualizar el avatar: " +
            (error.response?.data?.message || error.message),
          severity: "error",
        });
      }
    }
  };

  // const handleNotificationChange = (event) => {
  //   const { name, checked } = event.target;
  //   setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  //   setSnackbar({
  //     open: true,
  //     message: "Configuración de notificaciones actualizada",
  //     severity: "success",
  //   });
  // };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{ mt: 8, mb: 4, flexGrow: 1 }}
      >
        <Fade in={true} timeout={800}>
          <StyledCard>
            <CardContent sx={{ p: { xs: 2, md: 6 } }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Box position="relative">
                      <ProfileAvatar
                        src={user.avatarUrl || "/default-avatar.png"}
                        alt={user.username}
                      />
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="avatar-upload"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                      <label htmlFor="avatar-upload">
                        <IconButton
                          component="span"
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            backgroundColor: theme.palette.background.paper,
                            "&:hover": {
                              backgroundColor: theme.palette.background.default,
                            },
                          }}
                        >
                          <CameraAltIcon />
                        </IconButton>
                      </label>
                    </Box>
                    <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                      {user.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {user.email}
                    </Typography>
                    {userStats && (
                      <Chip
                        icon={<AssignmentIcon />}
                        label={`${userStats.completedTasks} / ${userStats.totalTasks} tareas completadas`}
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                      Logros
                    </Typography>
                    {achievements.length > 0 &&
                      achievements.map((achievement) => (
                        <AchievementBadge
                          key={achievement.id}
                          badgeContent={achievement.icon}
                        >
                          <Chip label={achievement.name} sx={{ m: 0.5 }} />
                        </AchievementBadge>
                      ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="profile tabs"
                    variant={isMobile ? "scrollable" : "standard"}
                    scrollButtons={isMobile ? true : false}
                  >
                    <Tab label="Información" />
                    <Tab label="Estadísticas" />
                    <Tab label="Configuración" />
                  </Tabs>
                  <TabPanel value={tabValue} index={0}>
                    <SectionTitle variant="h6">
                      Información Personal
                    </SectionTitle>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PersonIcon color="action" sx={{ mr: 1 }} />
                      {editMode ? (
                        <StyledTextField
                          fullWidth
                          value={user.username}
                          onChange={(e) =>
                            setUser({ ...user, username: e.target.value })
                          }
                        />
                      ) : (
                        <Typography>{user.username}</Typography>
                      )}
                      {!editMode && (
                        <IconButton
                          onClick={handleEditClick}
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </Box>
                    <Box display="flex" alignItems="center">
                      <EmailIcon color="action" sx={{ mr: 1 }} />
                      <Typography>{user.email}</Typography>
                    </Box>
                    {editMode && (
                      <Box mt={2}>
                        <ActionButton
                          onClick={handleSaveClick}
                          startIcon={<SaveIcon />}
                        >
                          Guardar
                        </ActionButton>
                        <ActionButton
                          onClick={handleCancelClick}
                          startIcon={<CloseIcon />}
                          sx={{ ml: 1 }}
                        >
                          Cancelar
                        </ActionButton>
                      </Box>
                    )}
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <SectionTitle variant="h6">Estadísticas de Productividad</SectionTitle>
                    {loading ? (
                      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                      </Box>
                    ) : userStats ? (
                      <>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={4}>
                            <StatCard>
                              <TrendingUpIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                              <Typography variant="h4">{userStats.productivityScore || "N/A"}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Puntuación de Productividad
                              </Typography>
                            </StatCard>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <StatCard>
                              <AssignmentIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                              <Typography variant="h4">
                                {userStats.taskCompletionRate
                                  ? `${userStats.taskCompletionRate.toFixed(2)}%`
                                  : "N/A"}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Tasa de Finalización de Tareas
                              </Typography>
                            </StatCard>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <StatCard>
                              <EmojiEventsIcon
                                sx={{
                                  fontSize: 40,
                                  mb: 1,
                                  color: theme.palette.warning.main,
                                }}
                              />
                              <Typography variant="h4">{userStats.streakDays || "N/A"}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Días Consecutivos Activo
                              </Typography>
                            </StatCard>
                          </Grid>
                        </Grid>
                        <Box mt={4}>
                          {/* {console.log('weeklyProductivity antes de renderizar:', userStats?.weeklyProductivity)} */}
                          <ProductivityChart weeklyProductivity={userStats?.weeklyProductivity || []} />
                        </Box>
                      </>
                    ) : (
                      <Typography color="error">No se han cargado las estadísticas del usuario.</Typography>
                    )}
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    <SectionTitle variant="h6" sx={{ mt: 4 }}>
                      Cambiar Contraseña
                    </SectionTitle>
                    <form onSubmit={handlePasswordChange}>
                      <StyledTextField
                        fullWidth
                        label="Contraseña actual"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        InputProps={{
                          startAdornment: (
                            <LockIcon color="action" sx={{ mr: 1 }} />
                          ),
                        }}
                      />
                      <StyledTextField
                        fullWidth
                        label="Nueva contraseña"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        InputProps={{
                          startAdornment: (
                            <LockIcon color="action" sx={{ mr: 1 }} />
                          ),
                        }}
                      />
                      <StyledTextField
                        fullWidth
                        label="Confirmar nueva contraseña"
                        type="password"
                        value={passwordData.confirmNewPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmNewPassword: e.target.value,
                          })
                        }
                        InputProps={{
                          startAdornment: (
                            <LockIcon color="action" sx={{ mr: 1 }} />
                          ),
                        }}
                      />
                      <ActionButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                      >
                        Cambiar Contraseña
                      </ActionButton>
                    </form>
                    <Box mt={4}>
                      <Typography variant="body2" color="error" gutterBottom>
                        Zona de Peligro
                      </Typography>
                      <ActionButton
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => setOpenDeleteModal(true)}
                      >
                        Eliminar Cuenta
                      </ActionButton>
                    </Box>
                  </TabPanel>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Fade>
      </Container>
      <Footer />
      <DeleteAccountModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        onConfirmDelete={handleDeleteAccount}
        isMobile={isMobile}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;
