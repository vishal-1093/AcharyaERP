import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  styled,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
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
};

function StudentFeereceiptIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData(values.filterList[1].value);
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (name == "endDate") {
      getData("custom", newValue);
    } else if (name !== "startDate") {
      getData(newValue, "");
    }
  };

  const getData = async (filterKey, endDate) => {
    let params = {};
    if (filterKey == "custom" && !!endDate && !!values.startDate) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=custom&start_date=${moment(
        values.startDate
      ).format("YYYY-MM-DD")}&end_date=${moment(endDate).format("YYYY-MM-DD")}`;
    } else if (filterKey != "custom") {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${filterKey}`;
    } else {
      params = `page=${0}&page_size=${1000000}&sort=created_date`;
    }
    await axios
      .get(`/api/finance/fetchAllFeeReceipt?${params}`)
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
            // onClick={() =>
            //   navigate(`/BulkFeeReceiptPdf`, {
            //     state: {
            //       studentId: params.row.student_id,
            //       feeReceiptId: params.row.id,
            //       transactionType: params.row.transaction_type,
            //       financialYearId: params.row.financial_year_id,
            //       linkStatus: true,
            //     },
            //   })
            // }

              onClick={() =>
              navigate(`/BulkFeeReceiptPdfV1`, {
                state: {
                  studentId: params.row.student_id,
                  feeReceiptId: params.row.id,
                  transactionType: params.row.transaction_type,
                  financialYearId: params.row.financial_year_id,
                  linkStatus: true,
                },
              })
            }
            sx={{ cursor: "pointer" }}
            color="primary"
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        ) : params.row.receipt_type.toLowerCase() === "bulk" &&
          params.row.student_id === null ? (
          <IconButton
            // onClick={() =>
            //   navigate(`/BulkFeeReceiptPdf`, {
            //     state: {
            //       studentId: params.row.student_id,
            //       feeReceiptId: params.row.id,
            //       transactionType: params.row.transaction_type,
            //       financialYearId: params.row.financial_year_id,
            //       linkStatus: true,
            //     },
            //   })
            // }

             onClick={() =>
              navigate(`/BulkFeeReceiptPdfV1`, {
                state: {
                  studentId: params.row.student_id,
                  feeReceiptId: params.row.id,
                  transactionType: params.row.transaction_type,
                  financialYearId: params.row.financial_year_id,
                  linkStatus: true,
                },
              })
            }
            sx={{ cursor: "pointer" }}
            color="primary"
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        ) : params.row.receipt_type.toLowerCase() === "hos" ? (
          <IconButton
            // onClick={() =>
            //   navigate(`/HostelFeePdf`, {
            //     state: { feeReceiptId: params.row.id, linkStatus: true },
            //   })
            // }

            onClick={() =>
              navigate(`/HostelFeePdfV1`, {
                state: { feeReceiptId: params.row.id, linkStatus: true },
              })
            }
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        ) : params.row.receipt_type.toLowerCase() === "exam" ? (
          <IconButton
            // onClick={() =>
            //   navigate(`/ExamReceiptPdf`, {
            //     state: { feeReceiptId: params.row.id, linkStatus: true },
            //   })
            // }

            onClick={() =>
              navigate(`/ExamReceiptPdfV1`, {
                state: { feeReceiptId: params.row.id, linkStatus: true },
              })
            }
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            // onClick={() =>
            //   navigate(`/FeeReceiptDetailsPDF`, {
            //     state: {
            //       auid: params.row.auid,
            //       studentId: params.row.student_id,
            //       feeReceipt: params.row.fee_receipt,
            //       transactionType: params.row.transaction_type,
            //       feeReceiptId: params.row.id,
            //       financialYearId: params.row.financial_year_id,
            //       linkStatus: true,
            //     },
            //   })
            // }
       
             onClick={() =>
                navigate(`/FeeReceiptDetailsPDFV1`, {
                  state: {
                    auid: params.row.auid,
                    studentId: params.row.student_id,
                    feeReceipt: params.row.fee_receipt,
                    transactionType: params.row.transaction_type,
                    feeReceiptId: params.row.id,
                    financialYearId: params.row.financial_year_id,
                    linkStatus: true,
                  },
                })
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
    <Box sx={{ position: "relative", mt: 4 }}>
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          right: 0,
          marginTop: { xs: -2, md: -7 },
        }}
      >
        <Grid
          container
          sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <Grid xs={12} md={2}>
            <CustomAutocomplete
              name="filter"
              label="filter"
              value={values.filter || values.filterList[1].value}
              options={values.filterList || []}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          {values.filter == "custom" && (
            <Grid item xs={12} md={2}>
              <CustomDatePicker
                name="startDate"
                label="From Date"
                value={values.startDate}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}
          {values.filter == "custom" && (
            <Grid item xs={12} md={2}>
              <CustomDatePicker
                name="endDate"
                label="To Date"
                value={values.endDate}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!values.startDate}
                required
              />
            </Grid>
          )}
        </Grid>
      </Box>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default StudentFeereceiptIndex;
