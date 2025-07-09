
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
// import { VerticalBar, HorizontalBar, StackedBar, LineChart, PieChart } from "../Chart.js";
import { VerticalBar, HorizontalBar, StackedBar, LineChart, PieChart } from "../../chartsDashboard/Chart.js";
import { IOSSwitch } from "../../chartsDashboard/IOSSwitch.js";
import GridIndex from "../../../../components/GridIndex.jsx";
import axios from "../../../../services/Api.js";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs.js";

const ChartOptions = [
    { value: "verticalbar", label: "Vertical Bar" },
    { value: "horizontalbar", label: "Horizontal Bar" },
    { value: "stackedbarvertical", label: "Stacked Bar(Vertical)" },
    { value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
]

export default function AdmissionReportDaily() {
    const [tableColumns, setTableColumns] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [chartData, setChartData] = useState({});
    const [selectedChart, setSelectedChart] = useState("line");
    const [isTableView, setIsTableView] = useState(true);
    const [loading, setLoading] = useState(false)
     const setCrumbs = useBreadcrumbs();

    useEffect(() => {
        setCrumbs([
        {
          name: "MIS-Dashboard",
          link: "/mis-dashboard"
        },
        { name: "Academic Overview" },
      ]);
        fetchAdmissionData();
    }, []);

    const fetchAdmissionData = async () => {
        setLoading(true)
        await axios.get(`/api/admissionCategoryReport/getDatewiseAdmissionReport`)
            .then((response) => {
                const { data } = response
                updateTableAndChart(data)
                setLoading(false)
            })
            .catch((err) =>{
                console.error(err)
                setLoading(false)
    });
    };

    const updateTableAndChart = (data) => {
        const years = [
            data.prevYear[0].prevAcademicYear,
            data.currentYear[0].currentAcademicYear
        ];

        let institutesSet = new Set();
        data.prevYear.slice(1).forEach(item => institutesSet.add(item.school_name_short));
        data.currentYear.slice(1).forEach(item => institutesSet.add(item.school_name_short));

        const institutes = Array.from(institutesSet);
        let yearData = {};

        data.prevYear.slice(1).forEach(item => {
            if (!yearData[years[0]]) yearData[years[0]] = {};
            yearData[years[0]][item.school_name_short] = item.admitted;
        });

        data.currentYear.slice(1).forEach(item => {
            if (!yearData[years[1]]) yearData[years[1]] = {};
            yearData[years[1]][item.school_name_short] = item.admitted;
        });

        const rows = [];
        let totals = { id: "Total", year: "Total" };
        institutes.forEach(inst => totals[inst] = 0);

        let i = 0;
        for (const year of years) {
            let row = { id: i++, year };
            institutes.forEach(inst => {
                row[inst] = yearData[year]?.[inst] || 0;
                totals[inst] += row[inst];
            });
            row.Total = institutes.reduce((acc, inst) => acc + (row[inst] || 0), 0);
            rows.push(row);
        }

        totals.Total = institutes.reduce((acc, inst) => acc + totals[inst], 0);
        rows.push(totals);

        setTableColumns([
            { field: "year", headerName: "Year", flex: 1, headerClassName: "header-bg" },
            ...institutes.map(inst => ({
                field: inst,
                headerName: inst,
                type: "number",
                flex: 1,
                headerClassName: "header-bg",
                align: 'center'
            })),
            { field: "Total", headerName: "Total", type: "number", flex: 1, headerClassName: "header-bg", cellClassName: "last-column", align: 'center' }
        ]);

        setTableRows(rows);

        const datasets = years.map((year, idx) => {
            const color = idx % 2 === 0 ? "118, 185, 0" : "232, 63, 51";
            return {
                label: year,
                data: institutes.map(inst => yearData[year]?.[inst] || 0),
                backgroundColor: `rgba(${color}, 0.6)`,
                borderColor: `rgb(${color})`,
                borderWidth: 1
            }
        });

        setChartData({
            labels: institutes,
            datasets
        });
    };

    const renderChart = () => {
        const props = { data: chartData, title: "Admission Report - Daily", showDataLabel: true };

        switch (selectedChart) {
            case "verticalbar": return <VerticalBar {...props} />;
            case "horizontalbar": return <HorizontalBar {...props} />;
            case "stackedbarvertical": return <StackedBar {...{ ...props, vertical: true }} />;
            case "stackedbarhorizontal": return <StackedBar {...{ ...props, vertical: false }} />;
            case "line": return <LineChart {...props} />;
            case "pie": return <PieChart {...props} />;
            default: return null;
        }
    };
  
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                    <Grid item xs={12} sm="auto">
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent={{ xs: 'flex-start', sm: 'flex-start' }}
                        >
                            <Typography variant="body1">Chart view</Typography>
                            <FormControlLabel
                                control={
                                    <IOSSwitch
                                        ischecked={isTableView}
                                        handlechange={() => setIsTableView(!isTableView)}
                                        sx={{ mx: 1 }}
                                    />
                                }
                                label="Table view"
                                labelPlacement="end"
                                sx={{ marginRight: 0 }}
                            />
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Chart Type</InputLabel>
                            <Select
                                size="small"
                                name="chart"
                                value={selectedChart}
                                label="Chart Type"
                                onChange={(e) => setSelectedChart(e.target.value)}
                            >
                                {ChartOptions.map((obj, index) => (
                                    <MenuItem key={index} value={obj.value}>
                                        {obj.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                {isTableView ? (
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        pt={1}
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#376a7d',
                                color: '#fff',
                                fontWeight: 'bold',
                            },
                            '& .last-row': {
                                fontWeight: 'bold',
                                backgroundColor: '#376a7d !important',
                                color: '#fff'
                            },
                            '& .last-row:hover': {
                                backgroundColor: '#376a7d !important',
                                color: '#fff'
                            },
                            '& .last-column': {
                                fontWeight: 'bold'
                            },
                            '& .header-bg': {
                                fontWeight: 'bold',
                                backgroundColor: '#376a7d',
                                color: '#fff'
                            }
                        }}
                    >
                        <GridIndex
                            rows={tableRows}
                            columns={tableColumns}
                            loading={loading}
                            getRowId={row => row.id}
                            isRowSelectable={(params) => params?.row?.year !== "Total"}
                            getRowClassName={(params) =>
                                params?.row?.year === "Total" ? "last-row" : ""
                            }
                        />
                    </Grid>
                ) : (
                    <Box p={{ xs: 1, sm: 3 }}>
                        {Object.keys(chartData).length > 0 && renderChart()}
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}
