import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import {
  Box,
  Button,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";

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

function CancelReceiptIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllCancelledReceipts?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "receipt_type", headerName: "Type", flex: 1 },
    {
      field: "fee_receipt",
      headerName: "Receipt No",
      flex: 1,
    },

    {
      field: "transaction_type",
      headerName: "Transaction Type",
      flex: 1,
      hide: true,
    },

    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      valueGetter: (value, row) => (row?.auid ? row?.auid : "NA"),
    },
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        return params.row.student_name &&
          params.row.student_name.length > 10 ? (
          <HtmlTooltip title={params.row.student_name}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.student_name.substr(0, 8) + "..."}
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
      field: "fee_template_name",
      headerName: "Template",
      flex: 1,
      valueGetter: (value, row) =>
        row?.fee_template_name ? row?.fee_template_name : "NA",
      hide: true,
    },
    {
      field: "amount",
      headerName: "Paid",
      flex: 1,
      valueGetter: (value, row) =>
        row?.amount ? row?.amount : row?.amount,
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
      field: "remarks",
      headerName: "Cancelled Remarks",
      flex: 1,
      renderCell: (params) => {
        return params?.row?.remarks?.length > 15 ? (
          <HtmlTooltip title={params.row.remarks}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.remarks.substr(0, 13) + "..."}
            </Typography>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.remarks}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.remarks}
            </Typography>
          </HtmlTooltip>
        );
      },
    },
    {
      field: "created_date",
      headerName: "Cancelled Date",
      flex: 1,
      type: "date",
      valueGetter: (value, row) =>
        row?.created_date
          ? moment(row?.created_date).format("DD-MM-YYYY")
          : "",
    },
    { field: "created_username", headerName: "Cancelled By", flex: 1 },
  ];

  return (
    <Box sx={{ position: "relative", mt: 6 }}>
      <Button
        onClick={() => navigate("/Cancelfeereceipt")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default CancelReceiptIndex;
