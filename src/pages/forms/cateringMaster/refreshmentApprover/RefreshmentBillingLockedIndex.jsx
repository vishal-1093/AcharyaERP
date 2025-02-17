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
const CustomRadioButtons = lazy(() =>
  import("../../../../components/Inputs/CustomRadioButtons")
);

const initialValues = {
 approverStatus:null
};

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function RefreshmentBillingLockedIndex() {
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
    setCrumbs([
      { name: "Refreshment Locked Billing Approver Index" },
    ]);
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllMealBillDetails?page=0&page_size=100000&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const openDataModal = async (data) => {
    setIsModalOpen(true);
  };

  const columns = [
    {
      field: "index",
      headerName: "Sl.No.",
      flex: 1,
    },
    {
      field: "month",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "school",
      headerName: "School",
      flex: 1,
    },
    {
      field: "vendor",
      headerName: "Vendor",
      flex: 1,
    },
    {
      field: "locked_amount",
      headerName: "Catering bill",
      flex: 1,
    },
    {
      field: "locked_by",
      headerName: "Locked By",
      flex: 1,
    },
    {
      field: "locked_date",
      headerName: "Locked Date",
      flex: 1,
    },
    {
      field: "approved_by",
      headerName: "Approver",
      flex: 1,
      renderCell: (params) =>
        !!params.row?.approved_by ? (
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
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
    },
    {
      field: "print",
      headerName: "Print",
      flex:1
    },
  ];

  const handleChange = (e) => {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
  };

  const handleUpdate = async (e) => {
      setLoading(true);
  };

  const modalData = () => {
    return (
      <>
         <Grid
          container
          rowSpacing={1}
          columnSpacing={4}
          justifyContent="flexStart"
          alignItems="center"
          padding={1}
        >
          <Grid item xs={12} md={12}>
            <Grid container>
              <Grid item xs={12} md={12} mb={1}>
                <Typography>Status :</Typography>
              </Grid>
              <Grid item xs={12} md={12} mb={2}>
                <CustomRadioButtons
                  name="approverStatus"
                  label=""
                  value={values.approverStatus}
                  items={[
                    {
                      value: 1,
                      label: "Approved",
                    },
                    {
                      value: 2,
                      label: "Rejected",
                    },
                  ]}
                  handleChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} mb={3}>
            <Button
              variant="contained"
              disableElevation
              sx={{ position: "absolute", right: 40, borderRadius: 2 }}
              // onClick={handleCancel}
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
        title="Locked Billing Approve"
        open={isModalOpen}
        setOpen={setIsModalOpen}
      >
        {modalData()}
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 3 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default RefreshmentBillingLockedIndex;
