import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CheckLeaveLockDate } from "../../../utils/CheckLeaveLockDate";

const ApproveLeave = lazy(() =>
  import("../../../pages/forms/leaveMaster/ApproveLeave")
);

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

  const columns = [
    {
      field: "leave_type",
      headerName: "Leave Type",
      flex: 1,
      hideable: false,
    },
    {
      field: "employee_name",
      headerName: "Employee Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 1,
      hideable: false,
    },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
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
    },
    {
      field: "to_date",
      headerName: "To Date",
      flex: 1,
      hideable: false,
    },
    {
      field: "leave_comments",
      headerName: "Reason",
      flex: 1,
      hideable: false,
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
    },
    {
      field: "created_date",
      headerName: "Applied Date",
      flex: 1,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY"),
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
          <AddTaskIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    setCrumbs([
      { name: "Approve Leave" },
      { name: "History", link: "/leavehistory" },
    ]);
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

  const handleStatus = async (data) => {
    const date = data.from_date?.split("-").reverse().join("-");
    const checkDate = await CheckLeaveLockDate(date);
    if (checkDate) {
      setAlertMessage({
        severity: "error",
        message:
          "You are unable to cancel the  leave as the leave lock date has passed !!",
      });
      setAlertOpen(true);
      return;
    }
    setRowData({
      leaveId: data.id,
      id: data.emp_id,
      name: data.employee_name + " - " + data.empcode,
      leaveType: data.type,
    });
    setModalWrapperOpen(true);
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
        <ApproveLeave
          empId={empId}
          userId={userId}
          rowData={rowData}
          setModalWrapperOpen={setModalWrapperOpen}
          getData={getData}
        />
      </ModalWrapper>

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
