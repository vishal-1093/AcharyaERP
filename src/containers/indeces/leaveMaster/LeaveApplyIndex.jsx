import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import CustomSelect from "../../../components/Inputs/CustomSelect";

const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;

const initialValues = {
  cancelComment: "",
  year: "",
};

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
    background: "#b3e5fc !important",
  },
  approved: {
    background: "#c8e6c9 !important",
  },
  cancelled: {
    background: "#ffcdd2 !important",
  },
}));

function LeaveApplyIndex() {
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
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rowData, setrowData] = useState();
  const [loading, setLoading] = useState(false);
  const [yearOptions, setYearOptions] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const classes = useStyle();

  const columns = [
    {
      field: "leave_type_short",
      headerName: "Leave Type",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {params.row.leave_type.toLowerCase()}
            </Typography>
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
            }}
          >
            {params.row.leave_type.toLowerCase()}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "employee_name",
      headerName: "Staff",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {params.row.employee_name.toLowerCase()}
            </Typography>
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
            }}
          >
            {params.row.employee_name.toLowerCase()}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "empcode",
      headerName: "Staff Code",
      flex: 1,
      hideable: false,
    },
    {
      field: "dept_name_short",
      headerName: "Staff Of",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {params.row.dept_name_short.toLowerCase()}
            </Typography>
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
            }}
          >
            {params.row.dept_name_short.toLowerCase()}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "no_of_days_applied",
      headerName: "Days Applied",
      flex: 1,
    },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.from_date}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.from_date}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "to_date",
      headerName: "To Date",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.to_date}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.to_date}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "created_username",
      headerName: "Applied By",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2">
              {params.row.created_username}
            </Typography>
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.created_username}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "created_date",
      headerName: "Applied Date",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? moment(params.value).format("DD-MM-YYYY") : "",
      renderCell: (params) => (
        <HtmlTooltip
          title={moment(params.row.created_date).format("DD-MM-YYYY")}
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {moment(params.row.created_date).format("DD-MM-YYYY")}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "leave_comments",
      headerName: "Reason",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.leave_comments}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.leave_comments}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "leave_app1_status",
      headerName: "App - 1",
      flex: 1,
      align: "center",
      valueFormatter: (params) =>
        params.value === true ? "Approved" : "Pending",
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
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {params.row.approver_1_name}
            </span>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.approver_1_name}>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {params.row.approver_1_name}
            </span>
          </HtmlTooltip>
        ),
    },
    {
      field: "leave_approved_date",
      headerName: "App-1 Date",
      flex: 1,
      hide: true,
      valueFormatter: (params) =>
        params.value ? moment(params.value).format("DD-MM-YYYY") : "",
      renderCell: (params) => (
        <HtmlTooltip
          title={
            params.row.leave_approved_date
              ? moment(params.row.leave_approved_date).format("DD-MM-YYYY")
              : ""
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.leave_approved_date
              ? moment(params.row.leave_approved_date).format("DD-MM-YYYY")
              : ""}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "reporting_approver_comment",
      headerName: "App-1 Remarks",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.reporting_approver_comment}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.reporting_approver_comment}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "leave_app2_status",
      headerName: "App - 2",
      flex: 1,
      align: "center",
      valueFormatter: (params) =>
        params.value === true ? "Approved" : "Pending",
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
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {params.row.approver_2_name}
            </span>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.approver_2_name}>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {params.row.approver_2_name}
            </span>
          </HtmlTooltip>
        ),
    },
    {
      field: "leave_approved2_date",
      headerName: "App-2 Date",
      flex: 1,
      hide: true,
      valueFormatter: (params) =>
        params.value ? moment(params.value).format("DD-MM-YYYY") : "",
      renderCell: (params) => (
        <HtmlTooltip
          title={
            params.row.leave_approved2_date
              ? moment(params.row.leave_approved2_date).format("DD-MM-YYYY")
              : ""
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.leave_approved2_date
              ? moment(params.row.leave_approved2_date).format("DD-MM-YYYY")
              : ""}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "reporting_approver1_comment",
      headerName: "App-2 Remarks",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.reporting_approver1_comment}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.reporting_approver1_comment}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "approved_status",
      headerName: "Leave Status",
      flex: 1,
      renderCell: (params) =>
        Number(params.row.approved_status) === 1 ? (
          <HtmlTooltip title="Pending">
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Pending
            </span>
          </HtmlTooltip>
        ) : Number(params.row.approved_status) === 2 ? (
          <HtmlTooltip title="Approved">
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Approved
            </span>
          </HtmlTooltip>
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
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Cancelled
            </span>
          </HtmlTooltip>
        ) : (
          ""
        ),
    },
    {
      field: "cancelled_username",
      headerName: "Cancelled By",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2">
              {params.row.cancelled_username}
            </Typography>
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.cancelled_username}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "cancel_date",
      headerName: "Cancelled Date",
      flex: 1,
      hide: true,
      valueFormatter: (params) =>
        params.value ? moment(params.value).format("DD-MM-YYYY") : "",
      renderCell: (params) => (
        <HtmlTooltip
          title={
            params.row.cancel_date
              ? moment(params.row.leave_approved_date).format("DD-MM-YYYY")
              : ""
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.cancel_date
              ? moment(params.row.cancel_date).format("DD-MM-YYYY")
              : ""}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "cancel_comments",
      headerName: "Cancel Remarks",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.cancel_comments}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.cancel_comments}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "cancel",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) =>
        params.row.approved_status === 1 ? (
          <IconButton
            onClick={() => openCancelModal(params.row)}
            sx={{ padding: 0 }}
          >
            <CancelIcon sx={{ color: "red" }} />
          </IconButton>
        ) : (
          <></>
        ),
    },
    {
      field: "leave_apply_attachment_path",
      headerName: "Attachment",
      flex: 1,
      hide: true,
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
  ];

  useEffect(() => {
    setCrumbs([{ name: "Leave History" }]);
    getEmpId();
    getYearOptions();
  }, []);

  useEffect(() => {
    getData();
  }, [
    paginationData.page,
    paginationData.pageSize,
    filterString,
    empId,
    values.year,
  ]);

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
        `/api/getAllLeaveApplyForEndUser?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date&emp_id=${empId}&year=${values.year}${searchString}`
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

  const getYearOptions = async () => {
    await axios
      .get("/api/getDistinctYear")
      .then((res) => {
        const yearData = [];
        res.data.data.forEach((obj) => {
          yearData.push({ value: obj, label: obj });
        });
        setYearOptions(yearData);
        setValues((prev) => ({
          ...prev,
          ["year"]: Math.max(...res.data.data),
        }));
      })
      .catch((err) => console.error(err));
  };

  const openCancelModal = async (data) => {
    setrowData(data);
    setCancelModalOpen(true);
  };

  const handleCancel = async (e) => {
    if (!values.cancelComment) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.cancelBy = userId;
      temp.leaveApplyId = rowData?.id;
      temp.cancelComment = values.cancelComment;

      await axios
        .post(`/api/cancelLeavesOfEmployee`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Leave Cancelled Successfully",
            });
            getData();
            setCancelModalOpen(false);
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const cancelData = () => {
    return (
      <>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={3}
          justifyContent="center"
          alignItems="center"
          padding={1}
        >
          <Grid item xs={12} md={12} mb={2}>
            <CustomTextField
              multiline
              rows={2}
              label="Cancel Remarks"
              value={values?.cancelComment}
              name="cancelComment"
              handleChange={handleChange}
              // inputProps={{
              //   maxLength: 300,
              // }}
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              disableElevation
              sx={{
                // position: "absolute",

                borderRadius: 2,
                margin: "auto", // Center vertically
              }}
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Submit</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
    <>
      <ModalWrapper
        maxWidth={400}
        title="Leave Cancel"
        open={cancelModalOpen}
        setOpen={setCancelModalOpen}
      >
        {cancelData()}
      </ModalWrapper>

      <Box mt={4}>
        <Grid container>
          <Grid item xs={12} md={6} align="left">
            <Stack
              direction="row"
              spacing={1}
              sx={{ marginRight: 2, marginBottom: 2 }}
              alignItems="center"
            >
              <Avatar
                variant="square"
                sx={{ width: 24, height: 24, bgcolor: "#b3e5fc" }}
              >
                <Typography variant="subtitle2"></Typography>
              </Avatar>
              <Typography variant="body2" color="textSecondary">
                Pending
              </Typography>
              <Avatar
                variant="square"
                sx={{ width: 24, height: 24, bgcolor: "#c8e6c9" }}
              >
                <Typography variant="subtitle2"></Typography>
              </Avatar>
              <Typography variant="body2" color="textSecondary">
                Approved
              </Typography>
              <Avatar
                variant="square"
                sx={{ width: 24, height: 24, bgcolor: "#ffcdd2" }}
              >
                <Typography variant="subtitle2"></Typography>
              </Avatar>
              <Typography variant="body2" color="textSecondary">
                Cancelled
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} align="right">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/LeaveApplyForm")}
              sx={{ borderRadius: 2 }}
            >
              Apply
            </Button>
          </Grid>

          <Grid item xs={12} md={2} mt={2}>
            <CustomSelect
              name="year"
              label="Year"
              value={values.year}
              items={yearOptions}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} mt={2}>
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
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default LeaveApplyIndex;
