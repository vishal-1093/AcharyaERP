import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex.jsx";
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import axios from "../../../services/Api.js";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import styled from "@emotion/styled";
import { GenerateSchoolCounterSummary } from "./GenerateSchoolCounterSummary";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
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
const initialValues = {
  startDate: new Date(),
  endDate: new Date(),
  loading: false,
  cashTotal: 0,
  usdCashTotal: 0,
  ddTotal: 0,
  onlineTotal: 0,
  paymentTotal: 0,
  closingTotal: 0,
  pdfRow: []
};

function CounterSummarySchoolIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [reportPath, setReportPath] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [hostelRowPopup, setHostelRowPopup] = useState(false);
  const [hostelData, setHostelData] = useState([]);

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
    let params = `fromDate=${moment(value.startDate).format("YYYY-MM-DD")}&toDate=${moment(value.endDate).format("YYYY-MM-DD")}`;
    await axios
      .get((value.startDate && value.endDate) && `api/finance/getCounterSummaryBySchools?${params}`)
      .then((res) => {
        getOrgName(res.data.data);
      })
      .catch((err) => { setLoading(false); console.error(err) });
  };

  const getOrgName = async (indexList) => {
    try {
      const res = await axios.get(`/api/institute/fetchAllOrgDetail?page=0&page_size=10000&sort=org_type`);
      if (res.status == 200 || res.status == 201) {
        const orgNameLists = res.data.data.Paginated_data.content?.reverse()?.map(li => li.org_name);
        //Make hostel obj in last
        const hostelObj = orgNameLists.find(obj => obj?.toLowerCase()?.includes("hostel"));
        orgNameLists[orgNameLists.length - 2] = orgNameLists[orgNameLists.length - 1];
        orgNameLists[orgNameLists.length - 1] = hostelObj;
        getSchoolList(orgNameLists, indexList);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getSchoolList = (orgNameLists, indexList) => {
    const schoolList = [];
    orgNameLists.forEach((ele) => {
      indexList.forEach((el) => {
        if ((el.orgName)?.toLowerCase() == ele?.toLowerCase()) {
          schoolList.push(el);
        }
      })
    });
    setLoading(false);

    const aitOrgNameSchoolList = schoolList.filter((obj) => obj.orgName.toLowerCase().includes("acharya institutes"));

    const totalCash = aitOrgNameSchoolList.reduce((sum, acc) => sum + acc.INRCASH, 0);
    const totalUsdCash = aitOrgNameSchoolList.reduce((sum, acc) => sum + acc.USDCASH, 0);
    const totalDD = aitOrgNameSchoolList.reduce((sum, acc) => sum + acc.INRDD, 0);
    const totalOnline = aitOrgNameSchoolList.reduce((sum, acc) => sum + acc.INRONLINE, 0);
    const totalPayment = aitOrgNameSchoolList.reduce((sum, acc) => sum + acc.payment, 0);
    const totalClosing = (totalCash) - (totalPayment);

    const totalRow = {
      "schoolName": "TOTAL",
      "INRDD": totalDD,
      "INRONLINE": totalOnline,
      "INRCASH": totalCash,
      "USDCASH": totalUsdCash,
      "payment": totalPayment,
      "closing": totalClosing,
    };

    if (aitOrgNameSchoolList.length > 1) {
      schoolList.splice(schoolList.length - 2, 0, totalRow)
    };

    const grandTotalCash = schoolList?.filter((li)=>li.schoolName !== "TOTAL")?.reduce((sum, acc) => sum + acc.INRCASH, 0);
    const grandTotalUsdCash = schoolList?.filter((li)=>li.schoolName !== "TOTAL")?.reduce((sum, acc) => sum + acc.USDCASH, 0);
    const grandTotalDD = schoolList?.filter((li)=>li.schoolName !== "TOTAL")?.reduce((sum, acc) => sum + acc.INRDD, 0);
    const grandTotalOnline = schoolList?.filter((li)=>li.schoolName !== "TOTAL")?.reduce((sum, acc) => sum + acc.INRONLINE, 0);
    const grandTotalPayment = schoolList?.filter((li)=>li.schoolName !== "TOTAL")?.reduce((sum, acc) => sum + acc.payment, 0);
    const grandTotalClosing = (grandTotalCash) - (grandTotalPayment);

    const grandTotalRow = {
      "schoolName": "GRAND TOTAL",
      "INRDD": grandTotalDD,
      "INRONLINE": grandTotalOnline,
      "INRCASH": grandTotalCash,
      "USDCASH": grandTotalUsdCash,
      "payment": grandTotalPayment,
      "closing": grandTotalClosing,
    };
    const pdfRows = schoolList;
    if (schoolList.length > 1) {
      const list = [...schoolList, grandTotalRow];
      setRows(list.map((li, index) => ({ ...li, id: index + 1 })));
    };
    setValues((prevState) => ({
      ...prevState,
      pdfRow: pdfRows,
      cashTotal: grandTotalCash,
      ddTotal: grandTotalDD,
      onlineTotal: grandTotalOnline,
      paymentTotal: grandTotalPayment,
      closingTotal: grandTotalClosing,
      usdCashTotal: grandTotalUsdCash
    }))
  };

  const columns = [
    {
      field: "schoolName", headerName: "Inst", flex: 1,
      hideable: false,
      renderCell: (params) => {
        if (params.row.id === "last-row") {
          return (
            <Typography color="#fff" variant="subtitle2" sx={{textAlign:"center",width:"100%"}}>{params.row.schoolName ? params.row.schoolName : "N/A"}</Typography>
          );
        } else if (params.row.schoolName !== "HOS") {
          return (
            <Typography variant="p" sx={{textAlign:"center",width:"100%" }}>{params.row.schoolName ? params.row.schoolName : "N/A"}</Typography>
          );
        } else {
          return (
            <HtmlTooltip title="View Hostel School's Detail">
              <Typography color="primary" variant="subtitle2" sx={{textAlign:"center",width:"100%", cursor: "pointer" }} onClick={handleHostelRow}>{params.row.schoolName ? params.row.schoolName : "N/A"}</Typography>
            </HtmlTooltip>
          )
        }
      }
    },
    {
      field: "Receipt_Total", headerName: "Receipt_Total", flex: 1,
      hideable: false,
      renderCell: (params) => {
        if (params.row.id === "last-row") {
          return (
            <Typography color="#fff" variant="subtitle2" sx={{textAlign:"center",width:"100%"}}>{Number((params.row.INRDD % 1 !== 0 || (params.row.INRONLINE % 1 !== 0) || 
                (params.row.INRCASH % 1 !== 0) || (params.row.USDCASH % 1 !== 0)) ? (params.row.INRDD + params.row.INRONLINE + params.row.INRCASH + params.row.USDCASH)?.toFixed(2) : (params.row.INRDD + params.row.INRONLINE + params.row.INRCASH + params.row.USDCASH) || 0)}</Typography>
          );
        } else if (params.row.schoolName !== "HOS") {
          return (
            <Typography variant="p" sx={{textAlign:"center",width:"100%" }}>{Number((params.row.INRDD % 1 !== 0 || (params.row.INRONLINE % 1 !== 0) || 
                (params.row.INRCASH % 1 !== 0) || (params.row.USDCASH % 1 !== 0)) ? (params.row.INRDD + params.row.INRONLINE + params.row.INRCASH + params.row.USDCASH)?.toFixed(2) : (params.row.INRDD + params.row.INRONLINE + params.row.INRCASH + params.row.USDCASH) || 0)}</Typography>
          );
        } else {
          return (
            <HtmlTooltip title="View Hostel School's Detail">
              <Typography color="primary" variant="subtitle2" sx={{textAlign:"center",width:"100%", cursor: "pointer" }} onClick={handleHostelRow}>{Number((params.row.INRDD % 1 !== 0 || (params.row.INRONLINE % 1 !== 0) || 
                (params.row.INRCASH % 1 !== 0) || (params.row.USDCASH % 1 !== 0)) ? (params.row.INRDD + params.row.INRONLINE + params.row.INRCASH + params.row.USDCASH)?.toFixed(2) : (params.row.INRDD + params.row.INRONLINE + params.row.INRCASH + params.row.USDCASH) || 0)}</Typography>
            </HtmlTooltip>
          )
        }
      }
    },
    {
      field: "INRDD",
      headerName: "DD",
      flex: 1,
      type: 'number',
      valueGetter: (value, row) => (Number(row?.INRDD % 1 !== 0 ? row?.INRDD?.toFixed(2) : row?.INRDD) || 0),
      renderCell: (params) => {
        if (params.row.id === "last-row") {
          return (
            <Typography color="#fff" variant="subtitle2">{(Number(params.row?.INRDD % 1 !== 0 ? params.row?.INRDD?.toFixed(2) : params.row?.INRDD) || 0)}</Typography>
          );
        } else if (params.row.schoolName !== "HOS") {
          return (
            (Number(params.row?.INRDD % 1 !== 0 ? params.row?.INRDD?.toFixed(2) : params.row?.INRDD) || 0)
          );
        } else {
          return (
            <HtmlTooltip title="View Hostel School's Detail">
              <Typography color="primary" variant="subtitle2" sx={{ cursor: "pointer" }} onClick={handleHostelRow}>
                {(Number(params.row?.INRDD % 1 !== 0 ? params.row?.INRDD?.toFixed(2) : params.row?.INRDD) || 0)}
              </Typography>
            </HtmlTooltip>
          )
        }
      }
    },
    {
      field: "INRONLINE",
      headerName: "Online",
      flex: 1,
      hideable: false,
      type: 'number',
      valueGetter: (value, row) => (Number(row?.INRONLINE % 1 !== 0 ? row?.INRONLINE?.toFixed(2) : row?.INRONLINE) || 0),
      renderCell: (params) => {
        if (params.row.id === "last-row") {
          return (
            <Typography color="#fff" variant="subtitle2">{(Number(params.row?.INRONLINE % 1 !== 0 ? params.row?.INRONLINE?.toFixed(2) : params.row?.INRONLINE) || 0)}</Typography>
          );
        } else if (params.row.schoolName !== "HOS") {
          return (
            (Number(params.row?.INRONLINE % 1 !== 0 ? params.row?.INRONLINE?.toFixed(2) : params.row?.INRONLINE) || 0)
          );
        } else {
          return (
            <HtmlTooltip title="View Hostel School's Detail">
              <Typography color="primary" variant="subtitle2" sx={{ cursor: "pointer" }} onClick={handleHostelRow}>
                {(Number(params.row?.INRONLINE % 1 !== 0 ? params.row?.INRONLINE?.toFixed(2) : params.row?.INRONLINE) || 0)}
              </Typography>
            </HtmlTooltip>
          )
        }
      }
    },
    {
      field: "INRCASH",
      headerName: "INR",
      flex: 1,
      hideable: false,
      type: 'number',
      valueGetter: (value, row) => (Number(row?.INRCASH % 1 !== 0 ? row?.INRCASH?.toFixed(2) : row?.INRCASH) || 0),
      renderCell: (params) => {
        if (params.row.id === "last-row") {
          return (
            <Typography color="#fff" variant="subtitle2">{(Number(params.row?.INRCASH % 1 !== 0 ? params.row?.INRCASH?.toFixed(2) : params.row?.INRCASH) || 0)}</Typography>
          );
        } else if (params.row.schoolName !== "HOS") {
          return (
            (Number(params.row?.INRCASH % 1 !== 0 ? params.row?.INRCASH?.toFixed(2) : params.row?.INRCASH) || 0)
          );
        } else {
          return (
            <HtmlTooltip title="View Hostel School's Detail">
              <Typography color="primary" variant="subtitle2" sx={{ cursor: "pointer" }} onClick={handleHostelRow}>
                {(Number(params.row?.INRCASH % 1 !== 0 ? params.row?.INRCASH?.toFixed(2) : params.row?.INRCASH) || 0)}
              </Typography>
            </HtmlTooltip>
          )
        }
      }
    },
    {
      field: "USDCASH",
      headerName: "INR1",
      flex: 1,
      hideable: false,
      type: 'number',
      valueGetter: (value, row) => (Number(row?.USDCASH % 1 !== 0 ? row?.USDCASH?.toFixed(2) : row?.USDCASH) || 0),
      renderCell: (params) => {
        if (params.row.id === "last-row") {
          return (
            <Typography color="#fff" variant="subtitle2">{(Number(params.row?.USDCASH % 1 !== 0 ? params.row?.USDCASH?.toFixed(2) : params.row?.USDCASH) || 0)}</Typography>
          );
        } else if (params.row.schoolName !== "HOS") {
          return (
            (Number(params.row?.USDCASH % 1 !== 0 ? params.row?.USDCASH?.toFixed(2) : params.row?.USDCASH) || 0)
          );
        } else {
          return (
            <HtmlTooltip title="View Hostel School's Detail">
              <Typography color="primary" variant="subtitle2" sx={{ cursor: "pointer" }} onClick={handleHostelRow}>
                {(Number(params.row?.USDCASH % 1 !== 0 ? params.row?.USDCASH?.toFixed(2) : params.row?.USDCASH) || 0)}
              </Typography>
            </HtmlTooltip>
          )
        }
      }
    },
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      hideable: false,
      type: 'number',
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}></div>,
      valueGetter: (value, row) => (Number(row?.payment % 1 !== 0 ? row?.payment?.toFixed(2) : row?.payment) || 0),
      renderCell: (params) => {
        if (params.row.id === "last-row") {
          return (
            <Typography color="#fff" variant="subtitle2">{(Number(params.row?.payment % 1 !== 0 ? params.row?.payment?.toFixed(2) : params.row?.payment) || 0)}</Typography>
          );
        } else if (params.row.schoolName !== "HOS") {
          return (
            (Number(params.row?.payment % 1 !== 0 ? params.row?.payment?.toFixed(2) : params.row?.payment) || 0)
          );
        } else {
          return (
            <HtmlTooltip title="View Hostel School's Detail">
              <Typography color="primary" variant="subtitle2" sx={{ cursor: "pointer" }} onClick={handleHostelRow}>
                {(Number(params.row?.payment % 1 !== 0 ? params.row?.payment?.toFixed(2) : params.row?.payment) || 0)}
              </Typography>
            </HtmlTooltip>
          )
        }
      }
    },
    {
      field: "closing",
      headerName: "Closing",
      flex: 1,
      hideable: false,
      type: 'number',
      valueGetter: (value, row) => (Number((row?.INRCASH - row?.payment) % 1 !== 0 ? (row?.INRCASH - row?.payment)?.toFixed(2) : (row?.INRCASH - row?.payment)) || 0),
      renderCell: (params) => {
        if (params.row.id === "last-row") {
          return (
            <Typography color="#fff" variant="subtitle2">{(Number((params.row?.INRCASH - params.row?.payment) % 1 !== 0 ? (params.row?.INRCASH - params.row?.payment)?.toFixed(2) : (params.row?.INRCASH - params.row?.payment)) || 0)}</Typography>
          );
        } else if (params.row.schoolName !== "HOS") {
          return (
            (Number((params.row?.INRCASH - params.row?.payment) % 1 !== 0 ? (params.row?.INRCASH - params.row?.payment)?.toFixed(2) : (params.row?.INRCASH - params.row?.payment)) || 0)
          );
        } else {
          return (
            <HtmlTooltip title="View Hostel School's Detail">
              <Typography color="primary" variant="subtitle2" sx={{ cursor: "pointer" }} onClick={handleHostelRow}>
                {(Number((params.row?.INRCASH - params.row?.payment) % 1 !== 0 ? (params.row?.INRCASH - params.row?.payment)?.toFixed(2) : (params.row?.INRCASH - params.row?.payment)) || 0)}
              </Typography>
            </HtmlTooltip>
          )
        }
      }
    }
  ];

  const hostelColumns = [
    {
      field: "schoolname", headerName: "Inst", flex: 1,
      hideable: false,
    },
    {
      field: "total", headerName: "Total", flex: 1,
      hideable: false,
      type:"number",
      renderCell:(params)=>(params.row.total || 0)
    },
  ];

  const handleHostelRow = () => {
    getHostelSchoolData()
  };

  const getHostelSchoolData = async () => {
    try {
      let params = `fromDate=${moment(values.startDate).format("YYYY-MM-DD")}&toDate=${moment(values.endDate).format("YYYY-MM-DD")}`;
      const res = await axios.get(`/api/finance/getHostelCounterSummaryBySchools?${params}`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data.map((ele, index) => ({ ...ele, id: index + 1 }))
        setHostelData(list);
        setHostelRowPopup(!hostelRowPopup);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const onClickPrint = async () => {
    const reportResponse = await GenerateSchoolCounterSummary(values.pdfRow, values.startDate, values.endDate, values.cashTotal, values.ddTotal, values.onlineTotal, values.paymentTotal, values.closingTotal, values.usdCashTotal);
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
            fontWeight: "bold"
          },
          '& .forth-last-row': {
            backgroundColor: '#edeef6 !important',
            color: '#000 !important',
            fontWeight: "bold"
          },
          '& .third-last-row': {
            color: '#000 !important',
            fontWeight: "bold"
          }
        }}>
          <GridIndex rows={rows} columns={columns} loading={values.loading}
            getRowClassName={(params) =>
              params.id === rows[rows.length - 4]?.id ? 'forth-last-row' :
                params.id === rows[rows.length - 3]?.id ? 'third-last-row' :
                  params.id === rows[rows.length - 1]?.id ? 'last-row' : ''
            }
            getRowId={row => row.id}
            isRowSelectable={(params) => params.id != rows[rows.length - 1].id}
          />
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

      <ModalWrapper
        title=""
        maxWidth={600}
        open={hostelRowPopup}
        setOpen={setHostelRowPopup}
      >
        <Box borderRadius={3}>
          <GridIndex rows={hostelData} columns={hostelColumns} loading={values.loading}
          />
        </Box>
      </ModalWrapper>

    </Box>
  );
}

export default CounterSummarySchoolIndex;
