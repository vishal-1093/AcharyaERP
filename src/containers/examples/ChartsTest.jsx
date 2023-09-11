import { useState, useEffect } from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import GridIndex from "../../components/GridIndex";
import axios from "../../services/Api";
import DropdownDownSearch from "./DropdownSearch";
import { HorizontalBar, LineChart, StackedBar, VerticalBar } from "./Chart";
import styled from "@emotion/styled";
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseIcon from '@mui/icons-material/Close';
import CheckboxAutocomplete from "../../components/Inputs/CheckboxAutocomplete";

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

const CloseButton = styled(CloseIcon)`
	position: absolute;
	right: 33px;
	top: 20px;
	color: #132353;
	cursor: pointer;
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

const graphOptions = [
  { value: "Department", label: "Department" },
  { value: "Designation", label: "Designation" },
  { value: "Gender", label: "Gender" },
  { value: "AgeGroup", label: "AgeGroup" },
  { value: "JoiningDate", label: "JoiningDate" },
  { value: "ExitingDate", label: "ExitingDate" },
  { value: "MaritalStatus", label: "MaritalStatus" },
  { value: "JobType", label: "JobType" },
  { value: "Shift", label: "Shift" },
  { value: "EmployeeType", label: "EmployeeType" },
]

const ChartOptions = [
	{value: "verticalbar", label: "Vertical Bar"},
	{value: "horizontalbar", label: "Horizontal Bar"},
	{value: "stackedbarvertical", label: "Stacked Bar(Vertical)"},
	{value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)"},
	{value: "line", label: "Line"},
]

const ShortenMonths = [
	{"January": "Jan"},
	{"February": "Feb"},
	{"March": "Mar"},
	{"April": "Apr"},
	{"May": "May"},
	{"June": "Jun"},
	{"July": "Jul"},
	{"August": "Aug"},
	{"September": "Sep"},
	{"October": "Oct"},
	{"November": "Nov"},
	{"December": "Dec"}
]

const DEFAULT_GRAPH = "JobType"
const DEFAULT_CHART = "horizontalbar"

const ChartsTest = () => {
	const setCrumbs = useBreadcrumbs()
	const [selectedGraph, setSelectedGraph] = useState(DEFAULT_GRAPH)
	const [selectedChart, setSelectedChart] = useState(DEFAULT_CHART)
	const [selectedSchools, setSelectedSchools] = useState([])
	const [data, setData] = useState([]);
	const [schoolNameList, setSchoolNameList] = useState([]);
	const [year, setYear] = useState(2023)
	const [yearOptions, setYearOptions] = useState([])
	const [tableRows, setTableRows] = useState([])
	const [tableColumns, setTableColumns] = useState([])
	const [chartData, setChartData] = useState({})
	const [schoolColorsArray, setSchoolColorsArray] = useState([])
	const [addAllSchool, setAddAllSchool] = useState(false)
	const [selectedParam, setSelectedParam] = useState("")
	const [paramList, setParamList] = useState([])
	const [enlargeChart, setEnlargeChart] = useState(false)
	
  	useEffect(() => {
		getSchoolColors()
		setCrumbs([])
		let lastTenYears = []
		const currentYear = new Date().getFullYear();
		for (let year = currentYear - 10; year <= currentYear; year++) lastTenYears.push(year)
		setYearOptions(lastTenYears)
		setYear(lastTenYears[lastTenYears.length - 1])
	}, [])

	useEffect(() => {
		if (selectedGraph === "Department") handleApiCall("/api/employee/getEmployeeDetailsForReportOnDepartment")
		else if (selectedGraph === "Designation") handleApiCall("/api/employee/getEmployeeDetailsForReportOnDesignation")
		else if (selectedGraph === "Gender") handleApiCall("/api/employee/getEmployeeDetailsForReportOnGender")
		else if (selectedGraph === "AgeGroup") handleApiCall("/api/employee/getEmployeeDetailsForReportOnDateOfBirth")
		else if (selectedGraph === "JoiningDate") handleApiCall(`/api/employee/getEmployeeDetailsForReportOnMonthWiseOfJoiningYear/${year}`)
		else if (selectedGraph === "ExitingDate") handleApiCall(`/api/employee/getEmployeeRelievingReportDataOnMonthWise/${year}`)
		else if (selectedGraph === "Schools") handleApiCall("/api/employee/getEmployeeDetailsForReportOnSchools")
		else if (selectedGraph === "ExperienceInMonth") handleApiCall("/api/employee/getEmployeeDetailsForReportOnExperienceInMonth")
		else if (selectedGraph === "ExperienceInYear") handleApiCall("/api/employee/getEmployeeDetailsForReportOnExperienceInYear")
		else if (selectedGraph === "MaritalStatus") handleApiCall("/api/employee/getEmployeeDetailsForReportOnMaritalStatus")
		else if (selectedGraph === "JobType") handleApiCall("/api/employee/getEmployeeDetailsForReportOnJobType")
		else if (selectedGraph === "Shift") handleApiCall("/api/employee/getEmployeeDetailsForReportOnShift")
		else if (selectedGraph === "EmployeeType") handleApiCall("/api/employee/getEmployeeDetailsForReportOnEmployeeType")
	}, [selectedGraph, year])

	useEffect(() => {
		if(selectedSchools.length <= 0) return

		if(selectedParam === "All"){
			updateTable(data)
			updateChart(data)
		}else handleOnParamChange()
	}, [selectedSchools, selectedParam])

	const handleOnParamChange = () => {
		const selectedParamData = []
		const duplicateData = [...data]
		for (const obj of duplicateData) {
			const keys = Object.keys(obj)
			let newObj = {}
			keys.forEach(key => {
				if(key === "school_name_short" || key === selectedParam){
					newObj[key] = obj[key]
				}
			})
			selectedParamData.push(newObj)
		}
		updateTable(selectedParamData)
		updateChart(selectedParamData)
	}

	const getSchoolColors = async () => {
		await axios.get(`/api/institute/fetchAllSchoolDetail?page=${0}&page_size=${10000}&sort=created_date`)
		.then((Response) => {
			const response = Response.data.data
			const schoolColorsArray = response.map(obj => {
				let borderColor = ''
				let backgroundColor = ''
				const { school_color, school_name_short } = obj
				if(school_color === '' || school_color === undefined || school_color === null){
					const { r, g, b } = random_rgb()
					borderColor = `rgb(${r}, ${g}, ${b})`
					backgroundColor = `rgb(${r}, ${g}, ${b}, 0.5)`
				}else{
					borderColor = school_color
					backgroundColor = `${school_color}80`
				}

				return {borderColor, backgroundColor, schoolName: school_name_short}
			})

			setSchoolColorsArray(schoolColorsArray)
		})
		.catch((err) => console.error(err));
	}

	const handleApiCall = async api => {
		await axios.get(api)
		.then(async (res) => {
			const response = res.data.data
			if(response.length <= 0) return alert("No Data found")
			let modifiedResponse = response
			if(selectedGraph === "JoiningDate" || selectedGraph === "ExitingDate"){
				modifiedResponse = await trimMonthTo3Letters(response)
			}
			updateParamList(modifiedResponse)
			setData(modifiedResponse)
			const schoolList = modifiedResponse.map(obj => {
				return {value: obj.school_name_short, label: obj.school_name_short}
			})
			setSelectedSchools(prev => {
				const previousSelectedSchools = [...prev]
				const schools__ = schoolList.filter(sc => previousSelectedSchools.includes(sc.value))
				return [schoolList[0].value, ...schools__.map(obj => obj.value)]
			})
			setSchoolNameList(schoolList)
		})
		.catch((err) => console.error(err))
	}

	const trimMonthTo3Letters = (response) => {
		return new Promise(resolve => {
			const modifiedResponse = []
			for (const obj of response) {
				const keys = Object.keys(obj)
				let newObj = {}
				keys.forEach(key => {
					if(key === "school_name_short") newObj[key] = obj[key]
					else{
						const newKeyObj = ShortenMonths.find(monthObj => monthObj[key])
						const newKey = newKeyObj[key]
						newObj[newKey] = obj[key]
					}
				})
				modifiedResponse.push(newObj)
			}
			resolve(modifiedResponse)
		})
	}

	const updateParamList = response => {
		const params = []
		for (const obj of response) {
			const keys = Object.keys(obj)
			params.push(keys)
		}
		const uniqueParams = [...new Set(params.flat())]
		const list = [{value: "All", label: "All"}]
		for (const value of uniqueParams){
			if(value !== "school_name_short"){
				list.push({value, label: value})
			}
		}
		setParamList(list)
		setSelectedParam("All")
	}

	const handleSchoolCompare = selectedSchool => {
        const schoolIds = selectedSchool.map(obj => {
            if(obj.value !== schoolNameList[0].value) return obj.value
            else return ''
        }).filter(Boolean)
        setSelectedSchools([...schoolIds, schoolNameList[0].value])
    }

	const updateTable = (dataArray) => {
		const rowsToShow = []
		const sortedData = [...dataArray].sort(function (a, b) {
			return Object.keys(b).length - Object.keys(a).length;
		})
		for (const obj of sortedData) {
			if(selectedSchools.includes(obj.school_name_short)){
				// Add total to each row
				let total = 0
				const keys = Object.keys(obj)
				keys.splice(keys.indexOf("school_name_short"), 1)
				keys.forEach(key => {
					total += obj[key]
				})
				rowsToShow.push({...obj, "Total": total}) 
			}
		}
		// Show bottom Total row only if more than 1 school
		if(rowsToShow.length > 1){
			const totalRow = rowsToShow.reduce((acc, obj) => {
				const keys = Object.keys(obj)
				keys.splice(keys.indexOf("school_name_short"), 1)
				keys.forEach(key => {
					if(!acc[key]) acc[key] = 0
					acc[key] += obj[key]
				})
				return acc
			}, {})
			rowsToShow.push({school_name_short: "Total", ...totalRow})
		}
		
		let columnNames = [];
		for (const obj of rowsToShow)
			columnNames.push(...Object.keys(obj))

		columnNames = [...new Set(columnNames)];
		columnNames.splice(columnNames.indexOf("school_name_short"), 1);

		let columns = [{ field: "school_name_short", headerName: "School", flex: 1}]
		for (const key of columnNames) 
			columns.push({ field: key, headerName: key, flex: 1, type: 'number'})
	
		setTableColumns(columns)
		setTableRows(rowsToShow);
	}

	const updateChart = (dataArray) => {
		const getValues = (row, columnNames) => {
			const values = columnNames.map(key => row[key] ? row[key] : 0)
			return values
		}

		const rowsToShow = dataArray.filter(obj => selectedSchools.includes(obj.school_name_short))
		let columnNames = [];
		for (const obj of rowsToShow)
			columnNames.push(...Object.keys(obj))

		columnNames = [...new Set(columnNames)];
		columnNames.splice(columnNames.indexOf("school_name_short"), 1);
		
		const datasets = rowsToShow.map((row, i) => {
			const schoolColorObj = schoolColorsArray.find(obj => obj.schoolName === row.school_name_short)
			const { r, g, b } = random_rgb()
			return {
				id: i + 1,
				label: row.school_name_short,
				data: getValues(row, columnNames),
				borderColor: schoolColorObj ? schoolColorObj.borderColor : `rgb(${r}, ${g}, ${b})`, 
				backgroundColor: schoolColorObj ? schoolColorObj.backgroundColor :`rgb(${r}, ${g}, ${b}, 0.5)`
			}
		})
		const finalData = {labels: columnNames, datasets}
		setChartData(finalData)
	}

	const random_rgb = () => {
		let o = Math.round, r = Math.random, s = 255;
		return {r: o(r()*s), g: o(r()*s), b: o(r()*s)}
	}

	const handleAddAllSchool = (e) => {
		const checked = e.target.checked
		if(checked){
			setAddAllSchool(true)
			const schools = schoolNameList.map(obj => obj.value)
			setSelectedSchools(schools)
		}else{
			setAddAllSchool(false)
			if(selectedSchools.length <= 1) return
			setSelectedSchools([schoolNameList[0].value])
		}
	}

	const handleAddAllSchool__ = () => {
		const schools = schoolNameList.map(obj => obj.value)
		setSelectedSchools(schools)
	}

	const handleRemoveAllSchool = () => {
		// if(selectedSchools.length <= 1) return
		setSelectedSchools([schoolNameList[0].value])
	}

	const renderChart = () => {
		switch (selectedChart) {
			case 'verticalbar':
				return <VerticalBar data={chartData} title={selectedGraph}/>
			case 'horizontalbar':
				return <HorizontalBar data={chartData} title={selectedGraph}/>
			case 'line':
				return <LineChart data={chartData} title={selectedGraph}/>
			case 'stackedbarvertical':
				return <StackedBar data={chartData} title={selectedGraph} vertical={true}/>
			case 'stackedbarhorizontal':
				return <StackedBar data={chartData} title={selectedGraph} vertical={false}/>
			default:
				return null
		}
	}

	return(<>
		<Grid container alignItems="center" justifyContent="space-between" pt={3} rowGap={4}>
			{enlargeChart && <ChartSection>
				<ChartContainer>
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12} p={2}>
					<CloseButton fontSize="large" onClick={() => setEnlargeChart(false)} />
					{renderChart()}
				</Grid>
				</ChartContainer>
			</ChartSection>
			}
			<Grid container spacing={2} sx={{ zIndex: 3 }}>
				<Grid item xs={12} sm={6} md={6} sx={{ zIndex: 3 }}>
					<Grid container columnGap={1} alignItems="center" justifyContent="center" >
						<Grid item flex={1}>
							<FormControl size="small" fullWidth>
								<InputLabel>Graph</InputLabel>
								<Select size="large" name="graph" value={selectedGraph} label="Graph"
									onChange={(e) => setSelectedGraph(e.target.value)}>
									{graphOptions.map((obj, index) => (
										<MenuItem key={index} value={obj.value}>
											{obj.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{(selectedGraph === "JoiningDate" || selectedGraph === "ExitingDate") && (
							<Grid item xs={4} sx={{ zIndex: 3 }}>
								<FormControl size="small" fullWidth>
								<InputLabel>Year</InputLabel>
								<Select size="small" name="year" value={year} label="Year"
									onChange={(e) => setYear(e.target.value)}>
										{yearOptions.map((year, index) => (
										<MenuItem key={index} value={year}>
											{year}
										</MenuItem>
										))}
								</Select>
								</FormControl>
							</Grid>
						)}
					</Grid>
				</Grid>
				<Grid item xs={12} sm={6} md={6} sx={{ zIndex: 3 }}>
					{/* {schoolNameList.length > 0 && 
					<DropdownDownSearch isSearchable isMulti placeHolder="Select school" options={schoolNameList}
						onChange={value => handleSchoolCompare(value)} selectedSchoolId={schoolNameList[0].value}
						selectedSchools={selectedSchools}/>
					} */}
					{/* <Grid item xs={12} sm={6} md={6}> */}
						<CheckboxAutocomplete
							name="schoolName"
							label="Schools"
							value={selectedSchools}
							options={schoolNameList}
							handleChangeAdvance={(name, newValue) => setSelectedSchools(newValue)}
							handleSelectAll={handleAddAllSchool__}
							handleSelectNone={handleRemoveAllSchool}
							required
						/>
                	{/* </Grid> */}
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				{/* <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
					<FormControlLabel
						control={<Checkbox onChange={handleAddAllSchool} checked={addAllSchool} />} 
						label="Select All Schools"
					/>
				</Grid> */}
				<Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
					<FormControl size="small" fullWidth>
						<InputLabel>Chart</InputLabel>
						<Select size="small" name="chart" value={selectedChart} label="Chart"
							onChange={(e) => setSelectedChart(e.target.value)}>
							{ChartOptions.map((obj, index) => (
								<MenuItem key={index} value={obj.value}>
									{obj.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
					<FormControl size="small" fullWidth>
						<InputLabel>Parameters</InputLabel>
						<Select size="small" name="parameters" value={selectedParam} label="Parameters"
							onChange={(e) => setSelectedParam(e.target.value)}>
							{paramList.map((obj, index) => (
								<MenuItem key={index} value={obj.value}>
									{obj.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Grid container width="100%">
						<Grid item xs={12} md={6} p={2} style={{position: "relative"}}>
							{Object.keys(chartData).length > 0 && <EnlargeChartIcon fontSize="medium" onClick={() => setEnlargeChart(!enlargeChart)} />}
							{Object.keys(chartData).length > 0 ? renderChart() : null}
						</Grid>
						<Grid item xs={12} md={6} pt={10}>
							<GridIndex rows={tableRows} columns={tableColumns} getRowId={row => row.school_name_short} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	</>)
} 

export default ChartsTest