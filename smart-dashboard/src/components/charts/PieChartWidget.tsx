import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Plugin,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Box, useTheme } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartWidgetProps = {
  data: any;
  height?: number;
  centerText?: string;
  subText?: string;
  onSegmentClick?: (label: string) => void;
};

export const PieChartWidget = ({
  data,
  height = 260,
  centerText,
  subText,
  onSegmentClick,
}: PieChartWidgetProps) => {
  const theme = useTheme();

  const textColor =
    theme.palette.mode === 'dark' ? '#e2e8f0' : '#0f172a';
  const subTextColor =
    theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b';

  // 🔥 center text plugin
  const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      ctx.save();

      ctx.font = `bold ${Math.min(width, height) / 6}px sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(centerText || '', width / 2, height / 2 - 10);

      if (subText) {
        ctx.font = '12px sans-serif';
        ctx.fillStyle = subTextColor;
        ctx.fillText(subText, width / 2, height / 2 + 15);
      }

      ctx.restore();
    },
  };

  return (
    <Box sx={{ height }}>
      <Doughnut
        data={data}
        plugins={[centerTextPlugin]}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          animation: {
            duration: 800,
          },
          elements: {
            arc: {
              hoverOffset: 10, // 🔥 smooth pop-out
            },
          },
          onClick: (_, elements, chart) => {
            if (!elements.length || !onSegmentClick) return;

            const index = elements[0].index;
            const label = chart.data.labels?.[index] as string;

            onSegmentClick(label);
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: subTextColor,
                font: { size: 12 },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const data = context.dataset.data as number[];

                  const total = data.reduce((a, b) => a + b, 0);
                  const value = context.raw as number;

                  const percentage = ((value / total) * 100).toFixed(1);

                  return `${context.label}: ${value} (${percentage}%)`;
                },
              },
            },  
          },
        }}
      />
    </Box>
  );
};