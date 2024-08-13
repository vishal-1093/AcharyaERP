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
import { convertToDMY } from "../../utils/DateTimeUtils";
import { useNavigate } from "react-router-dom";
import { Print } from "@mui/icons-material";
import { Visibility } from "@mui/icons-material";
import moment from "moment";
import { makeStyles } from "@mui/styles";

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
  applied: {
    background: "#81d4fa !important",
  },
  approved: {
    background: "#a5d6a7 !important",
  },
  cancelled: {
    background: "#ef9a9a !important",
  },
}));

function ScholarshipApproverHistory() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const classes = useStyle();

  const columns = [
    {
      field: "student_name",
      headerName: "Student Name",
      width: 200,
      hideable: false,
    },
    {
      field: "auid",
      headerName: "AUID",
      width: 120,
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
      field: "pre_approval_byName",
      headerName: "Pre Approved",
      flex: 1,
      renderCell: (params) => params.row.requested_scholarship,
    },
    {
      field: "pre_approval_date",
      headerName: "Pre Approved By",
      flex: 1,
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
          <Visibility sx={{ color: "auzColor.main" }} />
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
            onClick={() =>
              navigate(
                `/ScholarshipApplicationPrint/${params.row.student_id}/${params.row.scholarship_id}`
              )
            }
            sx={{ padding: 0 }}
          >
            <Print sx={{ color: "auzColor.main" }} />
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
          <></>
        ),
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Approve Grant" }, { name: "History" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/getIsApprovedDataForIndex?page=${0}&page_size=${10000}&sort=created_date`
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

  const getRowClassName = (params) => {
    if (params.row.is_approved === "yes") {
      return classes.approved;
    } else if (params.row.is_approved === "no") {
      return classes.cancelled;
    }
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <Stack
        direction="row"
        spacing={1}
        justifyContent={{ md: "right" }}
        sx={{ marginRight: 2, marginBottom: 2 }}
        alignItems="center"
      >
        <Avatar
          variant="square"
          sx={{ width: 24, height: 24, bgcolor: "#a5d6a7" }}
        >
          <Typography variant="subtitle2"></Typography>
        </Avatar>
        <Typography variant="body2" color="textSecondary">
          Approved
        </Typography>
        <Avatar
          variant="square"
          sx={{ width: 24, height: 24, bgcolor: "#ef9a9a" }}
        >
          <Typography variant="subtitle2"></Typography>
        </Avatar>
        <Typography variant="body2" color="textSecondary">
          Rejected
        </Typography>
      </Stack>

      <GridIndex
        rows={rows}
        columns={columns}
        getRowClassName={getRowClassName}
      />
    </Box>
  );
}

export default ScholarshipApproverHistory;
