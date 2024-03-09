import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Visibility } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import ModalWrapper from "../../../components/ModalWrapper";

function PaymentVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [voucherNo, setVoucherNo] = useState([]);
  const [data, setData] = useState({ fileUpload: "" });
  const [loading, setLoading] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);
  const [draftPaymentPdf, setDraftPaymentPdf] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "voucher_no", headerName: "Voucher No", flex: 1 },
    {
      field: "date",
      headerName: " Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.date ? moment(params.row.date).format("DD-MM-YYYY") : "NA",
    },
    { field: "pay_to", headerName: "Pay to", flex: 1 },
    { field: "cheque_dd_no", headerName: "Contract No", flex: 1 },
    { field: "debit_total", headerName: "Debit", flex: 1 },

    { field: "bank_name", headerName: "Bank", flex: 1 },

    {
      field: "upload",
      type: "actions",
      flex: 1,
      headerName: "View & Upload",
      getActions: (params) => [
        <IconButton onClick={() => handleUpload(params)} color="primary">
          <CloudUploadIcon fontSize="small" />
        </IconButton>,
      ],
    },
    { field: "username", headerName: "Verified By", flex: 1 },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Print",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/PaymentVoucherPdf/${params.row.voucher_no}/${params.row.school_id}/${params.row.financial_year_id}`
            )
          }
          color="primary"
        >
          <PrintIcon fontSize="small" />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllPaymentVoucher?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
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
    await axios
      .get(
        `/api/finance/getVoucherAttachmentByVoucherNo/${params.row.voucher_no}`
      )
      .then((res) => {
        setAllDocuments(res.data);
      })
      .catch((err) => console.error(err));

    await axios
      .get(
        `/api/finance/getDraftVoucherFileByVoucherId/${params.row.payment_voucher_id}`
      )
      .then((res) => {
        setDraftPaymentPdf(res);
      })
      .catch((err) => console.error(err));
  };

  const handleDownloadPaymentVoucherPdf = async (obj) => {
    await axios
      .get(`/api/finance/paymentVoucherFileDownload?fileName=${obj.filePath}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleDownloadDraftVoucherPdf = async (obj) => {
    await axios
      .get(
        `/api/finance/draftPaymentVoucherFileviews?fileName=${draftPaymentPdf.data.attachment_path}`,
        {
          method: "GET",
          responseType: "blob",
        }
      )
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleUploadDocument = async () => {
    const dataArray = new FormData();
    dataArray.append("multipartFile", data.fileUpload);
    dataArray.append("payment_voucher_no", voucherNo);
    setLoading(true);

    await axios
      .post(`/api/finance/paymentVoucherUploadFile`, dataArray)
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
        setData({ fileUpload: "" });
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
        maxWidth={600}
        open={uploadOpen}
        setOpen={setUploadOpen}
      >
        <Grid
          container
          rowSpacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} md={6}>
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
              onClick={handleUploadDocument}
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
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                backgroundColor: "rgba(74, 87, 169, 0.1)",
                color: "#46464E",
                p: 1,
              }}
            >
              Uploaded Documents
            </Typography>
          </Grid>
          <Grid container component={Paper}>
            <Grid item xs={12} md={4} mt={1}>
              {draftPaymentPdf.data !== "" ? (
                <IconButton onClick={() => handleDownloadDraftVoucherPdf()}>
                  <Visibility />
                  <Typography sx={{ marginLeft: 1 }}>
                    Payment Voucher
                  </Typography>
                </IconButton>
              ) : (
                <></>
              )}
            </Grid>

            {allDocuments.length > 0 ? (
              allDocuments.map((obj, i) => {
                return (
                  <Grid item xs={12} md={4} mt={1} key={i}>
                    <IconButton
                      onClick={() => handleDownloadPaymentVoucherPdf(obj)}
                    >
                      <Visibility />
                      <Typography sx={{ marginLeft: 1 }}>
                        Payment Voucher
                      </Typography>
                    </IconButton>
                  </Grid>
                );
              })
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default PaymentVoucherIndex;
