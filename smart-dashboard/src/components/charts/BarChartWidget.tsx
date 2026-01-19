import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
    data: ChartData<'bar'>;
    height?: number;
}

export const BarChartWidget = ({ data, height = 300 }: BarChartProps) => {
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
            }
        }
    };

    return (
        <div style={{ height: height, width: '100%' }}>
            <Bar options={options} data={data} />
        </div>
    );
};