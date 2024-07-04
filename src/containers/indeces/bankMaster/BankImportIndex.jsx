import { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  styled,
  Grid,
  Paper,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { Visibility } from "@mui/icons-material";
import ModalWrapper from "../../../components/ModalWrapper";
import { Check, HighlightOff } from "@mui/icons-material";

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

function BankImportIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    {
      field: "created_Date",
      headerName: "Imported Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.created_Date
          ? params.row.created_Date.substr(0, 10).split("-").reverse().join("/")
          : "NA",
    },
    {
      field: "transaction_date",
      headerName: "Transaction Date",
      flex: 1,
    },
    {
      field: "transaction_no",
      headerName: "Transaction No",
      flex: 1,
      hide: true,
    },
    { field: "voucher_head", headerName: "Bank", flex: 1 },
    {
      field: "cheque_dd_no",
      headerName: "Reference No",
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
      field: "view",
      headerName: "View",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => handleViewTransaction(params)}>
          <Visibility fontSize="small" color="primary" />
        </IconButton>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/fetchAllbankImportTransactionDetail?page=${0}&page_size=${10000}&sort=created_by`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/student/bankImportTransaction/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/student/activateBankImportTransaction/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Are you sure you want to cancel ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  const handleViewTransaction = async (params) => {
    setTransactionOpen(true);
    await axios
      .get(`/api/finance/allRTGSFeeHistoryDetails/${params.row.id}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <ModalWrapper
        open={transactionOpen}
        setOpen={setTransactionOpen}
        maxWidth={900}
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
                          <StyledTableCell>{obj.student_name}</StyledTableCell>
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/BankMaster/BankImport/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>

        <Button
          onClick={() => navigate("/BankClearedHistory")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 120, top: -57, borderRadius: 2 }}
          startIcon={<HistoryIcon />}
        >
          Cleared History
        </Button>

        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default BankImportIndex;
