
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
import { VerticalBar, HorizontalBar, StackedBar, LineChart, PieChart } from "../../chartsDashboard/Chart.js";
import { IOSSwitch } from "../../chartsDashboard/IOSSwitch.js";
import GridIndex from "../../../../components/GridIndex.jsx";
import axios from "../../../../services/Api.js";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs.js";
import { useLocation } from "react-router-dom";

const ChartOptions = [
    { value: "verticalbar", label: "Vertical Bar" },
    { value: "horizontalbar", label: "Horizontal Bar" },
    { value: "stackedbarvertical", label: "Stacked Bar(Vertical)" },
    { value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
]

export default function AdmissionReportYearly() {
    const [tableColumns, setTableColumns] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [chartData, setChartData] = useState({});
    const [selectedChart, setSelectedChart] = useState("line");
    const [isTableView, setIsTableView] = useState(true);
    const [loading, setLoading] = useState(false)
    const setCrumbs = useBreadcrumbs();
    const location = useLocation()
    const currAcYearId = location?.state

    useEffect(() => {
        fetchYearlyAdmissionReportData();
         setCrumbs([
        {
          name: "MIS-Dashboard",
          link: "/mis-dashboard"
        },
        { name: "Admission" },
      ]);
    }, [currAcYearId]);

    const fetchYearlyAdmissionReportData = async () => {
        setLoading(true)
        await axios.get(`api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${currAcYearId}`)
            .then((response) => {
                const { data } = response?.data
                updateTableAndChart(data || [])
                setLoading(false)
            })
            .catch((err) =>{
                console.error(err)
                setLoading(false)
    });
    };

    const updateTableAndChart = (data) => {
        const rows = data?.map((item, index) => ({
            id: index,
            quota: item.feeAdmissionType,
            intake: item.intake,
            admitted: item.admitted,
            vacant: item.vacant
        }));

        const totals = {
            id: 'total',
            quota: "Total",
            intake: data.reduce((sum, d) => sum + d.intake, 0),
            admitted: data.reduce((sum, d) => sum + d.admitted, 0),
            vacant: data.reduce((sum, d) => sum + d.vacant, 0)
        };

        rows.push(totals);

        setTableRows(rows);
        setTableColumns([
            { field: "quota", headerName: "Category Group Name", flex: 1, headerClassName: "header-bg" },
            { field: "intake", headerName: "Intake", type: "number", flex: 1, headerClassName: "header-bg", align: 'center' },
            { field: "admitted", headerName: "Admitted", type: "number", flex: 1, headerClassName: "header-bg", align: 'center' },
            { field: "vacant", headerName: "Vacant", type: "number", flex: 1, headerClassName: "header-bg", cellClassName: "last-column", align: 'center' }
        ]);

        setChartData({
            labels: data.map(d => d.feeAdmissionType),
            datasets: [
                {
                    label: "Intake",
                    data: data.map(d => d.intake),
                    backgroundColor: "rgba(54, 162, 235, 0.6)"
                },
                {
                    label: "Admitted",
                    data: data.map(d => d.admitted),
                    backgroundColor: "rgba(75, 192, 192, 0.6)"
                },
                {
                    label: "Vacant",
                    data: data.map(d => d.vacant),
                    backgroundColor: "rgba(255, 99, 132, 0.6)"
                }
            ]
        });
    };

    const renderChart = () => {
        const props = { data: chartData, title: "Admission Report Yearly", showDataLabel: true };

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
                            isRowSelectable={(params) => params.row.quota !== "Total"}
                            getRowClassName={(params) =>
                                params.row.quota === "Total" ? "last-row" : ""
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
