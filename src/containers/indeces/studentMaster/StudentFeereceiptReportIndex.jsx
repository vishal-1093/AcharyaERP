import { useState, useEffect,lazy } from "react";
import GridIndex from "../../../components/GridIndex.jsx";
import {
  Box,
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

function StudentFeereceiptReportIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData()
  }, []);


  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllFeeReceipt?page=${0}&page_size=${1000000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
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
                `/FeeReceiptDetailsPDF/${params.row.auid}/${
                  params.row.student_id
                }/${params.row.fee_receipt.split("/").join("_")}/${
                  params.row.financial_year_id
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

    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      valueGetter: (params) => (params.row.auid ? params.row.auid : "NA"),
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
    { field: "fee_template_name", headerName: "Template", flex: 1, hide: true },
    {
      field: "paid_amount",
      headerName: "Paid",
      flex: 1,
      valueGetter: (params) =>
        params.row.paid_amount ? params.row.paid_amount : params.row.paid,
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
      type: "date",
      valueGetter: (params) =>
        params.row.created_date
          ? moment(params.row.created_date).format("DD-MM-YYYY")
          : "",
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
  ];

  return (
    <Box sx={{ position: "relative", mt:3}}>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default StudentFeereceiptReportIndex;
