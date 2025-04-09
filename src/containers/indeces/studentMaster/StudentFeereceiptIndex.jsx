import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  styled,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  tooltipClasses,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import axios from "../../../services/Api";
import PrintIcon from "@mui/icons-material/Print";
import moment from "moment";

const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);

const useStyles = makeStyles({
  redRow: {
    backgroundColor: "#FFD6D7 !important",
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    padding: "5px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "5px 5px 5px 40px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

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
  { label: "Today", value: "today" },
  { label: "1 Week", value: "week" },
  { label: "1 Month", value: "month" },
  { label: "Custom Date", value: "custom" },
];

const initialValues = {
  filterList: filterLists,
  filter: filterLists[0].value,
  startDate: "",
  endDate: "",
  schoolList: [],
  schoolId: "",
};

function StudentFeereceiptIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [cashTotal, setCashTotal] = useState(0);
  const [ddTotal, setDdTotal] = useState(0);
  const [onlineTotal, setOnlineTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    fee_template_name: false,
    created_username: false,
    paid_year: false,
    transaction_no: false,
    remarks: false,
  });

  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    getSchoolDetails();
    getData(values.filterList[0].value);
  }, []);

  const getSchoolDetails = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data.map((obj) => ({
          value: obj.school_id,
          label: obj.school_name,
        }));
        setSchoolList(list);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setSchoolList = (lists) => {
    setValues((prevState) => ({
      ...prevState,
      schoolList: lists,
    }));
  };

  const getData = async (filterKey, value) => {
    setLoading(true);
    let params = null;
    if (
      filterKey == "custom" &&
      !!value &&
      !!values.startDate &&
      !values.schoolId
    ) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=custom&start_date=${moment(
        values.startDate
      ).format("YYYY-MM-DD")}&end_date=${moment(value).format("YYYY-MM-DD")}`;
    } else if (
      filterKey == "custom" &&
      !!value &&
      !!values.startDate &&
      !!values.schoolId
    ) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&school_id=${
        values.schoolId
      }&date_range=custom&start_date=${moment(values.startDate).format(
        "YYYY-MM-DD"
      )}&end_date=${moment(value).format("YYYY-MM-DD")}`;
    } else if (
      filterKey == "schoolId" &&
      !!values.endDate &&
      !!values.startDate
    ) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&school_id=${value}&date_range=custom&start_date=${moment(
        values.startDate
      ).format("YYYY-MM-DD")}&end_date=${moment(values.endDate).format(
        "YYYY-MM-DD"
      )}`;
    } else if (
      filterKey == "schoolId" &&
      !!values.filter &&
      !values.endDate &&
      !values.startDate
    ) {
      if (value === null) {
        params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${
          values.filter
        }`;
      } else {
        params = `page=${0}&page_size=${1000000}&sort=created_date&school_id=${value}&date_range=${
          values.filter
        }`;
      }
    } else if (filterKey !== "custom" && !!values.schoolId) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${filterKey}&school_id=${
        values.schoolId
      }`;
    } else {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${filterKey}`;
    }

    if (params) {
      await axios
        .get(`/api/finance/fetchAllFeeReceipt?${params}`)
        .then((res) => {
          const cashLists = res.data.data.filter(
            (el) => el.transaction_type?.toLowerCase() == "cash"
          );
          const cashGrandTotal = cashLists.reduce(
            (sum, acc) => sum + acc?.paid_amount,
            0
          );
          const ddLists = res.data.data.filter(
            (el) => el.transaction_type?.toLowerCase() == "dd"
          );
          const ddGrandTotal = ddLists.reduce(
            (sum, acc) => sum + acc?.paid_amount,
            0
          );
          const onlineLists = res.data.data.filter(
            (el) =>
              el.transaction_type?.toLowerCase() == "rtgs" ||
              el.transaction_type?.toLowerCase() == "p_gateway" ||
              el.transaction_type?.toLowerCase() == "online"
          );
          const onlineGrandTotal = onlineLists.reduce(
            (sum, acc) => sum + acc?.paid_amount,
            0
          );
          setLoading(false);
          setRows(res.data.data);
          setCashTotal(cashGrandTotal);
          setDdTotal(ddGrandTotal);
          setOnlineTotal(onlineGrandTotal);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
        });
    }
  };

  const columns = [
    {
      field: "receipt_type",
      headerName: "Type",
      flex: 0.6,
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
      field: "school_name_short",
      headerName: "School",
      flex: 0.2,
      hideable: false,
      valueGetter: (value, row) =>
        row.school_name_short ? row.school_name_short : "",
    },
    {
      field: "fee_receipt",
      headerName: "Receipt No",
      flex: 0.7,
      hideable: false,
      align: "right",
    },
    {
      field: "created_date",
      headerName: "Date",
      flex: 0.8,
      hideable: false,
      valueGetter: (value, row) =>
        row.created_date ? moment(row.created_date).format("DD-MM-YYYY") : "",
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1.2,
      hideable: false,
      valueGetter: (value, row) => (row.auid ? row.auid : ""),
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
              {params.row.student_name ? params.row.student_name : "N/A"}
            </Typography>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.bulk_user_name}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.bulk_user_name ? params.row.bulk_user_name : "N/A"}
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
      field: "fee_template_name",
      headerName: "Template",
      flex: 1,
      valueGetter: (value, row) =>
        row.fee_template_name ? row.fee_template_name : "NA",
    },
    {
      field: "transaction_type",
      headerName: "Cash",
      flex: 0.8,
      hideable: false,
      type: "number",
      valueGetter: (value, row) =>
        row.transaction_type?.toLowerCase() == "cash"
          ? Number(
              row.paid_amount % 1 !== 0
                ? row.paid_amount?.toFixed(2)
                : row.paid_amount
            )
          : 0,
    },
    {
      field: "dd",
      headerName: "DD",
      flex: 0.8,
      hideable: false,
      type: "number",
      valueGetter: (value, row) =>
        row.transaction_type?.toLowerCase() == "dd"
          ? Number(
              row.paid_amount % 1 !== 0
                ? row.paid_amount?.toFixed(2)
                : row.paid_amount
            )
          : 0,
    },
    {
      field: "paid_amount",
      headerName: "Online",
      flex: 0.8,
      hideable: false,
      type: "number",
      valueGetter: (value, row) =>
        row.transaction_type?.toLowerCase() == "rtgs" ||
        row.transaction_type?.toLowerCase() == "p_gateway" ||
        row.transaction_type?.toLowerCase() == "online"
          ? Number(
              row.paid_amount % 1 !== 0
                ? row.paid_amount?.toFixed(2)
                : row.paid_amount
            )
          : 0,
    },
    {
      field: "bank_name",
      headerName: "Bank",
      flex: 0.8,
      hideable: false,
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
      flex: 2,
      hideable: false,
      renderCell: (params) => {
        params.row?.cheque_dd_no ? (
          <HtmlTooltip title={params.row?.cheque_dd_no}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params?.row.cheque_dd_no}
            </Typography>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip
            title={`${params.row?.dd_number}_${params.row?.dd_bank_name}`}
          >
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {`${params.row?.dd_number}_${params.row?.dd_bank_name}`}
            </Typography>
          </HtmlTooltip>
        );
      },
      valueGetter: (value, row) =>
        row?.cheque_dd_no || row?.dd_number + "_" + row?.dd_bank_name,
    },
    {
      field: "transaction_no",
      headerName: "Trn No",
      flex: 1.5,
      valueGetter: (value, row) =>
        row?.transaction_no
          ? row.transaction_no
          : row?.dd_number
          ? row.dd_number
          : "N/A",
    },
    {
      field: "transaction_date",
      headerName: "Trn Date",
      flex: 1,
      valueGetter: (value, row) =>
        row?.transaction_date
          ? row.transaction_date
          : row?.dd_date
          ? moment(row.dd_date).format("DD-MM-YYYY")
          : null,
    },

    { field: "created_username", headerName: "Created By", flex: 1 },
    { field: "paid_year", headerName: "Paid Year", flex: 0.5 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "Print",
      type: "actions",
      flex: 0.5,
      headerName: "Print",
      getActions: (params) => [
        (params.row.receipt_type.toLowerCase() === "bulk" ||
          params.row.receipt_type.toLowerCase() === "bulk fee") &&
        params.row.student_id !== null ? (
          <IconButton
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
        ) : (params.row.receipt_type.toLowerCase() === "bulk" ||
            params.row.receipt_type.toLowerCase() === "bulk fee") &&
          params.row.student_id === null ? (
          <IconButton
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
        ) : params.row.receipt_type.toLowerCase() === "exam" ||
          params.row.receipt_type.toLowerCase() === "exam fee" ? (
          <IconButton
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
        ) : params.row.receipt_type.toLowerCase() === "hosb" ? (
          <IconButton
            onClick={() =>
              navigate(`/HostelBulkFeeReceiptV1`, {
                state: {
                  feeReceiptId: params.row.id,
                  studentId: params.row.student_id,
                  linkStatus: true,
                },
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
  ];

  const setNullField = () => {
    setValues((prevState) => ({
      ...prevState,
      startDate: "",
      endDate: "",
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (name == "endDate") {
      getData("custom", newValue);
    } else if (name == "startDate" || newValue == "custom") {
    } else if (name == "schoolId") {
      getData("schoolId", newValue);
    } else {
      getData(newValue, "");
      setNullField();
    }
  };

  const getRowClassName = (params) => {
    return !params.row?.active ? classes.redRow : "";
  };

  return (
    <Box>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: { xs: 2, md: -5 },
        }}
      >
        <Grid xs={12} md={3}>
          <CustomAutocomplete
            name="schoolId"
            label="School"
            value={values.schoolId}
            options={values.schoolList || []}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>
        <Grid xs={12} md={2}>
          <CustomAutocomplete
            name="filter"
            label="filter"
            value={values.filter}
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
      <Box
        sx={{
          position: "relative",
          marginTop: "10px",
        }}
      >
        <Box sx={{ position: "absolute", width: "100%",height:"500px",overflow:"auto"}}>
          <Box sx={{ position: "relative" }}>
            <GridIndex
              getRowClassName={getRowClassName}
              rows={rows}
              columns={columns}
              loading={loading}
              columnVisibilityModel={columnVisibilityModel}
              setColumnVisibilityModel={setColumnVisibilityModel}
            />
          </Box>
          <Box sx={{ position: "relative" }}>
            {rows.length > 0 && !loading && (
              <Box
                sx={{
                  border: "1px solid rgba(224, 224, 224, 1)",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  marginTop: "-50px",
                }}
              >
                <TableContainer>
                  <Table>
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell
                          sx={{ textAlign: "center", fontWeight: "500" }}
                        >
                          Total
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ textAlign: "right", fontWeight: "500" }}
                        >
                          {Number(
                            cashTotal % 1 !== 0
                              ? cashTotal?.toFixed(2)
                              : cashTotal
                          ) || 0}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ textAlign: "right", fontWeight: "500" }}
                        >
                          {Number(
                            ddTotal % 1 !== 0 ? ddTotal?.toFixed(2) : ddTotal
                          ) || 0}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ textAlign: "right", fontWeight: "500" }}
                        >
                          {Number(
                            onlineTotal % 1 !== 0
                              ? onlineTotal?.toFixed(2)
                              : onlineTotal
                          ) || 0}
                        </StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell
                          sx={{ textAlign: "center", fontWeight: "500" }}
                        >
                          Grand Total ={" "}
                          {Number(
                            (cashTotal + ddTotal + onlineTotal) % 1 !== 0
                              ? (cashTotal + ddTotal + onlineTotal)?.toFixed(2)
                              : cashTotal + ddTotal + onlineTotal
                          ) || 0}
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default StudentFeereceiptIndex;
