import { Bar, Line } from "react-chartjs-2";

export const VerticalBar = ({data, title}) => {
    const options = {
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

export const StackedBar = ({data, title, vertical}) => {
    const options = {
        indexAxis: vertical ? 'x' : 'y',
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
        scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
        }
    }

    return <Bar options={options} data={data} />;
}

export const LineChart = ({data, title}) => {
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