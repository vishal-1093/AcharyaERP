
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

const ChartOptions = [
    { value: "verticalbar", label: "Vertical Bar" },
    { value: "horizontalbar", label: "Horizontal Bar" },
    { value: "stackedbarvertical", label: "Stacked Bar(Vertical)" },
    { value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
]

export default function FinanceReport() {
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
        { name: "Finance" },
      ]);
        getFinanceReportData()
    }, []);

    const getFinanceReportData = async () => {
        setLoading(true)
        await axios.get(`api/admissionCategoryReport/getBankReport`)
            .then((response) => {
                const { data } = response
                updateTableAndChart(data)
                setLoading(false)
            })
            .catch((err) =>{
                console.error(err)
                 setLoading(false)
    });
    }

    const updateTableAndChart = (data) => {
    // Sort by month_number
    const sortedData = [...data].sort((a, b) => a.month_number - b.month_number);

    const months = sortedData.map(item => item.month_name);
    const monthAmounts = Object.fromEntries(
        sortedData.map(item => [item.month_name, parseFloat(item.totalAmount.replace(" cr.", "")) || 0])
    );

    const amountRow = { id: 1, type: "Amount" };
    months.forEach(month => {
        amountRow[month] = monthAmounts[month];
    });
    amountRow.Total = months.reduce((sum, month) => sum + amountRow[month], 0);

    setTableRows([amountRow]);

    setTableColumns([
        { field: "type", headerName: "Type", flex: 1, headerClassName: "header-bg" },
        ...months.map(month => ({
            field: month,
            headerName: month,
            type: "number",
            flex: 1,
            headerClassName: "header-bg"
        })),
        { field: "Total", headerName: "Total", type: "number", flex: 1, headerClassName: "header-bg", cellClassName: "last-column" }
    ]);

    setChartData({
        labels: months,
        datasets: [
            {
                label: "Amount (cr.)",
                data: months.map(month => monthAmounts[month]),
                backgroundColor: "rgba(75, 192, 192, 0.6)"
            }
        ]
    });
};

    const renderChart = () => {
        const props = { data: chartData, title: "Monthly Revenue", showDataLabel: true };

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
                            getRowId={(row) => row.id}
                            isRowSelectable={(params) => params.row.month !== "Total"}
                            getRowClassName={(params) => params.row.month === "Total" ? "last-row" : ""}
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


// import React, { useEffect, useState } from "react";
// import Grid from "@mui/material/Grid";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import Box from "@mui/material/Box";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import axios from "../../../../services/Api.js";
// import GridIndex from "../../../../components/GridIndex.jsx";
// import useBreadcrumbs from "../../../../hooks/useBreadcrumbs.js";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import { IOSSwitch } from "../../chartsDashboard/IOSSwitch.js";

// const ChartOptions = [
//     { value: "column", label: "Column" },
//     { value: "bar", label: "Bar" },
//     { value: "line", label: "Line" },
//     { value: "pie", label: "Pie" },
// ];

// export default function FinanceReport() {
//     const [tableColumns, setTableColumns] = useState([]);
//     const [tableRows, setTableRows] = useState([]);
//     const [chartData, setChartData] = useState({});
//     const [selectedChart, setSelectedChart] = useState("column");
//     const [isTableView, setIsTableView] = useState(true);
//     const [loading, setLoading] = useState(false);
//     const setCrumbs = useBreadcrumbs();

//     useEffect(() => {
//         setCrumbs([
//             { name: "MIS-Dashboard", link: "/mis-dashboard" },
//             { name: "Finance" },
//         ]);
//         getFinanceReportData();
//     }, []);

//     const getFinanceReportData = async () => {
//         setLoading(true);
//         try {
//             const { data } = await axios.get(`api/admissionCategoryReport/getBankReport`);
//             updateTableAndChart(data);
//         } catch (err) {
//             console.error(err);
//         }
//         setLoading(false);
//     };

//     const updateTableAndChart = (data) => {
//         const sortedData = [...data].sort((a, b) => a.month_number - b.month_number);
//         const months = sortedData.map(item => item.month_name);
//         const monthAmounts = Object.fromEntries(
//             sortedData.map(item => [item.month_name, parseFloat(item.totalAmount.replace(" cr.", "")) || 0])
//         );

//         const amountRow = { id: 1, type: "Amount" };
//         months.forEach(month => {
//             amountRow[month] = monthAmounts[month];
//         });
//         amountRow.Total = months.reduce((sum, month) => sum + amountRow[month], 0);

//         setTableRows([amountRow]);

//         setTableColumns([
//             { field: "type", headerName: "Type", flex: 1, headerClassName: "header-bg" },
//             ...months.map(month => ({
//                 field: month,
//                 headerName: month,
//                 type: "number",
//                 flex: 1,
//                 headerClassName: "header-bg"
//             })),
//             { field: "Total", headerName: "Total", type: "number", flex: 1, headerClassName: "header-bg", cellClassName: "last-column" }
//         ]);

//         setChartData({
//             categories: months,
//             data: months.map(month => monthAmounts[month])
//         });
//     };

//     const buildHighChartOptions = () => ({
//         chart: { type: selectedChart },
//         title: { text: "Monthly Revenue" },
//         xAxis: { categories: chartData.categories || [], crosshair: true },
//         yAxis: { min: 0, title: { text: "Amount (cr.)" }},
//         tooltip: {
//             headerFormat: "<b>{point.key}</b><table>",
//             pointFormat: "<tr><td style='color:{series.color}'>{series.name}: </td>" +
//                 "<td style='text-align: right'><b>{point.y}</b></td></tr>",
//             footerFormat: "</table>",
//             shared: true,
//             useHTML: true
//         },
//         plotOptions: {
//             column: { pointPadding: 0.2, borderWidth: 0 },
//             bar: { dataLabels: { enabled: true }},
//             line: { dataLabels: { enabled: true }},
//             pie: { allowPointSelect: true, cursor: 'pointer', dataLabels: { enabled: true }}
//         },
//         series: selectedChart === "pie"
//             ? [{
//                 name: "Amount",
//                 colorByPoint: true,
//                 data: chartData.categories?.map((month, i) => ({
//                     name: month,
//                     y: chartData.data[i]
//                 }))
//             }]
//             : [{
//                 name: "Amount (cr.)",
//                 data: chartData.data,
//                 color: "rgba(75, 192, 192, 0.6)"
//             }]
//     });

//     return (
//         <Grid container spacing={3}>
//             <Grid item xs={12}>
//                 <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
//                     <Grid item xs={12} sm="auto">
//                         <Stack direction="row" spacing={1} alignItems="center">
//                             <Typography variant="body1">Chart view</Typography>
//                             <FormControlLabel
//                                 control={
//                                     <IOSSwitch
//                                         ischecked={isTableView}
//                                         handlechange={() => setIsTableView(!isTableView)}
//                                     />
//                                 }
//                                 label="Table view"
//                                 labelPlacement="end"
//                             />
//                         </Stack>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={4} lg={3}>
//                         <FormControl size="small" fullWidth>
//                             <InputLabel>Chart Type</InputLabel>
//                             <Select
//                                 size="small"
//                                 value={selectedChart}
//                                 label="Chart Type"
//                                 onChange={(e) => setSelectedChart(e.target.value)}
//                             >
//                                 {ChartOptions.map((obj, index) => (
//                                     <MenuItem key={index} value={obj.value}>{obj.label}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                 </Grid>
//             </Grid>

//             <Grid item xs={12}>
//                 {isTableView ? (
//                     <GridIndex
//                         rows={tableRows}
//                         columns={tableColumns}
//                         loading={loading}
//                         getRowId={(row) => row.id}
//                         isRowSelectable={() => false}
//                     />
//                 ) : (
//                     <Box p={3}>
//                         {chartData?.data && <HighchartsReact highcharts={Highcharts} options={buildHighChartOptions()} />}
//                     </Box>
//                 )}
//             </Grid>
//         </Grid>
//     );
// }

