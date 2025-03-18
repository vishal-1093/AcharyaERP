import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Card,
  CardContent,
  CardHeader,
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
import useAlert from "../../../hooks/useAlert";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import { CheckLeaveLockDate } from "../../../utils/CheckLeaveLockDate";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CancelLeave = lazy(() =>
  import("../../../pages/forms/leaveMaster/CancelLeave")
);

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const initialValues = {
  cancelComment: "",
  year: "",
  fileName: "",
  fileName1: "",
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
  const [yearOptions, setYearOptions] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const classes = useStyle();

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
    setrowData(data);
    setCancelModalOpen(true);
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
    if (Number(params.row.approved_status) === 2) {
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

  const handleAttachment2 = async (path) => {
    await axios
      .get(`/api/leaveApplyFileviews2?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const dataArray = new FormData();
      dataArray.append("file", values.fileName);
      dataArray.append("leave_apply_id", rowData.row.id);
      const response = await axios.post(
        "/api/leaveApplyUploadFile2",
        dataArray
      );

      if (response.status === 200 || response.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Uploaded Successfully",
        });
        setAlertOpen(true);
        setUploadOpen(false);
        setValues((prev) => ({ ...prev, ["fileName"]: "" }));
        setLoading(false);
        getData();
      }
    } catch (err) {
      setLoading(false);
      setAlertMessage({ severity: "Error", message: "Error Occured" });
    }
  };

  const handleUploadFileOne = async () => {
    try {
      setLoading(true);
      const dataArray = new FormData();
      dataArray.append("file", values.fileName1);
      dataArray.append("leave_apply_id", rowData.row.id);
      const response = await axios.post("/api/leaveApplyUploadFile", dataArray);

      if (response.status === 200 || response.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Uploaded Successfully",
        });
        setAlertOpen(true);
        setUploadOpen(false);
        setValues((prev) => ({ ...prev, ["fileName"]: "" }));
        setLoading(false);
        getData();
      }
    } catch (err) {
      setLoading(false);
      setAlertMessage({ severity: "Error", message: "Error Occured" });
    }
  };

  const handleOpenUpload = (params) => {
    setUploadOpen(true);
    setrowData(params);
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const CustomCardHeader = ({ title }) => (
    <CardHeader
      title={title}
      titleTypographyProps={{ variant: "subtitle2" }}
      sx={{
        backgroundColor: "tableBg.main",
        color: "tableBg.text",
        padding: 1,
      }}
    />
  );

  const StatusItem = ({ bgColor, text }) => (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Avatar variant="square" sx={{ width: 24, height: 24, bgcolor: bgColor }}>
        <Typography />
      </Avatar>
      <Typography variant="subtitle2" color="textSecondary">
        {text}
      </Typography>
    </Stack>
  );

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
      hide: true,
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
      field: "cancelled_username",
      headerName: "Cancelled By",
      flex: 1,
      hide: true,
    },
    {
      field: "cancel_date",
      headerName: "Cancelled Date",
      flex: 1,
      hide: true,
      valueFormatter: (value) =>
        value ? moment(value).format("DD-MM-YYYY") : "",
    },
    {
      field: "cancel_comments",
      headerName: "Cancel Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "cancel",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) =>
        params.row.approved_status === 1 || params.row.approved_status === 2 ? (
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
            <VisibilityIcon color="primary" />
          </IconButton>
        ) : (
          ""
        ),
    },
    {
      field: "attach",
      headerName: "Attachment",
      flex: 1,
      renderCell: (params) =>
        Number(params.row.approved_status) !== 3 &&
        params.row.leave_type_attachment_required ? (
          <IconButton
            onClick={() => handleOpenUpload(params)}
            sx={{ padding: 0 }}
          >
            <CloudUploadIcon fontSize="small" color="primary" />
          </IconButton>
        ) : (
          ""
        ),
    },
  ];

  return (
    <>
      <ModalWrapper
        open={cancelModalOpen}
        setOpen={setCancelModalOpen}
        maxWidth={700}
        title={`${rowData?.employee_name} - ${rowData?.empcode}`}
      >
        <CancelLeave
          userId={userId}
          rowData={rowData}
          setCancelModalOpen={setCancelModalOpen}
          getData={getData}
        />
      </ModalWrapper>

      <ModalWrapper maxWidth={500} open={uploadOpen} setOpen={setUploadOpen}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
        >
          {(rowData?.row?.leave_apply_attachment_path === null ||
            rowData?.row?.leave_apply_attachment_path2 === null) && (
            <Grid item xs={12} align="center">
              <Typography variant="button" color="error">
                Maximum two files can be uploaded !!
              </Typography>
            </Grid>
          )}

          {rowData?.row?.leave_apply_attachment_path === null && (
            <>
              <Grid item xs={12} align="center">
                <CustomFileInput
                  name="fileName1"
                  label="FILE-1"
                  file={values.fileName1}
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                />
              </Grid>
              <Grid item xs={12} onClick={handleUploadFileOne} align="center">
                <Button
                  disabled={loading}
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    "Upload"
                  )}
                </Button>
              </Grid>
            </>
          )}

          {rowData?.row?.leave_apply_attachment_path &&
            rowData?.row?.leave_apply_attachment_path2 === null && (
              <>
                <Grid item xs={12} align="center">
                  <CustomFileInput
                    name="fileName"
                    label="FILE-2"
                    file={values.fileName}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                  />
                </Grid>
                <Grid item xs={12} onClick={handleUpload} align="center">
                  <Button
                    disabled={loading}
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </Grid>
              </>
            )}

          <Grid item xs={12}>
            <Card>
              <CustomCardHeader title="Uploaded Documents" />
              <CardContent>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    justifyItems: "start",
                  }}
                >
                  {rowData?.row?.leave_apply_attachment_path && (
                    <>
                      <IconButton
                        onClick={() =>
                          handleAttachment(
                            rowData?.row?.leave_apply_attachment_path
                          )
                        }
                      >
                        <VisibilityIcon color="primary" />
                        <Typography variant="subtitle2" sx={{ marginLeft: 1 }}>
                          FILE-1
                        </Typography>
                      </IconButton>
                    </>
                  )}
                  {rowData?.row?.leave_apply_attachment_path2 && (
                    <>
                      <IconButton
                        onClick={() =>
                          handleAttachment2(
                            rowData?.row?.leave_apply_attachment_path2
                          )
                        }
                      >
                        <VisibilityIcon color="primary" />
                        <Typography variant="subtitle2" sx={{ marginLeft: 1 }}>
                          FILE-2
                        </Typography>
                      </IconButton>
                    </>
                  )}

                  {!rowData?.row?.leave_apply_attachment_path &&
                    !rowData?.row?.leave_apply_attachment_path2 && (
                      <>
                        <Typography variant="subtitle2">
                          No Documents Uploaded !!
                        </Typography>
                      </>
                    )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 3 }}>
        <Button
          onClick={() => navigate("/LeaveApplyForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Apply
        </Button>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            position: "absolute",
            right: 120,
            top: -50,
            borderRadius: 2,
          }}
        >
          <StatusItem bgColor="#c8e6c9" text="Approved" />
          <StatusItem bgColor="#ffcdd2" text="Cancelled" />
        </Box>

        <Box
          sx={{
            position: "absolute",
            right: 320,
            top: -50,
            borderRadius: 2,
          }}
        >
          <CustomSelect
            name="year"
            value={values.year}
            items={yearOptions}
            handleChange={handleChange}
          />
        </Box>

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
    </>
  );
}

export default LeaveApplyIndex;
