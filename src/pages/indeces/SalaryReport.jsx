import { useState, useEffect, lazy } from "react";
import {
  Box, Grid
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import useAlert from "../../hooks/useAlert.js";
import axios from "../../services/Api.js";
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);

const reportTypeList = [
  { value: "EarnedSummary", label: "Earned Summary" },
  { value: "EarnedCTC", label: "Earned CTC" },
];

const initialState = {
  rows: [],
  loading: false,
  fcYearId: null,
  fcYearList: [],
  reportType: reportTypeList[0].value
};

const SalaryReport = () => {
  const [{ loading, rows, fcYearId, fcYearList, reportType }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  useEffect(() => {
    setCrumbs([]);
    getFcYear();
  }, []);

  useEffect(() => {
    (fcYearId) && getData(fcYearId);
  }, [fcYearId]);

  const columns = [
    {
      field: "school",
      headerName: "Inst",
      flex: 1,
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
    }
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
        const totalRows = {
          "school": "Total",
          "JANUARY": res.data.data.reduce((acc, curr) => (acc + (curr.JANUARY ? Number(curr.JANUARY) : 0)), 0),
          "FEBRUARY": res.data.data.reduce((acc, curr) => (acc + (curr.FEBRUARY ? Number(curr.FEBRUARY) : 0 )), 0),
          "MARCH": res.data.data.reduce((acc, curr) => (acc + (curr.MARCH ? Number(curr.MARCH) :0)), 0),
          "APRIL": res.data.data.reduce((acc, curr) => (acc + (curr.APRIL ? Number(curr.APRIL) :0)), 0),
          "MAY": res.data.data.reduce((acc, curr) => (acc + (curr.MAY? Number(curr.MAY) :0)), 0),
          "JUNE": res.data.data.reduce((acc, curr) => (acc + (curr.JUNE ? Number(curr.JUNE) :0)), 0),
          "JULY": res.data.data.reduce((acc, curr) => (acc + (curr.JULY ? Number(curr.JULY) :0)), 0),
          "AUGUST": res.data.data.reduce((acc, curr) => (acc + (curr.AUGUST ? Number(curr.AUGUST) :0)), 0),
          "SEPTEMBER": res.data.data.reduce((acc, curr) => (acc + (curr.SEPTEMBER ? Number(curr.SEPTEMBER) :0)), 0),
          "OCTOBER": res.data.data.reduce((acc, curr) => (acc + (curr.OCTOBER ? Number(curr.OCTOBER):0)), 0),
          "NOVEMBER": res.data.data.reduce((acc, curr) => (acc + (curr.NOVEMBER ? Number(curr.NOVEMBER) : 0)), 0),
          "DECEMBER": res.data.data.reduce((acc, curr) => (acc + (curr.DECEMBER ? Number(curr.DECEMBER):0)), 0),
        };
        list.push(totalRows);
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
        maxHeight:"80vh",
        '& .row-header': {
          backgroundColor: '#376a7d',
          color: '#ffff'
        },
        '& .last-row': {
          backgroundColor: '#376a7d !important',
          color:'#ffff !important'
        },
      }}>
        <GridIndex
          rows={rows}
          columns={columns}
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
