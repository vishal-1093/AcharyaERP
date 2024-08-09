import React, { lazy, useEffect, useState } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import axios from "../../../../services/Api"
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material"
import styled from "@emotion/styled";
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseIcon from '@mui/icons-material/Close';
import { HorizontalBar, LineChart, StackedBar, VerticalBar } from "../Chart"
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
    { value: "Age Group", label: "Age Group" },
    { value: "Programme", label: "Programme" },
    { value: "Gender", label: "Gender" },
    { value: "GeoLocation", label: "GeoLocation" },
    { value: "GeoLocationCities", label: "GeoLocation Cities" },
    { value: "Specialization", label: "Specialization" },
    { value: "AdmissionCategory", label: "Admission Category" },
    { value: "AdmissionSubCategory", label: "Admission SubCategory" }
]

const ChartOptions = [
    { value: "verticalbar", label: "Vertical Bar" },
    { value: "horizontalbar", label: "Horizontal Bar" },
    { value: "stackedbarvertical", label: "Stacked Bar(Vertical)" },
    { value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)" },
    { value: "line", label: "Line" },
]

const DEFAULT_CHART = "horizontalbar"

const AdmissionPage = () => {
    const setCrumbs = useBreadcrumbs()
    const [tableRows, setTableRows] = useState([])
    const [tableColumns, setTableColumns] = useState([])
    const [chartData, setChartData] = useState({})
    const [academicYears, setAcademicYears] = useState([])
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("")
    const [selectedGraph, setSelectedGraph] = useState("")
    const [selectedChart, setSelectedChart] = useState(DEFAULT_CHART)
    const [enlargeChart, setEnlargeChart] = useState(false)
    const [schoolNameList, setSchoolNameList] = useState([])
    const [selectedSchools, setSelectedSchools] = useState([])
    const [schoolColorsArray, setSchoolColorsArray] = useState([])
    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [selectedCountryId, setSelectedCountryId] = useState("select country")
    const [selectedStateId, setSelectedStateId] = useState("select province")
    const [fullNameCategory, setFullNameCategory] = useState([])
    const [fullNameSubCategory, setFullNameSubCategory] = useState([])

    useEffect(() => {
        setCrumbs([
            { name: "Charts Dashboard", link: "/charts-dashboard" },
            { name: "Admission" }
        ])
        getSchoolColors()
    }, [])

    useEffect(() => {
        if (schoolColorsArray.length > 0) {
            getAdmissionReport()
            getAcademicYearList()
            getFullNameCategory()
            getFullNamesubCategory()
        }
    }, [schoolColorsArray])

    useEffect(() => {
        if (selectedGraph !== '' && selectedAcademicYear !== '') {
            const getacademicYearId = academicYears.find(obj => obj.ac_year === selectedAcademicYear)
            if (selectedGraph === "Age Group") handleApiCall(`/api/reports/getStudentAdmissionReportByAgeGroup/${getacademicYearId.ac_year_id}`, handleAgeGroupData)
            else if (selectedGraph === "Programme") handleApiCall(`/api/reports/getStudentAdmissionReportProgramWise/${getacademicYearId.ac_year_id}`, handleProgrammeWiseData)
            else if (selectedGraph === "Gender") handleApiCall(`/api/reports/getStudentAdmissionReportGenderWise/${getacademicYearId.ac_year_id}`, handleGenderData)
            else if (selectedGraph === "GeoLocation") getCountryList()
            else if (selectedGraph === "GeoLocationCities") {
                getCountryList()
                getStateList()
            }
            else if (selectedGraph === "Specialization") handleApiCall(`/api/reports/getStudentAdmissionReportSpecializationWise/${getacademicYearId.ac_year_id}`, handleSpecializationWiseData)
            else if (selectedGraph === "AdmissionCategory") handleApiCall(`/api/reports/getStudentAdmissionReportFeeAdmissionCategoryWise/${getacademicYearId.ac_year_id}`, handleFeeAdmissionCategoryWiseData)
            else if (selectedGraph === "AdmissionSubCategory") handleApiCall(`/api/reports/getStudentAdmissionReportFeeAdmissionSubCategoryWise/${getacademicYearId.ac_year_id}`, handleFeeAdmissionSubCategoryWiseData)
        }
    }, [selectedGraph, selectedAcademicYear])

    useEffect(() => {
        if (selectedGraph === "GeoLocation" && selectedCountryId !== "select country" && selectedAcademicYear !== '') {
            const getacademicYearId = academicYears.find(obj => obj.ac_year === selectedAcademicYear)
            handleApiCall(`/api/reports/getStudentAdmissionReportStatesWiseByAcademicYearAndCountry/${getacademicYearId.ac_year_id}/${selectedCountryId}`, handleGeoLocationData)
        } else if (selectedGraph === "GeoLocationCities" && selectedCountryId !== "select country" && selectedStateId !== "select province" && selectedAcademicYear !== '') {
            const getacademicYearId = academicYears.find(obj => obj.ac_year === selectedAcademicYear)
            handleApiCall(`/api/reports/getStudentAdmissionReportCityWiseByAcademicYearCountryAndState/${getacademicYearId.ac_year_id}/${selectedCountryId}/${selectedStateId}`, handleGeoLocationData)
        }
    }, [selectedCountryId, selectedStateId])

    const getFullNameCategory = async () => {
        axios.get("/api/student/feeAdmissionCategoryForAdmissionReport")
            .then(res => {
                if (res.data.data.length <= 0)
                    return setFullNameCategory([])

                setFullNameCategory(res.data.data)
            })
    }

    const getFullNamesubCategory = async () => {
        axios.get("/api/student/feeAdmissionSubCategoryForAdmissionReport")
            .then(res => {
                if (res.data.data.length <= 0)
                    return setFullNameSubCategory([])

                setFullNameSubCategory(res.data.data)
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
            })
    }

    const getCountryList = () => {
        if (countryList.length > 0) return setSelectedCountryId("select country")

        axios.get("/api/Country")
            .then(res => {
                if (res.data.length <= 0) return setCountryList([])

                const countryArr = res.data.map(obj => {
                    const { id, name } = obj
                    return { id, name }
                })
                setCountryList([{ id: "select country", name: "Select Country" }, ...countryArr])
                setSelectedCountryId("select country")
            })
    }

    const getStateList = () => {
        if (stateList.length > 0) return setSelectedStateId("select province")

        axios.get(`/api/State1/1`)
            .then(res => {
                if (res.data.length <= 0) return setStateList([])

                const stateArr = res.data.map(obj => {
                    const { id, name } = obj
                    return { id, name }
                })
                setStateList([{ id: "select province", name: "Select Province" }, ...stateArr])
                setSelectedStateId("select province")
            })
    }

    const handleApiCall = (path, callback) => {
        axios.get(path)
            .then(res => {
                if (res.data.data.length <= 0) {
                    setTableColumns([])
                    setTableRows([])
                    setChartData({ labels: [], datasets: [] })
                    return
                }

                callback(res.data.data);
            })
    }

    const handleAgeGroupData = (data) => {
        const { AUZ } = data[0]
        const ageGroupKeys = Object.keys(AUZ).sort()
        const rowsToShow = []
        let id = 0
        for (const ageGroup of ageGroupKeys) {
            let total = 0
            let male = AUZ[ageGroup]["M"]
            let female = AUZ[ageGroup]["F"]
            total += male + female
            rowsToShow.push({ "id": id, "ageGroup": ageGroup, "Male": male, "Female": female, "Total": total })
            id++
        }
        const totalRow = rowsToShow.reduce((acc, obj) => {
            const keys = Object.keys(obj)
            keys.splice(keys.indexOf("ageGroup"), 1)
            keys.splice(keys.indexOf("id"), 1)
            keys.forEach(key => {
                if (!acc[key]) acc[key] = 0
                acc[key] += obj[key]
            })
            return acc
        }, {})
        rowsToShow.push({ "id": 9990909, "ageGroup": "Total", ...totalRow })

        let columnNames = [];
        for (const obj of rowsToShow)
            columnNames.push(...Object.keys(obj))

        columnNames = [...new Set(columnNames)];
        columnNames.splice(columnNames.indexOf("ageGroup"), 1);
        columnNames.splice(columnNames.indexOf("id"), 1);

        let columns = [{ field: "ageGroup", headerName: "Age Group", flex: 1 }]
        for (const key of columnNames)
            columns.push({ field: key, headerName: key, flex: 1, type: 'number' })

        setTableColumns(columns)
        setTableRows(rowsToShow);

        const getValues = (row, columnName) => {
            const values = row.map(obj => obj[columnName] ? obj[columnName] : 0)
            return values
        }

        const rowsToShowChart = ageGroupKeys.map(ageGroup => {
            return { "ageGroup": ageGroup, "Male": AUZ[ageGroup]["M"], "Female": AUZ[ageGroup]["F"] }
        })

        const columnNamesToShow = [];
        for (const obj of rowsToShowChart)
            columnNamesToShow.push(...Object.keys(obj))

        let columnNamesChart = [...new Set([...columnNamesToShow])];
        columnNamesChart.splice(columnNamesChart.indexOf("ageGroup"), 1);

        const datasets = columnNamesChart.map((columnName, i) => {
            const { r, g, b } = random_rgb()
            return {
                id: i + 1,
                label: columnName,
                data: getValues(rowsToShowChart, columnName),
                borderColor: `rgb(${r}, ${g}, ${b})`,
                backgroundColor: `rgb(${r}, ${g}, ${b}, 0.5)`
            }
        })
        const finalData = { labels: ageGroupKeys, datasets }
        setChartData(finalData)
    }

    const handleProgrammeWiseData = (data) => {
        handleTableAndChartData(data, "Programme")
    }

    const handleGenderData = (data) => {
        handleTableAndChartData(data, "Gender")
    }

    const getAdmissionReportNew = () => {
        axios.get("/api/reports/getAdmissionReportAcademicYearWiseWithCancelAdmissionAndGender")
            .then(res => {
                if (res.data.data.length <= 0) {
                    setTableColumns([])
                    setTableRows([])
                    setChartData({ labels: [], datasets: [] })
                    return
                }

                const getYearobjAndSchoollist = (data) => {
                    const academicYearArr = []
                    const schoolNames = []
                    const academicYears = Object.keys(data)
                    for (const acYear of academicYears) {
                        let newObj = {}
                        const school = Object.keys(data[acYear])[0]
                        newObj["ac_year"] = acYear
                        newObj["active"] = data[acYear][school]["true"]
                        newObj["inactive"] = data[acYear][school]["false"]
                        newObj["school_name_short"] = school
                        academicYearArr.push(newObj)
                        schoolNames.push(school)
                    }
                    const unqiueSchoolNames = [...new Set(schoolNames)]

                    return { academicYearArr, schoolNamesArr: unqiueSchoolNames }
                }

                const { academicYearArr, schoolNamesArr } = getYearobjAndSchoollist(res.data.data[0])
                const schoolList = schoolNamesArr.map(value => {
                    return { value: value, label: value }
                })
                setSelectedSchools(prev => {
                    const previousSelectedSchools = [...prev]
                    const schools__ = schoolList.filter(sc => previousSelectedSchools.includes(sc.value))
                    if (schools__.length > 0) return [schoolList[0].value, ...schools__.map(obj => obj.value)]
                    return [schoolList[0].value]
                })
                setSchoolNameList(schoolList)
                const rowsToShow = []
                let id = 0
                for (const obj of academicYearArr) {
                    let activeMale = obj["active"]["M"] ? obj["active"]["M"] : 0
                    let activeFemale = obj["active"]["F"] ? obj["active"]["F"] : 0
                    let inactiveMale = obj["inactive"]["M"] ? obj["inactive"]["M"] : 0
                    let inactiveFemale = obj["inactive"]["F"] ? obj["inactive"]["F"] : 0
                    let total = activeFemale + activeMale + inactiveFemale + inactiveMale
                    rowsToShow.push({ "id": id, "school_name_short": obj.school_name_short, "ac_year": obj["ac_year"],
                     "Active(Male)": activeMale, "Active(Female)": activeFemale, "Inactive(Male)": inactiveMale,  
                     "Inactive(Female)": inactiveFemale, "Total": total })
                    id++
                }

                // Show bottom Total row only if more than 1 school
                const totalRow = rowsToShow.reduce((acc, obj) => {
                    const keys = Object.keys(obj)
                    keys.splice(keys.indexOf("ac_year"), 1)
                    keys.splice(keys.indexOf("id"), 1)
                    keys.splice(keys.indexOf("school_name_short"), 1)
                    keys.forEach(key => {
                        if (!acc[key]) acc[key] = 0
                        acc[key] += obj[key]
                    })
                    return acc
                }, {})
                rowsToShow.push({ "id": 9990909, "ac_year": "Total", ...totalRow })

                let columnNames = [];
                for (const obj of rowsToShow)
                    columnNames.push(...Object.keys(obj))

                columnNames = [...new Set(columnNames)];
                columnNames.splice(columnNames.indexOf("ac_year"), 1);
                columnNames.splice(columnNames.indexOf("id"), 1);
                columnNames.splice(columnNames.indexOf("school_name_short"), 1);

                let columns = [{ field: "ac_year", headerName: "Academic Year", flex: 1 }]
                for (const key of columnNames)
                    columns.push({ field: key, headerName: key, flex: 1, type: 'number' })

                setTableColumns(columns)
                setTableRows(rowsToShow);

                const getValues = (row, columnName) => {
                    const values = row.map(obj => obj[columnName] ? obj[columnName] : 0)
                    return values.flat()
                }

                const rowsToShowChart = academicYearArr.map(obj => {
                    return { "ac_year": obj.ac_year, "Active": [obj["active"]["M"],  obj["active"]["F"]], 
                    "Inactive": [obj["inactive"]["M"],  obj["inactive"]["F"]], "school_name_short": obj.school_name_short }
                })
                const columnNamesToShow = [];
                for (const obj of rowsToShowChart)
                    columnNamesToShow.push(...Object.keys(obj))

                let columnNamesChart = [...new Set([...columnNamesToShow])];
                columnNamesChart.splice(columnNamesChart.indexOf("ac_year"), 1);
                columnNamesChart.splice(columnNamesChart.indexOf("school_name_short"), 1);

                const datasets = columnNamesChart.map((columnName, i) => {
                    const { r, g, b } = random_rgb()
                    return {
                        id: i + 1,
                        label: columnName,
                        data: getValues(rowsToShowChart, columnName),
                        borderColor: `rgb(${r}, ${g}, ${b})`,
                        backgroundColor: `rgb(${r}, ${g}, ${b}, 0.5)`
                    }
                })
                const finalData = { labels: ["Male", "Female"], datasets }
                setChartData(finalData)
            })
    }

    const getAdmissionReport = () => {
        axios.get("/api/reports/getStudentAdmissionReportAcademicYearWise")
            .then(res => {
                if (res.data.data.length <= 0) {
                    setTableColumns([])
                    setTableRows([])
                    setChartData({ labels: [], datasets: [] })
                    return
                }

                const getYearobjAndSchoollist = (data) => {
                    const academicYearArr = []
                    const schoolNames = []
                    const academicYears = Object.keys(data)
                    for (const acYear of academicYears) {
                        let newObj = {}
                        const school = Object.keys(data[acYear])[0]
                        newObj["ac_year"] = acYear
                        newObj["active"] = data[acYear][school]["true"]
                        newObj["inactive"] = data[acYear][school]["false"]
                        newObj["school_name_short"] = school
                        academicYearArr.push(newObj)
                        schoolNames.push(school)
                    }
                    const unqiueSchoolNames = [...new Set(schoolNames)]

                    return { academicYearArr, schoolNamesArr: unqiueSchoolNames, yearsList: academicYears }
                }

                const { academicYearArr, schoolNamesArr, yearsList } = getYearobjAndSchoollist(res.data.data[0])
                const schoolList = schoolNamesArr.map(value => {
                    return { value: value, label: value }
                })
                setSelectedSchools(prev => {
                    const previousSelectedSchools = [...prev]
                    const schools__ = schoolList.filter(sc => previousSelectedSchools.includes(sc.value))
                    if (schools__.length > 0) return [schoolList[0].value, ...schools__.map(obj => obj.value)]
                    return [schoolList[0].value]
                })
                setSchoolNameList(schoolList)
                const rowsToShow = []
                let id = 0
                for (const obj of academicYearArr) {
                    let total = 0
                    total += obj["active"] + obj["inactive"]
                    rowsToShow.push({ "id": id, "school_name_short": obj.school_name_short, "ac_year": obj["ac_year"], "Active": obj["active"], "Inactive": obj["inactive"], "Total": total })
                    id++
                }

                // Show bottom Total row only if more than 1 school
                const totalRow = rowsToShow.reduce((acc, obj) => {
                    const keys = Object.keys(obj)
                    keys.splice(keys.indexOf("ac_year"), 1)
                    keys.splice(keys.indexOf("id"), 1)
                    keys.splice(keys.indexOf("school_name_short"), 1)
                    keys.forEach(key => {
                        if (!acc[key]) acc[key] = 0
                        acc[key] += obj[key]
                    })
                    return acc
                }, {})
                rowsToShow.push({ "id": 9990909, "ac_year": "Total", ...totalRow })

                let columnNames = [];
                for (const obj of rowsToShow)
                    columnNames.push(...Object.keys(obj))

                columnNames = [...new Set(columnNames)];
                columnNames.splice(columnNames.indexOf("ac_year"), 1);
                columnNames.splice(columnNames.indexOf("id"), 1);
                columnNames.splice(columnNames.indexOf("school_name_short"), 1);

                let columns = [{ field: "ac_year", headerName: "Academic Year", flex: 1 }]
                for (const key of columnNames)
                    columns.push({ field: key, headerName: key, flex: 1, type: 'number' })

                setTableColumns(columns)
                setTableRows(rowsToShow);

                const getValues = (row, columnName) => {
                    const values = row.map(obj => obj[columnName] ? obj[columnName] : 0)
                    return values
                }

                const rowsToShowChart = academicYearArr.map(obj => {
                    return { "ac_year": obj.ac_year, "Active": obj["active"], "Inactive": obj["inactive"], "school_name_short": obj.school_name_short }
                })
                const columnNamesToShow = [];
                for (const obj of rowsToShowChart)
                    columnNamesToShow.push(...Object.keys(obj))

                let columnNamesChart = [...new Set([...columnNamesToShow])];
                columnNamesChart.splice(columnNamesChart.indexOf("ac_year"), 1);
                columnNamesChart.splice(columnNamesChart.indexOf("school_name_short"), 1);

                const datasets = columnNamesChart.map((columnName, i) => {
                    const schoolColorObj = schoolColorsArray.find(obj => obj.schoolName === selectedSchools[0])
                    const { r, g, b } = random_rgb()
                    return {
                        id: i + 1,
                        label: columnName,
                        data: getValues(rowsToShowChart, columnName),
                        borderColor: schoolColorObj ? schoolColorObj.borderColor : `rgb(${r}, ${g}, ${b})`,
                        backgroundColor: schoolColorObj ? schoolColorObj.backgroundColor : `rgb(${r}, ${g}, ${b}, 0.5)`
                    }
                })
                const finalData = { labels: yearsList, datasets }
                setChartData(finalData)
            })
    }

    const handleGeoLocationData = (data) => {
        handleTableAndChartData(data, "Location")
    }

    const handleSpecializationWiseData = (data) => {
        handleTableAndChartData(data, "Specialization")
    }

    const handleFeeAdmissionCategoryWiseData = (data) => {
        handleTableAndChartData(data, "AdmissionCategory")
    }

    const handleFeeAdmissionSubCategoryWiseData = (data) => {
        handleTableAndChartData(data, "AdmissionSubCategory")
    }

    const handleTableAndChartData = (data, primaryKey) => {
        const { AUZ } = data[0]
        const keyNames = Object.keys(AUZ)
        const rowsToShow = []
        let id = 0
        for (const keyName of keyNames) {
            let count = AUZ[keyName]
            if(selectedGraph === "AdmissionCategory"){
                let fullNameObj = fullNameCategory.find(obj => obj.feeAdmissionCategoryShortName === keyName)
                rowsToShow.push({ "id": id, [primaryKey]: fullNameObj.feeAdmissionCategoryName, "Count": count, "Total": count })
            }else if(selectedGraph === "AdmissionSubCategory"){
                let fullNameObj = fullNameSubCategory.find(obj => obj.feeAdmissionSubCategoryShortName === keyName)
                rowsToShow.push({ "id": id, [primaryKey]: fullNameObj.feeAdmissionSubCategoryName, "Count": count, "Total": count })
            }else rowsToShow.push({ "id": id, [primaryKey]: keyName, "Count": count, "Total": count })

            id++
        }
        const totalRow = rowsToShow.reduce((acc, obj) => {
            const keys = Object.keys(obj)
            keys.splice(keys.indexOf(primaryKey), 1)
            keys.splice(keys.indexOf("id"), 1)
            keys.forEach(key => {
                if (!acc[key]) acc[key] = 0
                acc[key] += obj[key]
            })
            return acc
        }, {})
        rowsToShow.push({ "id": 9990909, [primaryKey]: "Total", ...totalRow })

        let columnNames = [];
        for (const obj of rowsToShow)
            columnNames.push(...Object.keys(obj))

        columnNames = [...new Set(columnNames)];
        columnNames.splice(columnNames.indexOf(primaryKey), 1);
        columnNames.splice(columnNames.indexOf("id"), 1);

        let columns = [{ field: primaryKey, headerName: primaryKey, flex: 1 }]
        for (const key of columnNames)
            columns.push({ field: key, headerName: key, flex: 1, type: 'number' })

        setTableColumns(columns)
        setTableRows(rowsToShow);

        const getValues = (row) => {
            const values = row.map(obj => obj["Count"] ? obj["Count"] : 0)
            return values
        }

        const rowsToShowChart = keyNames.map(keyName => {
            return { [primaryKey]: keyName, "Count": AUZ[keyName], "school_name_short": selectedSchools[0] }
        })

        const columnNamesToShow = [];
        for (const obj of rowsToShowChart)
            columnNamesToShow.push(...Object.keys(obj))

        let columnNamesChart = [...new Set([...columnNamesToShow])];
        columnNamesChart.splice(columnNamesChart.indexOf(primaryKey), 1);
        columnNamesChart.splice(columnNamesChart.indexOf("school_name_short"), 1);

        const datasets = columnNamesChart.map((row, i) => {
            const schoolColorObj = schoolColorsArray.find(obj => obj.schoolName === selectedSchools[0])
            const { r, g, b } = random_rgb()
            return {
                id: i + 1,
                label: selectedSchools[0],
                data: getValues(rowsToShowChart),
                borderColor: schoolColorObj ? schoolColorObj.borderColor : `rgb(${r}, ${g}, ${b})`,
                backgroundColor: schoolColorObj ? schoolColorObj.backgroundColor : `rgb(${r}, ${g}, ${b}, 0.5)`
            }
        })
        const finalData = { labels: keyNames, datasets }
        setChartData(finalData)
    }

    const random_rgb = () => {
        let o = Math.round, r = Math.random, s = 255;
        return { r: o(r() * s), g: o(r() * s), b: o(r() * s) }
    }

    const renderChart = () => {
        switch (selectedChart) {
            case 'verticalbar':
                return <VerticalBar data={chartData} title={selectedGraph} />
            case 'horizontalbar':
                return <HorizontalBar data={chartData} title={selectedGraph} />
            case 'line':
                return <LineChart data={chartData} title={selectedGraph} />
            case 'stackedbarvertical':
                return <StackedBar data={chartData} title={selectedGraph} vertical={true} />
            case 'stackedbarhorizontal':
                return <StackedBar data={chartData} title={selectedGraph} vertical={false} />
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
                            <InputLabel>Academic Year</InputLabel>
                            <Select size="medium" name="AcademicYear" value={selectedAcademicYear} label="Academic Year"
                                onChange={(e) => setSelectedAcademicYear(e.target.value)}>
                                {academicYears.map((obj, index) => (
                                    <MenuItem key={index} value={obj.ac_year}>
                                        {obj.ac_year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
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
                    {((selectedGraph === "GeoLocation" || selectedGraph === "GeoLocationCities") && countryList.length > 0) && <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <FormControl size="medium" fullWidth>
                            <InputLabel>Country</InputLabel>
                            <Select size="medium" name="country" value={selectedCountryId} label="Country"
                                onChange={(e) => setSelectedCountryId(e.target.value)}>
                                {countryList.map((obj, index) => (
                                    <MenuItem key={index} value={obj.id}>
                                        {obj.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>}
                    {(selectedGraph === "GeoLocationCities" && stateList.length > 0) && <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <FormControl size="medium" fullWidth>
                            <InputLabel>Province</InputLabel>
                            <Select size="medium" name="country" value={selectedStateId} label="Province"
                                onChange={(e) => setSelectedStateId(e.target.value)}>
                                {stateList.map((obj, index) => (
                                    <MenuItem key={index} value={obj.id}>
                                        {obj.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>}
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
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
                    <Grid container width="100%">
                        <Grid item xs={12} md={6} p={2} style={{ position: "relative" }}>
                            {Object.keys(chartData).length > 0 && <EnlargeChartIcon fontSize="medium" onClick={() => setEnlargeChart(!enlargeChart)} />}
                            {Object.keys(chartData).length > 0 ? renderChart() : null}
                        </Grid>
                        <Grid item xs={12} md={6} pt={10}>
                            <GridIndex rows={tableRows} columns={tableColumns} getRowId={row => row.id} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </>)
}

export default AdmissionPage