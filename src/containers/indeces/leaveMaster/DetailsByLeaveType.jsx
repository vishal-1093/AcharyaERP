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
import { useParams } from "react-router-dom";

//const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;

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

  const columns = [
    { field: "leave_type", headerName: "Leave Category", flex: 1 },
    {
      field: "no_of_days_applied",
      headerName: "Days Applied",
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
        params.row.leave_comments?.length > 20 ? (
          <HtmlTooltip title={params.row.leave_comments}>
            <span>{params.row.leave_comments.substr(0, 15) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.leave_comments
        ),
    },
    {
      field: "leave_app1_status",
      headerName: "Leave Approver",
      flex: 1,
      renderCell: (params) =>
        params.row.approver_1_name ? (
          <HtmlTooltip
            title={
              <Box>
                <Typography
                  variant="body2"
                  sx={{ textTransform: "capitalize" }}
                >
                  <b>Approved By</b> : &nbsp;{params.row.approver_1_name}
                </Typography>
                <Typography variant="body2">
                  <b>Approved Date</b> : &nbsp;
                  {moment(
                    new Date(params?.row?.leave_approved_date?.substr(0, 10))
                  ).format("DD-MM-YYYY")}
                </Typography>
                {/* <Typography variant="body2">
                  <b>Remarks</b> : &nbsp;
                  {params.row.reporting_approver_comment}
                </Typography> */}
              </Box>
            }
          >
            <span style={{ textTransform: "capitalize" }}>
              {params.row.approver_1_name?.toLowerCase()}
            </span>
          </HtmlTooltip>
        ) : (
          <Box sx={{ textAlign: "center", textTransform: "capitalize" }}>
            {params.row.approver_1_name?.toLowerCase()}
          </Box>
        ),
    },

    {
      field: "leave_apply_attachment_path",
      headerName: "Attachment",
      flex: 1,
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
    // {
    //   field: "cancel",
    //   type: "actions",
    //   headerName: "Cancel",
    //   width: 150,
    //   renderCell: (params) => (
    //     params.row?.approved_status == 2 || params.row?.approved_status == 3 ? (
    //       <Typography variant="subtitle2"  color="primary" sx={{ paddingLeft: 0, cursor:"pointer", textAlign:"center" }}

    //       >
    //         {""}
    //       </Typography>
    //     ) : (
    //       <IconButton
    //       onClick={()=> openCancelModal(params.row)}
    //       >
    //         < CancelIcon sx={{ color: "red" }}/>
    //       </IconButton>
    //     )
    //   ),
    // },
  ];

  const openCancelModal = async (data) => {
    setrowData(data);
    setCancelModalOpen(true);
  };

  useEffect(() => {
    setCrumbs([{ name: "Leave Details" }]);
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
        setPaginationData((prev) => ({
          ...prev,
          rows: res.data.data,
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
