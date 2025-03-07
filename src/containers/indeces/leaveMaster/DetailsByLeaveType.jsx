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
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import CancelIcon from "@mui/icons-material/Cancel";
import { useLocation, useParams } from "react-router-dom";

//const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const initialValues = {
  cancelComment: "",
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
    background: "#81d4fa !important",
  },
  approved: {
    background: "#a5d6a7 !important",
  },
  cancelled: {
    background: "#ef9a9a !important",
  },
}));

function DeatilsByLeaveType() {
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
  const [loading, setLoading] = useState(false);
  const setCrumbs = useBreadcrumbs();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [rowData, setrowData] = useState();
  const classes = useStyle();
  const { userId, leaveId } = useParams();

  const location = useLocation();

  const { year, profileStatus } = location?.state;

  const columns = [
    {
      field: "leave_type_short",
      headerName: "Leave Type",
      flex: 1,
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
    },
    {
      field: "compoff_worked_date",
      headerName: "Comp Off Date",
      flex: 1,
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
      valueFormatter: (value) =>
        value ? moment(value).format("DD-MM-YYYY") : "",
    },
    {
      field: "leave_comments",
      headerName: "Reason",
      flex: 1,
    },
    {
      field: "leave_app1_status",
      headerName: "App - 1",
      flex: 1,
      valueFormatter: (value) =>
        value === true ? "Approved" : "Pending",
      renderCell: (params) =>
        params.row.leave_app1_status === true ? (
          <HtmlTooltip
            title={
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Approved By : </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {params.row.approver_1_name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Approved Date :</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {params.row.leave_approved_date
                      ? moment(params.row.leave_approved_date).format(
                          "DD-MM-YYYY LT"
                        )
                      : ""}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Remarks : </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {params.row.reporting_approver_comment}
                  </Typography>
                </Box>
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
      valueFormatter: (value) =>
        value ? moment(value).format("DD-MM-YYYY") : "",
    },
    {
      field: "reporting_approver_comment",
      headerName: "App-1 Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "leave_app2_status",
      headerName: "App - 2",
      flex: 1,
      valueFormatter: (value) =>
        value === true ? "Approved" : "Pending",
      renderCell: (params) =>
        params.row.leave_app2_status === true ? (
          <HtmlTooltip
            title={
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Approved By : </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {params.row.approver_2_name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Approved Date :</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {params.row.leave_approved_date
                      ? moment(params.row.leave_approved2_date).format(
                          "DD-MM-YYYY LT"
                        )
                      : ""}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Remarks : </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {params.row.reporting_approver1_comment}
                  </Typography>
                </Box>
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
      valueFormatter: (value) =>
        value ? moment(value).format("DD-MM-YYYY") : "",
    },
    {
      field: "reporting_approver1_comment",
      headerName: "App-2 Remarks",
      flex: 1,
      hide: true,
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
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Cancelled By : </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {params.row.cancelled_username}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Cancelled Date :</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {params.row.cancel_date
                      ? moment(params.row.cancel_date).format("DD-MM-YYYY LT")
                      : ""}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Remarks : </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {params.row.cancel_comments}
                  </Typography>
                </Box>
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
            <VisibilityIcon color="primary" />
          </IconButton>
        ) : (
          ""
        ),
    },
  ];

  const openCancelModal = async (data) => {
    setrowData(data);
    setCancelModalOpen(true);
  };

  useEffect(() => {
    if (profileStatus)
      setCrumbs([{ name: "Leave Details", link: profileStatus }]);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setPaginationData((prev) => ({
      ...prev,
      loading: true,
    }));

    const searchString = filterString !== "" ? "&keyword=" + filterString : "";

    await axios(
      `/api/getLeaveKettyDetailsByUserIdAndLeaveId/${userId}/${leaveId}`
    )
      .then((res) => {
        const filterByYear = res.data.data.filter((obj) =>
          obj.to_date.includes(year)
        );

        setPaginationData((prev) => ({
          ...prev,
          rows: filterByYear,
          loading: false,
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
      value.items?.length > 0
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

      <Box>
        {/* <Stack
        direction="row"
        spacing={1}
        justifyContent={{ md: "right" }}
        sx={{ marginRight: 2, marginBottom: 2 }}
        alignItems="center"
      >
        <Avatar
          variant="square"
          sx={{ width: 24, height: 24, bgcolor: "#81d4fa" }}
        >
          <Typography variant="subtitle2"></Typography>
        </Avatar>
        <Typography variant="body2" color="textSecondary">
          Pending
        </Typography>
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
      </Stack> */}
        <GridIndex
          rows={paginationData.rows}
          columns={columns}
          loading={paginationData.loading}
          //getRowClassName={getRowClassName}
        />
      </Box>
    </>
  );
}

export default DeatilsByLeaveType;

//Leaves/ Attendance
//Appropved By and appproved date
