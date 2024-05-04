import { useState, useEffect, lazy } from "react";
import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import {
  convertDateFormat,
  convertDateYYYYMMDD,
  convertToDateandTime,
} from "../../../../utils/Utils";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import axios from "../../../../services/Api";
import useAlert from "../../../../hooks/useAlert";
const CustomDatePicker = lazy(() =>
  import("../../../../components/Inputs/CustomDatePicker")
);
const GridIndex = lazy(() => import("../../../../components/GridIndex"));

const initialValues = {
  date: "",
};
function RefreshmentMailBox() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Catering Report" }, { name: "Refreshment Mail Box" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/getFilteredEndUserData/${moment(values.date).format(
          "DD-MM-YYYY"
        )}`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      field: "meal_type",
      headerName: "Meal Type",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.meal_type
            ? params.row?.meal_type
            : params.row?.meal_type}
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
              maxWidth: 150,
            }}
          >
            {params.row?.vendor_name?.length > 15
              ? `${params.row?.vendor_name.slice(0, 18)}...`
              : params.row?.vendor_name}
          </Typography>
        </Tooltip>
      ),
    },

    {
      field: "Requested_name",
      headerName: "Requested By",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.Requested_name ? params.row?.Requested_name : "--"}
        </Typography>
      ),
    },
    {
      field: "dept_name",
      headerName: "Dept",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.dept_name ? params.row?.dept_name : "--"}
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
      field: "created_date",
      headerName: "Indents Date",
      flex: 1,

      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    { field: "approved_status", headerName: "Status", flex: 1 },

    {
      field: "approver_remarks",
      headerName: "Approved Remarks",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.approver_remarks} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 150,
            }}
          >
            {params.row.approver_remarks?.length > 15
              ? `${params.row.approver_remarks.slice(0, 18)}...`
              : params.row.approver_remarks}
          </Typography>
        </Tooltip>
      ),
    },

    {
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.approved_date
          ? convertDateFormat(params.row.approved_date)
          : "",
    },
  ];
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleMailBox = async () => {
    setAlertOpen(true);
    setLoading(true);
    await axios
      .post(
        `/api/emailToEndUSerForApprovalOfFoodRequest/${convertDateYYYYMMDD(
          values.date
        )}`
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          getData();
          setAlertMessage({
            severity: "success",
            message: "Mail sent to For End User successfully",
          });
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

    await axios
      .post(
        `/api/emailToVendorForSupplyOfFoodRequest/${convertDateYYYYMMDD(
          values.date
        )}`
      )
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          getData();
          setAlertMessage({
            severity: "success",
            message: "Mail sent to Vendor successfully",
          });
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
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <Grid container columnSpacing={4} mt={1} rowSpacing={2}>
        <Grid item xs={12} md={4} mb={2} align="right">
          <CustomDatePicker
            views={["month", "year"]}
            openTo="month"
            name="date"
            label="Meal Date"
            inputFormat="MM/YYYY"
            helperText="mm/yyyy"
            value={values.date}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>

        <Grid item xs={12} md={5} align="right">
          <Button
            variant="contained"
            onClick={getData}
            sx={{ right: 0, top: 0, left: 180, borderRadius: 2 }}
          >
            GO
          </Button>
        </Grid>
        <Grid item xs={12} md={3} align="right">
          <Button
            onClick={handleMailBox}
            variant="contained"
            disableElevation
            sx={{ right: 0, top: 0, borderRadius: 2 }}
            disabled={rows?.length > 0 ? false : true}
          >
            Send Mail
          </Button>
        </Grid>
      </Grid>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default RefreshmentMailBox;
