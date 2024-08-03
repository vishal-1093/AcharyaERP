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

function ScholarshipApproverIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

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
      headerName: "Requested Grant",
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
      field: "pre_approval_byName",
      headerName: "Pre Approved Grant",
      flex: 1,
      hideable: false,
      renderCell: (params) => params.row.requested_scholarship,
    },
    {
      field: "pre_approval_date",
      headerName: "Pre Approved By",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.pre_approval_byName}
              </Typography>
              <Typography variant="body2">
                {moment(params.row.pre_approval_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.pre_approval_byName}</span>
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
      headerName: "Attachment",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDownload(params.row.scholarship_attachment_path)}
          sx={{ padding: 0 }}
        >
          <Visibility sx={{ color: "auzColor.main" }} />
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
              `/ScholarshipApproverForm/${params.row.student_id}/${params.row.scholarship_id}`
            )
          }
          sx={{ padding: 0 }}
        >
          <AddBoxIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Approve Grant" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/getIsVerifiedDataForIndex?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (obj) => {
    await axios
      .get(`/api/ScholarshipAttachmentFileviews?fileName=${obj}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default ScholarshipApproverIndex;
