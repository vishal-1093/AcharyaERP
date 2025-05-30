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

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

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
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    approver_date: false,
    approver_name: false,
    approver_remarks: false,
    refund_remarks: false,
  });

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
            <CheckCircleIcon fontSize="small" />
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

    { field: "approver_name", headerName: "Approved By", flex: 1 },
    {
      field: "approver_date",
      headerName: "Approved Date",
    },

    {
      field: "approver_remarks",
      headerName: "Approver Remarks",
      flex: 1,
    },

    {
      field: "refund_remarks",
      headerName: "Refund Remarks",
      flex: 1,
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
        setRows(Response.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleOpen = async (data) => {
    setValues({});
    setApproveOpen(true);
    await axios
      .get(
        `/api/finance/getRefundRequestData/${data.refund_reference_no}/${data.school_id}/${data.financial_year_id}`
      )
      .then((response) => {
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
      approver_id: userID,
      approver_date: moment(new Date()).format("DD-MM-YYYY"),
    }));

    receiptData?.map((obj) => {
      ids.push(obj.id);
    });

    const journalPayload = [];

    const creditPayload = {
      active: true,
      date: moment(new Date()).format("DD-MM-YYYY"),
      credit: receiptData?.reduce(
        (total, sum) => Number(total) + Number(sum.inr_value),
        0
      ),
      credit_total: receiptData?.reduce(
        (total, sum) => Number(total) + Number(sum.inr_value),
        0
      ),
      debit: 0,
      debit_total: receiptData?.reduce(
        (total, sum) => Number(total) + Number(sum.inr_value),
        0
      ),

      pay_to: receiptData?.[0]?.student_name,
      payment_mode: 4,
      remarks: `BEING REFUND GENERATED FOR ${receiptData?.[0]?.auid}, ${receiptData?.[0]?.student_name}, ${receiptData?.[0]?.receipt_no}. DFDS& DATE , ${receiptData?.[0]?.refund_remarks}, DUE ADMISSION CANCELLATION`,
      school_id: receiptData?.[0]?.school_id,
      voucher_head_id: 503,
      type: "REFUND-JV",
      draftCreatedName: receiptData?.[0]?.created_username,
      verifier_id: userID,
      verified_status: 1,
      verified_date: new Date(),
      created_username: receiptData?.[0]?.created_username,
      created_by: receiptData?.[0]?.created_by,
    };

    receiptData?.forEach((obj) => {
      journalPayload.push({
        active: true,
        date: moment(new Date()).format("DD-MM-YYYY"),
        credit: 0,
        credit_total: receiptData?.reduce(
          (total, sum) => Number(total) + Number(sum.inr_value),
          0
        ),
        debit: obj.inr_value,
        debit_total: receiptData?.reduce(
          (total, sum) => Number(total) + Number(sum.inr_value),
          0
        ),
        draftCreatedName: obj.created_username,
        pay_to: receiptData?.[0]?.student_name,
        payment_mode: 4,
        reference_number: null,
        remarks: `Being Refund Generated For ${receiptData?.[0]?.auid}, ${
          receiptData?.[0]?.student_name
        }, Receipt No. ${receiptData?.[0]?.receipt_no} & ${moment(
          new Date()
        ).format("DD-MM-YYYY")} , ${
          receiptData?.[0]?.refund_remarks
        }, Due Admission Cancellation`,
        school_id: receiptData?.[0]?.school_id,
        voucher_head_id: obj.voucher_head_new_id,
        type: "REFUND-JV",
        verifier_id: userID,
        verified_status: 1,
        verified_date: new Date(),
        created_username: receiptData?.[0]?.created_username,
        created_by: receiptData?.[0]?.created_by,
      });
    });

    journalPayload.push(creditPayload);

    try {
      const response = await axios.put(
        `/api/finance/updateRefundRequest/${ids?.toString()}`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        const journalResponse = await axios.post(
          "api/finance/journalVoucher",
          journalPayload
        );

        if (journalResponse.status === 200 || journalResponse.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Approved Successfully",
          });
          setAlertOpen(true);
          setApproveOpen(false);
          getData();
        }
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
              // onClick={handleReject}
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
        <GridIndex
          rows={rows}
          columns={columns}
          setColumnVisibilityModel={setColumnVisibilityModel}
          columnVisibilityModel={columnVisibilityModel}
        />
      </Box>
    </>
  );
}
export default StudentRefundIndex;
