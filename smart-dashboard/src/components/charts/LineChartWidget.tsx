import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, useTheme } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

type LineChartWidgetProps = {
  data: any;
  height?: number;
};

export const LineChartWidget = ({
  data,
  height = 260,
}: LineChartWidgetProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ height }}>
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: theme.palette.text.secondary,
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          elements: {
            line: {
              tension: 0.35,
              borderWidth: 2,
            },
            point: {
              radius: 2,
              hoverRadius: 4,
            },
          },
          scales: {
            x: {
              ticks: {
                color: theme.palette.text.secondary,
              },
              grid: {
                color:
                  theme.palette.mode === 'dark'
                    ? 'rgba(148, 163, 184, 0.12)'
                    : 'rgba(148, 163, 184, 0.18)',
              },
            },
            y: {
              beginAtZero: true,
              suggestedMax: 100,
              ticks: {
                color: theme.palette.text.secondary,
                callback: (value) => `${value}%`,
              },
              grid: {
                color:
                  theme.palette.mode === 'dark'
                    ? 'rgba(148, 163, 184, 0.12)'
                    : 'rgba(148, 163, 184, 0.18)',
              },
            },
          },
        }}
      />
    </Box>
  );
};