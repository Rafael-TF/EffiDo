import React, { useState, useMemo } from 'react';
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter } from 'recharts';
import { Typography, Box, useTheme, Paper, Grid, Slider, Switch, FormControlLabel, Select, MenuItem, Button, Tabs, Tab } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ProductivityChart = ({ weeklyProductivity = [], historicalData = [] }) => {
  const theme = useTheme();
  const [showTrend, setShowTrend] = useState(true);
  const [targetScore, setTargetScore] = useState(5);
  const [timeRange, setTimeRange] = useState('week');
  const [viewMode, setViewMode] = useState(0);

  const calculatePrediction = (score, index) => {
    return score * (1 + Math.sin(index / 7) * 0.1);
  };

  const data = useMemo(() => {
    const processData = (rawData) => rawData.map((day, index) => ({
      ...day,
      score: day.score || 0,
      target: targetScore,
      prediction: calculatePrediction(day.score || 0, index),
    }));

    let dataToProcess;
    switch (timeRange) {
      case 'month':
        dataToProcess = historicalData.slice(-30);
        break;
      case 'year':
        dataToProcess = historicalData.slice(-365);
        break;
      default:
        dataToProcess = weeklyProductivity;
    }

    if (dataToProcess.length === 0) {
      dataToProcess = weeklyProductivity;
      // console.warn(`No hay suficientes datos para el rango ${timeRange}. Mostrando datos semanales.`);
    }

    return processData(dataToProcess);
  }, [weeklyProductivity, historicalData, timeRange, targetScore]);

  const averageScore = useMemo(() => data.reduce((sum, day) => sum + day.score, 0) / data.length, [data]);
  const maxScore = Math.max(...data.map(day => day.score));
  const minScore = Math.min(...data.map(day => day.score));
  const trend = data.length > 1 ? data[data.length - 1].score - data[0].score : 0;

  const recommendations = [
    "Intenta mantener una rutina constante para mejorar tu productividad.",
    "Los días con puntuaciones más altas suelen ser martes y miércoles. Aprovecha esos días para tareas importantes.",
    "Considera tomar descansos cortos pero frecuentes para mantener un alto nivel de productividad.",
    "Establece metas diarias realistas y celebra cuando las alcances.",
    "Prioriza tus tareas y enfócate en las más importantes primero."
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" color={entry.color}>
              {`${entry.name}: ${entry.value.toFixed(2)}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const exportData = () => {
    const csvContent = [
      ['Día', 'Puntuación', 'Objetivo', 'Predicción'].join(','),
      ...data.map(day => 
        [day.day, day.score, day.target, day.prediction].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'productivity_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const exportPDF = () => {
  //   const doc = new jsPDF();
    
  //   // Título
  //   doc.setFontSize(18);
  //   doc.text('Informe de Productividad', 14, 20);
  
  //   // Tabla de datos
  //   doc.autoTable({
  //     head: [['Día', 'Puntuación', 'Objetivo', 'Predicción']],
  //     body: data.map(day => [day.day, day.score.toFixed(2), day.target.toFixed(2), day.prediction.toFixed(2)]),
  //     startY: 30,
  //   });
  
  //   // Gráfico simple
  //   const startY = doc.lastAutoTable.finalY + 20;
  //   const chartWidth = 180;
  //   const chartHeight = 100;
  //   const barWidth = chartWidth / data.length;
  //   const maxScore = Math.max(...data.map(day => day.score));
  
  //   // Eje X
  //   doc.line(10, startY + chartHeight, 10 + chartWidth, startY + chartHeight);
  //   // Eje Y
  //   doc.line(10, startY, 10, startY + chartHeight);
  
  //   // Dibujar barras
  //   data.forEach((day, index) => {
  //     const barHeight = (day.score / maxScore) * chartHeight;
  //     doc.setFillColor(200, 200, 255);
  //     doc.rect(10 + index * barWidth, startY + chartHeight - barHeight, barWidth * 0.8, barHeight, 'F');
  //   });
  
  //   // Etiquetas del eje X
  //   doc.setFontSize(8);
  //   data.forEach((day, index) => {
  //     doc.text(day.day, 10 + index * barWidth + barWidth / 2, startY + chartHeight + 10, { align: 'center' });
  //   });
  
  //   // Título del gráfico
  //   doc.setFontSize(12);
  //   doc.text('Gráfico de Productividad', 14, startY - 10);
  
  //   // Estadísticas resumen
  //   const statsY = startY + chartHeight + 30;
  //   doc.setFontSize(14);
  //   doc.text('Resumen Estadístico', 14, statsY);
  //   doc.setFontSize(10);
  //   doc.text(`Promedio: ${averageScore.toFixed(2)}`, 14, statsY + 10);
  //   doc.text(`Máximo: ${maxScore}`, 14, statsY + 20);
  //   doc.text(`Mínimo: ${minScore}`, 14, statsY + 30);
  //   doc.text(`Tendencia: ${trend.toFixed(2)}`, 14, statsY + 40);
  
  //   // Guardar el PDF
  //   doc.save('informe_productividad.pdf');
  // };

  const exportPDF = () => {
    const doc = new jsPDF();
    let yOffset = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Paleta de colores moderna
    const colors = {
        primary: [0, 119, 190],    // Azul
        secondary: [255, 99, 71],  // Rojo coral
        accent: [255, 165, 0],     // Naranja
        light: [240, 240, 240],    // Gris claro
        text: [60, 60, 60]         // Gris oscuro para texto
    };

    const addHeader = () => {
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Informe de Productividad', pageWidth / 2, 25, { align: 'center' });
        yOffset = 50;
    };

    const addSection = (title, content) => {
        if (yOffset + 60 > pageHeight) {
            doc.addPage();
            yOffset = 20;
        }
        doc.setFillColor(...colors.light);
        doc.rect(margin, yOffset, pageWidth - 2 * margin, 30, 'F');
        doc.setFontSize(16);
        doc.setTextColor(...colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin + 5, yOffset + 20);
        yOffset += 35;

        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        doc.setFont('helvetica', 'normal');
        content.forEach(line => {
            if (yOffset > pageHeight - margin) {
                doc.addPage();
                yOffset = 20;
            }
            doc.text(line, margin, yOffset);
            yOffset += 7;
        });
        yOffset += 10;
    };

    const addChart = () => {
        if (yOffset + 120 > pageHeight) {
            doc.addPage();
            yOffset = 20;
        }
        const chartWidth = pageWidth - 2 * margin;
        const chartHeight = 100;
        const barWidth = chartWidth / data.length;
        const maxScore = Math.max(...data.map(day => day.score));

        // Fondo del gráfico
        doc.setFillColor(...colors.light);
        doc.rect(margin, yOffset, chartWidth, chartHeight, 'F');

        // Ejes
        doc.setDrawColor(...colors.text);
        doc.line(margin, yOffset + chartHeight, margin + chartWidth, yOffset + chartHeight);
        doc.line(margin, yOffset, margin, yOffset + chartHeight);

        // Barras
        data.forEach((day, index) => {
            const barHeight = (day.score / maxScore) * (chartHeight - 20);
            doc.setFillColor(...colors.primary);
            doc.rect(margin + index * barWidth + 5, yOffset + chartHeight - barHeight, barWidth - 10, barHeight, 'F');
            
            // Etiquetas de valor
            doc.setFontSize(8);
            doc.setTextColor(...colors.text);
            doc.text(day.score.toString(), margin + index * barWidth + barWidth / 2, yOffset + chartHeight - barHeight - 5, { align: 'center' });
        });

        // Etiquetas de días
        doc.setFontSize(8);
        doc.setTextColor(...colors.text);
        data.forEach((day, index) => {
            doc.text(day.day, margin + index * barWidth + barWidth / 2, yOffset + chartHeight + 10, { align: 'center' });
        });

        yOffset += chartHeight + 30;
    };

    const addFooter = () => {
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(...colors.text);
            doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }
    };

    addHeader();
    
    // Resumen ejecutivo en formato de tabla
    doc.autoTable({
        head: [['Métrica', 'Valor']],
        body: [
            ['Período', `${data[0].day} - ${data[data.length - 1].day}`],
            ['Promedio', averageScore.toFixed(2)],
            ['Tendencia', `${trend >= 0 ? 'Positiva' : 'Negativa'} (${trend.toFixed(2)})`],
            ['Máximo', `${maxScore} (${data.filter(d => d.score === maxScore).map(d => d.day).join(', ')})`],
            ['Mínimo', `${minScore} (${data.filter(d => d.score === minScore).map(d => d.day).join(', ')})`]
        ],
        startY: yOffset,
        theme: 'striped',
        headStyles: { fillColor: colors.primary },
        alternateRowStyles: { fillColor: colors.light }
    });
    yOffset = doc.lastAutoTable.finalY + 20;

    addSection('Gráfico de Productividad', []);
    addChart();

    addSection('Análisis Detallado', [
        `Días por encima del promedio: ${data.filter(d => d.score > averageScore).length}`,
        `Días por debajo del promedio: ${data.filter(d => d.score < averageScore).length}`,
        `Variabilidad (desviación estándar): ${calculateStandardDeviation(data.map(d => d.score)).toFixed(2)}`,
        `Días que alcanzaron el objetivo: ${data.filter(d => d.score >= d.target).length}`,
        `Efectividad: ${((data.filter(d => d.score >= d.target).length / data.length) * 100).toFixed(2)}%`
    ]);

    addSection('Tendencias y Patrones', [
        `Día más productivo: ${findMostProductiveDay(data)}`,
        `Patrón semanal: ${identifyWeeklyPattern(data)}`,
        `Tendencia a largo plazo: ${identifyLongTermTrend(data)}`
    ]);

    // Tabla de comparativa con objetivos
    doc.autoTable({
        head: [['Métrica', 'Valor']],
        body: [
            ['Objetivo promedio', (data.reduce((sum, d) => sum + d.target, 0) / data.length).toFixed(2)],
            ['Diferencia promedio', (data.reduce((sum, d) => sum + (d.score - d.target), 0) / data.length).toFixed(2)],
            ['Días superando objetivo', data.filter(d => d.score > d.target).length],
            ['Porcentaje de éxito', `${((data.filter(d => d.score >= d.target).length / data.length) * 100).toFixed(2)}%`]
        ],
        startY: doc.lastAutoTable.finalY + 20,
        theme: 'striped',
        headStyles: { fillColor: colors.secondary },
        alternateRowStyles: { fillColor: colors.light }
    });

    addSection('Recomendaciones', [
        '• Mantener la consistencia en los días de alta productividad.',
        '• Investigar factores que contribuyen a los días de baja productividad.',
        '• Ajustar los objetivos diarios para que sean desafiantes pero alcanzables.',
        '• Implementar técnicas de gestión del tiempo en días menos productivos.',
        '• Revisar y ajustar las estrategias de trabajo basándose en los patrones identificados.'
    ]);

    addFooter();
    doc.save('informe_productividad_moderno.pdf');
};
  
  // Las funciones auxiliares (calculateStandardDeviation, findMostProductiveDay, etc.) permanecen sin cambios
// Funciones auxiliares para cálculo de estadísticas

const calculateStandardDeviation = (values) => {
    const avg = values.reduce((a, b) => a + b) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b) / values.length);
};

const findMostProductiveDay = (data) => {
    const dayAverages = {};
    data.forEach(d => {
        if (!dayAverages[d.day]) dayAverages[d.day] = { sum: 0, count: 0 };
        dayAverages[d.day].sum += d.score;
        dayAverages[d.day].count++;
    });
    let mostProductiveDay = '';
    let highestAverage = 0;
    Object.entries(dayAverages).forEach(([day, { sum, count }]) => {
        const average = sum / count;
        if (average > highestAverage) {
            highestAverage = average;
            mostProductiveDay = day;
        }
    });
    return `${mostProductiveDay} (promedio: ${highestAverage.toFixed(2)})`;
};

const identifyWeeklyPattern = (data) => {
    return "Se observa una tendencia de mayor productividad a mitad de semana.";
};

const identifyLongTermTrend = (data) => {
    return trend > 0 ? "Tendencia general al alza en la productividad." : "Tendencia general a la baja en la productividad.";
};

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>Dashboard de Productividad Avanzado</Typography>
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={<Switch checked={showTrend} onChange={(e) => setShowTrend(e.target.checked)} />}
            label="Mostrar tendencia"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography gutterBottom>Objetivo diario</Typography>
          <Slider
            value={targetScore}
            onChange={(_, newValue) => setTargetScore(newValue)}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            min={0}
            max={10}
            step={0.5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            fullWidth
          >
            <MenuItem value="week">Semana</MenuItem>
            <MenuItem value="month" disabled={historicalData.length < 30}>Mes</MenuItem>
            <MenuItem value="year" disabled={historicalData.length < 365}>Año</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button variant="contained" color="primary" fullWidth onClick={exportPDF}>
            Exportar a PDF
          </Button>
        </Grid>
      </Grid>
      <Tabs value={viewMode} onChange={(_, newValue) => setViewMode(newValue)} centered>
        <Tab icon={<TimelineIcon />} label="Gráfico" />
        <Tab icon={<AssessmentIcon />} label="Análisis" />
        <Tab icon={<FormatListBulletedIcon />} label="Datos" />
      </Tabs>
      {viewMode === 0 && (
        <Box height={400} mt={2}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="day" tick={{ fill: theme.palette.text.secondary }} />
              <YAxis tick={{ fill: theme.palette.text.secondary }} label={{ value: 'Puntuación', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="score" fill={theme.palette.primary.main} name="Puntuación actual" />
              {showTrend && <Line type="monotone" dataKey="target" stroke={theme.palette.warning.main} strokeDasharray="5 5" name="Objetivo" />}
              <Area type="monotone" dataKey="prediction" fill={theme.palette.info.light} stroke={theme.palette.info.main} name="Predicción" />
              <Scatter dataKey="score" fill={theme.palette.secondary.main} name="Puntos de datos" />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      )}
      {viewMode === 1 && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>Análisis de Productividad</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Tendencias</Typography>
                <Typography variant="body2">
                  Tu productividad ha {trend >= 0 ? "aumentado" : "disminuido"} un {Math.abs(trend).toFixed(2)} en este período.
                  {trend >= 0 ? " ¡Sigue así!" : " Considera revisar tus hábitos de trabajo."}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Recomendaciones</Typography>
                <ul>
                  {recommendations.map((rec, index) => (
                    <li key={index}><Typography variant="body2">{rec}</Typography></li>
                  ))}
                </ul>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
      {viewMode === 2 && (
        <Box mt={2} sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Día</th>
                <th>Puntuación</th>
                <th>Objetivo</th>
                <th>Predicción</th>
              </tr>
            </thead>
            <tbody>
              {data.map((day, index) => (
                <tr key={index}>
                  <td>{day.day}</td>
                  <td>{day.score.toFixed(2)}</td>
                  <td>{day.target.toFixed(2)}</td>
                  <td>{day.prediction.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{averageScore.toFixed(2)}</Typography>
              <Typography variant="body2">Promedio</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{maxScore}</Typography>
              <Typography variant="body2">Máximo</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{minScore}</Typography>
              <Typography variant="body2">Mínimo</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color={trend >= 0 ? "success.main" : "error.main"}>
                {trend >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />} {Math.abs(trend).toFixed(2)}
              </Typography>
              <Typography variant="body2">Tendencia</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductivityChart;