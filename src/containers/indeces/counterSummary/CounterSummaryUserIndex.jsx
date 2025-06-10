import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex.jsx";
import {
  Box,
  Button,
  Grid
} from "@mui/material";
import axios from "../../../services/Api.js";
import PrintIcon from "@mui/icons-material/Print";
import { GenerateUserCounterSummary } from "./GenerateUserCounterSummary";
import moment from "moment";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);

const todayDate = new Date();

const initialValues = {
  startDate: todayDate,
  endDate: todayDate,
  loading: false,
  cashTotal: 0,
  usdCashTotal: 0,
  ddTotal: 0,
  onlineTotal: 0,
  paymentTotal: 0,
  closingTotal: 0,
  pdfRow:[]
};;

function CounterSummaryUserIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [reportPath, setReportPath] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    (values.startDate && values.endDate) && getData(values);
  }, [values.startDate, values.endDate]);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const setLoading = (val) => {
    setValues((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getData = async (value) => {
    setLoading(true);
    if (value.startDate && value.endDate) {
      let params = `fromDate=${moment(value.startDate).format("YYYY-MM-DD")}&toDate=${moment(value.endDate).format("YYYY-MM-DD")}`;
      await axios
        .get(`/api/finance/getCounterSummary?${params}`)
        .then((res) => {
          setLoading(false);

          const grandTotalCash = res.data.data?.reduce((sum, acc) => sum + acc.INRCASH, 0);
          const grandUSDTotalCash = res.data.data?.reduce((sum, acc) => sum + acc.USDCASH, 0);
          const grandTotalDD = res.data.data?.reduce((sum, acc) => sum + acc.INRDD, 0);
          const grandTotalOnline = res.data.data?.reduce((sum, acc) => sum + acc.INRONLINE, 0);
          const grandTotalPayment = res.data.data.reduce((sum, acc) => sum + acc.payment, 0);
          const grandTotalClosing = (grandTotalCash) - (grandTotalPayment);

          const totalRow = {
            "createdUsername": "Total",
            "INRDD": grandTotalDD,
            "INRONLINE": grandTotalOnline,
            "INRCASH": grandTotalCash,
            "USDCASH": grandUSDTotalCash,
            "payment": grandTotalPayment,
            "closing": grandTotalClosing,
          };
          const pdfRows = res.data.data;
          const list = [...res.data.data, totalRow];
          setRows(list.map((li, index) => ({ ...li, id: index + 1 })));
          setValues((prevState) => ({
            ...prevState,
            pdfRow:pdfRows,
            cashTotal: grandTotalCash,
            usdCashTotal: grandUSDTotalCash,
            ddTotal: grandTotalDD,
            onlineTotal: grandTotalOnline,
            paymentTotal: grandTotalPayment,
            closingTotal: grandTotalClosing
          }))
        })
        .catch((err) => { setLoading(false); console.error(err) });
    }
  };

  const columns = [
    {
      field: "createdUsername", headerName: "Name", flex: 1,
      hideable: false
    },
    {
      field: "INRDD",
      headerName: "DD",
      flex: 1,
      hideable: false,
      type: 'number',
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number(params.row?.INRDD % 1 !== 0 ? params.row?.INRDD?.toFixed(2) : params.row?.INRDD) || 0)}</div>,
      valueGetter: (value, row) => (Number(row?.INRDD % 1 !== 0 ? row?.INRDD?.toFixed(2) : row?.INRDD) || 0)
    },
    {
      field: "INRONLINE",
      headerName: "Online",
      flex: 1,
      hideable: false,
        type: 'number',
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number(params.row?.INRONLINE % 1 !== 0 ? params.row?.INRONLINE?.toFixed(2) : params.row?.INRONLINE) || 0)}</div>,
      valueGetter: (value, row) => (Number(row?.INRONLINE % 1 !== 0 ? row?.INRONLINE?.toFixed(2) : row?.INRONLINE) || 0)
    },
    {
      field: "INRCASH",
      headerName: "INR",
      flex: 1,
      hideable: false,
       type: 'number',
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number(params.row?.INRCASH % 1 !== 0 ? params.row?.INRCASH?.toFixed(2) : params.row?.INRCASH) || 0)}</div>,
      valueGetter: (value, row) => (Number(row?.INRCASH % 1 !== 0 ? row?.INRCASH?.toFixed(2) : row?.INRCASH) || 0)
    },
    {
      field: "USDCASH",
      headerName: "INR1",
      flex: 1,
      hideable: false,
       type: 'number',
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number(params.row?.USDCASH % 1 !== 0 ? params.row?.USDCASH?.toFixed(2) : params.row?.USDCASH) || 0)}</div>,
      valueGetter: (value, row) => (Number(row?.USDCASH % 1 !== 0 ? row?.USDCASH?.toFixed(2) : row?.USDCASH) || 0)
    },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      hideable: false,
       type: 'number',
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number(params.row?.payment % 1 !== 0 ? params.row?.payment?.toFixed(2) : params.row?.payment) || 0)}</div>,
      valueGetter: (value, row) => (Number(row?.payment % 1 !== 0 ? row?.payment?.toFixed(2) : row?.payment) || 0)
    },
    {
      field: "closing",
      headerName: "Closing",
      flex: 1,
      hideable: false,
       type: 'number',
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.INRCASH - params.row?.payment) % 1 !== 0 ? (params.row?.INRCASH - params.row?.payment)?.toFixed(2) : (params.row?.INRCASH - params.row?.payment)) || 0)}</div>,
      valueGetter: (value, row) => (Number((row?.INRCASH - row?.payment) % 1 !== 0 ? (row?.INRCASH - row?.payment)?.toFixed(2) : (row?.INRCASH - row?.payment)) || 0)
    }
  ];

  const onClickPrint = async () => {
    const chunkArray = (array, chunkSize) =>
      Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
        array.slice(i * chunkSize, i * chunkSize + chunkSize)
      );

    const rowChunks = chunkArray(values.pdfRow, 35);
    const pages = [];
    rowChunks.forEach((rowChunk) => {
      pages.push({ rows: rowChunk });
    });
    const reportResponse = await GenerateUserCounterSummary(pages, values.startDate, values.endDate, values.cashTotal, values.ddTotal, values.onlineTotal, values.paymentTotal, values.closingTotal, values.usdCashTotal);
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
      <Box sx={{ position: "relative", marginTop: { xs: 8, md: 1 } }}>
        <Box sx={{
          position: "absolute",
          width: "100%",
          '& .last-row': {
            backgroundColor: '#edeef6 !important',
            color: '#000 !important',
            fontWeight:"bold"
          },
        }}>
          <GridIndex
            rows={rows}
            columns={columns}
            loading={values.loading}
            getRowClassName={(params) =>
              params.id === rows[rows.length - 1].id ? 'last-row' : ''
            }
            getRowId={row => row.id}
            isRowSelectable={(params) => params.id != rows[rows.length - 1].id} />
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

export default CounterSummaryUserIndex;
