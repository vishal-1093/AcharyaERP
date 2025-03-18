import { useState, useEffect, useRef } from "react";
import {
  Grid,
  Box,
  CircularProgress,
  Button,
  IconButton,
  Paper,
  styled,
  Typography,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff, InfoOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { convertToDMY } from "../../../utils/DateTimeUtils";
import useAlert from "../../../hooks/useAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import Reservation_Policy from "../../../assets/Reservation_Policy.pdf";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";

const useStyles = makeStyles((theme) => ({
  dropFileInput: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7ff",
    height: 180,
    maxWidth: 260,
    margin: "auto",
    border: `3px dashed ${theme.palette.primary.main}`,
    borderRadius: 20,

    "&:hover, &.dragover": {
      opacity: 0.7,
    },
  },
  input: {
    opacity: 0,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  helperText: {
    color: "#555",
    fontSize: "0.85rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.75rem",
    },
  },
  labelText: {
    textAlign: "center",
    fontSize: "0.90rem",
    margin: "20px 10px 0 10px",
    "&:hover": {
      backgroundColor: "red",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "0.9rem",
      margin: "10px 5px 0 5px",
    },
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 350,
    margin: "auto !important",
    backgroundColor: "#e4e4ff",
    borderRadius: 10,
    borderLeft: `10px solid ${theme.palette.success.main}`,
    marginTop: "17px !important",
    padding: "0 10px",
  },
  fileName: {
    fontSize: "0.9rem",
    margin: "5px 0",
    overflow: "hidden",
  },
  fileSize: {
    fontSize: "0.8rem",
    margin: "5px 0",
  },
  error: {
    color: theme.palette.error.main,
    fontSize: "1rem",
    maxWidth: 350,
    margin: "10px auto",
    paddingLeft: 10,
  },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#5A5A5A",
    maxWidth: 270,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}));

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const maxLength = 200;

const statusData = [
  { label: "Conducted", value: "Conducted" },
  { label: "Cancelled ", value: "Cancelled " },
];
function EventCreationIndex() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState({ remarks: "", eventSummary: "", summarize_status: "", schoolId: "", eventDate: "", facility: "" });
  const [imageViewOpen, setImageViewOpen] = useState(false);
  const [imageOpen, setImageUploadOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const [fileURL, setfileURL] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [auditoriumOpen, setAuditoriumOpen] = useState(false);
  const [summaryModalOpen, setsummaryModalOpen] = useState(false);
  const [details, setDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [fileSelected, setFileSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptOptions, setDeptOptions] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 100,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");
  const classes = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [facilityNameOptions, setFacilityNameOptions] = useState([]);

  const wrapperRef = useRef(null);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const getRemainingCharacters = (field) => maxLength - values[field]?.length;

  const handleAddImage = async (params) => {
    setFileSelected([]);
    setRowData(params.row);
    setImageUploadOpen(true);
  };
  const checks = {
    summarize_status: [values.summarize_status !== ""],
    eventSummary: [values.eventSummary !== ""],
  };

  const errorMessages = {
    summarize_status: ["This field required"],
    eventSummary: ["This field is required"],
  };

  const fetchAllPhotos = async (imagePaths) => {
    try {
      const allPaths = await axios.get(
        `/api/institute/eventImageAttachmentsImageDownload?event_image_path=${imagePaths}`,
        {
          method: "GET",
          responseType: "blob",
        }
      );

      const file = new Blob([allPaths.data], {
        type: "image/png, image/gif, image/jpeg",
      });
      const url = URL.createObjectURL(file);
      return url;
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewImage = async (params) => {
    setRowData(params.row);
    try {
      setLoading(true);
      setImageViewOpen(true);

      const imagePaths = await axios.get(
        `/api/institute/eventImageAttachmentsDetails/${params.row.id}`
      );

      const onlyPaths = imagePaths.data.data.map((obj) => obj.event_image_path);

      let combinedData = [];
      for (const url of onlyPaths) {
        const result = await fetchAllPhotos(url);
        combinedData = [...combinedData, result];
      }

      setfileURL(combinedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };
  const columns = [
    {
      field: "additional",
      headerName: "Additional Requirement",
      flex: 1,
      renderCell: (params) => {
        const { event_status, event_start_time, id } = params.row;
        const isMoreThan24Hours = event_start_time
          ? new Date(event_start_time) > new Date(Date.now() + 24 * 60 * 60 * 1000)
          : false;

        return (
          <>
            {isMoreThan24Hours ? (
              <IconButton
                onClick={() => {
                  localStorage.setItem("previousPath", pathname);
                  localStorage.setItem("event_id", id);
                  navigate("/ServiceRequestForm");
                }}
              >
                <AddCircleOutlineIcon fontSize="small" color="primary" />
              </IconButton>
            ) : <IconButton
              onClick={() => {
                setAlertMessage({
                  severity: "error",
                  message: "Additional services can only be requested at least 24 hours before the event start time.",
                });
                setAlertOpen(true);
              }}
            >
              <AddCircleOutlineIcon fontSize="small" color="primary" />
            </IconButton>}
          </>
        );
      },
    },

    {
      field: "viewService",
      headerName: "View Services",
      flex: 1,
      renderCell: (params) => {
        return (
          <>

            <IconButton
              onClick={() => {
                localStorage.setItem("previousPath", pathname);
                navigate("/ServiceRequestEventWise", { state: params.row });
              }}
            >
              <VisibilityIcon fontSize="small" color="primary" />
            </IconButton>
          </>
        );
      },
    },
    { field: "event_name", headerName: "Event Title", flex: 1 },
    { field: "event_sub_name", headerName: "Sub Title", flex: 1, hide: true },
    { field: "event_description", headerName: "Description", flex: 1, hide: true },
    { field: "guest_name", headerName: "Guest Name", flex: 1 },
    { field: "is_common", headerName: "Is Common", flex: 1, hide: true },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      valueGetter: (value, row) =>
        row.is_common === "Yes"
          ? "All Schools"
          : row.school_name_short,
      hide: true
    },

    { field: "roomcode", headerName: "Room", flex: 1 },
    { field: "block_short_name", headerName: "Block Name", flex: 1},
    { field: "facility_type_name", headerName: "Facility Type", flex: 1 },
    {
      field: "event_start_time",
      headerName: "From Date & Time",
      flex: 1,
      type: "dateTime",
      minWidth: 150,
      valueGetter: (value, row) =>
        moment(row.event_start_time).format("DD-MM-YYYY HH:mm"),
    },
    {
      field: "event_end_time",
      headerName: "To Date & Time",
      flex: 1,
      minWidth: 150,
      type: "dateTime",
      valueGetter: (value, row) =>
        moment(row.event_end_time).format("DD-MM-YYYY HH:mm"),
    },

    { field: "created_username", headerName: "Created By", flex: 1, hide: true },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "upload",
      headerName: "Upload Images",
      type: "actions",
      hide: true,
      getActions: (params) => [
        <IconButton
          label="Result"
          color="primary"
          onClick={() => handleAddImage(params)}
        >
          <CloudUploadOutlinedIcon fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "view",
      headerName: "View Images",
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          color="primary"
          onClick={() => handleViewImage(params)}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>,
      ],
    },

    // {
    //   field: "id",
    //   type: "actions",
    //   flex: 1,
    //   headerName: "Update",
    //   getActions: (params) => [
    //     <IconButton
    //       onClick={() => navigate(`/EventMaster/Event/Update/${params.row.id}`)}
    //     >
    //       <EditIcon />
    //     </IconButton>,
    //   ],
    // },
    {
      field: "Approve",
      headerName: "Approver Status",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <Typography variant="subtitle2">
          {params.row.approved_status}
        </Typography>,
      ],
    },
    {
      field: "summary",
      headerName: "Summary",
      flex: 1,
      renderCell: (params) => {
        const { event_end_time, summarize_status } = params.row;
        const now = new Date();
        const isEventActive = event_end_time ? new Date(event_end_time) < now : false;

        return (
          <Box display="flex" alignItems="center" gap={1}>
            {summarize_status !== null ? (
              <IconButton
                onClick={() => {
                  setsummaryModalOpen(true);
                  setDetails(params.row);
                  setValues((prev) => ({
                    ...prev,
                    eventSummary: params.row.summarize || "",
                    summarize_status: params.row.summarize_status || ""
                  }));
                }}
              >
                <VisibilityIcon fontSize="small" color="primary" />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  setValues((prev) => ({
                    ...prev,
                    eventSummary: "",
                    summarize_status: ""
                  }));
                  setsummaryModalOpen(true);
                  setDetails(params.row);
                }}
                disabled={!isEventActive}
              >
                <AddCircleOutlineIcon
                  fontSize="small"
                  color={isEventActive ? "primary" : "disabled"}
                />
              </IconButton>
            )}
          </Box>
        );
      },
    },
    {
      field: "cancel",
      type: "actions",
      headerName: "Cancel",
      width: 80,
      renderCell: (params) => {
        const now = new Date();
        const isEventActive = params.row?.event_end_time
          ? new Date(params.row.event_end_time) > now
          : false;

        if (params.row?.approved_status === "Cancelled" && params.row?.remarks) {
          return (
            <HtmlTooltip title={params.row.remarks}>
              <Typography variant="subtitle2" sx={{ cursor: "pointer" }}>
                {params.row.remarks.length > 10
                  ? `${params.row.remarks.slice(0, 9)}...`
                  : params.row.remarks}
              </Typography>
            </HtmlTooltip>
          );
        }

        return (
          <IconButton onClick={() => openCancelModal(params.row)} disabled={!isEventActive}>
            <CancelIcon sx={{ color: isEventActive ? "red" : "gray" }} />
          </IconButton>
        );
      },
    },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  useEffect(() => {
    localStorage.setItem("previousPath", pathname);
    getData();
    getSchoolDetails()
    getFacilityData()
  }, []);

  useEffect(() => {
    getData();
  }, [
    paginationData.page,
    paginationData.pageSize,
    filterString, values.schoolId, values.eventDate, values.facility
  ]);
  const getData = async () => {
    const { eventDate, schoolId, facility } = values;
    const { page, pageSize } = paginationData;


    try {
      setPaginationData((prev) => ({
        ...prev,
        loading: true,
      }));

      let params = {
        page,
        page_size: pageSize,
        sort: "created_date",
        ...(schoolId && { school_id: schoolId }),
        ...(facility && { facility_type_id: facility }),
        ...(eventDate && { date: moment(eventDate).format("YYYY-MM-DD") }),
        ...(filterString && { keyword: filterString }),
      };

      let apiEndpoint = "/api/institute/fetchAllEventCreation";

      switch (pathname.toLowerCase()) {
        case "/eventmaster/events-user":
          params = {
            ...params,
            created_by: userId,
          };
          break;
        default:
          apiEndpoint = "/api/institute/fetchAllEventCreation"
      }

      const response = await axios.get(apiEndpoint, { params });

      const { content, totalElements } = response.data.data;
      const now = new Date();
      const filteredEvents = content?.filter(
        event => new Date(event?.event_end_time) < now && event?.approved_status === "Pending" && event?.summarize_status === null
      ) || [];
      setActiveEvents(filteredEvents?.length > 0 ? true : false);
      setPaginationData((prev) => ({
        ...prev,
        rows: content,
        total: totalElements,
        loading: false,
      }));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";

      setAlertMessage({
        severity: "error",
        message: errorMessage,
      });
      setAlertOpen(true);

      setPaginationData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  const getFacilityData = async () => {
    try {
      const res = await axios.get(`/api/getFacilityTypeBasedOnEvent`);

      const filteredData = res.data.data
        .map(obj => ({
          value: obj.facility_type_id,
          label: obj.facility_short_name,
        }));

      setFacilityNameOptions(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  // const getData = async () => {
  //   try {

  //     const res = await axios.get(
  //       `/api/institute/fetchAllEventCreation?page=${0}&page_size=${10000}&sort=created_date&created_by=${userId}`
  //     );
  //     if(pathname.toLowerCase() === `/studentdetailsmaster/studentsdetailsview`)
  //       {

  //       }
  //     setRows(res.data.data);
  //     const now = new Date();

  //     const filteredEvents = res?.data?.data?.filter(
  //       event => new Date(event?.event_end_time) < now && event?.approved_status === "Pending"
  //     ) || [];

  //     console.log(filteredEvents, "filteredEvents");

  //     setActiveEvents(filteredEvents?.length > 0 ? true : false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };


  const handleCancel = async (e) => {
    const temp = {};
    temp.active = true;
    temp.approved_date = new Date();
    temp.approved_status = "Cancelled";
    temp.remarks = values.remarks;
    temp.event_id = rowData.id;
    temp.event_name = rowData.event_name;
    temp.event_sub_name = rowData.event_sub_name;
    temp.event_description = rowData.event_description;
    temp.guest_name = rowData.guest_name;
    temp.is_common = rowData.is_common;
    temp.event_start_time = rowData.event_start_time;
    temp.event_end_time = rowData.event_end_time;
    temp.school_id = rowData.school_id;
    temp.roomId = rowData.roomId;

    await axios
      .put(`/api/institute/eventCreation/${rowData.id}`, temp)
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Cancelled Successfully",
          });
          setCancelModalOpen(false);
          getData();
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
          message: error.response.data.message,
        });
      });
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/institute/eventCreation/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/institute/activateEventCreation/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
        title: "Deactivate",
        message: "Do you want to make it Inactive?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
        ],
      })
      : setModalContent({
        title: "",
        message: "Do you want to make it Active?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
        ],
      });
    setModalOpen(true);
  };
  const deleteFile = (e) => {
    const s = fileSelected.filter((item, index) => index !== e);
    setFileSelected(s);
  };

  const handleChange = (e) => {
    if (e?.target?.value?.length > maxLength) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (let i = 0; i < fileSelected.length; i++) {
      formData.append(`file`, fileSelected[i]);
    }
    formData.append("event_id", rowData.id);
    formData.append("image_upload_timing", "After");
    formData.append("active", true);
    await axios
      .post(`/api/institute/eventImageAttachmentsUploadFile`, formData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Image Uploaded Successfully",
          });
          setAlertOpen(true);
          setImageUploadOpen(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  const uploadMultiFiles = (e) => {
    const files = Array.from(e.target.files);
    setFileSelected(files);
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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
              value={values?.remarks}
              name="remarks"
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              disableElevation
              sx={{ position: "absolute", right: 40, borderRadius: 2 }}
              onClick={handleCancel}
            >
              <strong>Submit</strong>
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };

  const openCancelModal = async (data) => {
    setCancelModalOpen(true);
    setRowData(data);
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
      value.items.length > 0
        ? value.items[0].value === undefined
          ? ""
          : value.items[0].value
        : value.quickFilterValues.join(" ")
    );
  };
  const updateEvent = async () => {
    if (!values?.eventSummary || values?.eventSummary?.trim() === "") {
      setAlertMessage({
        severity: "error",
        message: "Event Summary is required",
      });
      setAlertOpen(true);
      return;
    }

    if (!values?.summarize_status) {
      setAlertMessage({
        severity: "error",
        message: "Summarize Status is required",
      });
      setAlertOpen(true);
      return;
    }
    const temp = {};
    temp.event_id = details.id;
    temp.summarize = values.eventSummary;
    temp.summarize_status = values.summarize_status;

    await axios
      .put(`/api/institute/updateEventCreation/${details.id}`, temp)
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Update Successfully",
          });
          setsummaryModalOpen(false);
          getData();
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
          message: error.response.data.message,
        });
      });
  };

  const onClose = () => {
    setsummaryModalOpen(false)
    setValues({ remarks: "", eventSummary: "", summarize_status: "" })
  };
  const PdfViewer = () => {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <embed src={Reservation_Policy} width="100%" height="100%" type="application/pdf" />
      </div>
    );
  };
  return (
    <>
      <ModalWrapper
        title="Auditorium and Seminar Reservation Policy"
        open={auditoriumOpen}
        setOpen={setAuditoriumOpen}
      >
        {<PdfViewer />}
      </ModalWrapper>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper
        maxWidth={500}
        title="Cancel Request"
        open={cancelModalOpen}
        setOpen={setCancelModalOpen}
      >
        {cancelData()}
      </ModalWrapper>
      <ModalWrapper
        maxWidth={800}
        title="Event Summary"
        open={summaryModalOpen}
        setOpen={onClose}
      >
        <Grid
          container
          rowSpacing={1}
          columnSpacing={4}
          justifyContent="center"
          alignItems="center"
          padding={3}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="eventSummary"
              label="Summarise Event Activity"
              value={values.eventSummary}
              handleChange={handleChange}
              checks={checks.eventSummary}
              errors={errorMessages.eventSummary}
              multiline
              helperText={`Remaining characters : ${getRemainingCharacters(
                "eventSummary"
              )}`}
              rows={2}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="summarize_status"
              label="Event Status"
              value={values.summarize_status}
              options={statusData}
              handleChangeAdvance={handleChangeAdvance}
              errors={errorMessages.summarize_status}
              checks={checks.summarize_status}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              disableElevation
              sx={{ position: "absolute", right: 40, borderRadius: 2 }}
              onClick={() => updateEvent()}
              disabled={details?.summarize_status ? true : false}
            >
              <strong>Submit</strong>
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        maxWidth={1700}
        open={imageOpen}
        setOpen={setImageUploadOpen}
        title="Upload Images"
      >
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} align="center">
            <div
              className={classes.dropFileInput}
              ref={wrapperRef}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input
                type="file"
                onChange={uploadMultiFiles}
                className={classes.input}
                multiple
              />
              <CloudUploadIcon sx={{ color: "auzColor.main", fontSize: 50 }} />

              <p className={classes.labelText}>
                Drop your
                <span style={{ fontWeight: 500, fontSize: "0.90rem" }}>
                  {"  " + "files" + "  "}
                </span>
                here or
                <span style={{ color: "auzColor.main", fontWeight: 500 }}>
                  {" "}
                  browse
                </span>
              </p>
            </div>
          </Grid>

          {fileSelected.map((file, index) => {
            return (
              <>
                <Grid item xs={12} md={2.4}>
                  <Paper
                    elevation={5}
                    sx={{
                      width: 300,
                      height: 180,
                      marginTop: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Grid container sx={{ background: "#edeff7" }}>
                      <Grid item xs={12} align="right">
                        <IconButton
                          aria-label="settings"
                          onClick={() => deleteFile(index)}
                          color="primary"
                        >
                          <HighlightOffIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                        <img
                          style={{ width: 300, height: 180 }}
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt="..."
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </>
            );
          })}
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            sx={{ borderRadius: 2 }}
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        maxWidth={1100}
        open={imageViewOpen}
        setOpen={setImageViewOpen}
        title="Uploaded Images"
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          {loading ? (
            <Grid item xs={12} align="center">
              <IconButton>
                <CircularProgress />
              </IconButton>
              <Typography>Please wait your images are loading...</Typography>
            </Grid>
          ) : fileURL.length > 0 ? (
            fileURL.map((item, index) => {
              return (
                <>
                  <Grid container xs={12} md={3} key={index} mt={2}>
                    <img src={item} style={{ height: 240, width: 240 }}></img>
                  </Grid>
                </>
              );
            })
          ) : (
            <>
              <Grid item xs={12} align="center">
                <Typography color="error" variant="subtitle2">
                  No photos found
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </ModalWrapper>
      <Box>
        <Grid
          container
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={4}
          mt={1}
        >
          {pathname.toLowerCase() !== "/eventmaster/events-user" && <><Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="facility"
                label="Facility"
                options={facilityNameOptions}
                value={values.facility}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={2} display="flex" alignItems="center">
              <CustomDatePicker
                name="eventDate"
                label="Event Date"
                value={values.eventDate}
                handleChangeAdvance={handleChangeAdvance}
                clearIcon={true}
              />
            </Grid>
            <Grid item xs={12} md={1.5}>

            </Grid></>}
          {pathname.toLowerCase() === "/eventmaster/events-user" && <> <Grid display="flex" item xs={12} md={9.5}>
          </Grid></>}
          <Grid item xs={12} md={2} display="flex" alignItems="center" justifyContent="flex-end">
            <Box display="flex" gap={2} width="100%">
              <Button
                onClick={() => setAuditoriumOpen(true)}
                variant="contained"
                disableElevation
                sx={{
                  flex: 1,
                  minWidth: "120px",
                  borderRadius: 4,
                  paddingX: 3,
                  paddingY: 1.5,
                  fontWeight: "bold",
                  fontSize: "12px",
                  letterSpacing: "0.5px",
                  textTransform: "none",
                  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                  color: "white",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                Read SOP
              </Button>
              <Button
                onClick={() => {
                  if (activeEvents) {
                    setAlertMessage({
                      severity: "error",
                      message: "Please provide a summary of the previous event.",
                    });
                    setAlertOpen(true);
                    return;
                  } else {
                    navigate("/EventMaster/Event/New", { state: pathname });
                  }
                }}
                variant="contained"
                disableElevation
                sx={{
                  flex: 1,
                  minWidth: "120px",
                  borderRadius: 4,
                  paddingX: 3,
                  paddingY: 1.5,
                  fontWeight: "bold",
                  fontSize: "12px",
                  letterSpacing: "0.5px",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
                startIcon={<AddIcon />}
              >
                Create
              </Button>
            </Box>
          </Grid>


          <Grid item xs={12} md={12} >
            <GridIndex
              rows={paginationData.rows}
              columns={columns}
              rowCount={paginationData.total}
              page={paginationData.page}
              pageSize={paginationData.pageSize}
              handleOnPageChange={handleOnPageChange}
              handleOnPageSizeChange={handleOnPageSizeChange}
              loading={paginationData.loading}
              handleOnFilterChange={handleOnFilterChange}
            />
            {/* <GridIndex rows={rows} columns={columns} /> */}
          </Grid>
        </Grid>
      </Box>

    </>
  );
}
export default EventCreationIndex;
