import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/TotalGridIndex.jsx";
import {
  Box,
  IconButton
} from "@mui/material";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import moment from "moment";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));

const initialValues = {
  loading: false,
  rows: []
};;

function LaptopIssueHistoryIndex() {
  const [{ rows, loading }, setValues] = useState(initialValues);
  const [reportPath, setReportPath] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
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
      type:"actions",
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
      type:"actions",
      getActions: (params) => [
        <IconButton>
          <DriveFolderUploadIcon  color="primary" />
        </IconButton>
      ]
    },
    {
      field: "printacknowledge",
      headerName: "Print Acknowledge",
      flex: 1,
      type:"actions",
      getActions: (params) => [
        <IconButton>
          <FileDownloadIcon  color="primary" />
        </IconButton>
      ]
    },
  ];

  const handleDownload = async (fileName) => {
    await axios
      .get(`api/student/laptopIssueFileDownload?fileName=${fileName}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
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


  return (
    <Box>
      <Box sx={{ position: "relative", marginTop: { xs: 8, md: 1 } }}>
        <Box sx={{ position: "absolute", width: "100%", }}>
          <GridIndex rows={rows} columns={columns} loading={loading} />
        </Box>
      </Box>
      <ModalWrapper
        title=""
        maxWidth={1000}
        open={isPrintModalOpen}
        setOpen={setIsPrintModalOpen}
      >
        <Box borderRadius={3}>
          {!!reportPath && (
            <object
              data={reportPath}
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
