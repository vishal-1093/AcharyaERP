import { useState, useEffect, lazy } from "react";
import {
  Box, Grid,
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import useAlert from "../../hooks/useAlert.js";
import axios from "../../services/Api.js";
import CustomToggle from "../../components/Inputs/CustomToggle";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const reportTypeList = [
  { value: "earnedSalary", label: "Earned Salary" },
  { value: "earnedCTC", label: "Earned CTC" },
  { value: "masterSalary", label: "Master Salary" },
];

const employeeTypeList = [
  { value: "regular", label: "Regular" },
  { value: "consultant", label: "Consultant" },
];

const initialState = {
  rows: [],
  loading: false,
  fcYearId: null,
  fcYearList: [],
  reportType: reportTypeList[0].value,
  salaryColumns: [],
  countColumns: [],
  employeeType: employeeTypeList[0].value,
  schoolRows: []
};

const SalaryReport = () => {
  const [{ loading, rows, fcYearId, fcYearList, reportType, countColumns, salaryColumns, employeeType, schoolRows }, setState] = useState(initialState);
  const [showCount, setShowCount] = useState(false);
  const [isSchoolCount, setIsSchoolCount] = useState(false);
  const [isSchool, setIsSchool] = useState(false);
  const [rowDetailData, setRowDetailData] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  useEffect(() => {
    setCrumbs([]);
    getFcYear();
  }, []);

  useEffect(() => {
    (fcYearId && reportType == "earnedSalary" && employeeType == "regular") && getData(fcYearId);
    (fcYearId && reportType == "earnedSalary" && employeeType == "consultant") && getConsultantEarnedSalaryData(fcYearId);
    (fcYearId && reportType == "masterSalary") && getMasterData(fcYearId);
    (fcYearId && reportType == "earnedCTC" && employeeType == "regular") && getEarnedCtcData(fcYearId);
    (fcYearId && reportType == "earnedCTC" && employeeType == "consultant") && getEarnedCtcConsultantData(fcYearId);
  }, [reportType, fcYearId, showCount, employeeType]);

  useEffect(() => {
    (rowDetailData && isSchool) && getSchoolWiseData(rowDetailData)
  }, [isSchoolCount]);

  useEffect(() => {
    (isSchool && rowDetailData) ? setCrumbs([{ name: "Earned CTC", link: () => setIsSchool(false) },
    { name: rowDetailData?.month },
    { name: `${rowDetailData?.grossAmount}`},
    { name: `${rowDetailData?.netAmount}`}
    ]) : setCrumbs([]);
  }, [isSchool]);

  const countColumn = [
    {
      field: "school",
      headerName: "Inst",
      flex: 1,
      headerClassName: 'row-header',
    },
    {
      field: "APRILCOUNT",
      headerName: "Apr",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "MAYCOUNT",
      headerName: "May",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "JUNECOUNT",
      headerName: "Jun",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "JULYCOUNT",
      headerName: "Jul",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "AUGUSTCOUNT",
      headerName: "Aug",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },

    {
      field: "SEPTEMBERCOUNT",
      headerName: "Sept",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "OCTOBERCOUNT",
      headerName: "Oct",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "NOVEMBERCOUNT",
      headerName: "Nov",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "DECEMBERCOUNT",
      headerName: "Dec",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "JANUARYCOUNT",
      headerName: "Jan",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "FEBRUARYCOUNT",
      headerName: "Feb",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "MARCHCOUNT",
      headerName: "Mar",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },

  ];

  const salaryColumn = [
    {
      field: "school",
      headerName: "Inst",
      flex: 1,
      headerClassName: 'row-header',
    },
    {
      field: "APRIL",
      headerName: "Apr",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "MAY",
      headerName: "May",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "JUNE",
      headerName: "Jun",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "JULY",
      headerName: "Jul",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "AUGUST",
      headerName: "Aug",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },

    {
      field: "SEPTEMBER",
      headerName: "Sept",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "OCTOBER",
      headerName: "Oct",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "NOVEMBER",
      headerName: "Nov",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "DECEMBER",
      headerName: "Dec",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "JANUARY",
      headerName: "Jan",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "FEBRUARY",
      headerName: "Feb",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "MARCH",
      headerName: "Mar",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
  ];

  const ctcColumn = [
    {
      field: "month",
      headerName: "Month",
      flex: 1,
      headerClassName: 'row-header',
    },
    {
      field: "grossAmount",
      headerName: "Gross",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "netAmount",
      headerName: "Net",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "detail",
      headerName: "Detail",
      flex: 1,
      headerClassName: 'row-header',
      type: "actions",
      getActions: (params) => {
        if (params.id === rows[rows.length - 1].id) {
          return [];
        }
        return [
          <HtmlTooltip title="View Schools Detail">
            <IconButton
              onClick={() => getSchoolWiseData(params.row)}
            >
              <OpenInNewIcon color="primary" />
            </IconButton>
          </HtmlTooltip>
        ]
      }
    },
  ];

  const ctcCountColumn = [
    {
      field: "month",
      headerName: "Month",
      flex: 1,
      headerClassName: 'row-header',
    },
    {
      field: "grossCount",
      headerName: "Gross",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "netCount",
      headerName: "Net",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "detail",
      headerName: "Detail",
      flex: 1,
      headerClassName: 'row-header',
      type: "actions",
      getActions: (params) => {
        if (params.id === rows[rows.length - 1].id) {
          return [];
        }
        return [
          <HtmlTooltip title="View School Wise Data">
            <IconButton
              onClick={() => getSchoolWiseData(params.row)}
            >
              <OpenInNewIcon color="primary" />
            </IconButton>
          </HtmlTooltip>
        ]
      }
    },
  ];

  const schoolColumn = [
    {
      field: "school",
      headerName: "Inst",
      flex: 1,
      headerClassName: 'row-header',
    },
    {
      field: "grossAmount",
      headerName: "Gross",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "netPay",
      headerName: "Net",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
  ];

  const schoolCountColumn = [
    {
      field: "school",
      headerName: "Inst",
      flex: 1,
      headerClassName: 'row-header',
    },
    {
      field: "grossCount",
      headerName: "Gross",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    },
    {
      field: "netCount",
      headerName: "Net",
      flex: 1,
      type: "number",
      headerClassName: 'row-header',
    }
  ];

  const getFcYear = async () => {
    try {
      const res = await axios.get(`/api/FinancialYear`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data.map((ele) => ({ value: ele.financial_year_id, label: ele.financial_year }));
        const fcYearLists = list.filter((val) => (val.label).slice(0, 4) > "2024");
        setState((prevState) => ({
          ...prevState,
          fcYearId: fcYearLists[0].value,
          fcYearList: fcYearLists,
        }));
      }
    } catch (error) {
      console.log(error)
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const employeeTypeReset = () => {
    setState((prevState) => ({
      ...prevState,
      employeeType: employeeTypeList[0].value
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "reportType") employeeTypeReset()
    setState((prevState) => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const getData = async (fcyearId = null) => {
    try {
      setLoading(true);
      const res = await axios.get(`api/consoliation/getEarnedSummary?fcYearID=${fcyearId}`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data;
        const totalSalaryRows = {
          "school": "Total",
          "JANUARY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JANUARY ? Number(curr.JANUARY) : 0)), 0),
          "FEBRUARY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.FEBRUARY ? Number(curr.FEBRUARY) : 0)), 0),
          "MARCH": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MARCH ? Number(curr.MARCH) : 0)), 0),
          "APRIL": "" + res.data.data.reduce((acc, curr) => (acc + (curr.APRIL ? Number(curr.APRIL) : 0)), 0),
          "MAY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MAY ? Number(curr.MAY) : 0)), 0),
          "JUNE": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JUNE ? Number(curr.JUNE) : 0)), 0),
          "JULY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JULY ? Number(curr.JULY) : 0)), 0),
          "AUGUST": "" + res.data.data.reduce((acc, curr) => (acc + (curr.AUGUST ? Number(curr.AUGUST) : 0)), 0),
          "SEPTEMBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.SEPTEMBER ? Number(curr.SEPTEMBER) : 0)), 0),
          "OCTOBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.OCTOBER ? Number(curr.OCTOBER) : 0)), 0),
          "NOVEMBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.NOVEMBER ? Number(curr.NOVEMBER) : 0)), 0),
          "DECEMBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.DECEMBER ? Number(curr.DECEMBER) : 0)), 0),
        };
        const totalCountRows = {
          "school": "Total",
          "JANUARYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JANUARYCOUNT ? Number(curr.JANUARYCOUNT) : 0)), 0),
          "FEBRUARYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.FEBRUARYCOUNT ? Number(curr.FEBRUARYCOUNT) : 0)), 0),
          "MARCHCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MARCHCOUNT ? Number(curr.MARCHCOUNT) : 0)), 0),
          "APRILCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.APRILCOUNT ? Number(curr.APRILCOUNT) : 0)), 0),
          "MAYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MAYCOUNT ? Number(curr.MAYCOUNT) : 0)), 0),
          "JUNECOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JUNECOUNT ? Number(curr.JUNECOUNT) : 0)), 0),
          "JULYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JULYCOUNT ? Number(curr.JULYCOUNT) : 0)), 0),
          "AUGUSTCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.AUGUSTCOUNT ? Number(curr.AUGUSTCOUNT) : 0)), 0),
          "SEPTEMBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.SEPTEMBERCOUNT ? Number(curr.SEPTEMBERCOUNT) : 0)), 0),
          "OCTOBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.OCTOBERCOUNT ? Number(curr.OCTOBERCOUNT) : 0)), 0),
          "NOVEMBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.NOVEMBERCOUNT ? Number(curr.NOVEMBERCOUNT) : 0)), 0),
          "DECEMBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.DECEMBERCOUNT ? Number(curr.DECEMBERCOUNT) : 0)), 0),
        };
        const filterCountColumn = countColumn.filter((f) => list?.some((s) => s[`${f.field}`] !== "" && s[`${f.field}`] !== null && s[`${f.field}`] !== undefined));
        const filterSalaryColumn = salaryColumn.filter((f) => list?.some((s) => s[`${f.field}`] !== "" && s[`${f.field}`] !== null && s[`${f.field}`] !== undefined));
        showCount ? list.push(totalCountRows) : list.push(totalSalaryRows);
        setState((prevState) => ({
          ...prevState,
          countColumns: filterCountColumn,
          salaryColumns: filterSalaryColumn,
          rows: list.map((ele, index) => ({ ...ele, id: index + 1 })),
          loading: false
        }));
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const getMasterData = async (fcyearId = null) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/consoliation/masterSummary?fcYearID=${fcyearId}`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data;
        const totalSalaryRows = {
          "school": "Total",
          "JANUARY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JANUARY ? Number(curr.JANUARY) : 0)), 0),
          "FEBRUARY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.FEBRUARY ? Number(curr.FEBRUARY) : 0)), 0),
          "MARCH": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MARCH ? Number(curr.MARCH) : 0)), 0),
          "APRIL": "" + res.data.data.reduce((acc, curr) => (acc + (curr.APRIL ? Number(curr.APRIL) : 0)), 0),
          "MAY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MAY ? Number(curr.MAY) : 0)), 0),
          "JUNE": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JUNE ? Number(curr.JUNE) : 0)), 0),
          "JULY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JULY ? Number(curr.JULY) : 0)), 0),
          "AUGUST": "" + res.data.data.reduce((acc, curr) => (acc + (curr.AUGUST ? Number(curr.AUGUST) : 0)), 0),
          "SEPTEMBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.SEPTEMBER ? Number(curr.SEPTEMBER) : 0)), 0),
          "OCTOBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.OCTOBER ? Number(curr.OCTOBER) : 0)), 0),
          "NOVEMBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.NOVEMBER ? Number(curr.NOVEMBER) : 0)), 0),
          "DECEMBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.DECEMBER ? Number(curr.DECEMBER) : 0)), 0),
        };
        const totalCountRows = {
          "school": "Total",
          "JANUARYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JANUARYCOUNT ? Number(curr.JANUARYCOUNT) : 0)), 0),
          "FEBRUARYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.FEBRUARYCOUNT ? Number(curr.FEBRUARYCOUNT) : 0)), 0),
          "MARCHCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MARCHCOUNT ? Number(curr.MARCHCOUNT) : 0)), 0),
          "APRILCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.APRILCOUNT ? Number(curr.APRILCOUNT) : 0)), 0),
          "MAYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MAYCOUNT ? Number(curr.MAYCOUNT) : 0)), 0),
          "JUNECOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JUNECOUNT ? Number(curr.JUNECOUNT) : 0)), 0),
          "JULYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JULYCOUNT ? Number(curr.JULYCOUNT) : 0)), 0),
          "AUGUSTCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.AUGUSTCOUNT ? Number(curr.AUGUSTCOUNT) : 0)), 0),
          "SEPTEMBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.SEPTEMBERCOUNT ? Number(curr.SEPTEMBERCOUNT) : 0)), 0),
          "OCTOBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.OCTOBERCOUNT ? Number(curr.OCTOBERCOUNT) : 0)), 0),
          "NOVEMBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.NOVEMBERCOUNT ? Number(curr.NOVEMBERCOUNT) : 0)), 0),
          "DECEMBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.DECEMBERCOUNT ? Number(curr.DECEMBERCOUNT) : 0)), 0),
        };
        const filterCountColumn = countColumn.filter((f) => list?.some((s) => s[`${f.field}`] !== "" && s[`${f.field}`] !== null && s[`${f.field}`] !== undefined));
        const filterSalaryColumn = salaryColumn.filter((f) => list?.some((s) => s[`${f.field}`] !== "" && s[`${f.field}`] !== null && s[`${f.field}`] !== undefined));
        showCount ? list.push(totalCountRows) : list.push(totalSalaryRows);
        setState((prevState) => ({
          ...prevState,
          countColumns: filterCountColumn,
          salaryColumns: filterSalaryColumn,
          rows: list.map((ele, index) => ({ ...ele, id: index + 1 })),
          loading: false
        }));
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const getConsultantEarnedSalaryData = async (fcyearId = null) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/consoliation/consultantEarnedSummary?fcYearID=${fcyearId}`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data;
        const totalSalaryRows = {
          "school": "Total",
          "JANUARY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JANUARY ? Number(curr.JANUARY) : 0)), 0),
          "FEBRUARY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.FEBRUARY ? Number(curr.FEBRUARY) : 0)), 0),
          "MARCH": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MARCH ? Number(curr.MARCH) : 0)), 0),
          "APRIL": "" + res.data.data.reduce((acc, curr) => (acc + (curr.APRIL ? Number(curr.APRIL) : 0)), 0),
          "MAY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MAY ? Number(curr.MAY) : 0)), 0),
          "JUNE": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JUNE ? Number(curr.JUNE) : 0)), 0),
          "JULY": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JULY ? Number(curr.JULY) : 0)), 0),
          "AUGUST": "" + res.data.data.reduce((acc, curr) => (acc + (curr.AUGUST ? Number(curr.AUGUST) : 0)), 0),
          "SEPTEMBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.SEPTEMBER ? Number(curr.SEPTEMBER) : 0)), 0),
          "OCTOBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.OCTOBER ? Number(curr.OCTOBER) : 0)), 0),
          "NOVEMBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.NOVEMBER ? Number(curr.NOVEMBER) : 0)), 0),
          "DECEMBER": "" + res.data.data.reduce((acc, curr) => (acc + (curr.DECEMBER ? Number(curr.DECEMBER) : 0)), 0),
        };
        const totalCountRows = {
          "school": "Total",
          "JANUARYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JANUARYCOUNT ? Number(curr.JANUARYCOUNT) : 0)), 0),
          "FEBRUARYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.FEBRUARYCOUNT ? Number(curr.FEBRUARYCOUNT) : 0)), 0),
          "MARCHCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MARCHCOUNT ? Number(curr.MARCHCOUNT) : 0)), 0),
          "APRILCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.APRILCOUNT ? Number(curr.APRILCOUNT) : 0)), 0),
          "MAYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.MAYCOUNT ? Number(curr.MAYCOUNT) : 0)), 0),
          "JUNECOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JUNECOUNT ? Number(curr.JUNECOUNT) : 0)), 0),
          "JULYCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.JULYCOUNT ? Number(curr.JULYCOUNT) : 0)), 0),
          "AUGUSTCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.AUGUSTCOUNT ? Number(curr.AUGUSTCOUNT) : 0)), 0),
          "SEPTEMBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.SEPTEMBERCOUNT ? Number(curr.SEPTEMBERCOUNT) : 0)), 0),
          "OCTOBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.OCTOBERCOUNT ? Number(curr.OCTOBERCOUNT) : 0)), 0),
          "NOVEMBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.NOVEMBERCOUNT ? Number(curr.NOVEMBERCOUNT) : 0)), 0),
          "DECEMBERCOUNT": "" + res.data.data.reduce((acc, curr) => (acc + (curr.DECEMBERCOUNT ? Number(curr.DECEMBERCOUNT) : 0)), 0),
        };
        const filterCountColumn = countColumn.filter((f) => list?.some((s) => s[`${f.field}`] !== "" && s[`${f.field}`] !== null && s[`${f.field}`] !== undefined));
        const filterSalaryColumn = salaryColumn.filter((f) => list?.some((s) => s[`${f.field}`] !== "" && s[`${f.field}`] !== null && s[`${f.field}`] !== undefined));
        showCount ? list.push(totalCountRows) : list.push(totalSalaryRows);
        setState((prevState) => ({
          ...prevState,
          countColumns: filterCountColumn,
          salaryColumns: filterSalaryColumn,
          rows: list.map((ele, index) => ({ ...ele, id: index + 1 })),
          loading: false
        }));
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const getEarnedCtcData = async (fcyearId = null) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/consoliation/earnedCTC?fcYearID=${fcyearId}`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data.map((li) => ({ ...li, grossCount: li.count, netCount: li.count }));
        const totalSalaryRows = {
          "month": "Total",
          "grossAmount": "" + list.reduce((acc, curr) => (acc + (curr.grossAmount ? Number(curr.grossAmount) : 0)), 0),
          "netAmount": "" + list.reduce((acc, curr) => (acc + (curr.netAmount ? Number(curr.netAmount) : 0)), 0),
        };
        const totalCountRows = {
          "month": "Total",
          "grossCount": "" + list.reduce((acc, curr) => (acc + (curr.grossCount ? Number(curr.grossCount) : 0)), 0),
          "netCount": "" + list.reduce((acc, curr) => (acc + (curr.netCount ? Number(curr.netCount) : 0)), 0),
        };
        showCount ? list.push(totalCountRows) : list.push(totalSalaryRows);
        setState((prevState) => ({
          ...prevState,
          rows: list.map((ele, index) => ({ ...ele, id: index + 1 })),
          loading: false
        }));
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const getEarnedCtcConsultantData = async (fcyearId = null) => {
    try {
      setLoading(true);
      const res = await axios.get(`api/consoliation/consultantCTC?fcYearID=${fcyearId}`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data.map((li) => ({ ...li, grossCount: li.count, netCount: li.count }));
        const totalSalaryRows = {
          "month": "Total",
          "grossAmount": "" + list.reduce((acc, curr) => (acc + (curr.grossAmount ? Number(curr.grossAmount) : 0)), 0),
          "netAmount": "" + list.reduce((acc, curr) => (acc + (curr.netAmount ? Number(curr.netAmount) : 0)), 0),
        };
        const totalCountRows = {
          "month": "Total",
          "grossCount": "" + list.reduce((acc, curr) => (acc + (curr.grossCount ? Number(curr.grossCount) : 0)), 0),
          "netCount": "" + list.reduce((acc, curr) => (acc + (curr.netCount ? Number(curr.netCount) : 0)), 0),
        };
        showCount ? list.push(totalCountRows) : list.push(totalSalaryRows);
        setState((prevState) => ({
          ...prevState,
          rows: list.map((ele, index) => ({ ...ele, id: index + 1 })),
          loading: false
        }));
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const getSchoolWiseData = async (rowData) => {
    try {
      setRowDetailData(rowData);
      setIsSchool(true);
      setLoading(true);
      const monthNo = rowData.month == "APRIL" ? 4 : rowData.month == "MAY" ? 5 : rowData.month == "JUNE" ? 6 : rowData.month == "JULY" ? 7 :
        rowData.month == "AUGUST" ? 8 : rowData.month == "SEPTEMBER" ? 9 : rowData.month == "OCTOBER" ? 10 : rowData.month == "NOVEMBER" ? 11 :
          rowData.month == "DECEMBER" ? 12 : rowData.month == "JANUARY" ? 1 : rowData.month == "FEBRUARY" ? 2 : rowData.month == "MARCH" ? 3 : "";
      const url = employeeType == "regular" ? `/api/consoliation/getMonthWiseEarnedCTC` : `/api/consoliation/getMonthWiseConsultantCTC`
      const res = await axios.get(`${url}?month=${monthNo}&year=${rowData.year}`);
      const list = res.data.data.map((li) => ({ ...li, grossCount: li.count, netCount: li.count }));
      const totalSalaryRows = {
        "school": "Total",
        "grossAmount": "" + list.reduce((acc, curr) => (acc + (curr.grossAmount ? Number(curr.grossAmount) : 0)), 0),
        "netPay": "" + list.reduce((acc, curr) => (acc + (curr.netPay ? Number(curr.netPay) : 0)), 0),
      };
      const totalCountRows = {
        "school": "Total",
        "grossCount": "" + list.reduce((acc, curr) => (acc + (curr.grossCount ? Number(curr.grossCount) : 0)), 0),
        "netCount": "" + list.reduce((acc, curr) => (acc + (curr.netCount ? Number(curr.netCount) : 0)), 0),
      };
      isSchoolCount ? list.push(totalCountRows) : list.push(totalSalaryRows);
      if (res.status == 200 || res.status == 201) {
        setLoading(false);
        setState((prevState) => ({
          ...prevState,
          schoolRows: list.map((li, index) => ({ ...li, id: index + 1 }))
        }))
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  return (
    <Box
      sx={{
        position: "relative"
      }}
    >
      {!isSchool && <Grid container rowSpacing={{ xs: 1, md: 0 }} columnSpacing={{ xs: 3 }} sx={{ marginTop: { xs: 2, md: 0 }, justifyContent: "flex-start" }}>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="reportType"
            value={reportType}
            label="Report Type"
            handleChangeAdvance={handleChangeAdvance}
            options={reportTypeList || []}
            required
          />
        </Grid>
        {reportType !== "masterSalary" && <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="employeeType"
            value={employeeType}
            label="Employee Type"
            handleChangeAdvance={handleChangeAdvance}
            options={employeeTypeList || []}
            required
          />
        </Grid>}

        <Grid item xs={12} md={2} align="center">
          <CustomToggle
            isVisible={showCount}
            onToggle={() => setShowCount(!showCount)}
            label="Count"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="fcYearId"
            value={fcYearId}
            label="FC Year"
            handleChangeAdvance={handleChangeAdvance}
            options={fcYearList || []}
            required
          />
        </Grid>
      </Grid>}
      {isSchool && <Grid container sx={{ marginTop: { xs: 1, md: -6 }, justifyContent: "flex-end" }}>
        <Grid item xs={12} md={2} align="center">
          <CustomToggle
            isVisible={isSchoolCount}
            onToggle={() => setIsSchoolCount(!isSchoolCount)}
            label="Count"
          />
        </Grid>
      </Grid>}
      <Box mt={2} sx={{
        position: "absolute",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        '& .row-header': {
          backgroundColor: '#376a7d',
          color: '#ffff'
        },
        '& .last-row': {
          backgroundColor: '#376a7d !important',
          color: '#ffff !important',
          cursor: 'none !important'
        },
      }}>
        <Box sx={{
          width: (countColumns.length < 6 || salaryColumns.length < 6 || ctcColumn.length < 6 || ctcCountColumn.length < 6 ||
            schoolColumn.length < 6 || schoolCountColumn.length < 6) ? '50%' : '100%'
        }}>
          {!isSchool && <GridIndex
            rows={rows}
            columns={reportType !== "earnedCTC" ? (showCount ? countColumns : salaryColumns) :
              (reportType == "earnedCTC") ? (showCount ? ctcCountColumn : ctcColumn) : []
            }
            loading={loading}
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel}
            getRowClassName={(params) =>
              params.id === rows[rows.length - 1].id ? 'last-row' : ''
            }
            getRowId={row => row.id}
            isRowSelectable={(params) => params.id != rows[rows.length - 1].id}
          />}
          {isSchool && <GridIndex
            rows={schoolRows}
            columns={isSchoolCount ? schoolCountColumn : schoolColumn}
            loading={loading}
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel}
            getRowClassName={(params) =>
              params.id === schoolRows[schoolRows.length - 1].id ? 'last-row' : ''
            }
            getRowId={row => row.id}
            isRowSelectable={(params) => params.id != schoolRows[schoolRows.length - 1].id}
          />}
        </Box>
      </Box>
    </Box>
  )
};

export default SalaryReport;
