import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  tableCellClasses,
  styled,
  TableRow,
  Grid,
  Table,
  Paper,
  Tooltip,
  tooltipClasses,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Visibility } from "@mui/icons-material";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

function BankImportClearedHistory() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getClearedHistory();
    setCrumbs([{ name: "BankMaster", link: "/BankMaster/Import" }]);
  }, []);

  const columns = [
    {
      field: "created_Date",
      headerName: "Imported Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.created_Date
          ? moment(row?.created_Date).format("DD-MM-YYYY")
          : "NA",
    },
    {
      field: "transaction_date",
      headerName: "Transaction Date",
      flex: 1,
    },
    { field: "transaction_no", headerName: "Transaction No", flex: 1 },
    { field: "bank_name", headerName: "Bank", flex: 1 },
    {
      field: "cheque_dd_no",
      headerName: "Cheque/DD No",
      flex: 1,
      renderCell: (params) => {
        return params.row.cheque_dd_no.length > 15 ? (
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
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "balance", headerName: "Balance", flex: 1 },
    {
      field: "receipt_no",
      headerName: "Receipt No",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton color="primary" onClick={() => handleModalOpen(params)}>
          <Visibility fontSize="small" />
        </IconButton>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
  ];

  const getClearedHistory = async () => {
    await axios
      .get(
        `/api/student/fetchAllbankImportTransactionDetailsForClearedHistory?page=${0}&page_size=${10000}&sort=created_by`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleModalOpen = async (params) => {
    setModalOpen(true);
    await axios
      .get(`/api/finance/allRTGSFeeHistoryDetails/${params.row.id}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <ModalWrapper
          title="Transaction Fee Receipt"
          maxWidth={1000}
          open={modalOpen}
          setOpen={setModalOpen}
        >
          <Grid container>
            <Grid item xs={12} mt={2}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>AUID</StyledTableCell>
                      <StyledTableCell>USN</StyledTableCell>
                      <StyledTableCell>Receipt No</StyledTableCell>
                      <StyledTableCell>Receipt Date</StyledTableCell>
                      <StyledTableCell>Transaction Date</StyledTableCell>
                      <StyledTableCell>Paid</StyledTableCell>
                      <StyledTableCell>Created Date</StyledTableCell>
                      <StyledTableCell>Created By</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {data.length > 0 ? (
                      data.map((obj, i) => {
                        return (
                          <StyledTableRow key={i}>
                            <StyledTableCell>
                              {obj.student_name}
                            </StyledTableCell>
                            <StyledTableCell>{obj.auid}</StyledTableCell>
                            <StyledTableCell>{obj.usn}</StyledTableCell>
                            <StyledTableCell>{obj.receipt_no}</StyledTableCell>
                            <StyledTableCell>
                              {obj.created_date
                                .substr(0, 10)
                                .split("-")
                                .reverse()
                                .join("-")}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.transaction_date}
                            </StyledTableCell>
                            <StyledTableCell>{obj.paid}</StyledTableCell>
                            <StyledTableCell>
                              {obj.created_date
                                .substr(0, 10)
                                .split("-")
                                .reverse()
                                .join("-")}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.created_username}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </ModalWrapper>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default BankImportClearedHistory;
