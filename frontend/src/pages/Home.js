import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { 
  Container, Typography, Box, Button, Paper, ThemeProvider, 
  createTheme, Snackbar, Menu, MenuItem, Modal, Fade,
  useMediaQuery, useTheme, Fab
} from '@mui/material';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import AddIcon from '@mui/icons-material/Add';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import esES from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { alpha } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TaskList from '../components/TaskList';
import LimitReachedModal from '../components/LimitReachedModal';
import Navbar from '../components/Navbar';
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/api';
import DayTasksPanel from '../components/DayTasksPanel';
import Footer from '../components/Footer';
import { Link as RouterLink } from 'react-router-dom';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const TaskForm = React.lazy(() => import('../components/TaskForm'));
const DnDCalendar = withDragAndDrop(Calendar);

const locales = {
  'es': esES,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul más vivo
    },
    secondary: {
      main: '#ff9800', // Naranja más vivo
    },
    background: {
      default: '#f0f4f8', // Un fondo ligeramente más azulado
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1976d2', // Color más vivo para los títulos
    },
    h6: {
      fontWeight: 500,
      color: '#1976d2', // Color más vivo para los subtítulos
    },
    body1: {
      fontSize: '1rem',
      color: '#333333', // Texto principal más oscuro para mejor contraste
    },
    body2: {
      fontSize: '0.875rem',
      color: '#555555', // Texto secundario más oscuro
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'background-color 0.3s ease',
        },
        containedPrimary: {
          backgroundColor: '#1976d2', // Color sólido para botones primarios
          color: 'white',
          '&:hover': {
            backgroundColor: '#1565c0', // Un tono más oscuro al pasar el mouse
          },
        },
        containedSecondary: {
          backgroundColor: '#ff9800', // Color sólido para botones secundarios
          color: 'white',
          '&:hover': {
            backgroundColor: '#f57c00', // Un tono más oscuro al pasar el mouse
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'box-shadow 0.3s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#1976d2', // Color más vivo para los iconos
        },
      },
    },
  },
});

const calendarStyles = {
  '.rbc-calendar': {
    fontFamily: theme.typography.fontFamily,
    border: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  '.rbc-header': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
    fontWeight: 600,
    padding: '15px',
    borderBottom: '1px solid ' + alpha(theme.palette.primary.main, 0.1),
  },
  '.rbc-month-view, .rbc-time-view, .rbc-agenda-view': {
    border: '1px solid ' + alpha(theme.palette.primary.main, 0.1),
    borderRadius: '20px',
    overflow: 'hidden',
  },
  '.rbc-month-row': {
    borderTop: '1px solid ' + alpha(theme.palette.primary.main, 0.1),
  },
  '.rbc-day-bg': {
    borderLeft: '1px solid ' + alpha(theme.palette.primary.main, 0.1),
  },
  '.rbc-off-range-bg': {
    backgroundColor: alpha(theme.palette.grey[200], 0.3),
  },
  '.rbc-today': {
    backgroundColor: alpha('#1976d2', 0.1), // Fondo más vivo para el día actual
  },
  '.rbc-event': {
    borderRadius: '5px',
    color: 'white',
    border: 'none',
    padding: '2px 5px',
    '&:hover': {
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    },
  },
  '.rbc-toolbar': {
    marginBottom: '20px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '10px',
  },
  '.rbc-toolbar button': {
    color: '#1976d2', // Color más vivo para los botones de la barra de herramientas
    borderColor: '#1976d2',
    borderRadius: '20px',
    padding: '8px 16px',
    '&:hover': {
      backgroundColor: alpha('#1976d2', 0.1),
    },
    '&:active, &.rbc-active': {
      backgroundColor: '#1976d2',
      color: 'white',
    },
  },
  '@media (max-width: 600px)': {
    '.rbc-toolbar': {
      flexDirection: 'column',
      alignItems: 'center',
    },
    '.rbc-toolbar-label': {
      margin: '10px 0',
      fontSize: '1.2rem',
    },
    '.rbc-btn-group': {
      margin: '5px 0',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    '.rbc-btn-group button': {
      margin: '2px',
      padding: '5px 10px',
      fontSize: '0.8rem',
    },
    '.rbc-calendar': {
      fontSize: '0.85rem',
    },
    '.rbc-event': {
      fontSize: '0.75rem',
    },
  },
};

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango.',
  showMore: total => `+ Ver más (${total})`
};

function DemoBanner() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '12px 16px' : '12px 24px',
        backgroundColor: 'rgba(25, 118, 210, 0.05)',
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        borderRadius: '4px',
        mb: 3,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.primary,
          marginBottom: isMobile ? 2 : 0,
        }}
      >
        Estás explorando la versión demo
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          component={RouterLink}
          to="/register"
          variant="outlined"
          color="primary"
          size="small"
          sx={{
            borderRadius: '16px',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            padding: '4px 12px',
            fontSize: '0.75rem',
            '&:hover': {
              boxShadow: 'none',
            },
          }}
        >
          Registrarse
        </Button>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="primary"
          size="small"
          sx={{
            borderRadius: '16px',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            padding: '4px 12px',
            fontSize: '0.75rem',
            '&:hover': {
              boxShadow: 'none',
            },
          }}
        >
          Iniciar Sesión
        </Button>
      </Box>
    </Box>
  );
}

function Home({ isDemo = false }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [view, setView] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [groupBy, setGroupBy] = useState('none');
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDayTasks, setSelectedDayTasks] = useState([]);
  const [isDayTasksPanelOpen, setIsDayTasksPanelOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (isDemo) {
          const demoTasks = JSON.parse(localStorage.getItem('demoTasks')) || [];
          setTasks(demoTasks);
        } else {
          const fetchedTasks = await getAllTasks();
          setTasks(fetchedTasks);
        }
      } catch (err) {
        // console.error('Error al cargar las tareas:', err);
        setSnackbarMessage('Error al cargar las tareas');
        setSnackbarOpen(true);
      }
    };
    fetchTasks();
  }, [isDemo]);

  const handleCreateTask = async (newTask) => {
    try {
      if (isDemo) {
        const currentTasks = JSON.parse(localStorage.getItem('demoTasks')) || [];
        if (currentTasks.length >= 3) {
          setIsModalOpen(true);
          return;
        }
        const createdTask = { ...newTask, _id: Date.now().toString() };
        const updatedTasks = [...currentTasks, createdTask];
        localStorage.setItem('demoTasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
      } else {
        const createdTask = await createTask(newTask);
        setTasks(prevTasks => [...prevTasks, createdTask]);
      }
      setIsFormVisible(false);
      setSnackbarMessage('Tarea creada con éxito');
      setSnackbarOpen(true);
    } catch (error) {
      // console.error('Error al crear la tarea:', error);
      setSnackbarMessage('Error al crear la tarea: ' + error.message);
      setSnackbarOpen(true);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      if (isDemo) {
        const currentTasks = JSON.parse(localStorage.getItem('demoTasks')) || [];
        const updatedTasks = currentTasks.map(task => 
          task._id === updatedTask._id ? { ...task, ...updatedTask } : task
        );
        localStorage.setItem('demoTasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
      } else {
        const updatedTaskFromServer = await updateTask(updatedTask._id, updatedTask);
        setTasks(prevTasks => prevTasks.map(task => 
          task._id === updatedTaskFromServer._id ? updatedTaskFromServer : task
        ));
      }
      setIsFormVisible(false);
      setEditingTask(null);
      setSnackbarMessage('Tarea actualizada con éxito');
      setSnackbarOpen(true);
    } catch (error) {
      // console.error('Error al actualizar la tarea:', error);
      setSnackbarMessage('Error al actualizar la tarea: ' + error.message);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setTaskToDelete(taskId);
    setConfirmDelete(true);
  };

  const confirmDeleteTask = async () => {
    try {
      if (isDemo) {
        const currentTasks = JSON.parse(localStorage.getItem('demoTasks')) || [];
        const updatedTasks = currentTasks.filter(task => task._id !== taskToDelete);
        localStorage.setItem('demoTasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
      } else {
        await deleteTask(taskToDelete);
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskToDelete));
      }
      setSnackbarMessage('Tarea eliminada con éxito');
      setSnackbarOpen(true);
      setTaskDetailsOpen(false);
      setSelectedTask(null);
    } catch (error) {
      // console.error('Error al eliminar la tarea:', error);
      setSnackbarMessage('Error al eliminar la tarea: ' + error.message);
      setSnackbarOpen(true);
    } finally {
      setConfirmDelete(false);
      setTaskToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const eventStyleGetter = useCallback((event) => {
    let backgroundColor = '#1976d2'; // Color por defecto más vivo
    switch (event.resource.priority) {
      case 'alta':
        backgroundColor = '#f44336'; // Rojo más vivo
        break;
      case 'media':
        backgroundColor = '#ff9800'; // Naranja más vivo
        break;
      case 'baja':
        backgroundColor = '#4caf50'; // Verde más vivo
        break;
      default:
        break;
    }
    return { 
      style: { 
        backgroundColor,
        borderRadius: '5px',
        color: 'white',
        border: 'none',
        padding: '2px 5px',
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: isMobile ? '0.7rem' : '0.9rem'
      }
    };
  }, [isMobile]);

  const formats = {
    weekdayFormat: (date, culture, localizer) =>
      isMobile
        ? localizer.format(date, 'EEEEE', culture)
        : localizer.format(date, 'EEEE', culture)
  };

  const CustomEvent = ({ event }) => (
    <span title={event.title}>
      {isMobile ? event.title.slice(0, 3) + '...' : event.title}
    </span>
  );

  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleGroupByChange = (newGroupBy) => {
    setGroupBy(newGroupBy);
    setFilterMenuAnchorEl(null);
  };

  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') return { 'Todas las tareas': tasks };
    return tasks.reduce((acc, task) => {
      const key = task[groupBy];
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
  }, [tasks, groupBy]);

  const CustomToolbar = ({ label, onNavigate, onView, date }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedYear, setSelectedYear] = useState(date.getFullYear());

    const handleYearMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleYearMenuClose = () => {
      setAnchorEl(null);
    };

    const handleYearSelect = (year) => {
      setSelectedYear(year);
      onNavigate('DATE', new Date(year, date.getMonth(), 1));
      handleYearMenuClose();
    };

    const years = Array.from({ length: 10 }, (_, i) => date.getFullYear() - 5 + i);

    return (
      <Box className="rbc-toolbar" sx={{ flexDirection: isMobile ? 'column' : 'row' }}>
        <Box className="rbc-btn-group" sx={{ mb: isMobile ? 1 : 0 }}>
          <Button onClick={() => onNavigate('PREV')}>Anterior</Button>
          <Button onClick={() => onNavigate('TODAY')}>Hoy</Button>
          <Button onClick={() => onNavigate('NEXT')}>Siguiente</Button>
        </Box>
        <Box className="rbc-toolbar-label" sx={{ mb: isMobile ? 1 : 0 }}>
          <Button onClick={handleYearMenuOpen} endIcon={<ArrowDropDownIcon />}>
            {label}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleYearMenuClose}
          >
            {years.map((year) => (
              <MenuItem
                key={year}
                onClick={() => handleYearSelect(year)}
                selected={year === selectedYear}
              >
                {year}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Box className="rbc-btn-group" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['month', 'week', 'day', 'agenda'].map(viewName => (
            <Button
              key={viewName}
              onClick={() => onView(viewName)}
              sx={{ m: '2px', padding: isMobile ? '5px 10px' : '8px 16px', fontSize: isMobile ? '0.8rem' : '1rem' }}
            >
              {messages[viewName]}
            </Button>
          ))}
        </Box>
      </Box>
    );
  };

  const handleEventDrop = useCallback(
    ({ event, start, end }) => {
      const updatedTask = {
        ...event.resource,
        dueDate: start
      };
      handleUpdateTask(updatedTask);
    },
    [handleUpdateTask]
  );

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsFormVisible(true);
  };

  const handleSelectEvent = useCallback((event) => {
    const task = event.resource;
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  }, []);

  const handleCloseTaskDetails = useCallback(() => {
    setTaskDetailsOpen(false);
    setSelectedTask(null);
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setIsFormVisible(true);
    setTaskDetailsOpen(false);
  }, []);

  const handleSelectSlot = useCallback(({ start }) => {
    const endOfDay = new Date(start);
    endOfDay.setHours(23, 59, 59, 999);
    
    setEditingTask({
      title: '',
      description: '',
      dueDate: endOfDay,
      priority: 'baja',
      status: 'pendiente'
    });
    setIsFormVisible(true);
  }, []);

  const calendarEvents = useMemo(() => {
    return tasks.map(task => ({
      id: task._id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      resource: task
    }));
  }, [tasks]);

  const handleShowMoreClick = useCallback((events, date) => {
    setSelectedDayTasks(events.map(event => event.resource));
    setIsDayTasksPanelOpen(true);
  }, []);

  const handleCloseDayTasksPanel = () => {
    setIsDayTasksPanelOpen(false);
    setSelectedDayTasks([]);
  };


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <Navbar onViewChange={setView} onNewTask={handleNewTask} isDemo={isDemo} />
        {isDemo && <Container maxWidth="lg" sx={{ mt: 2 }}><DemoBanner /></Container>}
        <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Paper elevation={0} sx={{ p: 3, minHeight: 'calc(100vh - 200px)', ...calendarStyles }}>
            {view === 'calendar' ? (
              <DnDCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', minHeight: '500px' }}
                eventPropGetter={eventStyleGetter}
                messages={messages}
                culture='es'
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                views={{month: true, week: true, day: true, agenda: true}}
                defaultView={Views.MONTH}
                date={currentDate}
                onNavigate={handleNavigate}
                components={{
                  toolbar: (toolbarProps) => <CustomToolbar {...toolbarProps} date={currentDate} />,
                  event: CustomEvent
                }}
                onShowMore={handleShowMoreClick}
                onEventDrop={handleEventDrop}
                resizable={false}
                formats={formats}
              />
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Lista de Tareas</Typography>
                  <Button
                    startIcon={<FilterListIcon />}
                    onClick={(e) => setFilterMenuAnchorEl(e.currentTarget)}
                  >
                    Agrupar por
                  </Button>
                  <Menu
                    anchorEl={filterMenuAnchorEl}
                    open={Boolean(filterMenuAnchorEl)}
                    onClose={() => setFilterMenuAnchorEl(null)}
                  >
                    <MenuItem onClick={() => handleGroupByChange('none')}>Sin agrupar</MenuItem>
                    <MenuItem onClick={() => handleGroupByChange('status')}>Estado</MenuItem>
                    <MenuItem onClick={() => handleGroupByChange('priority')}>Prioridad</MenuItem>
                  </Menu>
                </Box>
                {Object.entries(groupedTasks).map(([group, tasks]) => (
                  <Box key={group} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {group}
                    </Typography>
                    <TaskList
                      tasks={tasks}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                      isDemo={isDemo}
                      onAddTask={handleNewTask}
                    />
                  </Box>
                ))}
              </>
            )}
          </Paper>
        </Container>
        <Footer />
        {isMobile && (
          <Fab 
            color="primary" 
            aria-label="add"
            onClick={handleNewTask}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>
      <LimitReachedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Modal
        open={taskDetailsOpen}
        onClose={handleCloseTaskDetails}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={taskDetailsOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            {selectedTask && (
              <>
                <Typography variant="h6">{selectedTask.title}</Typography>
                <Typography variant="body1">Descripción: {selectedTask.description}</Typography>
                <Typography variant="body1">Fecha: {format(new Date(selectedTask.dueDate), 'dd/MM/yyyy')}</Typography>
                <Typography variant="body1">Prioridad: {selectedTask.priority}</Typography>
                <Typography variant="body1">Estado: {selectedTask.status}</Typography>
                <Box mt={2}>
                  <Button onClick={() => handleEditTask(selectedTask)} variant="contained" color="primary" sx={{ mr: 1 }}>
                    Editar
                  </Button>
                  <Button onClick={() => handleDeleteTask(selectedTask._id)} variant="outlined" color="secondary">
                    Eliminar
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      {isFormVisible && (
        <Modal
          open={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isFormVisible}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '90%' : 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                {editingTask && editingTask._id ? 'Editar Tarea' : 'Crear Nueva Tarea'}
              </Typography>
              <Suspense fallback={<div>Cargando...</div>}>
                <TaskForm
                  onSubmit={editingTask && editingTask._id ? handleUpdateTask : handleCreateTask}
                  initialTask={editingTask}
                  onCancel={() => {
                    setEditingTask(null);
                    setIsFormVisible(false);
                  }}
                />
              </Suspense>
            </Box>
          </Fade>
        </Modal>
      )}
      {isDayTasksPanelOpen && (
        <DayTasksPanel
          open={isDayTasksPanelOpen}
          onClose={handleCloseDayTasksPanel}
        >
          <TaskList
            tasks={selectedDayTasks}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            isDemo={isDemo}
          />
        </DayTasksPanel>
      )}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        aria-labelledby="confirm-delete-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="confirm-delete-modal" variant="h6" component="h2">
            ¿Estás seguro de eliminar esta tarea?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setConfirmDelete(false)} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button onClick={confirmDeleteTask} variant="contained" color="error">
              Eliminar
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default Home;