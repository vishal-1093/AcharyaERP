import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex.jsx";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  styled,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api.js";
import PrintIcon from "@mui/icons-material/Print";
import moment from "moment";
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
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

const filterLists = [
  { label: "1 Week", value: "week" },
  { label: "1 Month", value: "month" },
  { label: "Select Date", value: "custom" },
];

const initialValues = {
  filterList: filterLists,
  startDate: "",
  endDate: "",
  schoolId: "",
  schoolList: ""
};

function StudentFeereceiptReportIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData("");
    getSchoolData();
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFilter = (formValue) => {
    getData(formValue)
  }

  const getData = async (value) => {
    let params = {};
    if (!!value.filter && !value.schoolId && !!value.startDate && !!value.endDate) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=custom&start_date=${moment(value.startDate).format("YYYY-MM-DD")}&end_date=${moment(value.endDate).format("YYYY-MM-DD")}`
    } else if (!!value.filter && !!value.schoolId && !value.startDate && !value.endDate) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${value.filter}&school_id=${value.schoolId}`
    } else if (!!value.filter && !!value.schoolId && !!value.startDate && !!value.endDate) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=custom&start_date=${moment(value.startDate).format("YYYY-MM-DD")}&end_date=${moment(value.endDate).format("YYYY-MM-DD")}&school_id=${value.schoolId}`
    } else if (!value.filter && !!value.schoolId && !value.startDate && !value.endDate) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&school_id=${value.schoolId}`
    } else if (!!value.filter && !value.schoolId && !value.startDate && !value.endDate) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${value.filter}`
    } else {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=today`
    }
    await axios
      .get(
        `/api/finance/fetchAllFeeReceipt?${params}`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`api/institute/school`);
      if (res?.data?.data?.length) {
        setValues((prevState) => ({
          ...prevState,
          schoolList: res?.data?.data.map((el) => ({
            ...el,
            label: el.school_name,
            value: el.school_id,
          })),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      field: "receipt_type", headerName: "Type", flex: 1,
      valueGetter: (value, row) => (row.receipt_type == "General" ? "GEN" : row.receipt_type == "Hostel Fee" ? "HOS" : row.receipt_type == "Registration Fee" ? "REG" : row.receipt_type == "Bulk" ? "BUK": row.receipt_type.toUpperCase())
    },
    {
      field: "fee_receipt",
      headerName: "Receipt No",
      flex: 1,
    },
    {
      field: "id",
      headerName: "Receipt Date",
      flex: 1,
      // type: "date",
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1.2,
      valueGetter: (value, row) => (row.auid ? row.auid : "NA"),
    },
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        return params.row.student_name &&
          params.row.student_name.length > 15 ? (
          <HtmlTooltip title={params.row.student_name}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.student_name.substr(0, 13) + "..."}
            </Typography>
          </HtmlTooltip>
        ) : params.row.student_name ? (
          <HtmlTooltip title={params.row.student_name}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.student_name}
            </Typography>
          </HtmlTooltip>
        ) : (
          "NA"
        );
      },
    },
    {
      field: "Print",
      type: "actions",
      flex: 1,
      headerName: "Print",
      getActions: (params) => [
        params.row.receipt_type.toLowerCase() === "bulk" &&
          params.row.student_id !== null ? (
          <IconButton
            onClick={() =>
              navigate(
                `/BulkFeeReceiptPdf/${params.row.student_id}/${params.row.id}/${params.row.transaction_type}/${params.row.financial_year_id}`
              )
            }
            sx={{ cursor: "pointer" }}
            color="primary"
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        ) : params.row.receipt_type.toLowerCase() === "bulk" &&
          params.row.student_id === null ? (
          <IconButton
            onClick={() =>
              navigate(
                `/BulkFeeReceiptPdf/${params.row.id}/${params.row.transaction_type}/${params.row.financial_year_id}`
              )
            }
            sx={{ cursor: "pointer" }}
            color="primary"
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        ) : params.row.receipt_type.toLowerCase() === "hostel fee" ? (
          <IconButton
            onClick={() =>
              navigate(`/HostelFeePdf/${params.row.id}`, {
                state: { replace: false },
              })
            }
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={() =>
              navigate(
                `/FeeReceiptDetailsPDF/${params.row.auid}/${params.row.student_id
                }/${params.row.fee_receipt.split("/").join("_")}/${params.row.financial_year_id
                }/${params.row.transaction_type}`
              )
            }
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        ),
      ],
    },
    {
      field: "transaction_type",
      headerName: "Transaction Type",
      flex: 1,
      hide: true,
    },
    { field: "fee_template_name", headerName: "Template", flex: 1, hide: true },
    {
      field: "paid_amount",
      headerName: "Paid",
      flex: 1,
      valueGetter: (value, row) =>
        row.paid_amount ? row.paid_amount : row.paid,
    },

    {
      field: "cheque_dd_no",
      headerName: "Tranaction Ref",
      flex: 1,
      renderCell: (params) => {
        return params?.row?.cheque_dd_no?.length > 15 ? (
          <HtmlTooltip title={params.row.cheque_dd_no}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.cheque_dd_no.substr(0, 13) + "..."}
            </Typography>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.cheque_dd_no}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.cheque_dd_no}
            </Typography>
          </HtmlTooltip>
        );
      },
    },
    { field: "bank_name", headerName: "Bank", flex: 1, hide: true },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      // type: "date",
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
  ];

  return (
    <Box sx={{ position: "relative", mt: 7 }}>
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          right: 0,
          marginTop: { xs: -2, md: -6 },
        }}
      >
        <Grid container sx={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="schoolId"
              value={values.schoolId}
              label="School"
              handleChangeAdvance={handleChangeAdvance}
              options={values.schoolList || []}
            />
          </Grid>
          <Grid xs={12} md={2}>
            <CustomAutocomplete
              name="filter"
              label="Date Filter"
              value={values.filter}
              options={values.filterList || []}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          {values.filter == "custom" && <Grid item xs={12} md={2}>
            <CustomDatePicker
              name="startDate"
              label="From Date"
              value={values.startDate}
              handleChangeAdvance={handleChangeAdvance}
              helperText=""
              required
            />
          </Grid>}
          {values.filter == "custom" && <Grid item xs={12} md={2}>
            <CustomDatePicker
              name="endDate"
              label="To Date"
              value={values.endDate}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!values.startDate}
              helperText=""
              required
            />
          </Grid>}
          <Grid xs={12} md={1} align="right">
            <Button
              onClick={() => handleFilter(values)}
              variant="contained"
              disabled={!values.filter && !values.schoolId || (values.filter == "custom" && !values.endDate)}
              disableElevation
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Box>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default StudentFeereceiptReportIndex;
