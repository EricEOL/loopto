import { Line } from 'react-chartjs-2';
import styles from './styles.module.scss';

export function LineGraphic({ labels, data, title }) {
    const state = {
        labels: labels,
        datasets: [
            {
                label: title,
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: data
            }
        ]
    }

    return (
        <div className={styles.graphic}>
            <Line
                data={state}
                options={{
                    title: {
                        display: false,
                        text: title,
                        fontSize: 12
                    },
                    legend: {
                        display: false,
                        position: 'right',
                    }
                }}
            />
        </div>
    );
}