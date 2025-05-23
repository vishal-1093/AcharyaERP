import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/TotalGridIndex.jsx";
import {
  Box,
  IconButton,
  Button,
  Grid,
  Badge
} from "@mui/material";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import moment from "moment";
import { GenerateLaptopIssueAcknowledge } from "./GenerateLaptopIssueAcknowledge.jsx";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput.jsx")
);

const initialValues = {
  loading: false,
  rows: [],
  isPhotoModalOpen: false,
  photoUrl: null,
  isAcknowledgeModalOpen: false,
  ackUrl: null,
  isAckModalOpen: false,
  attachment: null,
  rowDetails: null,
  isAckDownloadModalOpen: false,
  ackDownloadFileUrl: null,
  ackDownloadPhotoFileUrl: null,
  photoImageUrl: null
};
const requiredAttachment = ["attachment"];

function LaptopIssueHistoryIndex() {
  const [{ rows, loading, isPhotoModalOpen, photoUrl, isAcknowledgeModalOpen, ackUrl, isAckModalOpen, attachment, rowDetails,
    isAckDownloadModalOpen, ackDownloadFileUrl, ackDownloadPhotoFileUrl, photoImageUrl }, setValues] = useState(initialValues);
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      field: "auid", headerName: "Auid", flex: 1,
    },
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "serialNo",
      headerName: "Serial No.",
      flex: 1,
    },
    {
      field: "grn_ref_no",
      headerName: "GRN Ref No.",
      flex: 1,
      hideable: false,
    },
    {
      field: "issued_by_name",
      headerName: "Issued By",
      flex: 1,
    },
    {
      field: "issued_date",
      headerName: "Issued Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.issued_date ? moment(row.issued_date).format("DD-MM-YYYY") : "",
    },
    {
      field: "attachment",
      headerName: "Photo",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() => handleDownload(params.row.attachment_path)}
          sx={{ padding: 0 }}
          disabled={!params.row.attachment_path}
        >
          <VisibilityIcon
            fontSize="small"
            color={params.row.attachment_path ? "primary" : "secondary"}
            sx={{ cursor: "pointer" }}
          />
        </IconButton>
      ],
    },
    {
      field: "acknowledge",
      headerName: "Acknowledge",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        !params.row.acknowledgment_path ? <IconButton onClick={() => onClickAck(params.row)}>
          <DriveFolderUploadIcon color="primary" />
        </IconButton> : <IconButton onClick={() => onDownloadAck(params.row.acknowledgment_path)}>
          <VisibilityIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: "pointer" }}
          />
        </IconButton>
      ]
    },
    {
      field: "printacknowledge",
      headerName: "Print Acknowledge",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => onPrintAck(params.row)}>
           <Badge badgeContent="Print" color="primary"></Badge>
          {/* <Typography  variant="paragraph" color="primary" sx={{fontSize:"15px"}}></Typography> */}
        </IconButton>
      ]
    },
  ];

  const handleDownload = async (fileName) => {
    if (fileName.endsWith(".pdf")) {
      await axios
        .get(`api/student/laptopIssueFileDownload?fileName=${fileName}`, {
          responseType: "blob",
        })
        .then((res) => {
          const file = new Blob([res.data], { type: "application/pdf" });
          const url = URL.createObjectURL(file);
          setValues((prevState) => ({
            ...prevState,
            isPhotoModalOpen: !isPhotoModalOpen,
            photoUrl: url,
            photoImageUrl:null
          }));
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(`api/student/laptopIssueFileDownload?fileName=${fileName}`, {
          responseType: "blob",
        })
        .then((res) => {
          setValues((prevState) => ({
            ...prevState,
            isPhotoModalOpen: !isPhotoModalOpen,
            photoImageUrl: URL.createObjectURL(res.data),
            photoUrl:null
          }));
        })
        .catch((err) => console.error(err));
    }
  };

  const setIsPhotoModalOpen = () => {
    setValues((prevState) => ({
      ...prevState,
      isPhotoModalOpen: !isPhotoModalOpen
    }))
  };

  const onClickAck = (rowData) => {
    setValues((prevState) => ({
      ...prevState,
      isAckModalOpen: !isAckModalOpen,
      rowDetails: rowData
    }))
  };

  const setIsAckModalOpen = () => {
    setValues((prevState) => ({
      ...prevState,
      isAckModalOpen: !isAckModalOpen
    }))
  };

  const onDownloadAck = async (fileName) => {
    if (fileName.endsWith(".pdf")) {
      await axios
        .get(`api/student/laptopIssueFileDownload?fileName=${fileName}`, {
          responseType: "blob",
        })
        .then((res) => {
          const file = new Blob([res.data], { type: "application/pdf" });
          const url = URL.createObjectURL(file);
          setValues((prevState) => ({
            ...prevState,
            isAckDownloadModalOpen: !isAckDownloadModalOpen,
            ackDownloadFileUrl: url,
            ackDownloadPhotoFileUrl:null
          }));
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(`api/student/laptopIssueFileDownload?fileName=${fileName}`, {
          responseType: "blob",
        })
        .then((res) => {
          setValues((prevState) => ({
            ...prevState,
            isAckDownloadModalOpen: !isAckDownloadModalOpen,
            ackDownloadPhotoFileUrl: URL.createObjectURL(res.data),
            ackDownloadFileUrl:null
          }));
        })
        .catch((err) => console.error(err));
    }
  };

  const setIsAckDownloadModalOpen = () => {
    setValues((prevState) => ({
      ...prevState,
      isAckDownloadModalOpen: !isAckDownloadModalOpen
    }))
  }

  const onPrintAck = async ({ id, student_id }) => {
    try {
      const res = await axios.get(`/api/student/getDataForAcknowledgment?laptop_issue_id=${id}&student_id=${student_id}`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data;
        const reportResponse = await GenerateLaptopIssueAcknowledge(list);
        if (!!reportResponse) {
          setValues((prevState) => ({
            ...prevState,
            ackUrl: URL.createObjectURL(reportResponse),
            isAcknowledgeModalOpen: true
          }))
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const setIsAcknowledgeModalOpen = () => {
    setValues((prevState) => ({
      ...prevState,
      isAcknowledgeModalOpen: !isAcknowledgeModalOpen
    }))
  };

  const setLoading = (val) => {
    setValues((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/student/fetchAllLaptopIssueHistory?page=0&page_size=1000000&sort=created_date`);
      if (res.status == 200 || res.status == 201) {
        setValues((prevState) => ({
          ...prevState,
          rows: res.data.data.Paginated_data.content
        }));
        setLoading(false)
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false)
    }
  };


  const handleFileDrop = (name, newFile) => {
    setValues((prev) => ({
      ...prev,
      [name]: newFile,
    }));
  };

  const errorAttachmentMessages = {
    attachment: [
      "This field is required",
      "Please upload a PDF || JPEG || JPG || PNG",
      "Maximum size 2 MB",
    ],
  };

  const checkAttachment = {
    attachment: [
      attachment !== "",
      attachment?.name?.endsWith(".pdf") ||
      attachment?.name?.endsWith(".jpeg") ||
      attachment?.name?.endsWith(".jpg") ||
      attachment?.name?.endsWith(".png"),
      attachment?.size < 2000000,
    ],
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      attachment: null,
    }));
  };

  const isAttachmentValid = () => {
    for (let i = 0; i < requiredAttachment.length; i++) {
      const field = requiredAttachment[i];
      if (Object.keys(checkAttachment).includes(field)) {
        const ch = checkAttachment[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("laptop_issue_id", rowDetails.id)
      formData.append("file2", attachment);
      const res = await axios.post(`api/student/laptopIssueUploadFile`, formData);
      if (res.status == 200 || res.status == 201) {
        setIsAckModalOpen();
        setAlertMessage({
          severity: "success",
          message: "Acknowledgement is successfully uploaded !!",
        });
        setAlertOpen(true);
        getData();
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  return (
    <Box>
      <Box sx={{ position: "relative", marginTop: { xs: 8, md: 1 } }}>
        <Box sx={{ position: "absolute", width: "100%", }}>
          <GridIndex rows={rows} columns={columns} loading={loading} />
        </Box>
      </Box>

      <ModalWrapper
        title="Laptop Issued File"
        maxWidth={800}
        open={isPhotoModalOpen}
        setOpen={setIsPhotoModalOpen}
      >
        {photoUrl && <Box borderRadius={3}>
          {photoUrl && (
            <object
              data={photoUrl}
              type="application/pdf"
              style={{ height: "450px", width: "100%" }}
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          )}
        </Box>}
        {photoImageUrl && <Box borderRadius={3}>
          {photoImageUrl && (
            <img src={photoImageUrl} alt="Laptop Issued file" width="100%" />
          )}
        </Box>}
      </ModalWrapper>

      <ModalWrapper
        title="Acknowledgement File"
        maxWidth={800}
        open={isAckDownloadModalOpen}
        setOpen={setIsAckDownloadModalOpen}
      >
        {ackDownloadFileUrl && <Box borderRadius={3}>
          {ackDownloadFileUrl && (
            <object
              data={ackDownloadFileUrl}
              type="application/pdf"
              style={{ height: "450px", width: "100%" }}
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          )}
        </Box>}
        {ackDownloadPhotoFileUrl && <Box borderRadius={3}>
          {ackDownloadPhotoFileUrl && (
            <img src={ackDownloadPhotoFileUrl} alt="acknowledgementfile" width="100%" />
          )}
        </Box>}
      </ModalWrapper>

      <ModalWrapper
        title="Upload Acknowledgement File"
        maxWidth={500}
        open={isAckModalOpen}
        setOpen={setIsAckModalOpen}
      >
        <Grid container>
          <Grid item xs={12}>
            <CustomFileInput
              name="attachment"
              label="PDF or JPEG or JPG or PNG  File Attachment"
              helperText="File Attachment - smaller than 2 MB"
              file={attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checkAttachment.attachment}
              errors={errorAttachmentMessages.attachment}
              required
            />
          </Grid>
          <Grid item mt={1} xs={12} textAlign="right">
            <Button
              onClick={onSubmit}
              variant="contained"
              disableElevation
              disabled={!isAttachmentValid()}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        title=""
        maxWidth={1000}
        open={isAcknowledgeModalOpen}
        setOpen={setIsAcknowledgeModalOpen}
      >
        <Box borderRadius={3}>
          {ackUrl && (
            <object
              data={ackUrl}
              type="application/pdf"
              style={{ height: "450px", width: "100%" }}
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          )}
        </Box>
      </ModalWrapper>
    </Box>
  );
}

export default LaptopIssueHistoryIndex;
