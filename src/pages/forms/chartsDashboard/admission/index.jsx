import React, { lazy, useEffect, useState } from "react";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import axios from "../../../../services/Api";
import {
	Box,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import CloseIcon from "@mui/icons-material/Close";
import {
	HorizontalBar,
	LineChart,
	PieChart,
	StackedBar,
	VerticalBar,
} from "../Chart";
import moment from "moment";
import { IOSSwitch } from "../IOSSwitch";
import ClearIcon from "@mui/icons-material/Clear";
import CustomDatePicker from "../../../../components/Inputs/CustomDatePicker";
import { GroupedColumnTable } from "./groupColumnTable";
const GridIndex = lazy(() => import("../../../../components/GridIndex"));

const EnlargeChartIcon = styled(OpenInFullRoundedIcon)`
  position: absolute;
  right: 33px;
  top: 20px;
  color: #132353;
  cursor: pointer;

  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const CloseButton = styled(CloseIcon)`
  position: absolute;
  right: 33px;
  top: 20px;
  color: #132353;
  cursor: pointer;
`;

const ChartSection = styled.div`
  visibility: 1;
  opacity: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  transition: opacity 1s;
  z-index: 999;
  max-height: 100%;
  overflow: scroll;
`;

const ChartContainer = styled.div`
  max-width: 85%;
  margin: 90px auto;
  border-radius: 5px;
  width: 100%;
  position: relative;
  transition: all 2s ease-in-out;
  padding: 30px;
  background-color: #ffffff;
`;

const GraphOptions = [
	{ value: "Institute", label: "Institute" },
	{ value: "Year Wise", label: "Year Wise" },
	{ value: "Day Wise", label: "Day Wise" },
	{ value: "Programme", label: "Programme" },
	// { value: "Gender", label: "Gender" },
	{ value: "GeoLocation", label: "GeoLocation" },
	{ value: "AdmissionCategory", label: "Admission Category" },
	{ value: "Datewise Statistics", label: "Datewise Statistics" },
];

const ChartOptions = [
	{ value: "verticalbar", label: "Vertical Bar" },
	{ value: "horizontalbar", label: "Horizontal Bar" },
	{ value: "stackedbarvertical", label: "Stacked Bar(Vertical)" },
	{ value: "stackedbarhorizontal", label: "Stacked Bar(Horizontal)" },
	{ value: "line", label: "Line" },
	{ value: "pie", label: "Pie" },
];

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
];

const standardColors = [
	"rgb(255, 99, 132)",
	"rgb(54, 162, 235)",
	"rgb(255, 206, 86)",
	"rgb(75, 192, 192)",
	"rgb(153, 102, 255)",
	"rgb(255, 159, 64)",
	"rgb(233, 30, 99)",
	"rgb(63, 81, 181)",
	"rgb(0, 188, 212)",
	"rgb(255, 87, 34)",
	"rgb(76, 175, 80)",
	"rgb(139, 195, 74)",
	"rgb(205, 220, 57)",
	"rgb(255, 235, 59)",
	"rgb(121, 85, 72)",
	"rgb(158, 158, 158)",
	"rgb(96, 125, 139)",
	"rgb(244, 67, 54)",
	"rgb(33, 150, 243)",
	"rgb(3, 169, 244)",
];

const DEFAULT_CHART = "horizontalbar";
const DEFAULT_SELECTEDGRAPH = "Institute";
const DEFAULT_MONTH = new Date().getMonth() + 1;
const DEFAULT_YEAR = new Date().getFullYear();

const AdmissionPage = () => {
	const setCrumbs = useBreadcrumbs();
	const [loading, setLoading] = useState(true);
	const [tableRows, setTableRows] = useState([]);
	const [tableColumns, setTableColumns] = useState([]);
	const [chartData, setChartData] = useState({ labels: [], datasets: [] });
	const [pieChartData, setPieChartData] = useState([]);
	const [academicYears, setAcademicYears] = useState([]);
	const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
	const [selectedGraph, setSelectedGraph] = useState(DEFAULT_SELECTEDGRAPH);
	const [selectedChart, setSelectedChart] = useState(DEFAULT_CHART);
	const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);
	const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);
	const [yearOptions, setYearOptions] = useState([]);
	const [enlargeChart, setEnlargeChart] = useState(false);
	const [schoolColorsArray, setSchoolColorsArray] = useState([]);
	const [isTableView, setIsTableView] = useState(true);
	const [instituteList, setInstituteList] = useState([]);
	const [selectedInstitute, setSelectedInstitute] = useState("");
	const [allCountryList, setAllCountryList] = useState([]);
	const [countryList, setCountryList] = useState([]);
	const [stateList, setstateList] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [selectedCountry, setSlectedCountry] = useState("");
	const [selectedState, setSlectedState] = useState("");
	const [selectedCity, setSlectedCity] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [isGroupColumnTable, setIsGroupColumntable] = useState(false)
	const [data, setData] = useState([])

	useEffect(() => {
		setCrumbs([
			{ name: "Charts Dashboard", link: "/charts-dashboard" },
			{ name: "Admission" },
		]);
		getInstituteList();
		getSchoolColors();
		getAcademicYearList();
		getCountry();
	}, []);

	useEffect(() => {
		if (selectedGraph === "GeoLocation") {
			if (selectedCountry !== "") {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== "")
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== "")
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				handleApiCall(apiPath, handleGeoLocationWiseDataCountry);
			} else {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== "")
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				handleApiCall(apiPath, handleGeoLocationWiseData);
			}
		}
	}, [selectedCountry]);

	useEffect(() => {
		if (selectedGraph === "GeoLocation") {
			if (selectedCountry !== "" && selectedState !== "") {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== "")
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== "")
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				if (selectedState !== "")
					apiPath = apiPath + `stateId=${selectedState}&`;
				handleApiCall(apiPath, handleGeoLocationWiseDataState);
			} else if (selectedCountry !== "" && selectedState === "") {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== "")
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== "")
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				handleApiCall(apiPath, handleGeoLocationWiseDataCountry);
			} else {
				setCityList([]);
				setSlectedCity("");
			}
		}
	}, [selectedState]);

	useEffect(() => {
		if (selectedGraph === "GeoLocation") {
			if (selectedCountry !== "" && selectedState !== "") {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== "")
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== "")
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				if (selectedState !== "")
					apiPath = apiPath + `stateId=${selectedState}&`;
				if (selectedCity !== "") apiPath = apiPath + `cityId=${selectedCity}&`;
				handleApiCall(apiPath, handleGeoLocationWiseDataCity);
			}
		}
	}, [selectedCity]);

	useEffect(() => {
		if (selectedGraph !== "") {
			if (selectedGraph === "Institute" && selectedAcademicYear !== "")
				handleApiCall(
					`/api/misInstituteWiseReport?acYearId=${selectedAcademicYear}`,
					handleInstituteWiseData
				);
			else if (selectedGraph === "Year Wise")
				handleApiCall(`/api/misYearWiseReport`, handleYearWiseData);
			else if (selectedGraph === "Day Wise")
				handleApiCall(
					`/api/misDayWiseReport?month=${selectedMonth}&year=${selectedYear}`,
					handleDayWiseData
				);
			else if (selectedGraph === "Programme") {
				if (selectedAcademicYear !== "" && selectedInstitute !== "")
					handleApiCall(
						`/api/misProgramWiseReport?acYearId=${selectedAcademicYear}&schoolId=${selectedInstitute}`,
						handleProgrammeWiseData
					);
			} else if (selectedGraph === "Gender") {
				if (selectedInstitute !== "")
					handleApiCall(
						`/api/misGenderWiseReport?schoolId=${selectedInstitute}&acYearId=${selectedAcademicYear}`,
						handleGenderWiseData
					);
				else handleApiCall(`/api/misGenderWiseReport`, handleGenderWiseData);
			} else if (selectedGraph === "GeoLocation") {
				let apiPath = "/api/misGeolocationWiseReport?";
				if (selectedInstitute !== "")
					apiPath = apiPath + `schoolId=${selectedInstitute}&`;
				if (selectedCountry !== "")
					apiPath = apiPath + `countryId=${selectedCountry}&`;
				if (selectedState !== "")
					apiPath = apiPath + `stateId=${selectedState}&`;
				if (selectedCity !== "") apiPath = apiPath + `cityId=${selectedCity}&`;

				if (
					selectedCountry !== "" &&
					selectedState !== "" &&
					selectedCity !== ""
				)
					handleApiCall(apiPath, handleGeoLocationWiseDataCity);
				else if (selectedCountry !== "" && selectedState !== "")
					handleApiCall(apiPath, handleGeoLocationWiseDataState);
				else if (selectedCountry !== "")
					handleApiCall(apiPath, handleGeoLocationWiseDataCountry);
				else handleApiCall(apiPath, handleGeoLocationWiseData);
			} else if (selectedGraph === "AdmissionCategory") {
				handleApiCall(
					`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
					handleAdmissionCategory
				);
			} else if (selectedGraph === "Datewise Statistics") {
				const formattedDate = moment(selectedDate).format("DD-MM-YYYY");
				if (selectedInstitute !== "")
					handleApiCall(
						`/api/student/getCountOfAdmissionDate?date_of_admission=${formattedDate}&school_id=${selectedInstitute}`,
						handleDateWiseInstitute
					);
				else
					handleApiCall(
						`/api/student/getCountOfAdmissionDate?date_of_admission=${formattedDate}`,
						handleDateWise
					);
			}
		}
	}, [
		selectedGraph,
		selectedAcademicYear,
		selectedMonth,
		selectedYear,
		selectedInstitute,
		selectedDate,
	]);

	useEffect(() => {
		setSelectedAcademicYear(
			academicYears.length > 0 ? academicYears[0].ac_year_id : ""
		);
		setTableColumns([]);
		setTableRows([]);
		setChartData({ labels: [], datasets: [] });
	}, [selectedGraph]);

	useEffect(() => {
		if (Object.keys(chartData).length > 0) generatePieChartDataset();
		else setPieChartData([]);
	}, [chartData]);

	const getInstituteList = () => {
		axios
			.get("/api/institute/school")
			.then((res) => {
				setInstituteList(
					res.data.data.map((obj) => {
						return { label: obj.school_name_short, value: obj.school_id };
					})
				);
			})
			.catch((err) => {
				console.log(err);
			});
	};

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
				console.error(err);
				setAllCountryList([]);
			});
	};

	const getSchoolColors = async () => {
		await axios
			.get(
				`/api/institute/fetchAllSchoolDetail?page=${0}&page_size=${10000}&sort=created_date`
			)
			.then((Response) => {
				const response = Response.data.data;
				const schoolColorsArray = response.map((obj) => {
					let borderColor = "";
					let backgroundColor = "";
					const { school_color, school_name_short } = obj;
					if (
						school_color === "" ||
						school_color === undefined ||
						school_color === null
					) {
						const { r, g, b } = random_rgb();
						borderColor = `rgb(${r}, ${g}, ${b})`;
						backgroundColor = `rgb(${r}, ${g}, ${b}, 0.5)`;
					} else {
						borderColor = school_color;
						backgroundColor = `${school_color}80`;
					}

					return {
						borderColor,
						backgroundColor,
						schoolName: school_name_short,
					};
				});

				setSchoolColorsArray(schoolColorsArray);
			})
			.catch((err) => console.error(err));
	};

	const getAcademicYearList = () => {
		axios.get("/api/academic/academic_year").then((res) => {
			if (res.data.data.length <= 0) return;

			const yearsObj = res.data.data.filter((obj) => {
				const { current_year } = obj;
				if (current_year >= 2022) return obj;

				return null;
			});
			setAcademicYears(yearsObj);
			setSelectedAcademicYear(
				yearsObj.length > 0 ? yearsObj[0].ac_year_id : ""
			);
			setYearOptions(
				yearsObj.map((obj) => {
					return { label: obj.current_year, value: obj.current_year };
				})
			);
		});
	};

	const handleApiCall = (path, callback) => {
		setLoading(true);
		setIsGroupColumntable(false)
		axios
			.get(path)
			.then((res) => {
				if (res.data.data && res.data?.data?.length <= 0) {
					setTableColumns([]);
					setTableRows([]);
					setChartData({ labels: [], datasets: [] });
					setLoading(false);
					return;
				}
				setLoading(false);
				if (selectedGraph === "Datewise Statistics") callback(res.data);
				else callback(res.data.data);
			})
			.catch((err) => {
				console.log(err);
				setTableColumns([]);
				setTableRows([]);
				setChartData({ labels: [], datasets: [] });
				setLoading(false);
			});
	};

	const handleInstituteWiseData = (data) => {
		const rowsToShow = [];
		let studentEntryTotal = 0;
		let lateralEntrytotal = 0;
		let inActiveEntrytotal = 0;
		let graduatesEntrytotal = 0;
		let total_ = 0;
		let id = 0;
		for (const obj of data) {
			const { school_name, Total } = obj;
			rowsToShow.push({
				id: id,
				School: school_name,
				"Student Entry": obj["Student Entry"],
				"Lateral Entry": obj["Lateral Entry"],
				InActive: obj["InActive"],
				Graduates: obj["Graduates"],
				Total: Total,
			});
			studentEntryTotal += obj["Student Entry"];
			lateralEntrytotal += obj["Lateral Entry"];
			inActiveEntrytotal += obj["InActive"];
			graduatesEntrytotal += obj["Graduates"];
			total_ += obj["Total"];
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			School: "Total",
			"Student Entry": studentEntryTotal,
			"Lateral Entry": lateralEntrytotal,
			InActive: inActiveEntrytotal,
			Graduates: graduatesEntrytotal,
			Total: total_,
		});

		const columns = [
			{
				field: "School",
				headerName: "School",
				headerClassName: "header-bg",
				minWidth: 350,
				flex: 1,
			},
			{
				field: "Student Entry",
				headerName: "Regular",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Lateral Entry",
				headerName: "Lateral/WP",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "InActive",
				headerName: "Cancellation",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Graduates",
				headerName: "Graduates ",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Active",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
				cellClassName: "last-column",
			},
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Regular Entry",
				data: data.map((obj) =>
					obj["Student Entry"] ? obj["Student Entry"] : 0
				),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Lateral Entry",
				data: data.map((obj) =>
					obj["Lateral Entry"] ? obj["Lateral Entry"] : 0
				),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
			{
				id: 0,
				label: "InActive",
				data: data.map((obj) => (obj["InActive"] ? obj["InActive"] : 0)),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Graduates",
				data: data.map((obj) => (obj["Graduates"] ? obj["Graduates"] : 0)),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.school_name), datasets };
		setChartData(finalData);
	};

	const handleYearWiseData = (data) => {
		const rowsToShow = [];
		let studentEntryTotal = 0;
		let lateralEntrytotal = 0;
		let inActiveEntrytotal = 0;
		let graduatesEntrytotal = 0;
		let total_ = 0;
		let id = 0;
		for (const obj of data) {
			const { year, Total } = obj;
			rowsToShow.push({
				id: id,
				Year: year,
				"Student Entry": obj["Student Entry"],
				"Lateral Entry": obj["Lateral Entry"],
				InActive: obj["InActive"],
				Graduates: obj["Graduates"],
				Total: Total,
			});
			studentEntryTotal += obj["Student Entry"];
			lateralEntrytotal += obj["Lateral Entry"];
			inActiveEntrytotal += obj["InActive"];
			graduatesEntrytotal += obj["Graduates"];
			total_ += obj["Total"];
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			Year: "Total",
			"Student Entry": studentEntryTotal,
			"Lateral Entry": lateralEntrytotal,
			InActive: inActiveEntrytotal,
			Graduates: graduatesEntrytotal,
			Total: total_,
		});

		const columns = [
			{
				field: "Year",
				headerName: "Year",
				headerClassName: "header-bg",
				minWidth: 350,
				flex: 1,
			},
			{
				field: "Student Entry",
				headerName: "Regular",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Lateral Entry",
				headerName: "Lateral/WP",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "InActive",
				headerName: "Cancellation",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Graduates",
				headerName: "Graduates",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Active",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
				cellClassName: "last-column",
			},
		];
		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Regular Entry",
				data: data.map((obj) => obj["Student Entry"]),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 1,
				label: "Lateral Entry",
				data: data.map((obj) => obj["Lateral Entry"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
			{
				id: 1,
				label: "InActive",
				data: data.map((obj) => obj["InActive"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
			{
				id: 1,
				label: "Graduates",
				data: data.map((obj) => obj["Graduates"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.year), datasets };
		setChartData(finalData);
	};

	const handleDayWiseData = (data) => {
		const rowsToShow = [];
		let studentEntryTotal = 0;
		let lateralEntrytotal = 0;
		let total_ = 0;
		let id = 0;
		for (const obj of data) {
			const { created_day, Total } = obj;
			rowsToShow.push({
				id: id,
				Date: moment(created_day).format("DD-MM-YYYY"),
				"Student Entry": obj["Student Entry"],
				"Lateral Entry": obj["Laternal Entry"],
				Total: Total,
			});
			studentEntryTotal += obj["Student Entry"];
			lateralEntrytotal += obj["Laternal Entry"];
			total_ += obj["Total"];
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			Date: "Total",
			"Student Entry": studentEntryTotal,
			"Lateral Entry": lateralEntrytotal,
			Total: total_,
		});

		const columns = [
			{
				field: "Date",
				headerName: "Date",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "Student Entry",
				headerName: "Regular Entry",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Lateral Entry",
				headerName: "Lateral Entry",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Total",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
				cellClassName: "last-column",
			},
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Regular Entry",
				data: data.map((obj) => obj["Student Entry"]),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Lateral Entry",
				data: data.map((obj) => obj["Laternal Entry"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
		];

		const finalData = {
			labels: data.map((obj) => moment(obj.created_day).format("DD-MM-YYYY")),
			datasets,
		};
		setChartData(finalData);
	};

	const handleProgrammeWiseData = (data) => {
		const rowsToShow = [];
		let total = 0;
		let id = 0;
		for (const obj of data) {
			const { course, Total } = obj;
			rowsToShow.push({
				id: id,
				course: course,
				Total: Total,
			});
			total += Total;
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			course: "Total",
			Total: total,
		});

		const columns = [
			{
				field: "course",
				headerName: "Course",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Total",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
				cellClassName: "last-column",
			},
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Total",
				data: data.map((obj) => obj["Total"]),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.course), datasets };
		setChartData(finalData);
	};

	const handleGenderWiseData = (data) => {
		const rowsToShow = [];
		let studentEntryTotal = 0;
		let lateralEntrytotal = 0;
		let id = 0;
		for (const obj of data) {
			const { candidate_sex, Total } = obj;
			rowsToShow.push({
				id: id,
				sex: candidate_sex,
				"Student Entry": obj["Student Entry"],
				"Lateral Entry": obj["Laternal Entry"],
				Total: Total,
			});
			studentEntryTotal += obj["Student Entry"];
			lateralEntrytotal += obj["Laternal Entry"];
			id += 1;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			sex: "Total",
			"Student Entry": studentEntryTotal,
			"Lateral Entry": lateralEntrytotal,
			Total: lateralEntrytotal + studentEntryTotal,
		});

		const columns = [
			{
				field: "sex",
				headerName: "Sex",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "Student Entry",
				headerName: "Regular Entry",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Lateral Entry",
				headerName: "Lateral Entry",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			},
			{
				field: "Total",
				headerName: "Total",
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
				cellClassName: "last-column",
			},
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Regular Entry",
				data: data.map((obj) => obj["Student Entry"]),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Lateral Entry",
				data: data.map((obj) => obj["Laternal Entry"]),
				borderColor: `rgb(153, 151, 228)`,
				backgroundColor: `rgb(153, 151, 228, 0.5)`,
			},
		];

		const finalData = {
			labels: data.map((obj) => obj.candidate_sex),
			datasets,
		};
		setChartData(finalData);
	};

	const handleGeoLocationColumnAndRowData = (
		data,
		acYears,
		fieldName,
		headerName
	) => {
		const columns = [
			{
				field: fieldName,
				headerName: headerName,
				flex: 1,
				headerClassName: "header-bg",
			},
		];
		acYears.forEach((year) => {
			columns.push({
				field: year,
				headerName: year,
				flex: 1,
				type: "number",
				headerClassName: "header-bg",
			});
		});
		columns.push({
			field: "Total",
			headerName: "Total",
			flex: 1,
			type: "number",
			headerClassName: "header-bg",
			cellClassName: "last-column",
		});

		const rows = [];
		const groupedData = {};

		data.forEach((item) => {
			const { name, academicYear, total } = item;

			if (!groupedData[name]) {
				groupedData[name] = { [fieldName]: name, Total: 0 };

				acYears.forEach((year) => (groupedData[name][year] = 0));
			}

			groupedData[name][academicYear] = total;
			groupedData[name]["Total"] += total;
		});

		Object.values(groupedData).forEach((row) => rows.push(row));

		const rowsToShow = rows.map((row, i) => ({
			id: i + 1,
			...row,
		}));

		// Generate last row for column totals
		const lastRow = { id: "last_row_of_table", [fieldName]: "Total" };
		acYears.forEach((year) => {
			lastRow[year] = rows.reduce((sum, row) => sum + (row[year] || 0), 0);
		});
		lastRow["Total"] = rows.reduce((sum, row) => sum + (row["Total"] || 0), 0);
		rowsToShow.push(lastRow);

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = acYears.map((year, index) => {
			const color =
				index < standardColors.length
					? standardColors[index]
					: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255
					})`;

			return {
				id: year,
				label: year,
				data: data
					.filter((obj) => obj.academicYear === year)
					.reduce((acc, obj) => {
						acc[obj.name] = obj.total;
						return acc;
					}, {}),
				borderColor: color,
				backgroundColor: color.replace("rgb", "rgba").replace(")", ", 0.5)"),
			};
		});

		// Fill missing values with 0
		const labelNames = [...new Set(data.map((obj) => obj.name))];
		datasets.forEach((dataset) => {
			dataset.data = labelNames.map((label) => dataset.data[label] || 0);
		});

		const finalData = { labels: labelNames, datasets };
		setChartData(finalData);
	};

	const handleGeoLocationWiseData = (data) => {
		const acYears = [...new Set(data.map((obj) => obj.academicYear))]
			.filter((year) => parseInt(year) > 2022) // Filter years greater than 2022
			.sort((a, b) => a - b); // Sort the years in ascending order

		handleGeoLocationColumnAndRowData(data, acYears, "country", "Country");

		if (selectedCountry === "") {
			const countryId = [...new Set(data.map((obj) => obj.id))];
			const countriesToShow = allCountryList.filter((obj) => {
				return countryId.find((id) => id.toString() === obj.value.toString());
			});

			setCountryList(countriesToShow);
			setstateList([]);
			setCityList([]);
			setSlectedState("");
			setSlectedCity("");
		}
	};

	const handleGeoLocationWiseDataCountry = (data) => {
		const acYears = [...new Set(data.map((obj) => obj.academicYear))]
			.filter((year) => parseInt(year) > 2022) // Filter years greater than 2022
			.sort((a, b) => a - b); // Sort the years in ascending order

		handleGeoLocationColumnAndRowData(data, acYears, "state", "State");

		const allStates = [...new Map(data.map((obj) => [obj.id, obj])).values()];

		setstateList(
			allStates.map((obj) => ({
				value: obj.id,
				label: obj.name,
			}))
		);
		setCityList([]);
		setSlectedState("");
		setSlectedCity("");
	};

	const handleGeoLocationWiseDataState = (data) => {
		const acYears = [...new Set(data.map((obj) => obj.academicYear))]
			.filter((year) => parseInt(year) > 2022) // Filter years greater than 2022
			.sort((a, b) => a - b); // Sort the years in ascending order

		handleGeoLocationColumnAndRowData(data, acYears, "city", "City");

		const allCities = [...new Map(data.map((obj) => [obj.id, obj])).values()];

		setCityList(
			allCities.map((obj) => ({
				value: obj.id,
				label: obj.name,
			}))
		);
		setSlectedCity("");
	};

	const handleGeoLocationWiseDataCity = (data) => {
		const acYears = [...new Set(data.map((obj) => obj.academicYear))]
			.filter((year) => parseInt(year) > 2022) // Filter years greater than 2022
			.sort((a, b) => a - b); // Sort the years in ascending order

		handleGeoLocationColumnAndRowData(data, acYears, "city", "City");
	};

	const getAdmissionReports = (data, type) => {
		console.log(data, type, "From handleAdmissionCategory");

		if (
			data?.id !== "last_row_of_table" &&
			type === "Admission Category Report"
		) {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryReportSchoolWiseWithCategory?feeAdmissionId=${data?.feeAdmissionId}&acYearId=${selectedAcademicYear}`,
				admissionCategoryReportCallBack
			);
			setCrumbs([
				{ name: "Charts Dashboard", link: "/charts-dashboard" },
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{ name: data?.feeAdmissionType },
			]);
		}
		if (
			data?.id === "last_row_of_table" &&
			type === "Admission Category Report"
		) {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryTotalReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
				admissionCategoryReportInstituteWiseCallBack
			);
			setCrumbs([
				{ name: "Charts Dashboard", link: "/charts-dashboard" },
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{ name: "Institute Wise Report" },
			]);
		}
	};

	const admissionReports = (data, type) => {
		console.log(data, type, "hhhhhhhh");

		if (data?.id !== "last_row_of_table" && type === "Institute Wise") {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryReportSpecializationWise?schoolId=${data?.schoolId}&acYearId=${selectedAcademicYear}&feeAdmissionId=${data?.feeAdmissionId}`,
				instituteWiseCallBack
			);
			setCrumbs([
				{ name: "Charts Dashboard", link: "/charts-dashboard" },
				{
					name: "Admission",
					link: () => {
						console.log("ttt");
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{
					name: data?.feeAdmissionType,
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportSchoolWiseWithCategory?feeAdmissionId=${data?.feeAdmissionId}&acYearId=${selectedAcademicYear}`,
							admissionCategoryReportCallBack
						);
						setCrumbs([
							{ name: "Charts Dashboard", link: "/charts-dashboard" },
							{
								name: "Admission",
								link: () => {
									handleApiCall(
										`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
										handleAdmissionCategory
									);
								},
							},
							{ name: data?.feeAdmissionType },
						]);
					},
				},
				{ name: data?.schoolName },
			]);
		}
		if (data?.id === "last_row_of_table" && type === "Institute Wise") {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryReportInstituteWise?acYearId=${selectedAcademicYear}`,
				admissionCategoryReportInstituteWiseCallBack
			);
			setCrumbs([
				{ name: "Charts Dashboard", link: "/charts-dashboard" },
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{ name: "Institute Wise Report" },
			]);
		}
	};

	const admissionReportsSecondTable = (data, type) => {
		if (data?.id !== "last_row_of_table" && type === "secondtable") {			
			handleApiCall(
				`api/admissionCategoryReport/getAdmissionCategoryTotalReportAcademicYearAndSchoolWise?acYearId=${selectedAcademicYear}&schoolId=${data?.schoolId}`,
				admissionReportSecondTableInstituteWise
			);
			setCrumbs([
				{ name: "Charts Dashboard", link: "/charts-dashboard" },
				{
					name: "Admission",
					link: () => {
						console.log("ttt");
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{
					name: "Institute Wise Report",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryTotalReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							admissionCategoryReportInstituteWiseCallBack
						);
						setCrumbs([
							{ name: "Charts Dashboard", link: "/charts-dashboard" },
							{
								name: "Admission",
								link: () => {
									handleApiCall(
										`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
										handleAdmissionCategory
									);
								},
							},
							{ name: "Institute Wise Report" }
						]);
					},
				},
				{ name: data?.schoolName },
			]);
		}

		if (data?.id === "last_row_of_table" && type === "secondtable") {
			handleApiCall(
				`/api/admissionCategoryReport/getAdmissionCategoryProgramWiseTotalReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
				admissionReportSecondTableInstituteWise
			);
			setCrumbs([
				{ name: "Charts Dashboard", link: "/charts-dashboard" },
				{
					name: "Admission",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							handleAdmissionCategory
						);
					},
				},
				{
					name: "Institute Wise Report",
					link: () => {
						handleApiCall(
							`/api/admissionCategoryReport/getAdmissionCategoryTotalReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
							admissionCategoryReportInstituteWiseCallBack
						);
						setCrumbs([
							{ name: "Charts Dashboard", link: "/charts-dashboard" },
							{
								name: "Admission",
								link: () => {
									handleApiCall(
										`/api/admissionCategoryReport/getAdmissionCategoryReportAcademicYearWise?acYearId=${selectedAcademicYear}`,
										handleAdmissionCategory
									);
								},
							},
							{ name: "Institute Wise Report" },
						]);
					},
				},
				{ name: "All Institute" },
			]);
		}
	};

	const handleAdmissionCategory = (data) => {
		const rowsToShow = [];
		let id_ = 0;
		let intakeTotalCount = 0;
		let admittedTotalCount = 0;
		let vacantTotalCount = 0;
		for (const obj of data) {
			const { admitted, feeAdmissionId, feeAdmissionType, intake, vacant } =
				obj;
			rowsToShow.push({
				id: id_,
				feeAdmissionType: feeAdmissionType,
				admitted: admitted,
				feeAdmissionId: feeAdmissionId,
				intake: intake,
				vacant: vacant,
				Total: admitted + intake + vacant,
			});
			id_ += 1;
			intakeTotalCount += intake;
			admittedTotalCount += admitted;
			vacantTotalCount += vacant;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			feeAdmissionType: "Total",
			admitted: admittedTotalCount,
			feeAdmissionId: 999999,
			intake: intakeTotalCount,
			vacant: vacantTotalCount,
			Total: intakeTotalCount + admittedTotalCount + vacantTotalCount,
		});

		const columns = [
			{
				field: "feeAdmissionType",
				headerName: "Admission Type",
				flex: 1,
				headerClassName: "header-bg",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
							>
								{params.row.feeAdmissionType}
							</Typography>
						</>
					);
				},
			},
			{
				field: "intake",
				headerName: "Intake",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
							>
								{params.row.intake}
							</Typography>
						</>
					);
				},
			},
			{
				field: "admitted",
				headerName: "Admitted",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
							>
								{params.row.admitted}
							</Typography>
						</>
					);
				},
			},
			{
				field: "vacant",
				headerName: "Vacant",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => getAdmissionReports(params.row, "Admission Category Report")}
							>
								{params.row.vacant}
							</Typography>
						</>
					);
				},
			},
			// { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);
		setCrumbs([
			{ name: "Charts Dashboard", link: "/charts-dashboard" },
			{ name: "Admission" },
		]);
		const datasets = [
			{
				id: 0,
				label: "Intake",
				data: data.map((obj) => obj.intake),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Admitted",
				data: data.map((obj) => obj.admitted),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Vacant",
				data: data.map((obj) => obj.vacant),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = {
			labels: data.map((obj) => obj.feeAdmissionType),
			datasets,
		};
		setChartData(finalData);
	};

	const admissionCategoryReportCallBack = (data) => {
		const rowsToShow = [];
		let id_ = 0;
		let intakeTotalCount = 0;
		let admittedTotalCount = 0;
		let vacantTotalCount = 0;
		for (const obj of data) {
			const {
				schoolName,
				admitted,
				feeAdmissionId,
				intake,
				vacant,
				schoolId,
				feeAdmissionType,
			} = obj;

			rowsToShow.push({
				id: id_,
				schoolId: schoolId,
				schoolName: schoolName,
				admitted: admitted,
				feeAdmissionType: feeAdmissionType,
				feeAdmissionId: feeAdmissionId,
				intake: intake,
				vacant: vacant,
				Total: admitted + intake + vacant,
			});
			id_ += 1;
			intakeTotalCount += intake;
			admittedTotalCount += admitted;
			vacantTotalCount += vacant;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			schoolName: "Total",
			admitted: admittedTotalCount,
			feeAdmissionId: 999999,
			intake: intakeTotalCount,
			vacant: vacantTotalCount,
			Total: intakeTotalCount + admittedTotalCount + vacantTotalCount,
		});

		const columns = [
			{
				field: "schoolName",
				headerName: "School Name",
				flex: 1,
				headerClassName: "header-bg",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReports(params.row, "Institute Wise")}
							>
								{params.row.schoolName}
							</Typography>
						</>
					);
				},
			},
			{
				field: "intake",
				headerName: "Intake",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReports(params.row, "Institute Wise")}
							>
								{params.row.intake}
							</Typography>
						</>
					);
				},
			},
			{
				field: "admitted",
				headerName: "Admitted",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReports(params.row, "Institute Wise")}
							>
								{params.row.admitted}
							</Typography>
						</>
					);
				},
			},
			{
				field: "vacant",
				headerName: "Vacant",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReports(params.row, "Institute Wise")}
							>
								{params.row.vacant}
							</Typography>
						</>
					);
				},
			},
			// { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Intake",
				data: data.map((obj) => obj.intake),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Admitted",
				data: data.map((obj) => obj.admitted),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Vacant",
				data: data.map((obj) => obj.vacant),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.schoolName), datasets };
		setChartData(finalData);
	};

	const admissionCategoryReportInstituteWiseCallBack = (data) => {
		const rowsToShow = [];
		let id_ = 0;
		let intakeTotalCount = 0;
		let admittedTotalCount = 0;
		let vacantTotalCount = 0;
		for (const obj of data) {
			const { schoolName, admitted, feeAdmissionId, intake, vacant, schoolId } = obj;
			rowsToShow.push({
				id: id_,
				schoolName: schoolName,
				admitted: admitted,
				feeAdmissionId: feeAdmissionId,
				schoolId: schoolId,
				intake: intake,
				vacant: vacant,
				Total: admitted + intake + vacant,
			});
			id_ += 1;
			intakeTotalCount += intake;
			admittedTotalCount += admitted;
			vacantTotalCount += vacant;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			schoolName: "Total",
			admitted: admittedTotalCount,
			feeAdmissionId: 999999,
			intake: intakeTotalCount,
			vacant: vacantTotalCount,
			schoolId: "schoolId",
			Total: intakeTotalCount + admittedTotalCount + vacantTotalCount,
		});

		const columns = [
			{
				field: "schoolName",
				headerName: "School Name",
				flex: 1,
				headerClassName: "header-bg",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReportsSecondTable(params.row, "secondtable")}
							>
								{params.row.schoolName}
							</Typography>
						</>
					);
				},
			},
			{
				field: "intake",
				headerName: "Intake",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReportsSecondTable(params.row, "secondtable")}
							>
								{params.row.intake}
							</Typography>
						</>
					);
				},
			},
			{
				field: "admitted",
				headerName: "Admitted",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReportsSecondTable(params.row, "secondtable")}
							>
								{params.row.admitted}
							</Typography>
						</>
					);
				},
			},
			{
				field: "vacant",
				headerName: "Vacant",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
								onClick={() => admissionReportsSecondTable(params.row, "secondtable")}
							>
								{params.row.vacant}
							</Typography>
						</>
					);
				},
			},
			// { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Intake",
				data: data.map((obj) => obj.intake),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Admitted",
				data: data.map((obj) => obj.admitted),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Vacant",
				data: data.map((obj) => obj.vacant),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.schoolName), datasets };
		setChartData(finalData);
	};

	const instituteWiseCallBack = (data) => {
		const rowsToShow = [];
		let id_ = 0;
		let intakeTotalCount = 0;
		let admittedTotalCount = 0;
		let vacantTotalCount = 0;
		for (const obj of data) {
			const {
				schoolName,
				admitted,
				feeAdmissionId,
				intake,
				vacant,
				program_short_name,
				program_specialization_short_name,
				fee_admission_category_type,
			} = obj;
			rowsToShow.push({
				id: id_,
				schoolName: schoolName,
				program_short_name: program_short_name,
				program_specialization_short_name: program_specialization_short_name,
				fee_admission_category_type: fee_admission_category_type,
				admitted: admitted,
				feeAdmissionId: feeAdmissionId,
				intake: intake,
				vacant: vacant,
				Total: admitted + intake + vacant,
			});
			id_ += 1;
			intakeTotalCount += intake;
			admittedTotalCount += admitted;
			vacantTotalCount += vacant;
		}

		rowsToShow.push({
			id: "last_row_of_table",
			schoolName: "Total",
			admitted: admittedTotalCount,
			feeAdmissionId: 999999,
			intake: intakeTotalCount,
			vacant: vacantTotalCount,
			Total: intakeTotalCount + admittedTotalCount + vacantTotalCount,
		});

		const columns = [
			{
				field: "schoolName",
				headerName: "School",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "program_short_name",
				headerName: "Program",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "program_specialization_short_name",
				headerName: "Specialization",
				flex: 1,
				headerClassName: "header-bg",
			},
			// { field: "fee_admission_category_type", headerName: "Category", flex: 1, headerClassName: "header-bg", hide: true },
			{
				field: "intake",
				headerName: "Intake",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
				renderCell: (params) => {
					return (
						<>
							<Typography
								sx={{ cursor: "pointer" }}
							//   onClick={() => getAdmissionReports(params.row,"AdmissionCategoryReport")}
							>
								{params.row.intake}
							</Typography>
						</>
					);
				},
			},
			{
				field: "admitted",
				headerName: "Admitted",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
			},
			{
				field: "vacant",
				headerName: "Vacant",
				flex: 1,
				headerClassName: "header-bg",
				type: "number",
			},
			// { field: "Total", headerName: "Total", flex: 1, type: 'number', headerClassName: "header-bg", cellClassName: "last-column" },
		];

		setTableColumns(columns);
		setTableRows(rowsToShow);

		const datasets = [
			{
				id: 0,
				label: "Intake",
				data: data.map((obj) => obj.intake),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Admitted",
				data: data.map((obj) => obj.admitted),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
			{
				id: 0,
				label: "Vacant",
				data: data.map((obj) => obj.vacant),
				borderColor: `rgb(19, 35, 83)`,
				backgroundColor: `rgb(19, 35, 83, 0.5)`,
			},
		];

		const finalData = { labels: data.map((obj) => obj.schoolName), datasets };
		setChartData(finalData);
	};

	const admissionReportSecondTableInstituteWise = (data) => {
		setIsGroupColumntable(true)
		setData(data)
	}

	// const getStudentDetailsGeoloactionWiseCallBack = data => {

	//     const rowsToShow = []
	//     let id_ = 0
	//     let intakeTotalCount = 0
	//     let admittedTotalCount = 0
	//     let vacantTotalCount = 0
	//     for (const obj of data) {
	//         const { student_name,date_of_admission, admitted, feeAdmissionId, intake, vacant, program_short_name, program_specialization_short_name, fee_admission_category_type } = obj
	//         rowsToShow.push({
	//             "id": id_, "student_name": student_name,"date_of_admission":date_of_admission, "program_short_name": program_short_name, "program_specialization_short_name": program_specialization_short_name, "fee_admission_category_type": fee_admission_category_type, "admitted": admitted,
	//             "feeAdmissionId": feeAdmissionId, "intake": intake, "vacant": vacant, "Total": admitted + intake + vacant
	//         })
	//         id_ += 1
	//         intakeTotalCount += intake
	//         admittedTotalCount += admitted
	//         vacantTotalCount += vacant
	//     }

	//     rowsToShow.push({
	//         "id": "last_row_of_table", "student_name": "Total", "admitted": admittedTotalCount,
	//         "feeAdmissionId": 999999, "intake": intakeTotalCount, "vacant": vacantTotalCount,
	//         "Total": intakeTotalCount + admittedTotalCount + vacantTotalCount
	//     })

	//     const columns = [
	//         { field: "student_name", headerName: "Student", flex: 1, headerClassName: "header-bg" },
	//         { field: "program_short_name", headerName: "Program", flex: 1, headerClassName: "header-bg" },
	//         { field: "program_specialization_short_name", headerName: "Specialization", flex: 1, headerClassName: "header-bg" },
	//         {
	//             field: "date_of_admission",
	//             headerName: "DOA",
	//             flex: 1,
	//             headerClassName: "header-bg"
	//           },

	//     ]

	//     setTableColumns(columns)
	//     setTableRows(rowsToShow)

	//     const datasets = [
	//         {
	//             id: 0,
	//             label: "Intake",
	//             data: data.map(obj => obj.intake),
	//             borderColor: `rgb(19, 35, 83)`,
	//             backgroundColor: `rgb(19, 35, 83, 0.5)`
	//         },
	//         {
	//             id: 0,
	//             label: "Admitted",
	//             data: data.map(obj => obj.admitted),
	//             borderColor: `rgb(19, 35, 83)`,
	//             backgroundColor: `rgb(19, 35, 83, 0.5)`
	//         },
	//         {
	//             id: 0,
	//             label: "Vacant",
	//             data: data.map(obj => obj.vacant),
	//             borderColor: `rgb(19, 35, 83)`,
	//             backgroundColor: `rgb(19, 35, 83, 0.5)`
	//         },
	//     ]

	//     const finalData = { labels: data.map(obj => obj.schoolName), datasets }
	//     setChartData(finalData)
	// }
	// const getStudentDetailsGeoloactionWise = (data, type) => {
	//     if (data?.countryID) {
	//         let apiPath = "/api/getStudentDetailsGeoloactionWise?"
	//         if (selectedAcademicYear !== "") apiPath = apiPath + `acYearId=${selectedAcademicYear}&`
	//         if (selectedInstitute !== "") apiPath = apiPath + `schoolId=${selectedInstitute}&countryId=${data?.countryID}&`
	//         handleApiCall(apiPath, getStudentDetailsGeoloactionWiseCallBack)
	//     } else {
	//         let apiPath = "/api/getStudentDetailsGeoloactionWise?"
	//         if (selectedAcademicYear !== "") apiPath = apiPath + `acYearId=${selectedAcademicYear}&`
	//         if (selectedInstitute !== "") apiPath = apiPath + `schoolId=${selectedInstitute}&`
	//         handleApiCall(apiPath, getStudentDetailsGeoloactionWiseCallBack)
	//     }
	//     setCrumbs([
	//         { name: "Charts Dashboard", link: "/charts-dashboard" },
	//         { name: type },
	//     ])
	// }

	const handleDateWise = (data) => {
		// Filter data for years >= 2022-2023
		const filteredData = data.filter((item) => item.ac_year >= "2023-2024");

		// Get unique school names
		const schoolNames = [
			...new Set(filteredData.map((item) => item.school_name_short)),
		];

		// Get academic years >= 2022-2023
		const academicYears = [
			...new Set(filteredData.map((item) => item.ac_year)),
		].sort();

		// Create the grouped structure
		const result = schoolNames.map((school, i) => {
			const row = { schoolName: school };

			academicYears.forEach((year) => {
				const entry = filteredData.find(
					(item) => item.school_name_short === school && item.ac_year === year
				);
				row[year] = entry ? entry.studentCount : 0;
			});
			row.id = `${school}__${i}`;

			return row;
		});

		// Add the "Total" row
		const totalRow = { schoolName: "Total", id: "last_row_of_table" };
		academicYears.forEach((year) => {
			totalRow[year] = filteredData
				.filter((item) => item.ac_year === year)
				.reduce((sum, item) => sum + item.studentCount, 0);
		});
		result.push(totalRow);

		const columns = [
			{
				field: "schoolName",
				headerName: "School Name",
				flex: 1,
				headerClassName: "header-bg",
			},
		];

		columns.push(
			...academicYears.map((year, i) => {
				if (academicYears.length === i + 1)
					return {
						field: year,
						headerName: year,
						flex: 1,
						headerClassName: "header-bg",
						type: "number",
						cellClassName: (params) => {
							if (params.row.id === "last_row_of_table") {
								return "";
							}
							return academicYears.length === i + 1 ? "latest-year" : "";
						},
					};

				return {
					field: year,
					headerName: year,
					flex: 1,
					headerClassName: "header-bg",
					type: "number",
				};
			})
		);

		setTableColumns(columns);
		setTableRows(result);
	};

	const handleDateWiseInstitute = (data) => {
		// Filter data for years >= 2023-2024
		const filteredData = data.filter((item) => item.ac_year >= "2023-2024");

		// Get unique combinations of program and specialization names
		const programmeSpecializations = [
			...new Set(
				filteredData.map(
					(item) =>
						`${item.program_short_name} (${item.program_specialization_short_name})`
				)
			),
		];

		// Get academic years >= 2023-2024
		const academicYears = [
			...new Set(filteredData.map((item) => item.ac_year)),
		].sort();

		// Create the grouped structure
		const result = programmeSpecializations.map((programmeSpec, i) => {
			const [programme, specialization] = programmeSpec.split(" ("); // Separate program and specialization
			const row = {
				programmeName: programme,
				specialization: specialization.replace(")", ""),
			};

			academicYears.forEach((year) => {
				const entry = filteredData.find(
					(item) =>
						`${item.program_short_name} (${item.program_specialization_short_name})` ===
						programmeSpec && item.ac_year === year
				);
				row[year] = entry ? entry.studentCount : 0;
			});

			row.id = `${programme}__${specialization}__${i}`;
			return row;
		});

		// Add the "Total" row
		const totalRow = { programmeName: "Total", id: "last_row_of_table" };
		academicYears.forEach((year) => {
			totalRow[year] = filteredData
				.filter((item) => item.ac_year === year)
				.reduce((sum, item) => sum + item.studentCount, 0);
		});
		result.push(totalRow);

		const columns = [
			{
				field: "programmeName",
				headerName: "Programme",
				flex: 1,
				headerClassName: "header-bg",
			},
			{
				field: "specialization",
				headerName: "Specialization",
				flex: 1,
				headerClassName: "header-bg",
			},
		];

		columns.push(
			...academicYears.map((year, i) => {
				if (academicYears.length === i + 1)
					return {
						field: year,
						headerName: year,
						flex: 1,
						headerClassName: "header-bg",
						type: "number",
						cellClassName: (params) => {
							if (params.row.id === "last_row_of_table") {
								return "";
							}
							return academicYears.length === i + 1 ? "latest-year" : "";
						},
					};

				return {
					field: year,
					headerName: year,
					flex: 1,
					headerClassName: "header-bg",
					type: "number",
				};
			})
		);

		setTableColumns(columns);
		setTableRows(result);
	};

	const random_rgb = () => {
		let o = Math.round,
			r = Math.random,
			s = 255;
		return { r: o(r() * s), g: o(r() * s), b: o(r() * s) };
	};

	const renderChart = () => {
		if (chartData.datasets.length <= 0)
			return <h3 style={{ textAlign: "center" }}>No Data found!!!</h3>;

		switch (selectedChart) {
			case "verticalbar":
				return (
					<VerticalBar
						data={chartData}
						title={selectedGraph}
						showDataLabel={false}
					/>
				);
			case "horizontalbar":
				return (
					<HorizontalBar
						data={chartData}
						title={selectedGraph}
						showDataLabel={false}
					/>
				);
			case "line":
				return (
					<LineChart
						data={chartData}
						title={selectedGraph}
						showDataLabel={false}
					/>
				);
			case "stackedbarvertical":
				return (
					<StackedBar
						data={chartData}
						title={selectedGraph}
						vertical={true}
						showDataLabel={false}
					/>
				);
			case "stackedbarhorizontal":
				return (
					<StackedBar
						data={chartData}
						title={selectedGraph}
						vertical={false}
						showDataLabel={false}
					/>
				);
			case "pie":
				if (chartData.datasets.length === 1)
					return (
						<Grid container sx={{ justifyContent: "center" }}>
							<Grid
								item
								xs={12}
								md={12}
								lg={chartData.datasets.length === 1 ? 8 : 12}
							>
								<PieChart
									data={{
										labels: chartData.labels,
										datasets:
											pieChartData.length > 0
												? pieChartData[0].datasets
												: chartData.datasets,
									}}
									title={selectedGraph}
									showDataLabel={true}
								/>
							</Grid>
						</Grid>
					);
				else {
					return (
						<Grid container>
							{pieChartData.map((dataset, index) => (
								<Grid item xs={12} md={12} lg={6} pb={10} key={index}>
									<PieChart
										data={dataset}
										title={dataset.datasets[0].label}
										showDataLabel={true}
									/>
								</Grid>
							))}
						</Grid>
					);
				}
			default:
				return <h3 style={{ textAlign: "center" }}>No Data found!!!</h3>;
		}
	};

	const generatePieChartDataset = () => {
		const backgroundColor = [
			"rgb(255, 99, 132, 0.5)",
			"rgb(54, 162, 235, 0.5)",
			"rgb(255, 206, 86, 0.5)",
			"rgb(75, 192, 192, 0.5)",
			"rgb(153, 102, 255, 0.5)",
			"rgb(255, 159, 64, 0.5)",
			"rgb(255, 99, 132, 0.5)",
			"rgb(201, 203, 207, 0.5)",
			"rgb(255, 205, 86, 0.5)",
			"rgb(75, 192, 192, 0.5)",
			"rgb(54, 162, 235, 0.5)",
			"rgb(241, 92, 96, 0.5)",
			"rgb(131, 66, 16, 0.5)",
			"rgb(100, 221, 23, 0.5)",
			"rgb(0, 188, 212, 0.5)",
			"rgb(255, 82, 82, 0.5)",
			"rgb(63, 81, 181, 0.5)",
			"rgb(255, 127, 0, 0.5)",
			"rgb(129, 212, 250, 0.5)",
			"rgb(123, 31, 162, 0.5)",
		];

		const borderColor = [
			"rgb(255, 99, 132)",
			"rgb(54, 162, 235)",
			"rgb(255, 206, 86)",
			"rgb(75, 192, 192)",
			"rgb(153, 102, 255)",
			"rgb(255, 159, 64)",
			"rgb(255, 99, 132)",
			"rgb(201, 203, 207)",
			"rgb(255, 205, 86)",
			"rgb(75, 192, 192)",
			"rgb(54, 162, 235)",
			"rgb(241, 92, 96)",
			"rgb(131, 66, 16)",
			"rgb(100, 221, 23)",
			"rgb(0, 188, 212)",
			"rgb(255, 82, 82)",
			"rgb(63, 81, 181)",
			"rgb(255, 127, 0)",
			"rgb(129, 212, 250)",
			"rgb(123, 31, 162)",
		];
		const { datasets, labels } = chartData;

		const data = datasets.map((data, i) => {
			return {
				labels,
				datasets: [
					{
						data: data.data,
						backgroundColor: backgroundColor.slice(0, data.data.length),
						borderColor: borderColor.slice(0, data.data.length),
						label: data.label,
					},
				],
			};
		});
		setPieChartData(data);
	};

	return (
		<>
			<Grid
				container
				alignItems="center"
				justifyContent="space-between"
				pt={3}
				rowGap={4}
			>
				{enlargeChart && (
					<ChartSection>
						<ChartContainer>
							<Grid item xs={12} sm={12} md={12} lg={12} xl={12} p={2}>
								<CloseButton
									fontSize="large"
									onClick={() => setEnlargeChart(false)}
								/>
								{renderChart()}
							</Grid>
						</ChartContainer>
					</ChartSection>
				)}

				<Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ zIndex: 3 }}>
					<Grid container columnGap={1} rowGap={2}>
						<Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
							<FormControl size="medium" fullWidth>
								<InputLabel>Graph By</InputLabel>
								<Select
									size="medium"
									name="graph"
									value={selectedGraph}
									label="Graph by"
									onChange={(e) => setSelectedGraph(e.target.value)}
								>
									{GraphOptions.map((obj, index) => (
										<MenuItem key={index} value={obj.value}>
											{obj.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{selectedGraph === "Datewise Statistics" && (
							<Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
								<CustomDatePicker
									name="Datewise"
									label="Datewise"
									value={selectedDate}
									handleChangeAdvance={(name, newValue) =>
										setSelectedDate(newValue)
									}
								/>
							</Grid>
						)}

						{selectedGraph !== "Year Wise" &&
							selectedGraph !== "Day Wise" &&
							selectedGraph !== "GeoLocation" &&
							selectedGraph !== "Datewise Statistics" && (
								<Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
									<FormControl size="medium" fullWidth>
										<InputLabel>Academic Year</InputLabel>
										<Select
											size="medium"
											name="AcademicYear"
											value={selectedAcademicYear}
											label="Academic Year"
											onChange={(e) => setSelectedAcademicYear(e.target.value)}
										>
											{academicYears.map((obj, index) => (
												<MenuItem key={index} value={obj.ac_year_id}>
													{obj.ac_year}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							)}

						{selectedGraph === "GeoLocation" && (
							<>
								<Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
									<FormControl size="medium" fullWidth>
										<InputLabel>Country</InputLabel>
										<Select
											size="medium"
											name="Country"
											value={selectedCountry}
											label="Country"
											onChange={(e) => setSlectedCountry(e.target.value)}
											endAdornment={
												<InputAdornment
													sx={{ marginRight: "10px" }}
													position="end"
												>
													<IconButton onClick={() => setSlectedCountry("")}>
														<ClearIcon />
													</IconButton>
												</InputAdornment>
											}
										>
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
										<Select
											size="medium"
											name="State"
											value={selectedState}
											label="State"
											onChange={(e) => setSlectedState(e.target.value)}
											endAdornment={
												<InputAdornment
													sx={{ marginRight: "10px" }}
													position="end"
												>
													<IconButton onClick={() => setSlectedState("")}>
														<ClearIcon />
													</IconButton>
												</InputAdornment>
											}
										>
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
										<Select
											size="medium"
											name="City"
											value={selectedCity}
											label="City"
											onChange={(e) => setSlectedCity(e.target.value)}
											endAdornment={
												<InputAdornment
													sx={{ marginRight: "10px" }}
													position="end"
												>
													<IconButton onClick={() => setSlectedCity("")}>
														<ClearIcon />
													</IconButton>
												</InputAdornment>
											}
										>
											{cityList.map((obj, index) => (
												<MenuItem key={index} value={obj.value}>
													{obj.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</>
						)}

						{(selectedGraph === "Programme" ||
							selectedGraph === "Gender" ||
							selectedGraph === "GeoLocation" ||
							selectedGraph === "Datewise Statistics") && (
								<Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
									<FormControl size="medium" fullWidth>
										<InputLabel>Institute</InputLabel>
										<Select
											size="medium"
											name="Institute"
											value={selectedInstitute}
											label="Institute"
											onChange={(e) => setSelectedInstitute(e.target.value)}
											endAdornment={
												<InputAdornment
													sx={{ marginRight: "10px" }}
													position="end"
												>
													<IconButton onClick={() => setSelectedInstitute("")}>
														<ClearIcon />
													</IconButton>
												</InputAdornment>
											}
										>
											{instituteList.map((obj, index) => (
												<MenuItem key={index} value={obj.value}>
													{obj.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							)}

						{selectedGraph === "Day Wise" && (
							<>
								<Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
									<FormControl size="medium" fullWidth>
										<InputLabel>Month</InputLabel>
										<Select
											size="medium"
											name="month"
											value={selectedMonth}
											label="Month"
											onChange={(e) => setSelectedMonth(e.target.value)}
										>
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
										<Select
											size="medium"
											name="year"
											value={selectedYear}
											label="Year"
											onChange={(e) => setSelectedYear(e.target.value)}
										>
											{yearOptions.map((obj, index) => (
												<MenuItem key={index} value={obj.value}>
													{obj.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</>
						)}

						<Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
							<FormControl size="medium" fullWidth>
								<InputLabel>Chart</InputLabel>
								<Select
									size="medium"
									name="chart"
									value={selectedChart}
									label="Chart"
									onChange={(e) => setSelectedChart(e.target.value)}
									disabled={
										chartData.datasets.length <= 0 ||
										pieChartData.length <= 0 ||
										selectedGraph === "Datewise Statistics"
									}
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

				<Grid container spacing={2}>
					<Grid item xs={12}>
						<FormGroup>
							<Box sx={{ display: "flex", gap: "40px" }}>
								<Stack direction="row" spacing={1} alignItems="center">
									<Typography>Chart view</Typography>
									<FormControlLabel
										control={
											<IOSSwitch
												sx={{ m: 1 }}
												ischecked={isTableView}
												handlechange={() => setIsTableView(!isTableView)}
												disabled={selectedGraph === "Datewise Statistics" || isGroupColumnTable}
											/>
										}
									/>
									<Typography>Table view</Typography>
								</Stack>
							</Box>
						</FormGroup>
						<Grid container sx={{ justifyContent: "center" }}>
							{isTableView ? (
								<Grid
									item
									xs={12}
									md={12}
									lg={isGroupColumnTable ? [...new Set(data.map((item) => item.fee_admission_category_short_name))].length > 2 ? 12 : 8 : tableColumns.length <= 4 ? 8 : 12}
									pt={1}
									sx={{
										"& .last-row": {
											fontWeight: "bold",
											backgroundColor: "#376a7d !important",
											color: "#fff",
										},
										"& .last-column": { fontWeight: "bold" },
										"& .last-row:hover": {
											backgroundColor: "#376a7d !important",
											color: "#fff",
										},
										"& .header-bg": {
											fontWeight: "bold",
											backgroundColor: "#376a7d",
											color: "#fff",
										},
										"& .latest-year": {
											color: "#000",
											fontWeight: "bold"
										},
									}}
								>
									{isGroupColumnTable ? <GroupedColumnTable data={data} /> :
										<GridIndex
											rows={tableRows}
											columns={tableColumns}
											getRowId={(row) => row.id}
											isRowSelectable={(params) =>
												tableRows.length - 1 !== params.row.id
											}
											getRowClassName={(params) => {
												return params.row.id === "last_row_of_table"
													? "last-row"
													: "";
											}}
											loading={loading}
										/>}
								</Grid>
							) : (
								<Grid
									item
									xs={12}
									md={12}
									lg={12}
									p={3}
									style={{ position: "relative" }}
								>
									{Object.keys(chartData).length > 0 && (
										<EnlargeChartIcon
											fontSize="medium"
											onClick={() => setEnlargeChart(!enlargeChart)}
										/>
									)}
									{Object.keys(chartData).length > 0 ? renderChart() : null}
								</Grid>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

export default AdmissionPage;
