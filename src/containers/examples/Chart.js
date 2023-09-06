import { Bar, Line } from "react-chartjs-2";

export const HorizontalBar = ({data, title}) => {
    const options = {
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            }
        },
    }

    return <Bar options={options} data={data} />;
}

export const LineChart1 = ({data, title}) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: 'black'
                }
            },
            title: {
                display: true,
                text: title,
            },
        }
    }

    return(
        <Line options={options} data={data}/>
    )
}