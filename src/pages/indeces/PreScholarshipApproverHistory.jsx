import { useState, useEffect } from "react";
import axios from "../../services/Api";
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
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import moment from "moment";
import { Visibility } from "@mui/icons-material";
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

function PreScholarshipApproverHistory() {
  const [rows, setRows] = useState([]);

  const setCrumbs = useBreadcrumbs();

  const classes = useStyle();

  const columns = [
    {
      field: "id",
      headerName: "Candidate Id",
      flex: 1,
      hide: true,
    },
    {
      field: "application_no_npf",
      headerName: "Application No",
      flex: 1,
      hideable: false,
    },
    {
      field: "candidate_name",
      headerName: "Applicant Name",
      width: 300,
      hideable: false,
    },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      hideable: false,
    },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
      hideable: false,
    },
    {
      field: "created_username",
      headerName: "Counselor Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "requested_scholarship",
      headerName: "Request Grant",
      flex: 1,
      hideable: false,
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
      field: "pre_approver_remarks",
      headerName: "Remarks",
      flex: 1,
      renderCell: (params) =>
        params?.row?.pre_approver_remarks?.length > 15 ? (
          <HtmlTooltip title={params.row.pre_approver_remarks}>
            <span>
              {params.row.pre_approver_remarks.substr(0, 10) + " ...."}
            </span>
          </HtmlTooltip>
        ) : (
          params.row.pre_approver_remarks
        ),
    },
    {
      field: "pre_approval_status",
      headerName: "Approved By",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.preApproverByName}
              </Typography>
              <Typography variant="body2">
                {moment(params.row.pre_approval_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.preApproverByName}</span>
        </HtmlTooltip>
      ),
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Approve Pre Grant" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/fetchAllFilteredCandidateWalkinDetailsOnPreApprovalStatus?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
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
    if (params.row.pre_approval_status === true) {
      return classes.approved;
    } else if (params.row.pre_approval_status === false) {
      return classes.cancelled;
    }
  };

  return (
    <>
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
    </>
  );
}

export default PreScholarshipApproverHistory;
