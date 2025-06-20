import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex.jsx";
import {
  Box,
  Typography,
  Grid,
  styled,
  Tooltip,
  tooltipClasses,
  Breadcrumbs,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "../../../services/Api.js";
import moment from "moment";
import { useLocation, useNavigate } from 'react-router-dom';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";

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

const useStyles = makeStyles((theme) => ({
  inactiveRow: {
    background: "#fdecea !important",
  },
}));

function LedgerDebitReceiptDetail() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    fee_template_name: false,
    inr1: false,
    created_username: false,
    paid_year: false,
    cheque_dd_no: false,
    school_name_short: false,
    bank_name: false
  });
  const location = useLocation()
  const queryValues = location.state;
  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const { voucherHeadId, fcYearId, schoolId, month, date, bankId } = queryValues
    const params = {
      page: 0,
      page_size: 1000000,
      sort: 'created_date',
      date_range: 'custom',
      start_date: date,
      end_date: date,
      inter_school_id: schoolId,
      bankId: bankId
    }
    const baseUrl = 'api/finance/fetchAllFeeReceipt'
    await axios
      .get(baseUrl, { params })
      .then((res) => {
        setLoading(false);
        setRows(res?.data?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const columns = [
    {
      field: "receipt_type",
      headerName: "Type",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        params.row.receipt_type == "HOS"
          ? "HOST"
          : params.row.receipt_type == "General"
            ? "GEN"
            : params.row.receipt_type == "Registration Fee"
              ? "REGT"
              : params.row.receipt_type == "Bulk Fee"
                ? "BULK"
                : params.row.receipt_type == "Exam Fee"
                  ? "EXAM"
                  : params.row.receipt_type?.toUpperCase(),
    },
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        return params.row.student_name && params.row.student_name ? (
          <HtmlTooltip title={params.row.student_name}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.student_name ? params.row.student_name : ""}
            </Typography>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.bulk_user_name}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.bulk_user_name ? params.row.bulk_user_name : ""}
            </Typography>
          </HtmlTooltip>
        );
      },
      valueGetter: (value, row) =>
        row?.student_name
          ? row.student_name
          : row?.bulk_user_name
            ? row.bulk_user_name
            : "N/A",
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      // hideable: false,
      valueGetter: (value, row) =>
        row.school_name_short ? row.school_name_short : "",
    },
    {
      field: "fee_receipt",
      headerName: "Receipt No",
      flex: 1,
      hideable: false,
      align: "center",
    },
    {
      field: "created_date",
      headerName: "Receipt Date",
      flex: 1,
      valueGetter: (row, value) => moment(row).format("DD-MM-YYYY"),
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      hideable: false,
      align: "center",
      valueGetter: (value, row) => (row.auid ? row.auid : ""),
    },
    {
      field: "fee_template_name",
      headerName: "Template",
      flex: 1,
      valueGetter: (value, row) =>
        row.fee_template_name ? row.fee_template_name : "",
    },
    {
      field: "inr_value",
      headerName: "Amount",
      flex: 1,
      hideable: false,
      type: "number",
      valueGetter: (value, row) => {
        return row.inr_value % 1 !== 0
          ? row.inr_value?.toFixed(2)
          : row.inr_value
      }
    },

    {
      field: "inr1",
      headerName: "INR1",
      flex: 1,
      type: "number",
      valueGetter: (value, row) =>
        row.received_in?.toLowerCase() == "usd"
          ? Number(
            row.paid_amount % 1 !== 0
              ? row.paid_amount?.toFixed(2)
              : row.paid_amount
          )
          : "",
    },
    {
      field: "bank_name",
      headerName: "Bank",
      flex: 1,
      // hideable: false,
      valueGetter: (value, row) =>
        row.transaction_type?.toLowerCase() == "cash"
          ? "Cash"
          : row.bank_name
            ? row.bank_name
            : null,
    },
    {
      field: "cheque_dd_no",
      headerName: "Transaction Ref",
      flex: 1,
      // hideable: false,
      valueGetter: (value, row) =>
        (row?.cheque_dd_no || row?.dd_number || row?.dd_bank_name) ? row?.cheque_dd_no || row?.dd_number + "_" + row?.dd_bank_name : "",
    },
    {
      field: "transaction_no",
      headerName: "Trn No",
      flex: 1,
      valueGetter: (value, row) =>
        row?.transaction_no
          ? row.transaction_no
          : row?.dd_number
            ? row.dd_number
            : "",
    },
    {
      field: "transaction_date",
      headerName: "Trn Date",
      flex: 1,
      align: 'center',
      valueGetter: (value, row) =>
        row?.transaction_date
          ? row.transaction_date
          : row?.dd_date
            ? moment(row.dd_date).format("DD-MM-YYYY")
            : null,
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
  ];

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", width: "100%", marginTop: "10px" }}>
        <GridIndex
          rows={rows}
          columns={columns}
          loading={loading}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
          getRowId={(row, index) => row?.id}
           getRowClassName={(params) => {
            return params.row.active === false ? `${classes.inactiveRow}` : '';
          }}
        />
      </Box>
    </Box>
  );
}

export default LedgerDebitReceiptDetail;


