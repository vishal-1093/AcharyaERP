import React, { lazy, useEffect, useState } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import axios from "../../../../services/Api"
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material"
import { HorizontalBar, LineChart, StackedBar, VerticalBar } from "../Chart";
import styled from "@emotion/styled";
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseIcon from '@mui/icons-material/Close';
const GridIndex = lazy(() => import("../../../../components/GridIndex"));

const EnlargeChartIcon = styled(OpenInFullRoundedIcon)`
	position: absolute;
	right: 33px;
	top: 20px;
	color: #132353;
	cursor: pointer;

	@media screen and (max-width: 1024px){
		display: none;
	}
`

const ChartSection = styled.div`
	visibility: 1;
	opacity: 1;
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	background: rgba(0,0,0,0.7);
	backdrop-filter: blur(5px);
	transition: opacity 1s;
	z-index: 999;
`

const ChartContainer = styled.div`
	max-width: 85%;
	margin: 90px auto;
	border-radius: 5px;
	width: 100%;
	position: relative;
	transition: all 2s ease-in-out;
	padding: 30px;
	background-color: #ffffff;
`

const CloseButton = styled(CloseIcon)`
	position: absolute;
	right: 33px;
	top: 20px;
	color: #132353;
	cursor: pointer;
`

const ShortenMonths = [
	{ "January": "Jan" },
	{ "February": "Feb" },
	{ "March": "Mar" },
	{ "April": "Apr" },
	{ "May": "May" },
	{ "June": "Jun" },
	{ "July": "Jul" },
	{ "August": "Aug" },
	{ "September": "Sep" },
	{ "October": "Oct" },
	{ "November": "Nov" },
	{ "December": "Dec" }
] 

const FilterOptions = [
    {value: "Summary", label: "Summary"},
    {value: "Inflow", label: "Inflow"},
    {value: "Outflow", label: "Outflow"}
]

const ChartOptions = [
	{ value: "verticalbar", label: "Vertical Bar" },
	{ value: "horizontalbar", label: "Horizontal Bar" },
	{ value: "stackedbarvertical", label: "Stacked Bar(Vertical)" },
	{ value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)" },
	{ value: "line", label: "Line" },
]

const DEFAULT_CHART = "verticalbar"

const InflowOutflowPage = () => {
    const setCrumbs = useBreadcrumbs()
    const [isLoading, setIsLoading] = useState(true)
    const [year, setYear] = useState(new Date().getFullYear())
    const [lasttenYears, setLastTenYears] = useState([])
    const [selectedOption, setSelectedOption] = useState("Summary")
    const [report, setReport] = useState({})
    const [outflowColumnGroup, setOutflowColumnGroup] = useState([])
    const [tableOutflowRows, setTableOutflowRows] = useState([])
	const [tableOutflowsColumns, setTableOutflowsColumns] = useState([])
    const [inflowColumnGroup, setInflowColumnGroup] = useState([])
    const [tableInflowRows, setTableInflowRows] = useState([])
	const [tableInflowsColumns, setTableInflowsColumns] = useState([])
    const [isOutflowTableLoaded, setIsOutflowTableLoaded] = useState(false)
    const [isInflowTableLoaded, setIsInflowTableLoaded] = useState(false)
    const [selectedChart, setSelectedChart] = useState(DEFAULT_CHART)
    const [inflowChartData, setInflowChartData] = useState({})
    const [outflowChartData, setOutflowChartData] = useState({})
    const [inflowEnlargeChart, setInflowEnlargeChart] = useState(false)
    const [outflowEnlargeChart, setOutflowEnlargeChart] = useState(false)

    useEffect(() => {
        setCrumbs([
			{ name: "Charts Dashboard", link: "/charts-dashboard" },
        	{ name: "Finance" }
		])

        let lastTenYears = []
		const currentYear = new Date().getFullYear();
		for (let year = currentYear - 10; year <= currentYear; year++) lastTenYears.push(year)
		setLastTenYears(lastTenYears)
    }, [])

    useEffect(() => {
        getFinanceReport()
    }, [year, selectedOption])

    useEffect(() => {
        renderData()
        updateChartData()
    }, [report])

    const getFinanceReport = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(`/api/finance/getFinanceDetailsReportOfOutFlowAndInflowMonthWise/${year}`)
            setReport(response.data.data)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert("Failed to get data!!!")
        }
    }

    const updateChartData = () => {
        if(isLoading) return
        if(!report) return
        const { outflow, inflow } = report
        const outflowkeys = Object.keys(outflow)
        const inflowkeys = Object.keys(inflow)

        if(outflowkeys.length <= 0 && inflowkeys.length <= 0){
            setInflowChartData({})
            setOutflowChartData({})
            alert("No data found")
            return
        }
        if(outflowkeys.length <= 0){
            setOutflowChartData({})
        }

        if(inflowkeys.length <= 0){
            setInflowChartData({})
        }

        const rowsToShowOutflow = getRowsToShow(outflow, "number")
        const rowsToShowInflow = getRowsToShow(inflow, "number")

        let columnNamesInflow = [];
		for (const obj of rowsToShowInflow)
            columnNamesInflow.push(...Object.keys(obj))

		columnNamesInflow = [...new Set(columnNamesInflow)];
		columnNamesInflow.splice(columnNamesInflow.indexOf("month"), 1);

        let columnNamesOutflow = [];
		for (const obj of rowsToShowOutflow)
            columnNamesOutflow.push(...Object.keys(obj))

		columnNamesOutflow = [...new Set(columnNamesOutflow)];
		columnNamesOutflow.splice(columnNamesOutflow.indexOf("month"), 1);

        const getDataSet = (rows, columns, type) => {
            const getValues = (row, columnNames) => {
                const values = columnNames.map(key => row[key] ? row[key] : 0)
                return values
            }

            const datasets = rows.map((row, i) => {
                return {
                    id: i + 1,
                    label: row.month,
                    data: getValues(row, columns),
                    borderColor: type === "outflow" ? `rgb(255, 0, 0)` : `rgb(118, 185, 0)`,
                    backgroundColor: type === "outflow" ? `rgb(255, 0, 0, 0.5)` : `rgb(118, 185, 0, 0.5)`
                }
            })
            const finalData = { labels: columns, datasets }
            return finalData
        }

        setInflowChartData(getDataSet(rowsToShowInflow, columnNamesInflow, "inflow"))
        setOutflowChartData(getDataSet(rowsToShowOutflow, columnNamesOutflow, "outflow"))
    }

    const renderData = async () => {
        if(isLoading) return
        if(!report) return 
        
        const { outflow, inflow } = report
        const outflowkeys = Object.keys(outflow)
        const inflowkeys = Object.keys(inflow)

        if(outflowkeys.length <= 0 && inflowkeys.length <= 0){
            setTableInflowRows([])
            setTableInflowsColumns([])
            setTableOutflowRows([])
            setTableOutflowsColumns([])
            alert("No data found")
            return
        }
        
        const columnsToShow = [
            {field: "month", headerName: "Months", flex: 1},
            {field: "USD", headerName: "USD",flex: 1, type: 'number'},
            {field: "UZS", headerName: "UZS", flex: 1, type: 'number'}
        ]

        const rowsToShowOutflow = getRowsToShow(outflow, "currency")
        const rowsToShowInflow = getRowsToShow(inflow, "currency")
        
        setTableInflowRows(rowsToShowInflow)
        setTableInflowsColumns(columnsToShow)
        setTableOutflowRows(rowsToShowOutflow)
        setTableOutflowsColumns(columnsToShow)
        setOutflowColumnGroup(getColumnGroupModel("Outflow"))
        setInflowColumnGroup(getColumnGroupModel("Inflow"))
        if(selectedOption === "Summary"){
            setIsOutflowTableLoaded(true)
            setIsInflowTableLoaded(true)
        }else if(selectedOption === "Inflow"){
            setIsOutflowTableLoaded(false)
            setIsInflowTableLoaded(true)
        }else if(selectedOption === "Outflow"){
            setIsOutflowTableLoaded(true)
            setIsInflowTableLoaded(false)
        }
    }

    const renderChart = (chartData) => {
		switch (selectedChart) {
			case 'verticalbar':
				return <VerticalBar data={chartData} title={selectedOption} />
			case 'horizontalbar':
				return <HorizontalBar data={chartData} title={selectedOption} />
			case 'line':
				return <LineChart data={chartData} title={selectedOption} />
			case 'stackedbarvertical':
				return <StackedBar data={chartData} title={selectedOption} vertical={true} />
			case 'stackedbarhorizontal':
				return <StackedBar data={chartData} title={selectedOption} vertical={false} />
			default:
				return null
		}
	}

    const getRowsToShow = (arr, dataType) => {
        if(arr.length <= 0) return []
        const rowsToShow = []
        const uniqueMonths = getUniqueMonths(arr)
        for (const month of uniqueMonths) {
            let row = { "USD": 0, "UZS": 0 }
            for (const obj of arr) {
                const { received_in } = obj
                const shorthenMonth = ShortenMonths.find(monthObj => monthObj[month])
                const month__ = shorthenMonth[month]
                row["month"] = month__
                if(month in obj && received_in === "USD"){
                    row["USD"] = parseFloat(obj[month])
                }else if(month in obj && received_in === "UZS"){
                    row["UZS"] = parseFloat(obj[month])
                }
            }
            rowsToShow.push(row)
        }

        const totalRow = rowsToShow.reduce((acc, obj) => {
            const keys = Object.keys(obj)
            keys.splice(keys.indexOf("month"), 1)
            keys.forEach(key => {
                if (!acc[key]) acc[key] = 0
                acc[key] += parseFloat(obj[key])
            })
            return acc
        }, {})
        if(dataType === "currency") rowsToShow.push({ month: "Total", ...totalRow })

        const sortedData = sortByMonth(rowsToShow)
        const updatedRows = sortedData.map(obj => {
            const { USD, UZS, month } = obj
            return { month, 
                USD: dataType === "number" ? USD : getFormattedCurrency(USD, "USD"), 
                UZS: dataType === "number" ? UZS : getFormattedCurrency(UZS, "UZS") 
            }
        })
        
        return updatedRows
    }

    const sortByMonth = (arr) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Total"]
        arr.sort(function(a, b){
            return months.indexOf(a.month) - months.indexOf(b.month)
        })
        return arr
    }

    const getFormattedCurrency = (amount, locale) => {
        const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'})
        const UZS = new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS'})
        if(locale === "USD") return USD.format(amount)
        else if(locale === "UZS") return UZS.format(amount)
        else return 0
    }

    const getUniqueMonths = (arr) => {
        const allKeys = []
        for (const obj of arr) {
            allKeys.push(...Object.keys(obj))
        }
        const uniqueKeys = [...new Set(allKeys)]
        uniqueKeys.splice(uniqueKeys.indexOf("received_in"), 1)
        return uniqueKeys
    }

    const getColumnGroupModel = (title) => {
        const columnGroupingModel = [
            {
                groupId: 'months',
                headerName: "",
                children: [{field: "month"}]
            },
            {
                groupId: title,
                headerAlign: 'center',
                children: [{field: "USD"}, {field: "UZS"}]
            }
        ]

        return columnGroupingModel
    }

    return(
        <>
            {inflowEnlargeChart && <ChartSection>
				<ChartContainer>
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12} p={2}>
						<CloseButton fontSize="large" onClick={() => setInflowEnlargeChart(false)} />
						{renderChart(inflowChartData)}
					</Grid>
				</ChartContainer>
			</ChartSection>
			}

            {outflowEnlargeChart && <ChartSection>
				<ChartContainer>
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12} p={2}>
						<CloseButton fontSize="large" onClick={() => setOutflowEnlargeChart(false)} />
						{renderChart(outflowChartData)}
					</Grid>
				</ChartContainer>
			</ChartSection>
			}

            <Grid container spacing={2} sx={{ zIndex: 3 }} mb={3}>
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ zIndex: 3 }}>
					<Grid container columnGap={1} rowGap={2} >
						<Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
							<FormControl size="medium" fullWidth>
								<InputLabel>Finance</InputLabel>
								<Select size="medium" name="graph" value={selectedOption} label="Graph"
									onChange={(e) => setSelectedOption(e.target.value)}>
									{FilterOptions.map((obj, index) => (
										<MenuItem key={index} value={obj.value}>
											{obj.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <FormControl size="medium" fullWidth>
                                <InputLabel>Year</InputLabel>
                                <Select size="medium" name="year" value={year} label="Year"
                                    onChange={(e) => setYear(e.target.value)}>
                                    {lasttenYears.map((year, index) => (
                                        <MenuItem key={index} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
							<FormControl size="medium" fullWidth>
								<InputLabel>Chart</InputLabel>
								<Select size="medium" name="chart" value={selectedChart} label="Chart"
									onChange={(e) => setSelectedChart(e.target.value)}>
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
			</Grid>

            {isInflowTableLoaded && 
            <Grid container spacing={2}>
				<Grid item xs={12}>
					<Grid container width="100%">
						<Grid item xs={12} md={6} p={2} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
							{Object.keys(inflowChartData).length > 0 && <EnlargeChartIcon fontSize="medium" onClick={() => setInflowEnlargeChart(!inflowEnlargeChart)} />}
							{Object.keys(inflowChartData).length > 0 ? renderChart(inflowChartData) : <h2>No Data found</h2>}
						</Grid>
						<Grid item xs={12} md={6}>
                            <GridIndex  rows={tableInflowRows} 
                                columns={tableInflowsColumns}
                                getRowId={row => row.month}
                                experimentalFeatures={{ columnGrouping: true }}
                                columnGroupingModel={inflowColumnGroup}/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>}

            {isOutflowTableLoaded && 
            <Grid container spacing={2}>
				<Grid item xs={12}>
					<Grid container width="100%">
						<Grid item xs={12} md={6} p={2} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
							{Object.keys(outflowChartData).length > 0 && <EnlargeChartIcon fontSize="medium" onClick={() => setOutflowEnlargeChart(!outflowEnlargeChart)} />}
							{Object.keys(outflowChartData).length > 0 ? renderChart(outflowChartData) : <h2>No Data found</h2>}
						</Grid>
						<Grid item xs={12} md={6}>
                            <GridIndex  rows={tableOutflowRows} 
                                columns={tableOutflowsColumns}
                                getRowId={row => row.month}
                                experimentalFeatures={{ columnGrouping: true }}
                                columnGroupingModel={outflowColumnGroup}/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>}
        </>
    )
}

export default InflowOutflowPage