import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const initialValues = { approverComments: "" };

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    // border: "1px solid rgba(224, 224, 224, 1)",
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

function LeaveApprovedHistoryIndex() {
  const [values, setValues] = useState(initialValues);
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 50,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");
  const [empId, setEmpId] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const classes = useStyle();

  const columns = [
    {
      field: "leave_type_short",
      headerName: "Leave Type",
      flex: 1,
    },
    {
      field: "employee_name",
      headerName: "Employee",
      flex: 1,
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 1,
    },
    {
      field: "no_of_days_applied",
      headerName: "Days Applied",
      flex: 1,
    },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
    },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
    },
    {
      field: "to_date",
      headerName: "To Date",
      flex: 1,
    },
    {
      field: "leave_comments",
      headerName: "Reason",
      flex: 1,
      renderCell: (params) =>
        params.row.leave_comments.length > 25 ? (
          <HtmlTooltip title={params.row.leave_comments}>
            <span>{params.row.leave_comments.substr(0, 20) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.leave_comments
        ),
    },
    {
      field: "leave_apply_attachment_path",
      headerName: "Attachment",
      flex: 1,
      align: "center",
      renderCell: (params) =>
        params.row.leave_apply_attachment_path ? (
          <IconButton
            onClick={() =>
              handleAttachment(params.row.leave_apply_attachment_path)
            }
            sx={{ padding: 0 }}
          >
            <VisibilityIcon sx={{ color: "auzColor.main" }} />
          </IconButton>
        ) : (
          ""
        ),
    },
    {
      field: "created_username",
      headerName: "Applied By",
      flex: 1,
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
      field: "leave_app1_status",
      headerName: "Leave App - 1",
      flex: 1,
      align: "center",
      renderCell: (params) =>
        params.row.leave_app1_status === true ? (
          <HtmlTooltip
            title={
              <Box>
                <Typography variant="body2">
                  <b>Approved By</b> : &nbsp;{params.row.approver_1_name}
                </Typography>
                <Typography variant="body2">
                  <b>Approved Date</b> : &nbsp;
                  {moment(
                    new Date(params?.row?.leave_approved_date?.substr(0, 10))
                  ).format("DD-MM-YYYY")}
                </Typography>
                <Typography variant="body2">
                  <b>Remarks</b> : &nbsp;
                  {params.row.reporting_approver_comment}
                </Typography>
              </Box>
            }
          >
            <span>{params.row.approver_1_name}</span>
          </HtmlTooltip>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <p>{params.row.approver_1_name}</p>
          </Box>
        ),
    },
    {
      field: "leave_app2_status",
      headerName: "Leave App - 2",
      flex: 1,
      align: "center",
      renderCell: (params) =>
        params.row.leave_app2_status === true ? (
          <HtmlTooltip
            title={
              <Box>
                <Typography variant="body2">
                  <b>Approved By</b> : &nbsp; {params.row.approver_2_name}
                </Typography>
                <Typography variant="body2">
                  <b>Approvd Date</b> : &nbsp;
                  {moment(
                    new Date(params?.row?.leave_approved2_date?.substr(0, 10))
                  ).format("DD-MM-YYYY")}
                </Typography>
                <Typography variant="body2">
                  <b>Remarks</b> : &nbsp;
                  {params.row.reporting_approver1_comment}
                </Typography>
              </Box>
            }
          >
            <span>{params.row.approver_2_name}</span>
          </HtmlTooltip>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <p>{params.row.approver_2_name}</p>
          </Box>
        ),
    },
    {
      field: "approved_status",
      headerName: "Leave Status",
      flex: 1,
      renderCell: (params) =>
        Number(params.row.approved_status) === 2 ? (
          "Approved"
        ) : Number(params.row.approved_status) === 3 ? (
          <HtmlTooltip
            title={
              <Box>
                <Typography variant="body2">
                  <b>Cancelled By</b> : &nbsp;{params.row.cancelled_username}
                </Typography>
                <Typography variant="body2">
                  <b>Cancelled Date</b> : &nbsp;
                  {moment(
                    new Date(params?.row?.cancel_date?.substr(0, 10))
                  ).format("DD-MM-YYYY")}
                </Typography>
                <Typography variant="body2">
                  <b>Remarks</b> : &nbsp; {params.row.cancel_comments}
                </Typography>
              </Box>
            }
          >
            <span>Cancelled</span>
          </HtmlTooltip>
        ) : (
          ""
        ),
    },
  ];

  useEffect(() => {
    setCrumbs([{ name: "Leave Approved History" }]);
    getEmpId();
  }, []);

  useEffect(() => {
    getData();
  }, [paginationData.page, paginationData.pageSize, filterString, empId]);

  const getEmpId = async () => {
    if (userId)
      await axios
        .get(`/api/employee/getEmployeeDataByUserID/${userId}`)
        .then((res) => {
          setEmpId(res.data.data.emp_id);
        })
        .catch((err) => console.error(err));
  };

  const getData = async () => {
    if (empId !== null) {
      setPaginationData((prev) => ({
        ...prev,
        loading: true,
      }));

      const searchString =
        filterString !== "" ? "&keyword=" + filterString : "";

      await axios(
        `/api/getAllApprovedOrCancelledLeaves?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date&approver_id=${empId}${searchString}`
      )
        .then((res) => {
          setPaginationData((prev) => ({
            ...prev,
            rows: res.data.data.Paginated_data.content,
            total: res.data.data.Paginated_data.totalElements,
            loading: false,
          }));
        })
        .catch((err) => console.error(err));
    }
  };

  const handleOnPageChange = (newPage) => {
    setPaginationData((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPaginationData((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
  };

  const handleOnFilterChange = (value) => {
    setFilterString(
      value.items.length > 0
        ? value.items[0].value === undefined
          ? ""
          : value.items[0].value
        : value.quickFilterValues.join(" ")
    );
  };

  const getRowClassName = (params) => {
    if (Number(params.row.approved_status) === 1) {
      return classes.applied;
    } else if (Number(params.row.approved_status) === 2) {
      return classes.approved;
    } else if (Number(params.row.approved_status) === 3) {
      return classes.cancelled;
    }
  };

  const handleAttachment = async (path) => {
    await axios
      .get(`/api/leaveApplyFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box>
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
          Cancelled
        </Typography>
      </Stack>

      <GridIndex
        rows={paginationData.rows}
        columns={columns}
        rowCount={paginationData.total}
        page={paginationData.page}
        pageSize={paginationData.pageSize}
        handleOnPageChange={handleOnPageChange}
        handleOnPageSizeChange={handleOnPageSizeChange}
        loading={paginationData.loading}
        handleOnFilterChange={handleOnFilterChange}
        getRowClassName={getRowClassName}
      />
    </Box>
  );
}

export default LeaveApprovedHistoryIndex;
