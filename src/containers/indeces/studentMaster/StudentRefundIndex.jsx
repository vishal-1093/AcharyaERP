import { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableContainer,
  Paper,
  Box,
  Button,
  tableCellClasses,
  TableRow,
  styled,
  TableCell,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "../../../services/Api";
import CustomModal from "../../../components/CustomModal";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const StyledTableCells = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
  },
}));

function StudentRefundIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [receiptData, setReceiptData] = useState([]);
  const [values, setValues] = useState({ remarks: "" });

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const columns = [
    {
      field: "id",
      type: "actions",

      headerName: "Status",
      getActions: (params) => [
        params.row.created_by === userId &&
        params.row.approver_status === null ? (
          <Typography variant="subtitle2">Pending</Typography>
        ) : params.row.approver_status === "1" ? (
          <IconButton color="primary">
            <CheckCircleIcon
              fontSize="small"
              onClick={() =>
                navigate(`/StudentRefundPdf`, {
                  state: {
                    id: params.row.refund_reference_no,
                    schoolId: params.row.school_id,
                    fcYearId: params.row.financial_year_id,
                  },
                })
              }
            />
          </IconButton>
        ) : params.row.created_by === userId ? (
          <Typography variant="subtitle2">Pending</Typography>
        ) : (
          <IconButton onClick={() => handleOpen(params.row)} color="primary">
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        ),
      ],
    },

    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "student_name", headerName: "Name", flex: 1 },

    { field: "receipt_no", headerName: "Receipt No" },

    {
      field: "inr_value",
      headerName: "Amount",
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "voucher_head", headerName: "Voucher Head", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },

    // {
    //   field: "cancel",
    //   type: "actions",
    //   flex: 1,
    //   headerName: "Cancel",

    //   renderCell: (params) => (
    //     <IconButton onClick={() => handleDelete(params)} sx={{ padding: 0 }}>
    //       <HighlightOff color="error" />
    //     </IconButton>
    //   ),
    // },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllRefundRequest?page=${0}&page_size=${1000000000}&sort=created_date`
      )
      .then((Response) => {
        console.log(Response);

        setRows(Response.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleOpen = async (data) => {
    setValues({});
    setApproveOpen(true);
    await axios
      .get(
        `/api/finance/getRefundRequestDataDetails/${data.refund_reference_no}`
      )
      .then((response) => {
        console.log(response);
        setReceiptData(response.data.data);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = async (params) => {
    const voucherNo = params.row.voucher_no;

    const handleToggle = async () => {
      await axios
        .delete(`/api/finance/deleteDraftPaymentVoucher/${voucherNo}`)
        .then((Response) => {
          getData();
        })
        .catch((err) => console.error(err));
    };

    setModalContent({
      title: "",
      message: "Are you sure you want to cancel the request ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });

    setModalOpen(true);
  };

  const handleApprove = async () => {
    const ids = [];
    const payload = receiptData?.map((obj) => ({
      ...obj,
      refund_id: obj.id,
      approver_amount: obj.inr_value,
      approver_remarks: values.remarks,
      approver_status: 1,
      refund_status: "Approved",
    }));

    receiptData?.map((obj) => {
      ids.push(obj.id);
    });

    try {
      const response = await axios.put(
        `/api/finance/updateRefundRequest/${ids?.toString()}`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Approved Successfully",
        });
        setAlertOpen(true);
        setApproveOpen(false);
        getData();
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error?.response?.data?.message,
      });
      setAlertOpen(true);
    }
  };

  const handleReject = async () => {
    const ids = [];
    const payload = receiptData?.map((obj) => ({
      ...obj,
      approver_amount: obj.inr_value,
      approver_remarks: values.remarks,
      approver_status: 1,
      refund_status: "Approved",
    }));

    receiptData?.map((obj) => {
      ids.push(obj.id);
    });

    try {
      const response = await axios.put(
        `/api/finance/updateRefundRequest/${ids?.toString()}`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Approved Successfully",
        });
        setAlertOpen(true);
        setApproveOpen(false);
        getData();
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error?.response?.data?.message,
      });
      setAlertOpen(true);
    }
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
        title="Refund Approve"
        maxWidth={900}
        open={approveOpen}
        setOpen={setApproveOpen}
      >
        <Grid
          container
          rowSpacing={2}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCells>AUID</StyledTableCells>
                    <StyledTableCells>Student Name</StyledTableCells>
                    <StyledTableCells>School</StyledTableCells>
                    <StyledTableCells>Voucher</StyledTableCells>
                    <StyledTableCells>Amount</StyledTableCells>
                    <StyledTableCells>Receipt No</StyledTableCells>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {receiptData?.map((obj, i) => (
                    <TableRow key={i}>
                      <StyledTableCells>{obj.auid}</StyledTableCells>
                      <StyledTableCells>{obj.student_name}</StyledTableCells>
                      <StyledTableCells>
                        {obj.school_name_short}
                      </StyledTableCells>
                      <StyledTableCells>{obj.voucher_head}</StyledTableCells>
                      <StyledTableCells>{obj.inr_value}</StyledTableCells>
                      <StyledTableCells>{obj.receipt_no}</StyledTableCells>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button onClick={handleApprove} variant="contained" color="success">
              Approve
            </Button>
            <Button
              sx={{ ml: 2 }}
              onClick={handleReject}
              variant="contained"
              color="error"
            >
              Reject
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 8 }}>
        <Button
          onClick={() => navigate("/StudentRefund")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default StudentRefundIndex;
