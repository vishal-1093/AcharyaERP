import React, { lazy, useEffect, useState } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import axios from "../../../../services/Api"
import { Box, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material"
import styled from "@emotion/styled";
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseIcon from '@mui/icons-material/Close';
import { HorizontalBar, LineChart, StackedBar, VerticalBar } from "../Chart"
import moment from "moment";
import { IOSSwitch } from "../IOSSwitch";
import ClearIcon from '@mui/icons-material/Clear';
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

const GraphOptions = [
    { value: "Institute", label: "Institute" },
    { value: "Year Wise", label: "Year Wise" },
    { value: "Day Wise", label: "Day Wise" },
    { value: "Programme", label: "Programme" },
    // { value: "Gender", label: "Gender" },
    { value: "GeoLocation", label: "GeoLocation" },
    { value: "AdmissionCategory", label: "Admission Category" },
]

const ChartOptions = [
    { value: "verticalbar", label: "Vertical Bar" },
    { value: "horizontalbar", label: "Horizontal Bar" },
    { value: "stackedbarvertical", label: "Stacked Bar(Vertical)" },
    { value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)" },
    { value: "line", label: "Line" },
]

const MonthOptions = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
]

const DEFAULT_CHART = "horizontalbar"
const DEFAULT_SELECTEDGRAPH = "Institute"
const DEFAULT_MONTH = new Date().getMonth() + 1
const DEFAULT_YEAR = new Date().getFullYear()

const AdmissionPage = () => {
    const setCrumbs = useBreadcrumbs()
    const [loading, setLoading] = useState(true)
    const [tableRows, setTableRows] = useState([])
    const [tableColumns, setTableColumns] = useState([])
    const [chartData, setChartData] = useState({})
    const [academicYears, setAcademicYears] = useState([])
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("")
    const [selectedGraph, setSelectedGraph] = useState(DEFAULT_SELECTEDGRAPH)
    const [selectedChart, setSelectedChart] = useState(DEFAULT_CHART)
    const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH)
    const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR)
    const [yearOptions, setYearOptions] = useState([])
    const [enlargeChart, setEnlargeChart] = useState(false)
    const [schoolColorsArray, setSchoolColorsArray] = useState([])
    const [isTableView, setIsTableView] = useState(true)
    const [instituteList, setInstituteList] = useState([])
    const [selectedInstitute, setSelectedInstitute] = useState("")
    const [allCountryList, setAllCountryList] = useState([])
    const [countryList, setCountryList] = useState([])
    const [stateList, setstateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [selectedCountry, setSlectedCountry] = useState("")
    const [selectedState, setSlectedState] = useState("")
    const [selectedCity, setSlectedCity] = useState("")

    useEffect(() => {
        setCrumbs([
            { name: "Charts Dashboard", link: "/charts-dashboard" },
            { name: "Admission" }
        ])
        getInstituteList()
        getSchoolColors()
        getAcademicYearList()
        getCountry()
    }, [])

    useEffect(() => {
        if (selectedCountry !== ""){
            let apiPath = "/api/misGeolocationWiseReport?"
            if (selectedAcademicYear !== "") apiPath = apiPath + `acYearId=${selectedAcademicYear}&`
            if (selectedInstitute !== "") apiPath = apiPath + `schoolId=${selectedInstitute}&`
            if (selectedCountry !== "") apiPath = apiPath + `countryId=${selectedCountry}&`
            handleApiCall(apiPath, handleGeoLocationWiseDataCountry)
        }else{
            let apiPath = "/api/misGeolocationWiseReport?"
            if (selectedAcademicYear !== "") apiPath = apiPath + `acYearId=${selectedAcademicYear}&`
            if (selectedInstitute !== "") apiPath = apiPath + `schoolId=${selectedInstitute}&`
            handleApiCall(apiPath, handleGeoLocationWiseData)
        }
    }, [selectedCountry])

    useEffect(() => {
        if (selectedCountry !== ""){
            let apiPath = "/api/misGeolocationWiseReport?"
            if (selectedAcademicYear !== "") apiPath = apiPath + `acYearId=${selectedAcademicYear}&`
            if (selectedInstitute !== "") apiPath = apiPath + `schoolId=${selectedInstitute}&`
            if (selectedCountry !== "") apiPath = apiPath + `countryId=${selectedCountry}&`
            if (selectedState !== "") apiPath = apiPath + `stateId=${selectedState}&`
            handleApiCall(apiPath, handleGeoLocationWiseDataState)
        }else {
            setCityList([])
            setSlectedCity("")
        }
    }, [selectedState])

    useEffect(() => {
        if (selectedCountry !== "" && selectedState !== ""){
            let apiPath = "/api/misGeolocationWiseReport?"
            if (selectedAcademicYear !== "") apiPath = apiPath + `acYearId=${selectedAcademicYear}&`
            if (selectedInstitute !== "") apiPath = apiPath + `schoolId=${selectedInstitute}&`
            if (selectedCountry !== "") apiPath = apiPath + `countryId=${selectedCountry}&`
            if (selectedState !== "") apiPath = apiPath + `stateId=${selectedState}&`
            if (selectedCity !== "") apiPath = apiPath + `cityId=${selectedCity}&`
            handleApiCall(apiPath, handleGeoLocationWiseDataCity)
        }
    }, [selectedCity])

    useEffect(() => {
        if (selectedGraph !== '' && selectedAcademicYear !== '') {
            if (selectedGraph === "Institute") handleApiCall(`/api/misInstituteWiseReport?acYearId=${selectedAcademicYear}`, handleInstituteWiseData)
            else if (selectedGraph === "Year Wise") handleApiCall(`/api/misYearWiseReport`, handleYearWiseData)
            else if (selectedGraph === "Day Wise") handleApiCall(`/api/misDayWiseReport?month=${selectedMonth}&year=${selectedYear}`, handleDayWiseData)
            else if (selectedGraph === "Programme") handleApiCall(`/api/misProgramWiseReport?acYearId=${selectedAcademicYear}&schoolId=${selectedInstitute}`, handleProgrammeWiseData)
            else if (selectedGraph === "Gender") {
                if (selectedInstitute !== "") handleApiCall(`/api/misGenderWiseReport?schoolId=${selectedInstitute}&acYearId=${selectedAcademicYear}`, handleGenderWiseData)
                else handleApiCall(`/api/misGenderWiseReport`, handleGenderWiseData)
            }
            else if (selectedGraph === "GeoLocation") {
                let apiPath = "/api/misGeolocationWiseReport?"
                if (selectedAcademicYear !== "") apiPath = apiPath + `acYearId=${selectedAcademicYear}&`
                if (selectedInstitute !== "") apiPath = apiPath + `schoolId=${selectedInstitute}&`
                if (selectedCountry !== "") apiPath = apiPath + `countryId=${selectedCountry}&`

                if(selectedCountry !== "") handleApiCall(apiPath, handleGeoLocationWiseDataCountry)
                handleApiCall(apiPath, handleGeoLocationWiseData)
            }else if (selectedGraph === "AdmissionCategory"){
                handleApiCall(`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`, handleAdmissionCategory)
            }
        }
    }, [selectedGraph, selectedAcademicYear, selectedMonth, selectedYear, selectedInstitute])

    useEffect(() => {
        setSelectedAcademicYear(academicYears.length > 0 ? academicYears[0].ac_year_id : "")
        setTableColumns([])
        setTableRows([])
        setChartData({ labels: [], datasets: [] })
    }, [selectedGraph])

    const getInstituteList = () => {
        axios.get("/api/institute/school")
            .then(res => {
                setInstituteList(res.data.data.map(obj => {
                    return { label: obj.school_name_short, value: obj.school_id }
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }

    const getCountry = () => {
        axios(`/api/Country`)
            .then((res) => {
                setAllCountryList(
                    res.data.map((obj) => ({
                        value: obj.id,
                        label: obj.name,
                    }))
                );
            })
            .catch((err) => {
                console.error(err)
                setAllCountryList([])
            })
    }

    const getSchoolColors = async () => {
        await axios.get(`/api/institute/fetchAllSchoolDetail?page=${0}&page_size=${10000}&sort=created_date`)
            .then((Response) => {
                const response = Response.data.data
                const schoolColorsArray = response.map(obj => {
                    let borderColor = ''
                    let backgroundColor = ''
                    const { school_color, school_name_short } = obj
                    if (school_color === '' || school_color === undefined || school_color === null) {
                        const { r, g, b } = random_rgb()
                        borderColor = `rgb(${r}, ${g}, ${b})`
                        backgroundColor = `rgb(${r}, ${g}, ${b}, 0.5)`
                    } else {
                        borderColor = school_color
                        backgroundColor = `${school_color}80`
                    }

                    return { borderColor, backgroundColor, schoolName: school_name_short }
                })

                setSchoolColorsArray(schoolColorsArray)
            })
            .catch((err) => console.error(err));
    }

    const getAcademicYearList = () => {
        axios.get("/api/academic/academic_year")
            .then(res => {
                if (res.data.data.length <= 0) return

                const yearsObj = res.data.data.map(obj => {
                    const { ac_year, ac_year_code, ac_year_id, current_year } = obj
                    return { ac_year, ac_year_code, ac_year_id, current_year }
                })
                setAcademicYears(yearsObj)
                setSelectedAcademicYear(yearsObj.length > 0 ? yearsObj[0].ac_year_id : "")
                setYearOptions(yearsObj.map(obj => {
                    return { label: obj.current_year, value: obj.current_year }
                }))
            })
    }

    const handleApiCall = (path, callback) => {
        setLoading(true)
        axios.get(path)
            .then(res => {
                if (res.data.data.length <= 0) {
                    setTableColumns([])
                    setTableRows([])
                    setChartData({ labels: [], datasets: [] })
                    return
                }
                setLoading(false)
                callback(res.data.data);
            })
            .catch(err => {
                console.log(err)
                setTableColumns([])
                setTableRows([])
                setChartData({ labels: [], datasets: [] })
                setLoading(false)
            })
    }

    const handleInstituteWiseData = (data) => {
        const rowsToShow = []
        let studentEntryTotal = 0
        let lateralEntrytotal = 0
        let inActiveEntrytotal = 0
        let graduatesEntrytotal = 0
        let id = 0
        for (const obj of data) {
            const { school_name, Total } = obj
            rowsToShow.push({
                "id": id, "School": school_name, "Student Entry": obj["Student Entry"],
                "Lateral Entry": obj["Lateral Entry"],"InActive": obj["InActive"],"Graduates": obj["Graduates"], "Total": Total
            })
            studentEntryTotal += obj["Student Entry"]
            lateralEntrytotal += obj["Lateral Entry"]
            inActiveEntrytotal += obj["InActive"]
            graduatesEntrytotal += obj["Graduates"]
            id += 1
        }

        rowsToShow.push({
            "id": "last_row_of_table", "School": "Total", "Student Entry": studentEntryTotal,
            "Lateral Entry": lateralEntrytotal,"InActive" : inActiveEntrytotal,"Graduates" : graduatesEntrytotal,  "Total": lateralEntrytotal + studentEntryTotal
        })

        const columns = [
            { field: "School", headerName: "School", headerClassName: "header-bg", minWidth: 350, flex: 1 },
            { field: "Student Entry", headerName: "Regular", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Lateral Entry", headerName: "Lateral", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "InActive", headerName: "Cancellation", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Graduates ", headerName: "Graduates ", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Total", headerName: "Active", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)

        const datasets = [
            {
                id: 0,
                label: "Regular Entry",
                data: data.map(obj => obj["Student Entry"]),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Lateral Entry",
                data: data.map(obj => obj["Laternal Entry"]),
                borderColor: `rgb(153, 151, 228)`,
                backgroundColor: `rgb(153, 151, 228, 0.5)`
            }
        ]

        const finalData = { labels: data.map(obj => obj.school_name), datasets }
        setChartData(finalData)
    }

    const handleYearWiseData = data => {
        const rowsToShow = []
        let studentEntryTotal = 0
        let lateralEntrytotal = 0
        let inActiveEntrytotal = 0
        let graduatesEntrytotal = 0
        let id = 0
        for (const obj of data) {
            const { year, Total } = obj
            rowsToShow.push({
                "id": id, "Year": year, "Student Entry": obj["Student Entry"],
                "Lateral Entry": obj["Lateral Entry"],"InActive": obj["InActive"],"Graduates": obj["Graduates"], "Total": Total
            })
            studentEntryTotal += obj["Student Entry"]
            lateralEntrytotal += obj["Lateral Entry"]
            inActiveEntrytotal += obj["InActive"]
            graduatesEntrytotal += obj["Graduates"]
            id += 1
        }

        rowsToShow.push({
            "id": "last_row_of_table", "Year": "Total", "Student Entry": studentEntryTotal,
            "Lateral Entry": lateralEntrytotal,"InActive" : inActiveEntrytotal,"Graduates" : graduatesEntrytotal,  "Total": lateralEntrytotal + studentEntryTotal
        })

        const columns = [
            { field: "Year", headerName: "Year", headerClassName: "header-bg", minWidth: 350, flex: 1 },
            { field: "Student Entry", headerName: "Regular", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Lateral Entry", headerName: "Lateral", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "InActive", headerName: "Cancellation", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Graduates ", headerName: "Graduates ", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Total", headerName: "Active", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]
        setTableColumns(columns)
        setTableRows(rowsToShow)

        const datasets = [
            {
                id: 0,
                label: "Regular Entry",
                data: data.map(obj => obj["Student Entry"]),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Lateral Entry",
                data: data.map(obj => obj["Laternal Entry"]),
                borderColor: `rgb(153, 151, 228)`,
                backgroundColor: `rgb(153, 151, 228, 0.5)`
            }
        ]

        const finalData = { labels: data.map(obj => obj.year), datasets }
        setChartData(finalData)
    }

    const handleDayWiseData = data => {
        const rowsToShow = []
        let studentEntryTotal = 0
        let lateralEntrytotal = 0
        let id = 0
        for (const obj of data) {
            const { created_day, Total } = obj
            rowsToShow.push({
                "id": id, "Date": moment(created_day).format("DD-MM-YYYY"), "Student Entry": obj["Student Entry"],
                "Lateral Entry": obj["Laternal Entry"], "Total": Total
            })
            studentEntryTotal += obj["Student Entry"]
            lateralEntrytotal += obj["Laternal Entry"]
            id += 1
        }

        rowsToShow.push({
            "id": "last_row_of_table", "Date": "Total", "Student Entry": studentEntryTotal,
            "Lateral Entry": lateralEntrytotal, "Total": lateralEntrytotal + studentEntryTotal
        })

        const columns = [
            { field: "Date", headerName: "Date", flex: 1, headerClassName: "header-bg" },
            { field: "Student Entry", headerName: "Regular Entry", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Lateral Entry", headerName: "Lateral Entry", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)

        const datasets = [
            {
                id: 0,
                label: "Regular Entry",
                data: data.map(obj => obj["Student Entry"]),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Lateral Entry",
                data: data.map(obj => obj["Laternal Entry"]),
                borderColor: `rgb(153, 151, 228)`,
                backgroundColor: `rgb(153, 151, 228, 0.5)`
            }
        ]

        const finalData = { labels: data.map(obj => moment(obj.created_day).format("DD-MM-YYYY")), datasets }
        setChartData(finalData)
    }

    const handleProgrammeWiseData = (data) => {
        const rowsToShow = []
        let studentEntryTotal = 0
        let lateralEntrytotal = 0
        let id = 0
        for (const obj of data) {
            const { course, Total } = obj
            rowsToShow.push({
                "id": id, "course": course, "Student Entry": obj["Student Entry"],
                "Lateral Entry": obj["Laternal Entry"], "Total": Total
            })
            studentEntryTotal += obj["Student Entry"]
            lateralEntrytotal += obj["Laternal Entry"]
            id += 1
        }

        rowsToShow.push({
            "id": "last_row_of_table", "course": "Total", "Student Entry": studentEntryTotal,
            "Lateral Entry": lateralEntrytotal, "Total": lateralEntrytotal + studentEntryTotal
        })

        const columns = [
            { field: "course", headerName: "Course", flex: 1, headerClassName: "header-bg" },
            { field: "Student Entry", headerName: "Regular Entry", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Lateral Entry", headerName: "Lateral Entry", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)

        const datasets = [
            {
                id: 0,
                label: "Regular Entry",
                data: data.map(obj => obj["Student Entry"]),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Lateral Entry",
                data: data.map(obj => obj["Laternal Entry"]),
                borderColor: `rgb(153, 151, 228)`,
                backgroundColor: `rgb(153, 151, 228, 0.5)`
            }
        ]

        const finalData = { labels: data.map(obj => obj.course), datasets }
        setChartData(finalData)
    }

    const handleGenderWiseData = (data) => {
        const rowsToShow = []
        let studentEntryTotal = 0
        let lateralEntrytotal = 0
        let id = 0
        for (const obj of data) {
            const { candidate_sex, Total } = obj
            rowsToShow.push({
                "id": id, "sex": candidate_sex, "Student Entry": obj["Student Entry"],
                "Lateral Entry": obj["Laternal Entry"], "Total": Total
            })
            studentEntryTotal += obj["Student Entry"]
            lateralEntrytotal += obj["Laternal Entry"]
            id += 1
        }

        rowsToShow.push({
            "id": "last_row_of_table", "sex": "Total", "Student Entry": studentEntryTotal,
            "Lateral Entry": lateralEntrytotal, "Total": lateralEntrytotal + studentEntryTotal
        })

        const columns = [
            { field: "sex", headerName: "Sex", flex: 1, headerClassName: "header-bg" },
            { field: "Student Entry", headerName: "Regular Entry", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Lateral Entry", headerName: "Lateral Entry", flex: 1, type: 'number', headerClassName: "header-bg" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)

        const datasets = [
            {
                id: 0,
                label: "Regular Entry",
                data: data.map(obj => obj["Student Entry"]),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Lateral Entry",
                data: data.map(obj => obj["Laternal Entry"]),
                borderColor: `rgb(153, 151, 228)`,
                backgroundColor: `rgb(153, 151, 228, 0.5)`
            }
        ]

        const finalData = { labels: data.map(obj => obj.candidate_sex), datasets }
        setChartData(finalData)
    }

    const handleGeoLocationWiseData = (data) => {
        const rowsToShow = []
        let id_ = 0
        let totalCount = 0
        let countryId = []
        for (const obj of data) {
            const { name, Total, id } = obj
            if(id) countryId.push(id)
            rowsToShow.push({ "id": id_, "country": name, "Total": Total })
            id_ += 1
            totalCount += Total
        }

        rowsToShow.push({ "id": "last_row_of_table", "country": "Total", "Total": totalCount })

        const columns = [
            { field: "country", headerName: "Country", flex: 1, headerClassName: "header-bg" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)
        if(selectedCountry === ""){
            const countriesToShow = allCountryList.filter(obj => {
                return countryId.find(id => id.toString() === obj.value.toString())
            })
            
            setCountryList(countriesToShow)
            setstateList([])
            setCityList([])
            setSlectedState("")
            setSlectedCity("")
        }
        
        const datasets = [
            {
                id: 0,
                label: "Count",
                data: data.map(obj => obj.Total),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
        ]

        const finalData = { labels: data.map(obj => obj.name), datasets }
        setChartData(finalData)
    }

    const handleGeoLocationWiseDataCountry = (data) => {
        const rowsToShow = []
        let id_ = 0
        let totalCount = 0
        for (const obj of data) {
            const { name, Total } = obj
            rowsToShow.push({ "id": id_, "state": name, "Total": Total })
            id_ += 1
            totalCount += Total
        }

        rowsToShow.push({ "id": "last_row_of_table", "state": "Total", "Total": totalCount })

        const columns = [
            { field: "state", headerName: "State", flex: 1, headerClassName: "header-bg" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)
        setstateList(
            data.map((obj) => ({
                value: obj.id,
                label: obj.name,
            }))
        )
        setCityList([])
        setSlectedState("")
        setSlectedCity("")

        const datasets = [
            {
                id: 0,
                label: "Count",
                data: data.map(obj => obj.Total),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
        ]

        const finalData = { labels: data.map(obj => obj.name), datasets }
        setChartData(finalData)
    }

    const handleGeoLocationWiseDataState = (data) => {
        const rowsToShow = []
        let id_ = 0
        let totalCount = 0
        for (const obj of data) {
            const { Total, name} = obj
            rowsToShow.push({
                "id": id_, "city": name, "Total": Total
            })
            id_ += 1
            totalCount += Total
        }

        rowsToShow.push({
            "id": "last_row_of_table", "city": "Total", "Total": totalCount
        })

        const columns = [
            { field: "city", headerName: "City", flex: 1, headerClassName: "header-bg" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)
        setCityList(
            data.map((obj) => ({
                value: obj.id,
                label: obj.name,
            }))
        )
        setSlectedCity("")

        const datasets = [
            {
                id: 0,
                label: "Count",
                data: data.map(obj => obj.Total),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
        ]

        const finalData = { labels: data.map(obj => obj.name), datasets }
        setChartData(finalData)
    }

    const handleGeoLocationWiseDataCity = (data) => {
        const rowsToShow = []
        let id_ = 0
        let totalCount = 0
        for (const obj of data) {
            const { Total, name} = obj
            rowsToShow.push({
                "id": id_, "city": name, "Total": Total
            })
            id_ += 1
            totalCount += Total
        }

        rowsToShow.push({
            "id": "last_row_of_table", "city": "Total", "Total": totalCount
        })

        const columns = [
            { field: "city", headerName: "City", flex: 1, headerClassName: "header-bg" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)

        const datasets = [
            {
                id: 0,
                label: "Count",
                data: data.map(obj => obj.Total),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
        ]

        const finalData = { labels: data.map(obj => obj.name), datasets }
        setChartData(finalData)
    }
    const getAdmissionReports = (data,type) => {
        if(data?.id !== "last_row_of_table" && type === "Admission Category Report"){
            handleApiCall(`/api/admissionCategoryReport/getAdmissionCategoryReportInstituteWiseWithCategory?feeAdmissionId=${data?.feeAdmissionId}`, admissionCategoryReportCallBack)
            setCrumbs([
                { name: "Charts Dashboard", link: "/charts-dashboard" },
                { name: "Admission", link: () => {
                    console.log("ttt");
                    handleApiCall(`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`, handleAdmissionCategory)
                } },
                { name: type}
            ])
        }
        if(data?.id === "last_row_of_table" && type === "Admission Category Report"){
            handleApiCall(`/api/admissionCategoryReport/getAdmissionCategoryReportInstituteWise?acYearId=${selectedAcademicYear}`, admissionCategoryReportInstituteWiseCallBack)
            setCrumbs([
                { name: "Charts Dashboard", link: "/charts-dashboard" },
                { name: "Admission", link: () => {
                    console.log("ttt");
                    handleApiCall(`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`, handleAdmissionCategory)
                } },
                { name: "Institute Wise Report"}
            ])
        }
    }
    const admissionReports = (data,type) => {
        if(data?.id !== "last_row_of_table" && type === "Institute Wise"){
            handleApiCall(`/api/admissionCategoryReport/getAdmissionCategoryReportSpecializationWise?schoolId=${data?.schoolId}`, instituteWiseCallBack)
            setCrumbs([
                { name: "Charts Dashboard", link: "/charts-dashboard" },
                { name: "Admission", link: () => {
                    console.log("ttt");
                    handleApiCall(`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`, handleAdmissionCategory)
                } },
                { name: type}
            ])
        }
        if(data?.id === "last_row_of_table" && type === "Institute Wise"){
            handleApiCall(`/api/admissionCategoryReport/getAdmissionCategoryReportInstituteWise?acYearId=${selectedAcademicYear}`, admissionCategoryReportInstituteWiseCallBack)
            setCrumbs([
                { name: "Charts Dashboard", link: "/charts-dashboard" },
                { name: "Admission", link: () => {
                    console.log("ttt");
                    handleApiCall(`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`, handleAdmissionCategory)
                } },
                { name: "Institute Wise Report"}
            ])
        }
    }
    const handleAdmissionCategory = data => {
        const rowsToShow = []
        let id_ = 0
        let intakeTotalCount = 0
        let admittedTotalCount = 0
        let vacantTotalCount = 0
        for (const obj of data) {
            const { admitted, feeAdmissionId, feeAdmissionType, intake, vacant} = obj
            rowsToShow.push({
                "id": id_, "feeAdmissionType": feeAdmissionType, "admitted": admitted,
                "feeAdmissionId": feeAdmissionId, "intake": intake, "vacant": vacant, "Total": admitted + intake + vacant
            })
            id_ += 1
            intakeTotalCount += intake
            admittedTotalCount += admitted
            vacantTotalCount += vacant
        }

        rowsToShow.push({
            "id": "last_row_of_table", "feeAdmissionType": "Total", "admitted": admittedTotalCount,
                "feeAdmissionId": 999999, "intake": intakeTotalCount, "vacant": vacantTotalCount, 
                "Total": intakeTotalCount + admittedTotalCount + vacantTotalCount
        })

        const columns = [
            { field: "feeAdmissionType", headerName: "Admission Type", flex: 1, headerClassName: "header-bg" },
            { field: "intake", headerName: "Intake", flex: 1, headerClassName: "header-bg", type: "number",renderCell: (params) => {
                return (
                  <>
                    <Typography
                      sx={{ cursor: "pointer"}}
                      onClick={() => getAdmissionReports(params.row,"Admission Category Report")}
                    >
                      {params.row.intake}
                    </Typography>
                  </>
                );
              }, },
            { field: "admitted", headerName: "Admitted", flex: 1, headerClassName: "header-bg", type: "number" },
            { field: "vacant", headerName: "Vacant", flex: 1, headerClassName: "header-bg", type: "number" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column"},
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)
        setCrumbs([
            { name: "Charts Dashboard", link: "/charts-dashboard" },
            { name: "Admission" }
        ])
        const datasets = [
            {
                id: 0,
                label: "Intake",
                data: data.map(obj => obj.intake),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Admitted",
                data: data.map(obj => obj.admitted),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Vacant",
                data: data.map(obj => obj.vacant),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
        ]

        const finalData = { labels: data.map(obj => obj.feeAdmissionType), datasets }
        setChartData(finalData)
    }
    const admissionCategoryReportCallBack = data => {
        const rowsToShow = []
        let id_ = 0
        let intakeTotalCount = 0
        let admittedTotalCount = 0
        let vacantTotalCount = 0
        for (const obj of data) {
            const { schoolName,admitted, feeAdmissionId, intake, vacant,schoolId} = obj
            rowsToShow.push({
                "id": id_, "schoolId" : schoolId ,"schoolName": schoolName, "admitted": admitted,
                "feeAdmissionId": feeAdmissionId, "intake": intake, "vacant": vacant, "Total": admitted + intake + vacant
            })
            id_ += 1
            intakeTotalCount += intake
            admittedTotalCount += admitted
            vacantTotalCount += vacant
        }

        rowsToShow.push({
            "id": "last_row_of_table", "schoolName": "Total", "admitted": admittedTotalCount,
                "feeAdmissionId": 999999, "intake": intakeTotalCount, "vacant": vacantTotalCount, 
                "Total": intakeTotalCount + admittedTotalCount + vacantTotalCount
        })

        const columns = [
            { field: "schoolName", headerName: "School Name", flex: 1, headerClassName: "header-bg" },
            { field: "intake", headerName: "Intake", flex: 1, headerClassName: "header-bg", type: "number",renderCell: (params) => {
                return (
                  <>
                    <Typography
                      sx={{ cursor: "pointer"}}
                      onClick={() => admissionReports(params.row,"Institute Wise")}
                    >
                      {params.row.intake}
                    </Typography>
                  </>
                );
              }, },
            { field: "admitted", headerName: "Admitted", flex: 1, headerClassName: "header-bg", type: "number" },
            { field: "vacant", headerName: "Vacant", flex: 1, headerClassName: "header-bg", type: "number" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column"},
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)

        const datasets = [
            {
                id: 0,
                label: "Intake",
                data: data.map(obj => obj.intake),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Admitted",
                data: data.map(obj => obj.admitted),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Vacant",
                data: data.map(obj => obj.vacant),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
        ]

        const finalData = { labels: data.map(obj => obj.schoolName), datasets }
        setChartData(finalData)
    }
    const admissionCategoryReportInstituteWiseCallBack = data => {
        const rowsToShow = []
        let id_ = 0
        let intakeTotalCount = 0
        let admittedTotalCount = 0
        let vacantTotalCount = 0
        for (const obj of data) {
            const { schoolName,admitted, feeAdmissionId, intake, vacant} = obj
            rowsToShow.push({
                "id": id_, "schoolName": schoolName, "admitted": admitted,
                "feeAdmissionId": feeAdmissionId, "intake": intake, "vacant": vacant, "Total": admitted + intake + vacant
            })
            id_ += 1
            intakeTotalCount += intake
            admittedTotalCount += admitted
            vacantTotalCount += vacant
        }

        rowsToShow.push({
            "id": "last_row_of_table", "schoolName": "Total", "admitted": admittedTotalCount,
                "feeAdmissionId": 999999, "intake": intakeTotalCount, "vacant": vacantTotalCount, 
                "Total": intakeTotalCount + admittedTotalCount + vacantTotalCount
        })

        const columns = [
            { field: "schoolName", headerName: "School Name", flex: 1, headerClassName: "header-bg" },
            { field: "intake", headerName: "Intake", flex: 1, headerClassName: "header-bg", type: "number",renderCell: (params) => {
                return (
                  <>
                    <Typography
                      sx={{ cursor: "pointer"}}
                    //   onClick={() => getAdmissionReports(params.row,"AdmissionCategoryReport")}
                    >
                      {params.row.intake}
                    </Typography>
                  </>
                );
              }, },
            { field: "admitted", headerName: "Admitted", flex: 1, headerClassName: "header-bg", type: "number" },
            { field: "vacant", headerName: "Vacant", flex: 1, headerClassName: "header-bg", type: "number" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)

        const datasets = [
            {
                id: 0,
                label: "Intake",
                data: data.map(obj => obj.intake),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Admitted",
                data: data.map(obj => obj.admitted),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Vacant",
                data: data.map(obj => obj.vacant),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
        ]

        const finalData = { labels: data.map(obj => obj.schoolName), datasets }
        setChartData(finalData)
    }
    const instituteWiseCallBack = data => {
        
        const rowsToShow = []
        let id_ = 0
        let intakeTotalCount = 0
        let admittedTotalCount = 0
        let vacantTotalCount = 0
        for (const obj of data) {
            const { schoolName,admitted, feeAdmissionId, intake, vacant,program_short_name,program_specialization_short_name,fee_admission_category_type} = obj
            rowsToShow.push({
                "id": id_, "schoolName": schoolName,"program_short_name" :program_short_name,"program_specialization_short_name":program_specialization_short_name , "fee_admission_category_type":fee_admission_category_type,"admitted": admitted,
                "feeAdmissionId": feeAdmissionId, "intake": intake, "vacant": vacant, "Total": admitted + intake + vacant
            })
            id_ += 1
            intakeTotalCount += intake
            admittedTotalCount += admitted
            vacantTotalCount += vacant
        }

        rowsToShow.push({
            "id": "last_row_of_table", "schoolName": "Total", "admitted": admittedTotalCount,
                "feeAdmissionId": 999999, "intake": intakeTotalCount, "vacant": vacantTotalCount, 
                "Total": intakeTotalCount + admittedTotalCount + vacantTotalCount
        })

        const columns = [
            { field: "schoolName", headerName: "School", flex: 1, headerClassName: "header-bg" },
            { field: "program_short_name", headerName: "Program", flex: 1, headerClassName: "header-bg" },
            { field: "program_specialization_short_name", headerName: "Specialization", flex: 1, headerClassName: "header-bg" },
            { field: "fee_admission_category_type", headerName: "Category", flex: 1, headerClassName: "header-bg" },
            { field: "intake", headerName: "Intake", flex: 1, headerClassName: "header-bg", type: "number",renderCell: (params) => {
                return (
                  <>
                    <Typography
                      sx={{ cursor: "pointer"}}
                    //   onClick={() => getAdmissionReports(params.row,"AdmissionCategoryReport")}
                    >
                      {params.row.intake}
                    </Typography>
                  </>
                );
              }, },
            { field: "admitted", headerName: "Admitted", flex: 1, headerClassName: "header-bg", type: "number" },
            { field: "vacant", headerName: "Vacant", flex: 1, headerClassName: "header-bg", type: "number" },
            { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
        ]

        setTableColumns(columns)
        setTableRows(rowsToShow)

        const datasets = [
            {
                id: 0,
                label: "Intake",
                data: data.map(obj => obj.intake),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Admitted",
                data: data.map(obj => obj.admitted),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
            {
                id: 0,
                label: "Vacant",
                data: data.map(obj => obj.vacant),
                borderColor: `rgb(19, 35, 83)`,
                backgroundColor: `rgb(19, 35, 83, 0.5)`
            },
        ]

        const finalData = { labels: data.map(obj => obj.schoolName), datasets }
        setChartData(finalData)
    }

    const random_rgb = () => {
        let o = Math.round, r = Math.random, s = 255;
        return { r: o(r() * s), g: o(r() * s), b: o(r() * s) }
    }

    const renderChart = () => {
        switch (selectedChart) {
            case 'verticalbar':
                return <VerticalBar data={chartData} title={selectedGraph} showDataLabel={false} />
            case 'horizontalbar':
                return <HorizontalBar data={chartData} title={selectedGraph} showDataLabel={false} />
            case 'line':
                return <LineChart data={chartData} title={selectedGraph} showDataLabel={false} />
            case 'stackedbarvertical':
                return <StackedBar data={chartData} title={selectedGraph} vertical={true} showDataLabel={false} />
            case 'stackedbarhorizontal':
                return <StackedBar data={chartData} title={selectedGraph} vertical={false} showDataLabel={false} />
            default:
                return null
        }
    }

    return (<>
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

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ zIndex: 3 }}>
                <Grid container columnGap={1} rowGap={2} >
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <FormControl size="medium" fullWidth>
                            <InputLabel>Graph By</InputLabel>
                            <Select size="medium" name="graph" value={selectedGraph} label="Graph by"
                                onChange={(e) => setSelectedGraph(e.target.value)}>
                                {GraphOptions.map((obj, index) => (
                                    <MenuItem key={index} value={obj.value}>
                                        {obj.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {selectedGraph !== "Year Wise" && selectedGraph !== "Day Wise" &&
                        <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                            <FormControl size="medium" fullWidth>
                                <InputLabel>Academic Year</InputLabel>
                                <Select size="medium" name="AcademicYear" value={selectedAcademicYear} label="Academic Year"
                                    onChange={(e) => setSelectedAcademicYear(e.target.value)}>
                                    {academicYears.map((obj, index) => (
                                        <MenuItem key={index} value={obj.ac_year_id}>
                                            {obj.ac_year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>}

                    {(selectedGraph === "Programme" || selectedGraph === "Gender" || selectedGraph === "GeoLocation") &&
                        <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                            <FormControl size="medium" fullWidth>
                                <InputLabel>Institute</InputLabel>
                                <Select size="medium" name="Institute" value={selectedInstitute} label="Institute"
                                    onChange={(e) => setSelectedInstitute(e.target.value)}
                                    endAdornment={
                                        <InputAdornment sx={{ marginRight: "10px" }} position="end">
                                            <IconButton onClick={() => setSelectedInstitute("")}>
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }>
                                    {instituteList.map((obj, index) => (
                                        <MenuItem key={index} value={obj.value}>
                                            {obj.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>}

                    {selectedGraph === "Day Wise" && <>
                        <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                            <FormControl size="medium" fullWidth>
                                <InputLabel>Month</InputLabel>
                                <Select size="medium" name="month" value={selectedMonth} label="Month"
                                    onChange={(e) => setSelectedMonth(e.target.value)}>
                                    {MonthOptions.map((obj, index) => (
                                        <MenuItem key={index} value={obj.value}>
                                            {obj.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                            <FormControl size="medium" fullWidth>
                                <InputLabel>Year</InputLabel>
                                <Select size="medium" name="year" value={selectedYear} label="Year"
                                    onChange={(e) => setSelectedYear(e.target.value)}>
                                    {yearOptions.map((obj, index) => (
                                        <MenuItem key={index} value={obj.value}>
                                            {obj.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </>}

                    {selectedGraph === "GeoLocation" && <>
                        <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                            <FormControl size="medium" fullWidth>
                                <InputLabel>Country</InputLabel>
                                <Select size="medium" name="Country" value={selectedCountry} label="Country"
                                    onChange={(e) => setSlectedCountry(e.target.value)}
                                    endAdornment={
                                        <InputAdornment sx={{ marginRight: "10px" }} position="end">
                                            <IconButton onClick={() => setSlectedCountry("")}>
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }>
                                    {countryList.map((obj, index) => (
                                        <MenuItem key={index} value={obj.value}>
                                            {obj.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                            <FormControl size="medium" fullWidth>
                                <InputLabel>State</InputLabel>
                                <Select size="medium" name="State" value={selectedState} label="State"
                                    onChange={(e) => setSlectedState(e.target.value)}
                                    endAdornment={
                                        <InputAdornment sx={{ marginRight: "10px" }} position="end">
                                            <IconButton onClick={() => setSlectedState("")}>
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }>
                                    {stateList.map((obj, index) => (
                                        <MenuItem key={index} value={obj.value}>
                                            {obj.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                            <FormControl size="medium" fullWidth>
                                <InputLabel>City</InputLabel>
                                <Select size="medium" name="City" value={selectedCity} label="City"
                                    onChange={(e) => setSlectedCity(e.target.value)}
                                    endAdornment={
                                        <InputAdornment sx={{ marginRight: "10px" }} position="end">
                                            <IconButton onClick={() => setSlectedCity("")}>
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }>
                                    {cityList.map((obj, index) => (
                                        <MenuItem key={index} value={obj.value}>
                                            {obj.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </>}

                    <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
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

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormGroup>
                        <Box sx={{ display: "flex", gap: "40px" }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography>Chart view</Typography>
                                <FormControlLabel
                                    control={<IOSSwitch sx={{ m: 1 }} ischecked={isTableView} handlechange={() => setIsTableView(!isTableView)} />}
                                />
                                <Typography>Table view</Typography>
                            </Stack>
                        </Box>
                    </FormGroup>
                    <Grid container sx={{ justifyContent: "center" }}>
                        {isTableView ?
                            <Grid item xs={12} md={12} lg={tableColumns.length <= 4 ? 8 : 12} pt={1} sx={{
                                '& .last-row': { fontWeight: "bold", backgroundColor: "#376a7d !important", color: "#fff" },
                                '& .last-column': { fontWeight: "bold" },
                                '& .last-row:hover': { backgroundColor: "#376a7d !important", color: "#fff" },
                                '& .header-bg': { fontWeight: "bold", backgroundColor: "#376a7d", color: "#fff" },
                            }}>
                                <GridIndex rows={tableRows} columns={tableColumns} getRowId={row => row.id}
                                    isRowSelectable={(params) => tableRows.length - 1 !== params.row.id}
                                    getRowClassName={(params) => {
                                        return params.row.id === "last_row_of_table" ? "last-row" : ""
                                    }} loading={loading} />
                            </Grid>
                            :
                            <Grid item xs={12} md={12} lg={12} p={3} style={{ position: "relative" }}>
                                {Object.keys(chartData).length > 0 && <EnlargeChartIcon fontSize="medium" onClick={() => setEnlargeChart(!enlargeChart)} />}
                                {Object.keys(chartData).length > 0 ? renderChart() : null}
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </>)
}

export default AdmissionPage