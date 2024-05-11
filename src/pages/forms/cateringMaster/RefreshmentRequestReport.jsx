import { useState, useEffect, lazy } from "react";
import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import {
  convertDateFormat,
  convertDateYYYYMMDD,
  convertToDateandTime,
} from "../../../utils/Utils";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const GridIndex = lazy(() => import("../../../components/GridIndex"));

const initialValues = {
  date: new Date(),
};
function RefreshmentRequestReport() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [open, setOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

  useEffect(() => {
    getData();
    setCrumbs([
      { name: "Catering Report" },
      { name: "Refreshment Request Report" },
    ]);
  }, []);

  const getData = async () => {
    if (pathname.toLowerCase() === "/refreshmentdetails/approvedreport") {
      setOpen(false);
      await axios
        .get(
          `/api/fetchAllMealRefreshmentRequestDetailsForEmailIndexReport?page=${0}&page_size=${10000}&sort=created_date&date=${moment(
            values.date
          ).format("DD-MM-YYYY")}&approved_status=1`
        )
        .then((res) => {
          setRows(res.data.data?.Paginated_data?.content);
        })
        .catch((err) => console.error(err));
    } else {
      setOpen(true);
      await axios
        .get(
          `/api/fetchAllMealRefreshmentRequestDetailsForEmailIndexReport?page=${0}&page_size=${10000}&sort=created_date&date=${moment(
            values.date
          ).format("DD-MM-YYYY")}&approved_status=2`
        )
        .then((res) => {
          setRows(res.data.data?.Paginated_data?.content);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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
      headerName: "Count",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.count ? params.row?.count : "-"}
        </Typography>
      ),
    },
    {
      field: "approved_count",
      headerName: "Approved Count",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.approved_count ? params.row?.approved_count : "-"}
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
            {params.row?.vendor_name?.length > 20
              ? `${params.row?.vendor_name?.slice(0, 22)}...`
              : params.row?.vendor_name}
          </Typography>
        </Tooltip>
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
      headerName: "Indents Date",
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
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.approved_date ? params.row.approved_date : "",
    },

    {
      field: "approver_name",
      headerName: "Approved By",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.approver_name ? params.row?.approver_name : "--"}
        </Typography>
      ),
    },
    {
      field: "end_user_feedback_remarks",
      headerName: "Meal Feedback",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Tooltip title={params.row.end_user_feedback_remarks} arrow>
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
            {params.row.end_user_feedback_remarks?.length > 30
              ? `${params.row.end_user_feedback_remarks?.slice(0, 32)}...`
              : params.row.end_user_feedback_remarks}
          </Typography>
        </Tooltip>
      ),
    },
  ];

  const columnsCancelled = [
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
      field: "delivery_address",
      headerName: "Delivery Place",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.delivery_address ? params.row?.delivery_address : "-"}
        </Typography>
      ),
    },

    {
      field: "menu_contents",
      headerName: "Menu",
      hide: true,
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
      headerName: "Indents Date",
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
      field: "cancel_remarks",
      headerName: "Cancelled Remarks",
      flex: 1,
    },
    {
      field: "cancel_date",
      headerName: "Cancelled Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.cancel_date
          ? moment(params.row.cancel_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "modified_username",
      headerName: "Cancelled By",
      flex: 1,
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <Grid container columnSpacing={4} mt={1} rowSpacing={2}>
        <Grid item xs={12} md={4} mb={2} align="right">
          <CustomDatePicker
            views={["month", "year"]}
            openTo="month"
            name="date"
            label="Select Month"
            inputFormat="MM/YYYY"
            helperText="mm/yyyy"
            value={values.date}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>

        <Grid item xs={12} md={3} align="right">
          <Button
            variant="contained"
            onClick={getData}
            sx={{ position: "absolute", right: 0, top: 30, borderRadius: 2 }}
          >
            GO
          </Button>
        </Grid>
      </Grid>
      <GridIndex rows={rows} columns={open ? columnsCancelled : columns} />
    </Box>
  );
}

export default RefreshmentRequestReport;
