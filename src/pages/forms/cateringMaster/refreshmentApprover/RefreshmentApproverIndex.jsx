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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import moment from "moment";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import axios from "../../../../services/Api";
import CancelIcon from "@mui/icons-material/Cancel";
import useAlert from "../../../../hooks/useAlert";
const GridIndex = lazy(() => import("../../../../components/GridIndex"));
const ModalWrapper = lazy(() => import("../../../../components/ModalWrapper"));
const CustomTextField = lazy(() =>
  import("../../../../components/Inputs/CustomTextField")
);
const CustomDatePicker = lazy(() =>
  import("../../../../components/Inputs/CustomDatePicker")
);
const CustomAutocomplete = lazy(() =>
  import("../../../../components/Inputs/CustomAutocomplete")
);
const CustomTimePicker = lazy(() =>
  import("../../../../components/Inputs/CustomTimePicker")
);

const initialValues = {
  date: "",
  count: "",
  active: true,
  meal_id: "",
  time: "",
  remarks: "",
  vendor_id: "",
  rate_per_count: "",
  amount: "",
  delivery_address: "",
  menu_contents: "",
  approver_remarks: "",
  cancel_remarks: "",
  approved_count: "",
};

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function RefreshmentApproverIndex() {
  const [rows, setRows] = useState([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const setCrumbs = useBreadcrumbs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [mealData, setMealData] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [refreshmentData, setRefreshmentData] = useState(null);
  const empId = sessionStorage.getItem("empId");
  const navigate = useNavigate();
  const [venderRateData, setVenderRateDataData] = useState(null);
  const [alert, setAlert] = useState("");
  const checks = {
    vendor_id: [values.vendor_id !== ""],
    remarks: [values.remarks !== ""],
    approver_remarks: [values.approver_remarks !== ""],
    delivery_address: [values.delivery_address !== ""],
  };

  const errorMessages = {
    remarks: ["This field required"],
    vendor_id: ["This field required"],
    approver_remarks: ["This field required"],
    delivery_address: ["This field required"],
  };

  useEffect(() => {
    getData();
    getMealOptions();
    setCrumbs([
      { name: "Catering Report" },
      { name: "Refreshment Approver Index" },
    ]);
  }, []);

  useEffect(() => {
    if (values.vendor_id) {
      getVenerRateData();
    }
  }, [values.vendor_id]);

  useEffect(() => {
    if (values.meal_id) {
      getMealVendor(values.meal_id);
    }
  }, [values.meal_id]);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllMealRefreshmentRequestDetailsEndUserOnly?page=${0}&page_size=${10000}&sort=created_date`
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

  const getVenerRateData = async () => {
    await axios
      .get(`/api/getRatePerCount/${values.meal_id}/${values.vendor_id}`)
      .then((res) => {
        setVenderRateDataData(res.data);
      })
      .catch((err) => console.error(err));
  };

  const getMealVendor = async (meal_id) => {
    await axios
      .get(`/api/getVendorData/${meal_id}`)
      .then((Response) => {
        setVendorOptions(
          Response.data.data.map((obj) => ({
            value: obj.voucher_head_new_id,
            label: obj.vendor_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getMealOptions = async () => {
    await axios
      .get(`/api/getOnlyEndUserMealType`)
      .then((Response) => {
        setMealData(
          Response.data.data.map((obj) => ({
            value: obj.meal_id,
            label: obj.meal_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const openDataModal = async (data) => {
    await getRefreshRequestData(data?.id);
    setAlert("");
    setIsModalOpen(true);
    setVenderRateDataData(0);
  };

  const openCancelModal = async (data) => {
    await getRefreshRequestData(data?.id);
    setAlert("");
    setCancelModalOpen(true);
  };

  const columns = [
    {
      field: "meal_type",
      headerName: "Meal Type",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row?.meal_type} arrow>
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
            {params.row?.meal_type?.length > 30
              ? `${params.row?.meal_type?.slice(0, 32)}...`
              : params.row?.meal_type}
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
      field: "date",
      headerName: "Meal Date",
      flex: 1,
//      type: "date",
      valueGetter: (value, row) => (row?.date ? row?.date : "--"),
    },
    {
      field: "time",
      headerName: "Meal Time",
      flex: 1,
  //    type: "date",
      valueGetter: (value, row) =>
        row?.time ? moment(row?.time).format("hh:mm A") : "--",
    },

    {
      field: "delivery_address",
      headerName: "Delivery Place",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.delivery_address ? params.row?.delivery_address : "-"}
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
      field: "vendor_name",
      headerName: "Vendor Name",
      flex: 1,
      hide:true,
      renderCell: (params) => (
        <Tooltip title={params.row?.vendor_name} arrow>
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
            {params.row?.vendor_name?.length > 30
              ? `${params.row?.vendor_name?.slice(0, 32)}...`
              : params.row?.vendor_name}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "created_username", headerName: "Indents By", flex: 1 },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hide:true,
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
      field: "menu_contents",
      headerName: "Menu",
      flex: 1,
      hide: true,
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

    {
      field: "created_date",
      headerName: "Indents Date",
      flex: 1,

      valueGetter: (value, row) =>
        moment(row?.created_date).format("DD-MM-YYYY"),
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
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
 //     type: "date",
      valueGetter: (value, row) =>
        row?.approved_date ? row?.approved_date : "",
    },
    {
      field: "Approve",
      type: "actions",
      headerName: "Approve",
      width: 90,
      renderCell: (params) =>
        params.row?.approved_status == 1 || params.row?.approved_status == 2 ? (
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{ paddingLeft: 0, cursor: "pointer", textAlign: "center" }}
          >
            {""}
          </Typography>
        ) : (
          <IconButton onClick={() => openDataModal(params.row)}>
             <AddCircleIcon color="primary" />
          </IconButton>
        ),
    },

    {
      field: "assign",
      type: "actions",
      headerName: "Cancel",
      width: 80,
      renderCell: (params) =>
        params.row?.approved_status == 2 ? (
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{ paddingLeft: 0, cursor: "pointer", textAlign: "center" }}
          >
            {""}
          </Typography>
        ) : (
          <IconButton onClick={() => openCancelModal(params.row)}>
            <CancelIcon sx={{ color: "red" }} />
          </IconButton>
        ),
    },
  ];

  const handleUpdate = async (e) => {
    if (
      values.vendor_id &&
      values.approver_remarks &&
      values.delivery_address
    ) {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.created_by = refreshmentData?.created_by;
      temp.created_date = refreshmentData?.created_date;
      temp.created_username = refreshmentData?.created_username;
      temp.meal_id = values.meal_id ? values.meal_id : refreshmentData.meal_id;
      temp.refreshment_id = refreshmentData.refreshment_id;
      temp.voucher_head_new_id = values.vendor_id;
      temp.rate_per_count = values.rate_per_count;
      temp.meal_vendor_assignment_id =
        refreshmentData?.meal_vendor_assignment_id;
      temp.remarks = values.remarks;
      temp.approved_status = 1;
      temp.approved_by = empId;
      temp.approved_date = moment(new Date()).format("DD-MM-YYYY");
      temp.approver_remarks = values.approver_remarks;
      temp.time = values.time ? values.time : refreshmentData?.time;
      temp.time_for_frontend =
        values.time_for_frontend === refreshmentData.time_for_frontend
          ? values.time_for_frontend
          : moment(new Date(values.time)).format("hh:mm A");
      temp.date = values?.date ? values.date : refreshmentData?.date;
      temp.count = refreshmentData?.count;
      temp.delivery_address = values?.delivery_address;
      temp.approved_count = values.count
        ? values.count
        : refreshmentData?.count;
      temp.school_id = refreshmentData.school_id;
      temp.dept_id = refreshmentData.dept_id;
      temp.approved_by = userID;
      temp.user_id = refreshmentData.user_id;
      temp.gross_amount = venderRateData?.data
        ? values?.count * venderRateData?.data
        : "0";
      temp.rate_per_count = venderRateData?.data;
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
              message: "Refreshment Request Approved",
            });
            getData();
            setIsModalOpen(false);
          } else {
            setAlert(res.data ? res.data.message : "Error Occured");
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
    } else {
      setAlert("Please fill all the required fields");
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
      temp.cancel_by = empId;
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

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

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
          rowSpacing={2}
          columnSpacing={4}
          justifyContent="center"
          alignItems="center"
          padding={3}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="meal_id"
              label="Meal Type"
              options={mealData}
              value={values.meal_id}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Count"
              value={values?.count}
              name="count"
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="date"
              label="Meal Date"
              value={values.date}
              handleChange={handleChange}
              required
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTimePicker
              name="time"
              label="Meal time"
              value={values.time}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="vendor_id"
              label="Vendor"
              options={vendorOptions}
              value={values.vendor_id}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.vendor_id}
              errors={errorMessages.vendor_id}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Rate Per Count"
              value={venderRateData?.data ? venderRateData?.data : "0"}
              name="rate_per_count"
              handleChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Gross Amount"
              value={
                venderRateData?.data
                  ? values?.count * venderRateData?.data
                  : "0"
              }
              name="amount"
              handleChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Delivery Place"
              value={values?.delivery_address}
              name="delivery_address"
              handleChange={handleChange}
              checks={checks.delivery_address}
              errors={errorMessages.delivery_address}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              label="Event"
              value={values?.remarks}
              name="remarks"
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              label="Approver Remarks"
              value={values?.approver_remarks}
              name="approver_remarks"
              handleChange={handleChange}
              checks={checks.approver_remarks}
              errors={errorMessages.approver_remarks}
              required
            />
          </Grid>

          <Grid item xs={12} align="center">
            <Typography color="error" variant="h6">
              {alert ? alert : ""}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              disableElevation
              sx={{ position: "absolute", right: 40, borderRadius: 2 }}
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
        maxWidth={900}
        title="Approver"
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
            navigate("/RefreshmentDetails/RefreshmentTypeIndex/New")
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

export default RefreshmentApproverIndex;
