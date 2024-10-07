import { XAxis, YAxis } from 'recharts';

XAxis.defaultProps = {
  ...XAxis.defaultProps,
  allowDecimals: false,
};

YAxis.defaultProps = {
  ...YAxis.defaultProps,
  allowDecimals: false,
};

// No necesitas exportar nada, solo importar este archivo