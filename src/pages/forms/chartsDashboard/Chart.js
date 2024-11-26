import { Bar, Line, Pie } from "react-chartjs-2";

export const VerticalBar = ({data, title, showDataLabel}) => {
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
            },
            datalabels: {
                display: showDataLabel,
                anchor: 'start',
                align: 'top',
                font: {
                    weight: 'bold',
                    size: "15px"
                }
            }
        }
    }

    return <Bar options={options} data={data} />;
}

export const HorizontalBar = ({data, title, showDataLabel}) => {
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
            },
            datalabels: {
                display: showDataLabel,
                anchor: 'start',
                align: 'top',
                font: {
                    weight: 'bold',
                    size: "15px"
                }
            }
        },
    }

    return <Bar options={options} data={data} />;
}

export const StackedBar = ({data, title, vertical, showDataLabel}) => {
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
            },
            datalabels: {
                display: showDataLabel,
                anchor: 'start',
                align: 'top',
                font: {
                    weight: 'bold',
                    size: "15px"
                }
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

export const LineChart = ({data, title, showDataLabel}) => {
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
            datalabels: {
                display: showDataLabel,
                anchor: 'start',
                align: 'top',
                font: {
                    weight: 'bold',
                    size: "15px"
                }
            }
        }
    }

    return(
        <Line options={options} data={data}/>
    )
}

export const PieChart = ({data, title, showDataLabel}) => {
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
            datalabels: {
                display: showDataLabel,
                anchor: 'center',
                align: 'top',
                font: {
                    weight: 'bold',
                    size: "15px"
                }
            }
        }
    }

    return(
        <Pie options={options} data={data}/>
    )
}