import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/TotalGridIndex.jsx";
import {
  Box,
  Button,
  Grid,
  styled,
  Tooltip,
  tooltipClasses,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api.js";
import moment from "moment";
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);


const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#5A5A5A",
    maxWidth: 270,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}));

const todayDate = new Date();
const nextDate = new Date();
nextDate.setDate(todayDate.getDate() + 1);

const initialValues = {
  startDate: todayDate,
  endDate: nextDate,
  trnType: "cash",
  trnTypeList: [{ label: "Cash", value: "cash" }, { label: "Cash & Bank", value: "null" }],
  cashTotal: 0,
  ddTotal: 0,
  onlineTotal: 0,
  paymentTotal: 0,
  closingTotal: 0
};;

function CounterSummarySchoolIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData(values);
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    name == "trnType" && setNull();
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
        .get(`/api/finance/getCounterSummary?${params}${(values.trnType)?.toLowerCase() == "cash" ? `&transactionType=cash` : ""}`)
        .then((res) => {
          const cashList = res.data.data.filter((ele) => (ele.transactionType)?.toLowerCase() == "cash");
          const grandTotalCash = cashList.reduce((sum, acc) => sum + acc.paidAmount, 0);
          const ddList = res.data.data.filter((ele) => (ele.transactionType)?.toLowerCase() == "dd");
          const grandTotalDD = ddList.reduce((sum, acc) => sum + acc.paidAmount, 0);
          const onlineList = res.data.data.filter((ele) => (ele.transactionType)?.toLowerCase() == "p_gateway" || ele.transactionType?.toLowerCase() == "rtgs");
          const grandTotalOnline = onlineList.reduce((sum, acc) => sum + acc.paidAmount, 0);
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
      field: "paidAmount",
      headerName: "Cash",
      flex: 1,
      type: "number",
      hideable:false,
      renderCell: (params) => ((params.row.transactionType)?.toLowerCase() == "cash" ? params.row?.paidAmount : 0)
    },
    {
      field: "dd",
      headerName: "DD",
      flex: 1,
      type: "number",
      hideable:false,
      renderCell: (params) => ((params.row.transactionType)?.toLowerCase() == "dd" ? params.row?.paidAmount : 0)
    },
    {
      field: "rtgs",
      headerName: "Online",
      flex: 1,
      type: "number",
      hideable:false,
      renderCell: (params) => ((params.row.transactionType == "p_gateway" || (params.row?.transactionType)?.toLowerCase() == "rtgs") ? params.row?.paidAmount.toFixed(2) : 0)
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
      renderCell: (params) => (((params.row.transactionType?.toLowerCase() == "cash" && params.row?.paidAmount) - params.row?.payment) || 0)
    }
  ];

  const cashColumns = [
    {
      field: "createdUsername", headerName: "Name", flex: 1,hideable:false
    },
    {
      field: "paidAmount",
      headerName: "Cash",
      flex: 1,
      type: "number",
      hideable:false
    },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      type: "number",
      hideable:false
    },
    {
      field: "closing",
      headerName: "Closing",
      flex: 1,
      type: "number",
      hideable:false,
      renderCell: (params) => (params.row.paidAmount - params.row.payment)
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

  const cashTotalFooter = () => (
    <Box
      sx={{
        padding: 1,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Grid container>
        <Grid item xs={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Grand Total
          </Typography>
        </Grid>
        <Grid item xs={3} align="right">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {values.cashTotal}
          </Typography>
        </Grid>
        <Grid item xs={3} align="right">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {values.paymentTotal}
          </Typography>
        </Grid>
        <Grid item xs={3} align="right">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {values.closingTotal}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Grid container sx={{ display: "flex", justifyContent: "flex-end", gap: "10px",marginTop: { xs: 2, md: -5 }}}>
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
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="trnType"
            label="Mode"
            value={values.trnType || ""}
            options={values.trnTypeList || []}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>
        <Grid xs={12} md={1} align="right">
          <Button
            onClick={() => handleFilter(values)}
            variant="contained"
            disabled={!(values.startDate && values.endDate && values.trnType)}
            disableElevation
          >
            Filter
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ position: "relative", marginTop: "10px" }}>
        <GridIndex rows={rows} columns={values.trnType == "cash" ? cashColumns : columns} TotalCustomFooter={values.trnType != "cash" ? cashBankTotalFooter : cashTotalFooter} />
      </Box>
    </Box>
  );
}

export default CounterSummarySchoolIndex;
