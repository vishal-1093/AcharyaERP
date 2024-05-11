import { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import { convertDateFormat } from "../../../../utils/Utils";
import CancelIcon from "@mui/icons-material/Cancel";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import axios from "../../../../services/Api";
import useAlert from "../../../../hooks/useAlert";
const GridIndex = lazy(() => import("../../../../components/GridIndex"));
const ModalWrapper = lazy(() => import("../../../../components/ModalWrapper"));
const CustomTextField = lazy(() =>
  import("../../../../components/Inputs/CustomTextField")
);
const CustomRadioButtons = lazy(() =>
  import("../../../../components/Inputs/CustomRadioButtons")
);

const initialValues = {
  endUser_feedback_remarks: "",
  receive_status: "",
};

function RefreshmentRequestIndex() {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [mealData, setMealData] = useState();
  const [refreshmentData, setRefreshmentData] = useState(null);
  const [alert, setAlert] = useState("");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Refreshment Request Index" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllMealRefreshmentRequestDetails?page=${0}&page_size=${10000}&sort=created_date&user_id=${userID}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const getRefreshRequestData = async (id) => {
    await axios
      .get(`/api/MealRefreshmentRequest/${id}`)
      .then((res) => {
        setValues({
          time: res.data.data.time,
          count: res.data.data.count,
          active: true,
          date: res.data.data.date,
          remarks: res.data.data.remarks,
          meal_id: res.data.data.meal_id,
        });
        setRefreshmentData(res.data.data);
        setCrumbs([
          {
            name: "Refreshment Request Index",
            link: "/CateringMaster/RefreshmentRequestIndex",
          },
          { name: "Refreshment Request" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const openDataModal = async (data) => {
    setMealData(data);
    setIsModalOpen(true);
  };

  const openCancelModal = async (data) => {
    await getRefreshRequestData(data?.id);

    setCancelModalOpen(true);
  };

  const handleUpdate = async (e) => {
    if (!values.receive_status) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.created_by = mealData?.created_by;
      temp.created_date = mealData?.created_date;
      temp.created_username = mealData?.created_username;
      temp.meal_id = mealData?.meal_id;
      temp.refreshment_id = mealData?.id;
      temp.rate_per_count = mealData?.rate_per_count;
      temp.remarks = mealData?.remarks;
      temp.approved_status = mealData.approved_status;
      temp.approved_by = mealData?.approved_by;
      temp.approved_date = mealData?.approved_date;
      temp.approver_remarks = mealData?.approver_remarks;
      temp.approved_count = mealData?.approved_count;
      temp.time = mealData?.time;
      temp.date = mealData?.date;
      temp.count = mealData?.count;
      temp.delivery_address = mealData?.delivery_address;
      temp.end_user_feedback_remarks = values.endUser_feedback_remarks;
      temp.receive_status = values.receive_status === "1" ? 1 : 2;
      temp.receive_date = new Date();
      temp.school_id = mealData.school_id;
      temp.dept_id = mealData.dept_id;
      temp.user_id = mealData.user_id;
      temp.approved_by = mealData.approved_by;
      temp.time_for_frontend = mealData.time_for_frontend;
      temp.voucher_head_new_id = mealData.voucher_head_new_id;
      temp.gross_amount = mealData.gross_amount;
      temp.rate_per_count = mealData.rate_per_count;
      temp.email_status = mealData.email_status;

      await axios
        .put(`/api/updateMealRefreshmentRequest/${mealData.id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Refreshment Status Changed",
            });
            getData();
            setIsModalOpen(false);
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

  const handleCancel = async (e) => {
    if (!values.remarks) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.created_by = refreshmentData?.created_by;
      temp.created_date = refreshmentData?.created_date;
      temp.created_username = refreshmentData?.created_username;
      temp.meal_id = refreshmentData.meal_id;
      temp.refreshment_id = refreshmentData.refreshment_id;
      temp.rate_per_count = refreshmentData.rate_per_count;
      temp.remarks = refreshmentData.remarks;
      temp.approved_status = 2;
      temp.approved_by = refreshmentData?.approved_by;
      temp.approved_date = refreshmentData?.approved_date;
      temp.approver_remarks = refreshmentData.approver_remarks;
      temp.time = refreshmentData.time;
      temp.date = refreshmentData?.date;
      temp.count = refreshmentData?.count;
      temp.delivery_address = refreshmentData?.delivery_address;
      temp.cancel_remarks = values.cancel_remarks;
      temp.cancel_date = new Date();
      temp.cancel_by = userID;
      temp.school_id = refreshmentData.school_id;
      temp.dept_id = refreshmentData.dept_id;
      temp.user_id = refreshmentData.user_id;

      await axios
        .put(
          `/api/updateMealRefreshmentRequest/${refreshmentData.refreshment_id}`,
          temp
        )
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Refreshment Request Cancelled",
            });
            getData();
            setCancelModalOpen(false);
          } else {
            setAlert(res.data ? res.data.message : "Error Occured");
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlert(error.response ? error.response.data.message : "Error");
        });
    }
  };

  const todaysDate = moment(new Date()).format("YYYY-MM-DD");
  const todaysTime = moment(new Date()).format("hh:mm A");

  const columns = [
    {
      field: "meal_type",
      headerName: "Meal Type",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.meal_type} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 130,
            }}
          >
            {params.row.meal_type?.length > 20
              ? `${params.row.meal_type?.slice(0, 22)}...`
              : params.row.meal_type}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "count",
      headerName: "Meal Count",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.count}
        </Typography>
      ),
    },
    {
      field: "approved_count",
      headerName: "Approved Count",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.approved_count ? params.row?.approved_count : "--"}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Meal Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => (params.row.date ? params.row.date : "--"),
    },
    {
      field: "time",
      headerName: "Meal Time",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.time ? moment(params.row.time).format("hh:mm A") : "--",
    },

    {
      field: "vendor_name",
      headerName: "Vendor Name",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.vendor_name ? params.row?.vendor_name : "--"}
        </Typography>
      ),
    },

    {
      field: "remarks",
      headerName: "Event",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.remarks} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 130,
            }}
          >
            {params.row.remarks?.length > 20
              ? `${params.row.remarks?.slice(0, 22)}...`
              : params.row.remarks}
          </Typography>
        </Tooltip>
      ),
    },

    {
      field: "menu_contents",
      headerName: "Menu",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.menu_contents} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 130,
            }}
          >
            {params.row.menu_contents?.length > 30
              ? `${params.row.menu_contents?.slice(0, 32)}...`
              : params.row.menu_contents}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "created_username", headerName: "Indents By", flex: 1 },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.school_name} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 130,
            }}
          >
            {params.row.school_name_short?.length > 30
              ? `${params.row.school_name_short?.slice(0, 32)}...`
              : params.row.school_name_short}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "dept_name_short",
      headerName: "Dept",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.dept_name} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 130,
            }}
          >
            {params.row.dept_name_short?.length > 30
              ? `${params.row.dept_name_short?.slice(0, 32)}...`
              : params.row.dept_name_short}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,

      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "approved_status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const approvedStatus = params.row.approved_status;
        const statusMapping = {
          0: "Pending",
          1: "Approved",
          2: "Cancelled",
        };

        const statusLabel = statusMapping[approvedStatus] || "";

        let tooltipText = "";
        if (approvedStatus === 1) {
          tooltipText = params.row.approver_remarks;
        } else if (approvedStatus === 2) {
          tooltipText = params.row.cancel_remarks;
        }

        return (
          <Tooltip title={tooltipText} arrow>
            <Typography variant="body2" sx={{ paddingLeft: 0 }}>
              {statusLabel}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "delivery_address",
      headerName: "Delivery Place",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.delivery_address}
        </Typography>
      ),
    },

    {
      field: "endUser_feedback_remarks",
      headerName: "End User Feedback",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.endUser_feedback_remarks
            ? params.row?.endUser_feedback_remarks
            : "--"}
        </Typography>
      ),
    },

    {
      field: "approved_by",
      headerName: "Approved By",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.approved_by ? params.row?.approved_by : "--"}
        </Typography>
      ),
    },

    {
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.approved_date ? params.row.approved_date : "",
    },
    {
      field: "receive_status",
      headerName: "Received Status",
      flex: 1,
      renderCell: (params) => {
        const receivedStatus = params.row.receive_status;
        const statusMapping = {
          1: "Received",
          2: "Not Received",
        };
        const statusLabel = statusMapping[receivedStatus] || "";
        return (
          <Typography variant="body2" sx={{ paddingLeft: 0 }}>
            {statusLabel}
          </Typography>
        );
      },
    },
    {
      field: "receive_date",
      headerName: "Received Date",
      flex: 1,
      hide: true,
      valueGetter: (params) =>
        params.row.receive_date
          ? moment(params.row.receive_date).format("DD-MM-YYYY")
          : "",
    },

    {
      field: "assign",
      type: "actions",
      headerName: "Feedback",
      width: 150,
      renderCell: (params) =>
        todaysDate === params?.row?.date?.split("-").reverse().join("-") ? (
          todaysDate >= params?.row?.date?.split("-").reverse().join("-") &&
          todaysTime >= params?.row?.time_for_frontend &&
          params.row.receive_status === null &&
          params.row.approved_status === 1
        ) : todaysDate >= params?.row?.date?.split("-").reverse().join("-") &&
          params.row.receive_status === null &&
          params.row.approved_status === 1 ? (
          <IconButton onClick={() => openDataModal(params.row)}>
            <AddIcon />
          </IconButton>
        ) : (
          ""
        ),
    },

    {
      field: "cancel",
      type: "actions",
      headerName: "Cancel",
      width: 80,
      renderCell: (params) =>
        params.row?.approved_status == 0 ? (
          <IconButton onClick={() => openCancelModal(params.row)}>
            <CancelIcon sx={{ color: "red" }} />
          </IconButton>
        ) : (
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{ paddingLeft: 0, cursor: "pointer", textAlign: "center" }}
          >
            {""}
          </Typography>
        ),
    },
  ];

  const handleChange = (e) => {
    if (e.target.name === "count") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const modalData = () => {
    return (
      <>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={4}
          justifyContent="center"
          alignItems="center"
          padding={3}
        >
          <Grid item xs={12} md={12}>
            <CustomTextField
              multiline
              rows={2}
              label="Feedback"
              value={values?.remarks}
              name="endUser_feedback_remarks"
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={12} mt={1} mb={2} justifyContent={"center"}>
            <CustomRadioButtons
              name="receive_status"
              label="Status"
              value={values.receive_status}
              items={[
                {
                  value: 1,
                  label: "Received",
                },
                {
                  value: 2,
                  label: "Not Received",
                },
              ]}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              disableElevation
              sx={{ position: "absolute", borderRadius: 2 }}
              onClick={handleUpdate}
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

  const cancelData = () => {
    return (
      <>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={4}
          justifyContent="center"
          alignItems="center"
          padding={3}
        >
          <Grid item xs={12} md={12}>
            <CustomTextField
              multiline
              rows={2}
              label="Cancel Remarks"
              value={values?.cancel_remarks}
              name="cancel_remarks"
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              disableElevation
              sx={{ position: "absolute", right: 40, borderRadius: 2 }}
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

  return (
    <>
      <ModalWrapper
        maxWidth={500}
        title="Recived Meal"
        open={isModalOpen}
        setOpen={setIsModalOpen}
      >
        {modalData()}
      </ModalWrapper>

      <ModalWrapper
        maxWidth={500}
        title="Cancel Request"
        open={cancelModalOpen}
        setOpen={setCancelModalOpen}
      >
        {cancelData()}
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 3 }}>
        <Button
          onClick={() =>
            navigate("/CateringMaster/RefreshmentRequestIndex/New")
          }
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -47, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default RefreshmentRequestIndex;
