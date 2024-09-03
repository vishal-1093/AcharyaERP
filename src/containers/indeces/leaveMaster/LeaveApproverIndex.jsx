import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import dayjs from "dayjs";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

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
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

function LeaveApproverIndex() {
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
  const [modalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [rowData, setRowData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    approverComments: [values.approverComments.length < 100],
  };

  const errorMessages = {
    approverComments: ["Maximum characters 100"],
  };

  const columns = [
    {
      field: "leave_type",
      headerName: "Leave Type",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {params.row.leave_type?.toLowerCase()}
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
            {params.row.leave_type?.toLowerCase()}
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
              {params.row.employee_name?.toLowerCase()}
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
            {params.row.employee_name?.toLowerCase()}
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
              {params.row.dept_name_short?.toLowerCase()}
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
            {params.row.dept_name_short?.toLowerCase()}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "no_of_days_applied",
      headerName: "Days Applied",
      flex: 1,
      hideable: false,
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
      hideable: false,
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
      field: "leave_comments",
      headerName: "Reason",
      flex: 1,
      hideable: false,
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
      field: "leave_app1_status",
      headerName: "App - 1",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <>
              <Typography variant="body2">
                {params.row.approver_1_name}
              </Typography>
            </>
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.row.leave_app1_status === true ? (
              <Box>
                <Typography variant="body2">
                  {params.row.approver_1_name}
                </Typography>
                <Typography variant="body2">
                  {moment(
                    new Date(params?.row?.leave_approved_date?.substr(0, 10))
                  ).format("DD-MM-YYYY")}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2">
                {params.row.approver_1_name}
              </Typography>
            )}
          </span>
        </HtmlTooltip>
      ),
    },
    {
      field: "leave_app2_status",
      headerName: "App - 2",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.approver_2_name}
              </Typography>
              {params.row.leave_approved2_date ? (
                <Typography variant="body2">
                  {moment(params.row.leave_approved2_date).format("DD-MM-YYYY")}
                </Typography>
              ) : (
                <></>
              )}
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
      ),
    },
    {
      field: "approved_status",
      headerName: "Approve",
      flex: 1,
      align: "center",
      renderCell: (params) => (
        <IconButton
          onClick={() => handleStatus(params.row)}
          sx={{ padding: 0 }}
        >
          <AddTaskIcon
            sx={{ color: "auzColor.main", fontSize: 22, textAlign: "center" }}
          />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    setCrumbs([{ name: "Approve Leave" }]);
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
        `/api/getAllLeaveApplyForApprovers?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date&approver_id=${empId}${searchString}`
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

  const handleStatus = (data) => {
    setRowData({
      leaveId: data.id,
      id: data.emp_id,
      name: data.employee_name + " - " + data.empcode,
      leaveType: data.type,
    });
    setModalWrapperOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApprove = async (status) => {
    setValues((prev) => ({
      ...prev,
      ["approverComments"]: "",
    }));

    const leaveApplyData = await axios
      .get(`/api/leaveApply/${rowData.leaveId}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const getLeaveApprovers = await axios
      .get(`/api/getLeaveApproversForEmployees/${rowData.id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const temp = { ...leaveApplyData };

    // approve
    if (
      getLeaveApprovers.leave_approver1.emp_id === empId &&
      status === "approve"
    ) {
      temp.leave_app1_status = 1;
      temp.reporting_approver_comment = values.approverComments;
      temp.leave_approved_date = convertUTCtoTimeZone(dayjs());
    }

    if (
      getLeaveApprovers.leave_approver2.emp_id === empId &&
      status === "approve"
    ) {
      temp.leave_app2_status = 1;
      temp.reporting_approver1_comment = values.approverComments;
      temp.leave_approved2_date = convertUTCtoTimeZone(dayjs());
      temp.approved_status = 2;
    }

    // cancel
    if (
      (getLeaveApprovers.leave_approver1.emp_id === empId ||
        getLeaveApprovers.leave_approver2.emp_id === empId) &&
      status === "cancel"
    ) {
      temp.cancel_by = userId;
      temp.cancel_comments = values.approverComments;
      temp.cancel_date = convertUTCtoTimeZone(dayjs());
      temp.approved_status = 3;
    }

    if (rowData.leaveType === "Leave") {
      let apiEndpoint = "";

      if (status === "approve") {
        apiEndpoint = `/api/emailToEmployeeForApprovalOfLeaveRequest/${rowData.leaveId}`;
      } else {
        apiEndpoint = `/api/emailToEmployeeForLeaveCancellation/${rowData.leaveId}`;
      }

      await axios
        .post(apiEndpoint)
        .then((emailRes) => {})
        .catch((emailErr) => console.error(emailErr));
    }

    await axios
      .put(`/api/leaveApply/${rowData.leaveId}`, temp)
      .then((res) => {
        setAlertMessage({
          severity: status === "approve" ? "success" : "error",
          message:
            status === "approve"
              ? "Leave request approved successfully !!"
              : "Leave request cancelled successfully !!",
        });
        setAlertOpen(true);
        getData();
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.data ? err.data.message : "Error Occured",
        });
        setAlertOpen(true);
      });

    setModalWrapperOpen(false);
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
      <ModalWrapper
        open={modalWrapperOpen}
        setOpen={setModalWrapperOpen}
        maxWidth={600}
        title={rowData?.name}
      >
        <Box mt={2} p={1}>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={2}
            justifyContent="flex-end"
            columnGap={3}
          >
            <Grid item xs={12}>
              <CustomTextField
                name="approverComments"
                label="Comments"
                value={values.approverComments}
                handleChange={handleChange}
                checks={checks.approverComments}
                errors={errorMessages.approverComments}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprove("approve")}
                disabled={checks.approverComments.includes(false) === true}
              >
                Approve
              </Button>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleApprove("cancel")}
                disabled={checks.approverComments.includes(false) === true}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <Grid container>
        <Grid item xs={12} align="right" mb={2}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/LeaveHistory")}
          >
            History
          </Button>
        </Grid>
      </Grid>

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
      />
    </Box>
  );
}

export default LeaveApproverIndex;
