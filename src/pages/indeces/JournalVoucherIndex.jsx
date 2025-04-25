import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import {
  Grid,
  Box,
  IconButton,
  Tooltip,
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
const ModalWrapper = lazy(() => import("../../components/ModalWrapper"));

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

function JournalVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    dept_name: false,
    remarks: false,
  });
  const [{ fileUrl, attachmentModal }, setState] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getData(values.filterList[1].value);
    setCrumbs([{ name: "Journal Vouchers" }]);
  }, []);

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
      field: "verified_date",
      headerName: "Date",
      flex: 1,
      // valueGetter: (params) => moment(params.value).format("DD-MM-YYYY LT"),
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
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
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
      renderCell: (params) => (
        <IconButton>
          <CancelOutlinedIcon color="error" sx={{ fontSize: 17 }} />
        </IconButton>
      ),
    },
  ];

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
          />
        </Grid>

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

export default JournalVoucherIndex;
