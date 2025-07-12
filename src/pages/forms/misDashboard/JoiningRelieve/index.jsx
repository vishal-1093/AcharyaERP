
// import React, { useEffect, useState } from "react";
// import Grid from "@mui/material/Grid";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import Box from "@mui/material/Box";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// // import { VerticalBar, HorizontalBar, StackedBar, LineChart, PieChart } from "../Chart.js";
// import { VerticalBar, HorizontalBar, StackedBar, LineChart, PieChart } from "../../chartsDashboard/Chart.js";
// import { IOSSwitch } from "../../chartsDashboard/IOSSwitch.js";
// import GridIndex from "../../../../components/GridIndex.jsx";
// import axios from "../../../../services/Api.js";
// import useBreadcrumbs from "../../../../hooks/useBreadcrumbs.js";

// const ChartOptions = [
//     { value: "verticalbar", label: "Vertical Bar" },
//     { value: "horizontalbar", label: "Horizontal Bar" },
//     { value: "stackedbarvertical", label: "Stacked Bar(Vertical)" },
//     { value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)" },
//     { value: "line", label: "Line" },
//     { value: "pie", label: "Pie" },
// ]

// export default function JoiningRelieveReport() {
//     const [tableColumns, setTableColumns] = useState([]);
//     const [tableRows, setTableRows] = useState([]);
//     const [chartData, setChartData] = useState({});
//     const [selectedChart, setSelectedChart] = useState("line");
//     const [isTableView, setIsTableView] = useState(true);
//     const [loading, setLoading] = useState(false)
//     const setCrumbs = useBreadcrumbs();

//     useEffect(() => {
//           setCrumbs([
//         {
//           name: "MIS-Dashboard",
//           link: "/mis-dashboard"
//         },
//         { name: "HRM" },
//       ]);
//         getRelievingData()
//     }, []);

//     const getRelievingData = async () => {
//         setLoading(true)
//         await axios.get(`api/admissionCategoryReport/getEmployeeJoiningAndRelievingReport`)
//             .then((response) => {
//                 const { data } = response
//                 updateTableAndChart(data)
//                 setLoading(false)
//             })
//             .catch((err) =>{
//                 console.error(err)
//                 setLoading(false)
//     });
//     }

//     const updateTableAndChart = (data) => {
//         const joinMap = Object.fromEntries(data.Joining.map(item => [item.month_name, item.total_joined]));
//         const relieveMap = Object.fromEntries(data.Relieve.map(item => [item.month_name, item.total_joined]));
//         const allMonths = [
//             ...new Map(
//                 [...data.Joining, ...data.Relieve]
//                     .sort((a, b) => a.month_number - b.month_number)
//                     .map(item => [item.month_name, item])
//             ).values()
//         ].map(item => item.month_name);

//         const joinedRow = { id: 1, type: "Joined" };
//         const relievedRow = { id: 2, type: "Relieved" };
//         const totalRow = { id: 3, type: "Total" };

//         allMonths.forEach(month => {
//             joinedRow[month] = joinMap[month] || 0;
//             relievedRow[month] = relieveMap[month] || 0;
//             totalRow[month] = joinedRow[month] + relievedRow[month];
//         });

//         joinedRow.Total = allMonths.reduce((sum, m) => sum + (joinedRow[m] || 0), 0);
//         relievedRow.Total = allMonths.reduce((sum, m) => sum + (relievedRow[m] || 0), 0);
//         totalRow.Total = joinedRow.Total + relievedRow.Total;

//         setTableRows([joinedRow, relievedRow, totalRow]);

//         setTableColumns([
//             { field: "type", headerName: "Type", flex: 1, headerClassName: "header-bg" },
//             ...allMonths.map(month => ({
//                 field: month,
//                 headerName: month,
//                 type: "number",
//                 flex: 1,
//                 headerClassName: "header-bg",
//                 align: 'center'
//             })),
//             { field: "Total", headerName: "Total", type: "number", flex: 1, headerClassName: "header-bg", cellClassName: "last-column", align: 'center' }
//         ]);

//         setChartData({
//             labels: allMonths,
//             datasets: [
//                 {
//                     label: "Joined",
//                     data: allMonths.map(m => joinMap[m] || 0),
//                     backgroundColor: "rgba(54, 162, 235, 0.6)"
//                 },
//                 {
//                     label: "Relieved",
//                     data: allMonths.map(m => relieveMap[m] || 0),
//                     backgroundColor: "rgba(255, 99, 132, 0.6)"
//                 }
//             ]
//         });
//     };

//     const renderChart = () => {
//         const props = { data: chartData, title: "Monthly Joining vs Relieve", showDataLabel: true };

//         switch (selectedChart) {
//             case "verticalbar": return <VerticalBar {...props} />;
//             case "horizontalbar": return <HorizontalBar {...props} />;
//             case "stackedbarvertical": return <StackedBar {...{ ...props, vertical: true }} />;
//             case "stackedbarhorizontal": return <StackedBar {...{ ...props, vertical: false }} />;
//             case "line": return <LineChart {...props} />;
//             case "pie": return <PieChart {...props} />;
//             default: return null;
//         }
//     };

//     return (
//         <Grid container spacing={3}>
//             <Grid item xs={12}>
//                 <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
//                     <Grid item xs={12} sm="auto">
//                         <Stack
//                             direction="row"
//                             spacing={1}
//                             alignItems="center"
//                             justifyContent={{ xs: 'flex-start', sm: 'flex-start' }}
//                         >
//                             <Typography variant="body1">Chart view</Typography>
//                             <FormControlLabel
//                                 control={
//                                     <IOSSwitch
//                                         ischecked={isTableView}
//                                         handlechange={() => setIsTableView(!isTableView)}
//                                         sx={{ mx: 1 }}
//                                     />
//                                 }
//                                 label="Table view"
//                                 labelPlacement="end"
//                                 sx={{ marginRight: 0 }}
//                             />
//                         </Stack>
//                     </Grid>

//                     <Grid item xs={12} sm={6} md={4} lg={3}>
//                         <FormControl size="small" fullWidth>
//                             <InputLabel>Chart Type</InputLabel>
//                             <Select
//                                 size="small"
//                                 name="chart"
//                                 value={selectedChart}
//                                 label="Chart Type"
//                                 onChange={(e) => setSelectedChart(e.target.value)}
//                             >
//                                 {ChartOptions.map((obj, index) => (
//                                     <MenuItem key={index} value={obj.value}>
//                                         {obj.label}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                 </Grid>
//             </Grid>

//             <Grid item xs={12}>
//                 {isTableView ? (
//                     <Grid
//                         item
//                         xs={12}
//                         md={12}
//                         lg={12}
//                         pt={1}
//                         sx={{
//                             '& .MuiDataGrid-columnHeaders': {
//                                 backgroundColor: '#376a7d',
//                                 color: '#fff',
//                                 fontWeight: 'bold',
//                             },
//                             '& .last-row': {
//                                 fontWeight: 'bold',
//                                 backgroundColor: '#376a7d !important',
//                                 color: '#fff'
//                             },
//                             '& .last-row:hover': {
//                                 backgroundColor: '#376a7d !important',
//                                 color: '#fff'
//                             },
//                             '& .last-column': {
//                                 fontWeight: 'bold'
//                             },
//                             '& .header-bg': {
//                                 fontWeight: 'bold',
//                                 backgroundColor: '#376a7d',
//                                 color: '#fff'
//                             }
//                         }}
//                     >
//                         <GridIndex
//                             rows={tableRows}
//                             columns={tableColumns}
//                             loading={loading}
//                             getRowId={row => row.id}
//                             isRowSelectable={(params) => params.row.type !== "Total"}
//                             getRowClassName={(params) =>
//                             params.row.type === "Total" ? "last-row" : ""
//                             }
//                         />
//                     </Grid>
//                 ) : (
//                     <Box p={{ xs: 1, sm: 3 }}>
//                         {Object.keys(chartData).length > 0 && renderChart()}
//                     </Box>
//                 )}
//             </Grid>
//         </Grid>
//     );
// }


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

// export default function JoiningRelieveReport() {
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
//             { name: "HRM" },
//         ]);
//         getRelievingData();
//     }, []);

//     const getRelievingData = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`api/admissionCategoryReport/getEmployeeJoiningAndRelievingReport`);
//             updateTableAndChart(response.data);
//         } catch (err) {
//             console.error(err);
//         }
//         setLoading(false);
//     };

//     const updateTableAndChart = (data) => {
//         const joinMap = Object.fromEntries(data.Joining.map(item => [item.month_name, item.total_joined]));
//         const relieveMap = Object.fromEntries(data.Relieve.map(item => [item.month_name, item.total_joined]));
//         const allMonths = [
//             ...new Map(
//                 [...data.Joining, ...data.Relieve]
//                     .sort((a, b) => a.month_number - b.month_number)
//                     .map(item => [item.month_name, item])
//             ).values()
//         ].map(item => item.month_name);

//         const joinedRow = { id: 1, type: "Joined" };
//         const relievedRow = { id: 2, type: "Relieved" };
//         const totalRow = { id: 3, type: "Total" };

//         allMonths.forEach(month => {
//             joinedRow[month] = joinMap[month] || 0;
//             relievedRow[month] = relieveMap[month] || 0;
//             totalRow[month] = joinedRow[month] + relievedRow[month];
//         });

//         joinedRow.Total = allMonths.reduce((sum, m) => sum + (joinedRow[m] || 0), 0);
//         relievedRow.Total = allMonths.reduce((sum, m) => sum + (relievedRow[m] || 0), 0);
//         totalRow.Total = joinedRow.Total + relievedRow.Total;

//         setTableRows([joinedRow, relievedRow, totalRow]);

//         setTableColumns([
//             { field: "type", headerName: "Type", flex: 1, headerClassName: "header-bg" },
//             ...allMonths.map(month => ({
//                 field: month,
//                 headerName: month,
//                 type: "number",
//                 flex: 1,
//                 headerClassName: "header-bg",
//                 align: 'center'
//             })),
//             { field: "Total", headerName: "Total", type: "number", flex: 1, headerClassName: "header-bg", cellClassName: "last-column", align: 'center' }
//         ]);

//         setChartData({
//             categories: allMonths,
//             joined: allMonths.map(m => joinMap[m] || 0),
//             relieved: allMonths.map(m => relieveMap[m] || 0)
//         });
//     };

//     const buildHighChartOptions = () => {
//         const isPie = selectedChart === "pie";
//         return {
//             chart: { type: selectedChart },
//             title: { text: "Monthly Joining vs Relieving" },
//             xAxis: !isPie ? { categories: chartData.categories } : undefined,
//             yAxis: !isPie ? { min: 0, title: { text: "Count" }, stackLabels: { enabled: true }} : undefined,
//             tooltip: { shared: true },
//             plotOptions: {
//                 column: { stacking: "normal", dataLabels: { enabled: true }},
//                 bar:    { stacking: "normal", dataLabels: { enabled: true }},
//                 line:   { dataLabels: { enabled: true }},
//                 pie: {
//                     allowPointSelect: true,
//                     cursor: "pointer",
//                     dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.y}" }
//                 }
//             },
//             series: isPie 
//                 ? [
//                     {
//                         name: "Total",
//                         colorByPoint: true,
//                         data: [
//                             { name: "Joined", y: chartData.joined?.reduce((a,b)=>a+b,0) },
//                             { name: "Relieved", y: chartData.relieved?.reduce((a,b)=>a+b,0) }
//                         ]
//                     }
//                 ]
//                 : [
//                     { name: "Joined", data: chartData.joined, color: "rgba(54, 162, 235, 0.6)" },
//                     { name: "Relieved", data: chartData.relieved, color: "rgba(255, 99, 132, 0.6)" }
//                 ]
//         };
//     };

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
//                         getRowClassName={(params) =>
//                             params.row.type === "Total" ? "last-row" : ""
//                         }
//                     />
//                 ) : (
//                     <Box p={3}>
//                         {chartData.joined && <HighchartsReact highcharts={Highcharts} options={buildHighChartOptions()} />}
//                     </Box>
//                 )}
//             </Grid>
//         </Grid>
//     );
// }


import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "../../../../services/Api.js";
import GridIndex from "../../../../components/GridIndex.jsx";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs.js";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { IOSSwitch } from "../../chartsDashboard/IOSSwitch.js";

const ChartOptions = [
    { value: "column", label: "Column" },
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
];

export default function JoiningRelieveReport() {
    const [tableColumns, setTableColumns] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [chartData, setChartData] = useState({});
    const [selectedChart, setSelectedChart] = useState("column");
    const [isTableView, setIsTableView] = useState(true);
    const [loading, setLoading] = useState(false);
    const setCrumbs = useBreadcrumbs();

    useEffect(() => {
        setCrumbs([
            { name: "MIS-Dashboard", link: "/mis-dashboard" },
            { name: "HRM" },
        ]);
        getRelievingData();
    }, []);

    const getRelievingData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`api/admissionCategoryReport/getEmployeeJoiningAndRelievingReport`);
            updateTableAndChart(response.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const updateTableAndChart = (data) => {
        const joinMap = Object.fromEntries(data.Joining.map(item => [item.month_name, item.total_joined]));
        const relieveMap = Object.fromEntries(data.Relieve.map(item => [item.month_name, item.total_joined]));

        const allMonths = [
            ...new Map(
                [...data.Joining, ...data.Relieve]
                    .sort((a, b) => a.month_number - b.month_number)
                    .map(item => [item.month_name, item])
            ).values()
        ].map(item => item.month_name);

        const joinedRow = { id: 1, type: "Joined" };
        const relievedRow = { id: 2, type: "Relieved" };
        const totalRow = { id: 3, type: "Total" };

        allMonths.forEach(month => {
            joinedRow[month] = joinMap[month] || 0;
            relievedRow[month] = relieveMap[month] || 0;
            totalRow[month] = joinedRow[month] + relievedRow[month];
        });

        joinedRow.Total = allMonths.reduce((sum, m) => sum + (joinedRow[m] || 0), 0);
        relievedRow.Total = allMonths.reduce((sum, m) => sum + (relievedRow[m] || 0), 0);
        totalRow.Total = joinedRow.Total + relievedRow.Total;

        setTableRows([joinedRow, relievedRow, totalRow]);

        setTableColumns([
            { field: "type", headerName: "Type", flex: 1, headerClassName: "header-bg" },
            ...allMonths.map(month => ({
                field: month,
                headerName: month,
                type: "number",
                flex: 1,
                headerClassName: "header-bg",
                align: 'center'
            })),
            { field: "Total", headerName: "Total", type: "number", flex: 1, headerClassName: "header-bg", cellClassName: "last-column", align: 'center' }
        ]);

        setChartData({
            categories: allMonths,
            joined: allMonths.map(m => joinMap[m] || 0),
            relieved: allMonths.map(m => relieveMap[m] || 0)
        });
    };

    const buildHighChartOptions = () => {
        const isPie = selectedChart === "pie";
        return {
            chart: { 
                type: selectedChart,
                backgroundColor: "#212529",
                style: { fontFamily: "'Roboto', sans-serif" }
            },
            title: { 
                text: "Monthly Joining vs Relieving",
                style: { color: "#f8f9fa" }
            },
            xAxis: !isPie ? { 
                categories: chartData.categories || [], 
                labels: { style: { color: "#f8f9fa" }}
            } : undefined,
            yAxis: !isPie ? { 
                min: 0,
                title: { text: "Count", style: { color: "#f8f9fa" }},
                labels: { style: { color: "#f8f9fa" }}
            } : undefined,
            tooltip: { 
                shared: true,
                backgroundColor: "#343a40",
                style: { color: "#fff" }
            },
            legend: { 
                itemStyle: { color: '#f8f9fa' }
            },
            plotOptions: {
                line: {
                    dataLabels: { 
                        enabled: true,
                        style: { color: "#fff", textOutline: "1px contrast" }
                    },
                    marker: { radius: 5, lineColor: "#fff", lineWidth: 1 }
                },
                column: {
                    dataLabels: {
                        enabled: true,
                        style: { color: "#fff", textOutline: "1px contrast" }
                    }
                },
                bar: {
                    dataLabels: {
                        enabled: true,
                        style: { color: "#fff", textOutline: "1px contrast" }
                    }
                },
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.name}</b>: {point.y}",
                        color: "#fff"
                    }
                }
            },
            series: isPie 
                ? [
                    {
                        name: "Total",
                        colorByPoint: true,
                        data: [
                            { name: "Joined", y: chartData.joined?.reduce((a,b)=>a+b,0), color: "#4e79a7" },
                            { name: "Relieved", y: chartData.relieved?.reduce((a,b)=>a+b,0), color: "#e15759" }
                        ]
                    }
                ]
                : [
                    { name: "Joined", data: chartData.joined, color: "#4e79a7" },
                    { name: "Relieved", data: chartData.relieved, color: "#e15759" }
                ]
        };
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                    <Grid item xs={12} sm="auto">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1">Chart view</Typography>
                            <FormControlLabel
                                control={
                                    <IOSSwitch
                                        ischecked={isTableView}
                                        handlechange={() => setIsTableView(!isTableView)}
                                    />
                                }
                                label="Table view"
                                labelPlacement="end"
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Chart Type</InputLabel>
                            <Select
                                size="small"
                                value={selectedChart}
                                label="Chart Type"
                                onChange={(e) => setSelectedChart(e.target.value)}
                            >
                                {ChartOptions.map((obj, index) => (
                                    <MenuItem key={index} value={obj.value}>{obj.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                {isTableView ? (
                    <GridIndex
                        rows={tableRows}
                        columns={tableColumns}
                        loading={loading}
                        getRowId={(row) => row.id}
                        isRowSelectable={() => false}
                        getRowClassName={(params) =>
                            params.row.type === "Total" ? "last-row" : ""
                        }
                    />
                ) : (
                    <Box p={3}>
                        {chartData.joined && <HighchartsReact highcharts={Highcharts} options={buildHighChartOptions()} />}
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}
