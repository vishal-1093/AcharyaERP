import { useState, useEffect } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Visibility } from "@mui/icons-material";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import { Print } from "@mui/icons-material";
import { GenerateScholarshipApplication } from "../forms/candidateWalkin/GenerateScholarshipApplication";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const breadCrumbsList = [{ name: "Approve Scholarship" }];

function ScholarshipApproverIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/student/getIsVerifiedDataForIndex",
        {
          params: { page: 0, page_size: 10000, sort: "created_date" },
        }
      );
      setRows(response.data.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleDownload = async (obj) => {
    try {
      const response = await axios.get(
        `/api/ScholarshipAttachmentFileviews?fileName=${obj}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to download the document !!",
      });
      setAlertOpen(true);
    }
  };

  const handleGeneratePrint = async (data) => {
    try {
      const response = await axios.get(
        "/api/student/getStudentDetailsBasedOnAuidAndStrudentId",
        { params: { auid: data.auid } }
      );
      const studentData = response.data.data[0];

      const schResponse = await axios.get(
        `/api/student/fetchScholarship2/${data.id}`
      );
      const schData = schResponse.data.data[0];

      const blobFile = await GenerateScholarshipApplication(
        studentData,
        schData
      );

      if (blobFile) {
        window.open(URL.createObjectURL(blobFile));
      } else {
        setAlertMessage({
          severity: "error",
          message: "Failed to generate scholarship application print !!",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to generate scholarship application print !!",
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      hideable: false,
    },
    {
      field: "requested_scholarship",
      headerName: "Requested Scholarship",
      flex: 1,
      hideable: false,
    },
    {
      field: "username",
      headerName: "Requested By",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">{params.row.requested_by}</Typography>
              <Typography variant="body2">
                {moment(params.row.requested_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.requested_by}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "verified_amount",
      headerName: "Verified Grant",
      flex: 1,
      hideable: false,
    },
    {
      field: "verified_name",
      headerName: "Verified By",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.verified_name}
              </Typography>
              <Typography variant="body2">
                {moment(params.row.verified_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.verified_name}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "scholarship_attachment_path",
      headerName: "Document",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDownload(params.row.scholarship_attachment_path)}
          sx={{ padding: 0 }}
        >
          <Visibility color="primary" sx={{ fontSize: 20 }} />
        </IconButton>
      ),
    },
    {
      field: "id",
      headerName: "Application Print",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleGeneratePrint(params.row)}
          sx={{ padding: 0 }}
        >
          <Print color="primary" />
        </IconButton>
      ),
    },
    {
      field: "is_approved",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          label="Result"
          color="primary"
          onClick={() =>
            navigate(
              `/ScholarshipApproverForm/${params.row.auid}/${params.row.scholarship_id}`
            )
          }
          sx={{ padding: 0 }}
        >
          <AddBoxIcon />
        </IconButton>
      ),
    },
  ];

  return <GridIndex rows={rows} columns={columns} />;
}

export default ScholarshipApproverIndex;
