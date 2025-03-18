import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { HighlightOff, Visibility } from "@mui/icons-material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "../../../services/Api";
import CustomModal from "../../../components/CustomModal";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function DraftPaymentVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({ fileUpload: "" });
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [voucherNo, setVoucherNo] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

  const columns = [
    {
      field: "id",
      type: "actions",

      headerName: "Approve",
      getActions: (params) => [
        params.row.created_by === userId ? (
          <Typography variant="subtitle2">Pending</Typography>
        ) : params.row.approved_status === 1 ? (
          <IconButton color="primary">
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        ) : params.row.created_by === userId ? (
          <Typography variant="subtitle2">Pending</Typography>
        ) : (
          <IconButton
            onClick={() =>
              navigate(
                `/ApproveDraftPayingVoucher/${params.row.voucher_no}/${params.row.school_id}/${params.row.financial_year_id}`
              )
            }
            color="primary"
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        ),
      ],
    },
    {
      field: "upload",
      type: "actions",
      flex: 1,
      headerName: "View",
      getActions: (params) => [
        params.row.attachment_path === null ? (
          <IconButton onClick={() => handleUpload(params)} color="primary">
            <CloudUploadIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={() =>
              navigate(`/DraftPaymentPdfView/${params.row.voucher_no}`)
            }
            color="primary"
          >
            <Visibility sx={{ color: "auzColor.main" }} />
          </IconButton>
        ),
      ],
    },

    { field: "pay_to", headerName: "Pay to", flex: 1 },
    { field: "bank_name", headerName: "Bank", flex: 1 },
    { field: "dept_name_short", headerName: "Dept", flex: 1 },
    { field: "debit_total", headerName: "Debit", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },

    {
      field: "cancel",
      type: "actions",
      flex: 1,
      headerName: "Cancel",

      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params)} sx={{ padding: 0 }}>
          <HighlightOff color="error" />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Payment Index" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllDraftPaymentVoucher?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
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

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setData((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setData((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleUpload = async (params) => {
    setUploadOpen(true);
    setVoucherNo(params.row.voucher_no);
  };

  const handleUpdateDocument = async () => {
    const dataArray = new FormData();
    dataArray.append("file", data.fileUpload);
    dataArray.append("voucher_no", voucherNo);
    setLoading(true);

    await axios
      .post(`/api/finance/draftPaymentVoucherUploadFile`, dataArray)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Uploaded Successfully",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data.message,
          });
        }

        setAlertOpen(true);
        setLoading(false);
        setUploadOpen(false);
        getData();
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
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
        title="Upload"
        maxWidth={500}
        open={uploadOpen}
        setOpen={setUploadOpen}
      >
        <Grid
          container
          rowSpacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12}>
            <CustomFileInput
              name="fileUpload"
              label="Document"
              helperText="PDF - smaller than 2 MB"
              file={data.fileUpload}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              disabled={loading}
              onClick={handleUpdateDocument}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Upload"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 8 }}>
        <Button
          onClick={() => navigate("/PaymentMaster/PaymentVoucher/New")}
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
export default DraftPaymentVoucherIndex;
