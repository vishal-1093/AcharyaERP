import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Box,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Typography,
  tooltipClasses,
  Tooltip,
  styled,
  Stack,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { HighlightOff, Visibility } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import dayjs from "dayjs";

const initialValues = { cancelRemarks: "" };

const requiredFields = [];

const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 270,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

function PaymentJournal() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [voucherNo, setVoucherNo] = useState([]);
  const [data, setData] = useState({ fileUpload: "" });
  const [allDocuments, setAllDocuments] = useState([]);
  const [journalallDocuments, setJournalallDocuments] = useState([]);
  const [draftPaymentPdf, setDraftPaymentPdf] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelWrapperOpen, setCancelWrapperOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    {
      field: "journal_voucher_number",
      headerName: "Voucher No",
      flex: 1,
      hideable: false,
    },
    {
      field: "date",
      headerName: " Date",
      flex: 1,
      hideable: false,
      renderCell: (params) => moment(params?.row?.date).format("DD-MM-YYYY"),
    },
    { field: "pay_to", headerName: "Pay to", flex: 1, hideable: false },
    {
      field: "contract_number",
      headerName: "Contract No",
      flex: 1,
      hideable: false,
    },
    { field: "debit_total", headerName: "Debit", flex: 1, hideable: false },
    {
      field: "actual_date",
      headerName: "Actual Date",
      flex: 1,
      hide: true,
    },
    {
      field: "financial_year",
      headerName: "Financial Year",
      flex: 1,
      hide: true,
    },
    {
      field: "dept_name",
      headerName: "Department",
      flex: 1,
      hide: true,
    },
    // {
    //   field: "draft_created_username",
    //   headerName: "Created By",
    //   flex: 1,
    //   hideable: false,
    //   renderCell: (params) => (
    //     <HtmlTooltip
    //       title={
    //         <Box>
    //           <Typography variant="body2">
    //             {params.row.created_username}
    //           </Typography>
    //           <Typography variant="body2">
    //             {moment(params.row.created_date).format("DD-MM-YYYY")}
    //           </Typography>
    //         </Box>
    //       }
    //     >
    //       <span>{params.row.draft_created_username}</span>
    //     </HtmlTooltip>
    //   ),
    // },
    {
      field: "draft_created_username",
      headerName: "Maker",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.draft_created_username}
              </Typography>
              <Typography variant="body2">
                {moment(params.row.draft_created_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.draft_created_username}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "created_username",
      headerName: "Checker",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.created_username}
              </Typography>
              <Typography variant="body2">
                {moment(params.row.created_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.created_username}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "attachment_path",
      headerName: "View & Upload",
      flex: 1,
      renderCell: (params) => [
        <IconButton onClick={() => handleUpload(params)} color="primary">
          <CloudUploadIcon fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "id",
      headerName: "Print",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(
              `/PaymentJournalVoucherPdf/${params.row.journal_voucher_number}/${params.row.school_id}/${params.row.financial_year_id}`
            )
          }
          color="primary"
        >
          <PrintIcon fontSize="small" />
        </IconButton>
      ),
    },
    {
      field: "cancel_voucher",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) =>
        params.row.active === true ? (
          <IconButton
            onClick={() => handleCancel(params.row)}
            sx={{ padding: 0 }}
          >
            <HighlightOff color="error" />
          </IconButton>
        ) : (
          <HtmlTooltip
            title={
              <Box>
                <Typography variant="body2">
                  <b>Cancelled By</b> : &nbsp;{params.row.cancelled_username}
                </Typography>
                <Typography variant="body2">
                  <b>Cancelled Date</b> : &nbsp;
                  {moment(params.row.cancelled_date).format("DD-MM-YYYY")}
                </Typography>
                <Typography variant="body2">
                  <b>Remarks</b> : &nbsp; {params.row.voucher_remarks}
                </Typography>
              </Box>
            }
          >
            <span>{params.row.cancelled_username}</span>
          </HtmlTooltip>
        ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllJournalVoucher?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((error) => console.error(error));
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

  const handleUploadDocument = async () => {
    const dataArray = new FormData();
    dataArray.append("multipartFile", data.fileUpload);
    dataArray.append("journal_voucher_number", voucherNo);
    setLoading(true);

    await axios
      .post(`/api/finance/journalVoucherUploadFile`, dataArray)
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
  const handleDownloadjournalPdf = async (obj) => {
    await axios
      .get(
        `/api/finance/journalVoucherFileDownload?fileName=${obj.attachment_path}`,
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

  const handleUpload = async (params) => {
    setUploadOpen(true);
    // draft_journal_voucher_id
    setVoucherNo(params.row.journal_voucher_number);

    await axios
      .get(
        `/api/finance/getdraftJournalVoucherAttachmentByVoucherNo/${params.row.journal_voucher_number}`
      )
      .then((res) => {
        setAllDocuments(res.data);
      })
      .catch((err) => console.error(err));

    await axios
      .get(
        `/api/finance/getjournalVoucherAttachmentByVoucherNo/${params.row.journal_voucher_number}`
      )
      .then((res) => {
        setJournalallDocuments(res.data);
      })
      .catch((err) => console.error(err));
  };

  const checks = {
    cancelRemarks: [
      values.cancelRemarks !== "",
      values?.cancelRemarks?.length < 100,
    ],
    fileUpload: [
      data.fileUpload !== "",
      data.fileUpload && data.fileUpload.name.endsWith(".pdf"),
      data.fileUpload && data.fileUpload.size < 2000000,
    ],
  };

  const errorMessages = {
    cancelRemarks: ["This field is required", "Maximum characters 100"],
    fileUpload: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const handleDownloadPaymentVoucherPdf = async (obj) => {
    await axios
      .get(
        `/api/finance/draftJournalVoucherFileviews?fileName=${obj.attachment_path}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleCancel = (data) => {
    if (requiredFields.includes("cancelRemarks") === false) {
      requiredFields.push("cancelRemarks");
    }
    setCancelWrapperOpen(true);
    setRowData(data);
    setValues((prev) => ({
      ...prev,
      ["cancelRemarks"]: "",
    }));
    setConfirmCancel(false);
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCancelUpdate = async () => {
    const getJournalData = await axios
      .get(
        `/api/finance/getJournalVoucherByVoucherNumber/${rowData.journal_voucher_number}/${rowData.school_id}/${rowData.financial_year_id}`
      )
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const temp = getJournalData.map((obj) => {
      return {
        ...obj,
        active: false,
        cancelled_by: userId,
        cancelled_date: convertUTCtoTimeZone(dayjs()),
        voucher_remarks: values.cancelRemarks,
      };
    });
    const ids = temp.map((obj) => obj.journal_voucher_id);

    setLoading(true);
    await axios
      .put(`/api/finance/updateJournalVoucher/${ids}`, temp)
      .then((res) => {
        if (res.data.success === true) {
          setAlertMessage({
            severity: "success",
            message: "JV cancelled successfully !!",
          });
          setAlertOpen(true);
          setLoading(false);
        } else {
          setAlertMessage({
            severity: "error",
            message: "Unable to cancel the JV !!",
          });
          setAlertOpen(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      });

    setCancelWrapperOpen(false);
    getData();
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
              checks={checks.fileUpload}
              errors={errorMessages.fileUpload}
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
            {allDocuments.length > 0 ? (
              allDocuments.map((obj, i) => {
                if (obj.attachment_path !== null) {
                  return (
                    <Grid item xs={12} md={4} mt={1} key={i}>
                      <IconButton
                        onClick={() => handleDownloadPaymentVoucherPdf(obj)}
                      >
                        <Visibility />
                        <Typography sx={{ marginLeft: 1 }}>
                          Journal Voucher
                        </Typography>
                      </IconButton>
                    </Grid>
                  );
                }
              })
            ) : (
              <></>
            )}
            {journalallDocuments.length > 0 ? (
              journalallDocuments.map((obj, i) => {
                if (obj.attachment_path !== null) {
                  return (
                    <Grid item xs={12} md={4} mt={1} key={i}>
                      <IconButton onClick={() => handleDownloadjournalPdf(obj)}>
                        <Visibility />
                        <Typography sx={{ marginLeft: 1 }}>
                          Journal Voucher
                        </Typography>
                      </IconButton>
                    </Grid>
                  );
                }
              })
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </ModalWrapper>

      {/* Cancel Voucher  */}

      <ModalWrapper
        open={cancelWrapperOpen}
        setOpen={setCancelWrapperOpen}
        maxWidth={500}
        title={"Cancel Voucher - " + rowData.journal_voucher_number}
      >
        <Box mt={2}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                name="cancelRemarks"
                label="Reason for cancel"
                value={values.cancelRemarks}
                handleChange={handleChange}
                checks={checks.cancelRemarks}
                errors={errorMessages.cancelRemarks}
                multiline
                rows={2}
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="error"
                onClick={() => setConfirmCancel(true)}
                disabled={loading || !requiredFieldsValid()}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <Typography variant="subtitle2">Cancel</Typography>
                )}
              </Button>
            </Grid>

            {confirmCancel ? (
              <Grid item xs={12} mt={2}>
                <Grid
                  container
                  component={Paper}
                  elevation={4}
                  sx={{
                    padding: 2,
                  }}
                >
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ fontSize: 15 }}
                    >
                      Are you sure want to cancel?
                    </Typography>
                  </Grid>

                  <Grid item xs={12} align="right" mt={4}>
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={2}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleCancelUpdate}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setConfirmCancel(false)}
                      >
                        No
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Box>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default PaymentJournal;
