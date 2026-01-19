import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
    data: ChartData<'line'>;
    height?: number;
}

export const LineChartWidget = ({ data, height = 300 }: LineChartProps) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false,
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        }
    };

    return (
        <div style={{ height: height, width: '100%' }}>
            <Line options={options} data={data} />
        </div>
    );
};