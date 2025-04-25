import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Button,
  Grid,
  IconButton,
  tooltipClasses,
  Tooltip,
  styled,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

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

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  },
  th: {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
  },
  td: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
  },
  yearTd: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "right",
  },
  cancelled: {
    background: "#ffcdd2 !important",
  },
}));

const filterLists = [
  { label: "Today", value: "today" },
  { label: "1 Week", value: "week" },
  { label: "1 Month", value: "month" },
  { label: "Custom Date", value: "custom" },
];

const initialValues = {
  filterList: filterLists,
  filter: filterLists[1].value,
  startDate: "",
  endDate: "",
  schoolList: [],
  schoolId: "",
  cancelledRemarks: "",
};

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  directDemandList: [],
  modalOpen: false,
  modalContent: modalContents,
  attachmentModal: false,
  fileUrl: null,
};

function PaymentVoucherIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [{ fileUrl, attachmentModal }, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    approved_by: false,
    // approved_date: false,
    created_date: false,
    created_by: false,
    dept_name: false,
    remarks: false,
  });
  const [voucherData, setVoucherData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const navigate = useNavigate();

  const maxLength = 200;

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  useEffect(() => {
    getSchoolDetails();
    getData(values.filterList[1].value);
    setCrumbs([{ name: "" }]);
  }, []);

  const getSchoolDetails = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data.map((obj) => ({
          value: obj.school_id,
          label: obj.school_name,
        }));
        setSchoolList(list);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setSchoolList = (lists) => {
    setValues((prevState) => ({
      ...prevState,
      schoolList: lists,
    }));
  };

  const getRowClassName = (params) => {
    if (!params.row.active) {
      return classes.cancelled;
    }
  };

  const getData = async (filterKey, value) => {
    setLoading(true);
    let params = null;
    if (
      filterKey == "custom" &&
      !!value &&
      !!values.startDate &&
      !values.schoolId
    ) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=custom&start_date=${moment(
        values.startDate
      ).format("YYYY-MM-DD")}&end_date=${moment(value).format("YYYY-MM-DD")}`;
    } else if (
      filterKey == "custom" &&
      !!value &&
      !!values.startDate &&
      !!values.schoolId
    ) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&school_id=${
        values.schoolId
      }&date_range=custom&start_date=${moment(values.startDate).format(
        "YYYY-MM-DD"
      )}&end_date=${moment(value).format("YYYY-MM-DD")}`;
    } else if (
      filterKey == "schoolId" &&
      !!values.endDate &&
      !!values.startDate
    ) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&school_id=${value}&date_range=custom&start_date=${moment(
        values.startDate
      ).format("YYYY-MM-DD")}&end_date=${moment(values.endDate).format(
        "YYYY-MM-DD"
      )}`;
    } else if (
      filterKey == "schoolId" &&
      !!values.filter &&
      !values.endDate &&
      !values.startDate
    ) {
      if (value === null) {
        params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${
          values.filter
        }`;
      } else {
        params = `page=${0}&page_size=${1000000}&sort=created_date&school_id=${value}&date_range=${
          values.filter
        }`;
      }
    } else if (filterKey !== "custom" && !!values.schoolId) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${filterKey}&school_id=${
        values.schoolId
      }`;
    } else {
      params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${filterKey}`;
    }

    if (params) {
      await axios
        .get(`/api/finance/fetchAllPaymentVoucher?${params}`)
        .then((response) => {
          setLoading(false);
          setRows(response.data.data.Paginated_data.content);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
        });
    }
  };

  const handleAttachment = async (data) => {
    try {
      const response = await axios.get(
        `/api/finance/draftPaymentVoucherFileviews?fileName=${data.attachment_path}`,
        {
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: "Error while fetching file",
      });
      setAlertOpen(true);
    }
  };

  const setNullField = () => {
    setValues((prevState) => ({
      ...prevState,
      startDate: "",
      endDate: "",
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (name == "endDate") {
      getData("custom", newValue);
    } else if (name == "startDate" || newValue == "custom") {
    } else if (name == "schoolId") {
      getData("schoolId", newValue);
    } else {
      getData(newValue, "");
      setNullField();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > maxLength) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleReject = async () => {
    try {
      let putData = [...voucherData];

      putData = putData.map(
        ({ created_username, payment_voucher_id, ...rest }) => ({
          ...rest,

          created_username: created_username,
          payment_voucher_id: payment_voucher_id,
          cancel_voucher: 1,
          cancelled_by: userID,
          cancelled_date: moment(new Date()).format("DD-MM-YYYY"),
          cancelled_remarks: values.cancelledRemarks,
          active: false,
        })
      );

      let ids = [];
      putData.forEach((obj) => {
        ids.push(obj.payment_voucher_id);
      });
      ids = ids.toString();

      const [response] = await Promise.all([
        axios.put(
          `/api/finance/updatePaymentVoucher/${ids.toString()}`,
          putData
        ),
      ]);
      if (!response.data.success) {
        throw new Error();
      }

      setAlertMessage({
        severity: "success",
        message: "Payment voucher has been cancelled successfully.",
      });
      setAlertOpen(true);
      getData();
      setCancelOpen(false);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Error Occured",
      });
      setAlertOpen(true);
      setCancelOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOpen = async (data) => {
    setCancelOpen(true);
    try {
      const response = await axios.get(
        `/api/purchase/getPaymentVoucherDetails?payment_voucher_id=${data.id}`
      );

      setVoucherData(response.data);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Something went wrong.",
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    {
      field: "Print",
      headerName: "Print",
      renderCell: (params) =>
        params.row.type === "FUND-TRANSFER" ? (
          <IconButton
            color="primary"
            onClick={() => navigate(`/fund-transfer-pdf/${params.row.id}`)}
          >
            <PrintIcon sx={{ fontSize: 17 }} />
          </IconButton>
        ) : (
          <IconButton
            color="primary"
            onClick={() => navigate(`/payment-voucher-pdf/${params.row.id}`)}
          >
            <PrintIcon sx={{ fontSize: 17 }} />
          </IconButton>
        ),
    },

    { field: "voucher_no", headerName: "Voucher No", flex: 1 },
    {
      field: "approved_date",
      headerName: "Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
    },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "pay_to", headerName: "Pay to", flex: 1 },
    {
      field: "debit_total",
      headerName: "Amount",
      flex: 0.8,
      headerAlign: "right",
      align: "right",
    },
    { field: "dept_name", headerName: "Dept", flex: 1, hide: true },
    { field: "created_name", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
    },
    { field: "created_username", headerName: "Approved By", flex: 1 },

    {
      field: "online",
      headerName: "Online",
      flex: 1,
      valueGetter: (value, row) => (value == 1 ? "Online" : ""),
    },
    { field: "type", headerName: "Type", flex: 1 },
    {
      field: "envAttachment_path",
      headerName: "Attachment",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params?.row?.envAttachment_path ? (
          <IconButton
            onClick={() => getUploadData(params.row?.envAttachment_path)}
          >
            <VisibilityIcon color="primary" sx={{ fontSize: 17 }} />
          </IconButton>
        ) : params?.row?.grnAttachment_path ? (
          <IconButton
            onClick={() => getUploadGrnData(params.row?.grnAttachment_path)}
          >
            <VisibilityIcon color="primary" sx={{ fontSize: 17 }} />
          </IconButton>
        ) : params?.row?.attachment_path ? (
          <>
            <IconButton onClick={() => handleAttachment(params.row)}>
              <Visibility sx={{ fontSize: 17 }} color="primary" />
            </IconButton>
          </>
        ) : (
          <></>
        ),
      ],
    },

    {
      field: "cancel",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) =>
        !params.row.cancel_voucher ? (
          <IconButton onClick={() => handleRejectOpen(params.row)}>
            <CancelOutlinedIcon color="error" sx={{ fontSize: 17 }} />
          </IconButton>
        ) : (
          <Typography>{params.row.cancelled_remarks}</Typography>
        ),
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
  ];

  const getUploadData = async (ddAttachment) => {
    await axios(
      `/api/finance/EnvBillDetailsFileviews?fileName=${ddAttachment}`,
      {
        method: "GET",
        responseType: "blob",
      }
    )
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        setState((prevState) => ({
          ...prevState,
          attachmentModal: !attachmentModal,
          fileUrl: url,
        }));
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: "An error occured",
        });
        setAlertOpen(true);
      });
  };

  const getUploadGrnData = async (ddAttachment) => {
    await axios(`/api/purchase/grnFileDownload?fileName=${ddAttachment}`, {
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        setState((prevState) => ({
          ...prevState,
          attachmentModal: !attachmentModal,
          fileUrl: url,
        }));
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: "An error occured",
        });
        setAlertOpen(true);
      });
  };

  const handleViewAttachmentModal = () => {
    setState((prevState) => ({
      ...prevState,
      attachmentModal: !attachmentModal,
    }));
  };

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: { xs: 2, md: -5 },
        }}
      >
        <Grid xs={12} md={3}>
          {/* <CustomAutocomplete
            name="schoolId"
            label="School"
            value={values.schoolId}
            options={values.schoolList || []}
            handleChangeAdvance={handleChangeAdvance}
          /> */}
        </Grid>
        <Grid xs={12} md={2}>
          <CustomAutocomplete
            name="filter"
            label="filter"
            value={values.filter}
            options={values.filterList || []}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>
        {values.filter == "custom" && (
          <Grid item xs={12} md={2}>
            <CustomDatePicker
              name="startDate"
              label="From Date"
              value={values.startDate}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
        )}
        {values.filter == "custom" && (
          <Grid item xs={12} md={2}>
            <CustomDatePicker
              name="endDate"
              label="To Date"
              value={values.endDate}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!values.startDate}
              required
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <GridIndex
            rows={rows}
            columns={columns}
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel}
            getRowClassName={getRowClassName}
          />
        </Grid>

        <ModalWrapper open={cancelOpen} setOpen={setCancelOpen} maxWidth={700}>
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
          >
            <Grid item xs={12}>
              <CustomTextField
                name="cancelledRemarks"
                label="Remarks"
                value={values.cancelledRemarks}
                handleChange={handleChange}
                helperText={`Remaining characters : ${getRemainingCharacters(
                  "cancelledRemarks"
                )}`}
                multiline
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={!values.cancelledRemarks}
                variant="contained"
                color="error"
                onClick={handleReject}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>

        {!!attachmentModal && (
          <ModalWrapper
            title="Direct Demand Attachment"
            maxWidth={600}
            open={attachmentModal}
            setOpen={() => handleViewAttachmentModal()}
          >
            <Grid container>
              <Grid item xs={12} md={12}>
                {!!fileUrl ? (
                  <iframe
                    width="100%"
                    style={{ height: "100vh" }}
                    src={fileUrl}
                  ></iframe>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </ModalWrapper>
        )}
      </Grid>
    </>
  );
}

export default PaymentVoucherIndex;
