import { useState, useEffect } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { Print } from "@mui/icons-material";
import { Visibility } from "@mui/icons-material";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import useAlert from "../../hooks/useAlert";
import { GenerateScholarshipApplication } from "../forms/candidateWalkin/GenerateScholarshipApplication";
import OverlayLoader from "../../components/OverlayLoader";

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

const useStyle = makeStyles((theme) => ({
  approved: {
    background: "#dcf7dd !important",
  },
  cancelled: {
    background: "#ebb5b5 !important",
  },
}));

function ScholarshipApproverHistory() {
  const [rows, setRows] = useState([]);
  const [printLoading, setPrintLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const classes = useStyle();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Scholarship History" }]);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/student/getIsApprovedDataForIndex",
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
      setPrintLoading(true);
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
    } finally {
      setPrintLoading(false);
    }
  };

  const getRowClassName = (params) => {
    if (params.row.is_approved === "yes") {
      return classes.approved;
    } else if (params.row.is_approved === "no") {
      return classes.cancelled;
    }
  };

  const AvatarCells = ({ color }) => (
    <Avatar variant="square" sx={{ width: 20, height: 20, bgcolor: color }}>
      <Typography variant="subtitle2"></Typography>
    </Avatar>
  );

  const AvatarLabelCells = ({ label }) => (
    <Typography variant="body2" color="textSecondary">
      {label}
    </Typography>
  );

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
      headerName: "Requested",
      flex: 1,
    },
    {
      field: "username",
      headerName: "Requested By",
      flex: 1,
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
      headerName: "Verified",
      flex: 1,
    },
    {
      field: "verified_name",
      headerName: "Verified By",
      flex: 1,
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
      field: "approved_amount",
      headerName: "Approved",
      flex: 1,
    },
    {
      field: "approved_by_name",
      headerName: "Approved By",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.approved_by_name}
              </Typography>
              <Typography variant="body2">
                {moment(params.row.approved_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.approved_by_name}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "scholarship_attachment_path",
      headerName: "Attachment",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDownload(params.row.scholarship_attachment_path)}
          sx={{ padding: 0 }}
        >
          <Visibility color="primary" />
        </IconButton>
      ),
    },
    {
      field: "comments",
      headerName: "Remarks",
      flex: 1,
      renderCell: (params) =>
        params?.row?.comments?.length > 10 ? (
          <HtmlTooltip title={params.row.comments}>
            <span>{params.row.comments.substr(0, 10) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.comments
        ),
    },
    {
      field: "is_approved",
      headerName: "Print",
      flex: 1,
      renderCell: (params) =>
        params.row.is_approved === "yes" ? (
          <IconButton
            onClick={() => handleGeneratePrint(params.row)}
            sx={{ padding: 0 }}
          >
            <Print color="primary" />
          </IconButton>
        ) : params.row.is_approved === "no" ? (
          <HtmlTooltip
            title={
              <Box>
                <Typography variant="body2">
                  {params.row.approved_by_name}
                </Typography>
                <Typography variant="body2">
                  {moment(params.row.approved_date).format("DD-MM-YYYY")}
                </Typography>
              </Box>
            }
          >
            <span>{params.row.approved_by_name}</span>
          </HtmlTooltip>
        ) : (
          ""
        ),
    },
  ];

  return (
    <>
      {printLoading && <OverlayLoader />}

      <Box
        sx={{
          width: { md: "20%", lg: "15%", xs: "68%" },
          position: "absolute",
          right: 30,
          marginTop: { xs: 2, md: -5 },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          justifyContent={{ md: "right" }}
          sx={{ marginRight: 2, marginBottom: 2 }}
          alignItems="center"
        >
          <AvatarCells color="#dcf7dd" />
          <AvatarLabelCells label="Approved" />
          <AvatarCells color="#ef9a9a" />
          <AvatarLabelCells label="Rejected" />
        </Stack>
      </Box>

      <Box sx={{ marginTop: { xs: 10, md: 3 } }}>
        <GridIndex
          rows={rows}
          columns={columns}
          getRowClassName={getRowClassName}
        />
      </Box>
    </>
  );
}

export default ScholarshipApproverHistory;
