import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/TotalGridIndex.jsx";
import {
  Box,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import axios from "../../../services/Api.js";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import { GenerateSchoolCounterSummary } from "./GenerateSchoolCounterSummary";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);

const initialValues = {
  startDate: new Date(),
  endDate: new Date(),
  loading:false,
  cashTotal: 0,
  usdCashTotal:0,
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
    (values.startDate && values.endDate) && getData(values);
  }, [values.startDate,values.endDate]);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const setLoading = (val) => {
    setValues((prevState)=>({
      ...prevState,
      loading:val
    }))
  };

  const getData = async (value) => {
    setLoading(true);
    let params = `fromDate=${moment(value.startDate).format("YYYY-MM-DD")}&toDate=${moment(value.endDate).format("YYYY-MM-DD")}`;
    await axios
      .get((value.startDate && value.endDate) && `api/finance/getCounterSummaryBySchools?${params}`)
      .then((res) => {
        setLoading(false);
        const grandTotalCash = res.data.data.reduce((sum, acc) => sum + acc.INRCASH, 0);
        const grandTotalUsdCash = res.data.data.reduce((sum, acc) => sum + acc.USDCASH, 0);
        const grandTotalDD = res.data.data.reduce((sum, acc) => sum + acc.INRDD, 0);
        const grandTotalOnline = res.data.data.reduce((sum, acc) => sum + acc.INRONLINE, 0);
        const grandTotalPayment = res.data.data.reduce((sum, acc) => sum + acc.payment, 0);
        const grandTotalClosing = (grandTotalCash) - (grandTotalPayment);
        setRows(res.data.data.map((li, index) => ({ ...li, id: index + 1 })));
        setValues((prevState) => ({
          ...prevState,
          cashTotal: grandTotalCash,
          ddTotal: grandTotalDD,
          onlineTotal: grandTotalOnline,
          paymentTotal: grandTotalPayment,
          closingTotal: grandTotalClosing,
          usdCashTotal:grandTotalUsdCash
        }))
      })
      .catch((err) =>{setLoading(false);console.error(err)});
  };

  const columns = [
    {
      field: "schoolName", headerName: "Inst", flex: 1,
      hideable: false,
      renderCell: (params) => (params.row.schoolName ? params.row.schoolName : "N/A")
    },
    {
      field: "INRDD",
      headerName: "DD",
      flex: 1,
      type: "number",
      hideable: false,
      valueGetter: (value, row) => (Number(row?.INRDD % 1 !== 0 ? row?.INRDD?.toFixed(2) : row?.INRDD) || 0)
    },
    {
      field: "INRONLINE",
      headerName: "Online",
      flex: 1,
      type: "number",
      hideable: false,
      valueGetter: (value, row) => (Number(row?.INRONLINE % 1 !== 0 ? row?.INRONLINE?.toFixed(2) : row?.INRONLINE) || 0)
    },
    {
      field: "INRCASH",
      headerName: "INR",
      flex: 1,
      type: "number",
      hideable: false,
      valueGetter: (value, row) => (Number(row?.INRCASH % 1 !== 0 ? row?.INRCASH?.toFixed(2) : row?.INRCASH) || 0)
    },
    {
      field: "USDCASH",
      headerName: "INR1",
      flex: 1,
      type: "number",
      hideable: false,
      valueGetter: (value, row) => (Number(row?.USDCASH % 1 !== 0 ? row?.USDCASH?.toFixed(2) : row?.USDCASH) || 0)
    },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      type: "number",
      hideable: false,
      valueGetter: (value, row) => (Number(row?.payment % 1 !== 0 ? row?.payment?.toFixed(2) : row?.payment) || 0)
    },
    {
      field: "closing",
      headerName: "Closing",
      flex: 1,
      type: "number",
      hideable: false,
      valueGetter: (value, row) => (Number((row?.INRCASH - row?.payment) % 1 !== 0 ? (row?.INRCASH - row?.payment)?.toFixed(2) : (row?.INRCASH - row?.payment)) || 0)
    }
  ];

  const cashBankTotalFooter = () => (
    <Box>
      <Table sx={{ background: "rgba(74, 87, 169, 0.1)", width: "100%" }}>
        <TableBody>
          <TableRow>
            <TableCell style={{ borderBottom: "0px", padding: "5px", width: "27%" }}>
              <b>TOTAL</b>
            </TableCell>
            <TableCell style={{ borderBottom: "0px", padding: "5px", width: "12%" }}><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {Number(values.ddTotal % 1 !== 0 ? values.ddTotal?.toFixed(2) : values.ddTotal) || 0}
            </Typography></TableCell>
            <TableCell style={{ borderBottom: "0px", padding: "5px", width: "15%" }}> <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {Number(values.onlineTotal % 1 !== 0 ? values.onlineTotal?.toFixed(2) : values.onlineTotal) || 0}
            </Typography></TableCell>
            <TableCell style={{ borderBottom: "0px", padding: "5px", width: "15%" }}><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {Number(values.cashTotal % 1 !== 0 ? values.cashTotal?.toFixed(2) : values.cashTotal) || 0}
            </Typography></TableCell>
            <TableCell style={{ borderBottom: "0px", padding: "5px", width: "15%" }}><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {Number(values.usdCashTotal % 1 !== 0 ? values.usdCashTotal?.toFixed(2) : values.usdCashTotal) || 0}
            </Typography></TableCell>
            <TableCell style={{ borderBottom: "0px", padding: "5px", width: "15%" }}><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {Number(values.paymentTotal % 1 !== 0 ? values.paymentTotal?.toFixed(2) : values.paymentTotal) || 0}
            </Typography></TableCell>
            <TableCell style={{ borderBottom: "0px", padding: "5px", width: "15%" }}> <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {Number(values.closingTotal % 1 !== 0 ? values.closingTotal?.toFixed(2) : values.closingTotal) || 0}
            </Typography></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );

  const onClickPrint = async () => {
    const reportResponse = await GenerateSchoolCounterSummary(rows, values.startDate, values.endDate, values.cashTotal, values.ddTotal, values.onlineTotal, values.paymentTotal, values.closingTotal,values.usdCashTotal);
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
        <Grid xs={12} md={1} align="right">
          <Button
            onClick={onClickPrint}
            startIcon={<PrintIcon />}
            variant="contained"
            disabled={!rows.length || values.loading}
            disableElevation
          >
            Print
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ position: "relative", marginTop: { xs: 8, md: 1 }}}>
        <Box sx={{ position: "absolute", width: "100%" }}>
          <GridIndex rows={rows} columns={columns} TotalCustomFooter={cashBankTotalFooter} loading={values.loading} />
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
