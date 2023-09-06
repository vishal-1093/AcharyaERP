import { useState, useEffect } from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import GridIndex from "../../components/GridIndex";
import axios from "../../services/Api";
import DropdownDownSearch from "./DropdownSearch";
import { HorizontalBar, LineChart1 } from "./Chart";

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
];
const DEFAULT_GRAPH = "EmployeeType";

const ChartsTest = () => {
	const setCrumbs = useBreadcrumbs()
	const [selectedGraph, setSelectedGraph] = useState(DEFAULT_GRAPH);
	const [selectedSchools, setSelectedSchools] = useState([])
	const [data, setData] = useState([]);
	const [schoolNameList, setSchoolNameList] = useState([]);
	const [year, setYear] = useState(2016)
	const [yearOptions, setYearOptions] = useState([])
	const [tableRows, setTableRows] = useState([])
	const [tableColumns, setTableColumns] = useState([])
	const [chartData, setChartData] = useState({})

  	useEffect(() => {
		setCrumbs([])
		let lastTenYears = []
		const currentYear = new Date().getFullYear();
		for (let year = currentYear - 10; year <= currentYear; year++) lastTenYears.push(year)
		setYearOptions(lastTenYears)
	}, [])

	useEffect(() => {
		if (selectedGraph === "Department") handleApiCall("/api/employee/getEmployeeDetailsForReportOnDepartment")
		else if (selectedGraph === "Designation") handleApiCall("/api/employee/getEmployeeDetailsForReportOnDesignation")
		else if (selectedGraph === "Gender") handleApiCall("/api/employee/getEmployeeDetailsForReportOnGender")
		else if (selectedGraph === "AgeGroup") handleApiCall("/api/employee/getEmployeeDetailsForReportOnDateOfBirth")
		else if (selectedGraph === "JoiningDate") handleApiCall(`/api/employee/getEmployeeDetailsForReportOnMonthWiseOfJoiningYear/${year}`)
		else if (selectedGraph === "ExitingDate") handleApiCall(`/api/employee/getEmployeeRelievingReportDataOnMonthWiseInactiveData/${year}`)
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
		updateTable()
		updateChart()
	}, [selectedSchools])

	const handleApiCall = async api => {
		await axios.get(api)
		.then((res) => {
			const response = res.data.data
			if(response.length <= 0) return alert("No Data found")
			setData(response)
			const schoolList = response.map(obj => {
				return {value: obj.school_name_short, label: obj.school_name_short}
			})
			setSelectedSchools(prev => [...prev, schoolList[0].value])
			setSchoolNameList(schoolList)
		})
		.catch((err) => console.error(err))
	}

	const handleSchoolCompare = selectedSchool => {
        const schoolIds = selectedSchool.map(obj => {
            if(obj.value !== schoolNameList[0].value) return obj.value
            else return ''
        }).filter(Boolean)
        setSelectedSchools([...schoolIds, schoolNameList[0].value])
    }

	const updateTable = () => {
		const rowsToShow = data.filter(obj => selectedSchools.includes(obj.school_name_short))
		let columnNames = [];
		for (const obj of rowsToShow)
			columnNames.push(...Object.keys(obj))

		columnNames = [...new Set(columnNames)];
		// columnNames.splice(columnNames.indexOf("school"), 1);
		columnNames.splice(columnNames.indexOf("school_name_short"), 1);

		let columns = [{ field: "school_name_short", headerName: "School", flex: 1}]
		for (const key of columnNames) 
			columns.push({ field: key, headerName: key, flex: 1})
	
		setTableColumns(columns)
		setTableRows(rowsToShow);
	}

	const updateChart = () => {
		const random_rgb = () => {
			let o = Math.round, r = Math.random, s = 255;
			return {r: o(r()*s), g: o(r()*s), b: o(r()*s)}
		}

		const getValues = (row, columnNames) => {
			// const keys = Object.keys(row)
			// keys.splice(keys.indexOf("school_name_short"), 1)
			// console.log(keys, "keys");
			const values = columnNames.map(key => row[key] ? row[key] : 0)
			console.log(values, "Key values");
			return values
		}

		const rowsToShow = data.filter(obj => selectedSchools.includes(obj.school_name_short))
		console.log(rowsToShow, "Rows to show");
		let columnNames = [];
		for (const obj of rowsToShow)
			columnNames.push(...Object.keys(obj))

		columnNames = [...new Set(columnNames)];
		columnNames.splice(columnNames.indexOf("school_name_short"), 1);
		
		const datasets = rowsToShow.map((row, i) => {
			const { r, g, b } = random_rgb()
			return {
				id: i + 1,
				label: row.school_name_short,
				data: getValues(row, columnNames),
				borderColor: `rgb(${r}, ${g}, ${b})`, 
				backgroundColor: `rgb(${r}, ${g}, ${b}, 0.5)`
			}
		})
		const finalData = {labels: columnNames, datasets}
		console.log(finalData)
		setChartData(finalData)
	}

	return(<>
		<Grid container alignItems="center" justifyContent="space-between" spacing={2} >
			<Grid item xs={12} sm={6} md={6} sx={{ zIndex: 3 }}>
				<Grid container columnGap={1} alignItems="center" justifyContent="center" >
					<Grid item flex={1}>
						<FormControl size="small" fullWidth>
							<InputLabel>Graph</InputLabel>
							<Select size="small" name="graph" value={selectedGraph} label="Graph"
								onChange={(e) => setSelectedGraph(e.target.value)}>
								{graphOptions.map((obj, index) => (
									<MenuItem key={index} value={obj.value}>
										{obj.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					{selectedGraph === "JoiningDate" || selectedGraph === "ExitingDate" && (
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
				{schoolNameList.length > 0 && 
				<DropdownDownSearch isSearchable isMulti placeHolder="Select school" options={schoolNameList}
					onChange={value => handleSchoolCompare(value)} selectedSchoolId={schoolNameList[0].value}/>
				}
			</Grid>
			<Grid item xs={12}>
          		<Grid container width="100%">
				  	<Grid item xs={12} md={6} p={2}>
						{Object.keys(chartData).length > 0 ? <HorizontalBar data={chartData} title={selectedGraph}/> : null}
						{Object.keys(chartData).length > 0 ? <LineChart1 data={chartData} title={selectedGraph}/> : null}
					</Grid>
					<Grid item xs={12} md={6} p={2}>
						<GridIndex rows={tableRows} columns={tableColumns} getRowId={row => row.school_name_short} />
					</Grid>
				</Grid>
		  	</Grid>
		</Grid>
	</>)
}

export default ChartsTest