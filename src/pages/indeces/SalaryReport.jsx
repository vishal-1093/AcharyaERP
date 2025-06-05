import { useState, useEffect, lazy } from "react";
import {
  Box, Grid
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import useAlert from "../../hooks/useAlert.js";
import axios from "../../services/Api.js";
import CustomToggle from "../../components/Inputs/CustomToggle";
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);

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
};

const SalaryReport = () => {
  const [{ loading, rows, fcYearId, fcYearList, reportType, countColumns, salaryColumns,employeeType }, setState] = useState(initialState);
  const [showCount, setShowCount] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  useEffect(() => {
    setCrumbs([]);
    getFcYear();
  }, []);

  useEffect(() => {
    (fcYearId && reportType == "earnedSalary" && employeeType == "regular") && getData(fcYearId);
    (fcYearId && reportType == "masterSalary" && employeeType == "regular") && getMasterData(fcYearId);
    (fcYearId && reportType == "earnedSalary" && employeeType == "consultant") && getConsultantEarnedSalaryData(fcYearId);
  }, [reportType, fcYearId, showCount]);

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

  const getFcYear = async () => {
    try {
      const res = await axios.get(`/api/FinancialYear`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          fcYearList: res.data.data.map((ele) => ({ value: ele.financial_year_id, label: ele.financial_year })),
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
  const handleChangeAdvance = (name, newValue) => {
    setState((prevState) => ({
      ...prevState,
      [name]: newValue
    }));
    (name == "fcYearId") && getData(newValue)
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


  return (
    <Box
      sx={{
        position: "relative"
      }}
    >
      <Grid container rowSpacing={{ xs: 1, md: 0 }} columnSpacing={{ xs: 3 }} sx={{ marginTop: { xs: 2, md: 0 }, justifyContent: "flex-end" }}>
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
        {reportType == "earnedSalary" && <Grid item xs={12} md={2}>
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
          />
        </Grid>
      </Grid>
      <Box mt={1} sx={{
        position: "absolute",
        width: "100%",
        maxHeight: "80vh",
        '& .row-header': {
          backgroundColor: '#376a7d',
          color: '#ffff'
        },
        '& .last-row': {
          backgroundColor: '#376a7d !important',
          color: '#ffff !important'
        },
      }}>
        <GridIndex
          rows={rows}
          columns={showCount ? countColumns : salaryColumns}
          loading={loading}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
          getRowClassName={(params) =>
            params.id === rows[rows.length - 1].id ? 'last-row' : ''
          }
          getRowId={row => row.id}
          isRowSelectable={(params) => params.id != rows[rows.length - 1].id}
        />
      </Box>
    </Box>
  )

};

export default SalaryReport;
