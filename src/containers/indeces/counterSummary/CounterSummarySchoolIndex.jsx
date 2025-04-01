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
import PrintIcon from "@mui/icons-material/Print";
import FilterListIcon from '@mui/icons-material/FilterList';
import { GenerateSchoolCounterSummary } from "./GenerateSchoolCounterSummary";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);

const initialValues = {
  startDate: new Date(),
  endDate: new Date(),
  cashTotal: 0,
  ddTotal: 0,
  onlineTotal: 0,
  paymentTotal: 0,
  closingTotal: 0
};

function CounterSummarySchoolIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [reportPath, setReportPath] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

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
    let params = `fromDate=${moment(value.startDate).format("YYYY-MM-DD")}&toDate=${moment(value.endDate).format("YYYY-MM-DD")}`;
    await axios
      .get((value.startDate && value.endDate) && `api/finance/getCounterSummaryBySchools?${params}`)
      .then((res) => {
        const cashList = res.data.data.filter((ele) => (ele.transactionType)?.toLowerCase() == "cash");
        const grandTotalCash = cashList.reduce((sum, acc) => sum + acc.paidAmount, 0);
        const ddList = res.data.data.filter((ele) => (ele.transactionType)?.toLowerCase() == "dd");
        const grandTotalDD = ddList.reduce((sum, acc) => sum + acc.paidAmount, 0);
        const onlineList = res.data.data.filter((ele) => (ele.transactionType)?.toLowerCase() == "p_gateway" || ele.transactionType?.toLowerCase() == "rtgs" || ele.transactionType?.toLowerCase() == "online");
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
  };

  const columns = [
    {
      field: "schoolNameShort", headerName: "Inst", flex: 1,
      hideable: false,
      renderCell: (params) => (params.row.schoolNameShort ? params.row.schoolNameShort : "N/A")
    },
    {
      field: "paidAmount",
      headerName: "Cash",
      flex: 1,
      type: "number",
      hideable: false,
      renderCell: (params) => ((params.row.transactionType)?.toLowerCase() == "cash" ? params.row?.paidAmount : 0)
    },
    {
      field: "dd",
      headerName: "DD",
      flex: 1,
      type: "number",
      hideable: false,
      renderCell: (params) => ((params.row.transactionType)?.toLowerCase() == "dd" ? params.row?.paidAmount : 0)
    },
    {
      field: "rtgs",
      headerName: "Online",
      flex: 1,
      type: "number",
      hideable: false,
      renderCell: (params) => ((params.row.transactionType?.toLowerCase() == "p_gateway" || (params.row?.transactionType)?.toLowerCase() == "rtgs") || (params.row.transactionType?.toLowerCase() == "online") ? params.row?.paidAmount.toFixed(2) : 0)
    },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      type: "number",
      hideable: false,
      renderCell: (params) => (params.row.payment || 0)
    },
    {
      field: "closing",
      headerName: "Closing",
      flex: 1,
      type: "number",
      hideable: false,
      renderCell: (params) => (((params.row.transactionType?.toLowerCase() == "cash" && params.row?.paidAmount) - params.row?.payment) || 0)
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

  const onClickPrint = async () => {
    const chunkArray = (array, chunkSize) =>
      Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
        array.slice(i * chunkSize, i * chunkSize + chunkSize)
      );

    const rowChunks = chunkArray(rows, 35);
    const pages = [];
    rowChunks.forEach((rowChunk) => {
      pages.push({ rows: rowChunk });
    });
    const reportResponse = await GenerateSchoolCounterSummary(pages, values.startDate, values.endDate, values.cashTotal, values.ddTotal, values.onlineTotal, values.paymentTotal, values.closingTotal);
    if (!!reportResponse) {
      setReportPath(URL.createObjectURL(reportResponse));
      setIsPrintModalOpen(!isPrintModalOpen);
    }
  };

  return (
    <Box>
      <Grid container sx={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: { xs: 2, md: -5 } }}>
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
        <Grid xs={12} md={1}>
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => handleFilter(values)}
            variant="contained"
            disabled={!(values.startDate && values.endDate)}
            disableElevation
          >
            Filter
          </Button>
        </Grid>
        <Grid xs={12} md={1} align="right">
          <Button
            onClick={onClickPrint}
            startIcon={<PrintIcon />}
            variant="contained"
            disabled={!rows.length}
            disableElevation
          >
            Print
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ position: "relative" }}>
        <Box sx={{ position: "absolute", width: "100%", marginTop: "10px" }}>
          <GridIndex rows={rows} columns={columns} TotalCustomFooter={cashBankTotalFooter} />
        </Box>
      </Box>
      <ModalWrapper
        title=""
        maxWidth={1000}
        open={isPrintModalOpen}
        setOpen={setIsPrintModalOpen}
      >
        <Box borderRadius={3}>
          {!!reportPath && (
            <object
              data={reportPath}
              type="application/pdf"
              style={{ height: "450px", width: "100%" }}
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          )}
        </Box>
      </ModalWrapper>
    </Box>
  );
}

export default CounterSummarySchoolIndex;
