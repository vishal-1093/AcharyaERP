import { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import {
  convertDateFormat,
  convertToDateandTime,
} from "../../../../utils/Utils";
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
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [mealData, setMealData] = useState();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const empId = localStorage.getItem("empId");
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Refreshment Request Index" }]);
  }, []);

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

  const openDataModal = async (data) => {
    setMealData(data);
    setIsModalOpen(true);
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
      temp.endUser_feedback_remarks = values.endUser_feedback_remarks;
      temp.receive_status = values.receive_status === "1" ? 1 : 2;
      temp.receive_date = new Date();

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

  const columns = [
    {
      field: "meal_type",
      headerName: "Meal Type",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.meal_type
            ? params.row?.meal_type
            : params.row?.mess_meal_type}
        </Typography>
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
    { field: "created_username", headerName: "Created By", flex: 1 },
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
        params.row.approved_date
          ? convertDateFormat(params.row.approved_date)
          : "",
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
        moment(params.row.receive_date).format("DD-MM-YYYY"),
    },

    {
      field: "assign",
      type: "actions",
      headerName: "Meal Receive",
      width: 150,
      renderCell: (params) =>
        params.row?.approved_status == 2 ||
        params.row.receive_status == 1 ||
        params.row?.approved_status == 0 ? (
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{ paddingLeft: 0, cursor: "pointer", textAlign: "center" }}
          >
            {""}
          </Typography>
        ) : (
          <IconButton onClick={() => openDataModal(params.row)}>
            <AddIcon />
          </IconButton>
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
