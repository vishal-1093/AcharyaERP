import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import {
  Button,
  Grid,
  Box,
  IconButton,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { makeStyles } from "@mui/styles";
const ModalWrapper = lazy(() => import("../../components/ModalWrapper"));

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

const useStyles = makeStyles((theme) => ({
  cancelled: {
    background: "#ffcdd2 !important",
  },
}));

function JournalVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    dept_name: false,
    remarks: false,
  });
  const [voucherData, setVoucherData] = useState([]);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [{ fileUrl, attachmentModal }, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    getData(values.filterList[1].value);
    setCrumbs([{ name: "Journal Vouchers" }]);
  }, []);

  const maxLength = 200;

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const getData = async (filterKey, value) => {
    // setLoading(true);
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
        .get(`/api/finance/fetchAllJournalVoucher?${params}`)
        .then((response) => {
          // setLoading(false);
          setRows(response.data.data.Paginated_data.content);
        })
        .catch((err) => {
          // setLoading(false);
          console.error(err);
        });
    }
  };

  const getRowClassName = (params) => {
    if (!params.row.active) {
      return classes.cancelled;
    }
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

  const setNullField = () => {
    setValues((prevState) => ({
      ...prevState,
      startDate: "",
      endDate: "",
    }));
  };

  const handleViewAttachmentModal = () => {
    setState((prevState) => ({
      ...prevState,
      attachmentModal: !attachmentModal,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > maxLength) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    {
      field: "id",
      headerName: "JV",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            handleGeneratePdf(
              params.row.journal_voucher_number,
              params.row.school_id,
              params.row.financial_year_id
            )
          }
        >
          <PrintIcon color="primary" sx={{ fontSize: 17 }} />
        </IconButton>
      ),
    },

    { field: "journal_voucher_number", headerName: "JV No.", flex: 1 },
    {
      field: "created_date",
      headerName: "Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
    },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "pay_to", headerName: "Vendor", flex: 1 },

    { field: "dept_name", headerName: "Dept", flex: 1 },
    {
      field: "debit_total",
      headerName: "Amount",
      flex: 0.8,
      headerAlign: "right",
      align: "right",
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    { field: "verifierName", headerName: "Verified By", flex: 1 },
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
        ) : (
          <></>
        ),
      ],
    },

    { field: "remarks", headerName: "Remarks", flex: 1 },
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
  ];

  const handleRejectOpen = async (data) => {
    setCancelOpen(true);
    setValues((prev) => ({ ...prev, ["cancelledRemarks"]: "" }));
    try {
      const response = await axios.get(
        `/api/finance/getJournalVoucherByVoucherNumber/${data.journal_voucher_number}/${data.school_id}/${data.financial_year_id}`
      );

      setVoucherData(response.data.data);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Something went wrong.",
      });
      setAlertOpen(true);
    }
  };

  const handleGeneratePdf = async (
    journalVoucherNumber,
    schoolId,
    fcYearId
  ) => {
    navigate(`/generate-journalvoucher-pdf/${journalVoucherNumber}`, {
      state: { indexStatus: true, schoolId, fcYearId },
    });
  };

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

  const handleReject = async () => {
    try {
      let putData = [...voucherData];

      putData = putData.map(({ created_username, id, ...rest }) => ({
        ...rest,
        created_username: created_username,
        journal_voucher_id: id,
        cancel_voucher: 1,
        cancelled_by: userID,
        cancelled_date: moment(new Date()).format("DD-MM-YYYY"),
        cancelled_remarks: values.cancelledRemarks,
        active: false,
      }));

      let ids = [];
      putData.forEach((obj) => {
        ids.push(obj.journal_voucher_id);
      });
      ids = ids.toString();

      const [response] = await Promise.all([
        axios.put(
          `/api/finance/updateJournalVoucher/${ids.toString()}`,
          putData
        ),
      ]);
      if (!response.data.success) {
        throw new Error();
      }

      setAlertMessage({
        severity: "success",
        message: "Journal voucher has been cancelled successfully.",
      });
      setAlertOpen(true);
      getData();
      setCancelOpen(false);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Unable to create the journal voucher.",
      });
      setAlertOpen(true);
      setCancelOpen(false);
    } finally {
      setLoading(false);
    }
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

        {!!attachmentModal && (
          <ModalWrapper
            title="Direct Demand Attachment"
            maxWidth={1000}
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
      </Grid>
    </>
  );
}

export default JournalVoucherIndex;
