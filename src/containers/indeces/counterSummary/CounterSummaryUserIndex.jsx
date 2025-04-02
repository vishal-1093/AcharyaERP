import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/TotalGridIndex.jsx";
import {
  Box,
  Button,
  Grid,
  Typography
} from "@mui/material";
import axios from "../../../services/Api.js";
import moment from "moment";
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);

const todayDate = new Date();

const initialValues = {
  startDate: todayDate,
  endDate: todayDate,
  cashTotal: 0,
  ddTotal: 0,
  onlineTotal: 0,
  paymentTotal: 0,
  closingTotal: 0
};;

function CounterSummaryUserIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getData(values);
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const setNull = () => {
    setRows([]);
    setValues((prevState) => ({
      ...prevState,
      cashTotal: 0,
      ddTotal: 0,
      onlineTotal: 0,
      paymentTotal: 0,
      closingTotal: 0
    }))
  };

  const handleFilter = (formValue) => {
    getData(formValue)
  };

  const getData = async (value) => {
    if (value.startDate && value.endDate) {
      let params = `fromDate=${moment(value.startDate).format("YYYY-MM-DD")}&toDate=${moment(value.endDate).format("YYYY-MM-DD")}`;
      await axios
        .get(`/api/finance/getCounterSummary?${params}`)
        .then((res) => {
          const grandTotalCash = res.data.data?.reduce((sum, acc) => sum + acc.CASH, 0);
          const grandTotalDD = res.data.data?.reduce((sum, acc) => sum + acc.DD, 0);
          const grandTotalOnline = res.data.data?.reduce((sum, acc) => sum + acc.ONLINE, 0);
          const grandTotalPayment = res.data.data.reduce((sum, acc) => sum + acc.payment, 0);
          const grandTotalClosing = (grandTotalCash) - (grandTotalPayment);
          setRows(res.data.data.map((li, index) => ({ ...li, id: index + 1 })));
          setValues((prevState) => ({
            ...prevState,
            cashTotal: grandTotalCash,
            ddTotal: grandTotalDD,
            onlineTotal: grandTotalOnline,
            paymentTotal: grandTotalPayment,
            closingTotal: grandTotalClosing
          }))
        })
        .catch((err) => console.error(err));
    }
  };

  const columns = [
    {
      field: "createdUsername", headerName: "Name", flex: 1,
      hideable:false
    },
    {
      field: "CASH",
      headerName: "Cash",
      flex: 1,
      type: "number",
      hideable:false,
      renderCell: (params) => (params.row?.CASH || 0)
    },
    {
      field: "DD",
      headerName: "DD",
      flex: 1,
      type: "number",
      hideable:false,
      renderCell: (params) => (params.row?.DD || 0)
    },
    {
      field: "ONLINE",
      headerName: "Online",
      flex: 1,
      type: "number",
      hideable:false,
      renderCell: (params) => ( params.row?.ONLINE.toFixed(2) || 0)
    },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      type: "number",
      hideable:false,
      renderCell: (params) => (params.row.payment || 0)
    },
    {
      field: "closing",
      headerName: "Closing",
      flex: 1,
      type: "number",
      hideable:false,
      valueGetter: (value,row) => ((row?.CASH - row?.payment) || 0)
    }
  ];

  const cashBankTotalFooter = () => (
    <Box
      sx={{
        padding: 1,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Grand Total
          </Typography>
        </Grid>
        <Grid item xs={2} align="right">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {values.cashTotal}
          </Typography>
        </Grid>
        <Grid item xs={2} align="right">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {values.ddTotal}
          </Typography>
        </Grid>
        <Grid item xs={2} align="right">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {values.onlineTotal.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={2} align="right">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {values.paymentTotal}
          </Typography>
        </Grid>
        <Grid item xs={2} align="right">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {values.closingTotal}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Grid container sx={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: { xs: 2, md: -5 }}}>
        <Grid item xs={12} md={2}>
          <CustomDatePicker
            name="startDate"
            label="From Date"
            value={values.startDate}
            handleChangeAdvance={handleChangeAdvance}
            helperText=""
            required
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomDatePicker
            name="endDate"
            label="To Date"
            minDate={values.startDate}
            value={values.endDate}
            handleChangeAdvance={handleChangeAdvance}
            disabled={!values.startDate}
            helperText=""
            required
          />
        </Grid>

        <Grid xs={12} md={1} align="right">
          <Button
            onClick={() => handleFilter(values)}
            variant="contained"
            disabled={!(values.startDate && values.endDate)}
            disableElevation
          >
          Submit
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ position: "relative"}}>        
        <Box sx={{ position: "absolute", width: "100%", marginTop: "10px" }}>
          <GridIndex rows={rows} columns={columns} TotalCustomFooter={cashBankTotalFooter } />
        </Box>
      </Box>
    </Box>
  );
}

export default CounterSummaryUserIndex;
