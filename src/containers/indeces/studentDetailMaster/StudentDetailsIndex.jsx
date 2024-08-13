import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
  CircularProgress,
  IconButton,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import { GridActionsCellItem } from "@mui/x-data-grid";
import PrintIcon from "@mui/icons-material/Print";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import ModalWrapper from "../../../components/ModalWrapper";
// import AssignTransport from "../../../pages/forms/studentDetailMaster/AssignTransport";
import useAlert from "../../../hooks/useAlert";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import { CustomDataExport } from "../../../components/CustomDataExport";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Person4Rounded } from "@mui/icons-material";
import PortraitIcon from "@mui/icons-material/Portrait";
import { GenerateTranscriptPdf } from "../../../pages/forms/studentDetailMaster/GenerateTranscriptPdf";
import { GenerateProvisionalCertificate } from "../../../pages/forms/studentDetailMaster/GenerateProvisionalCertificate";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import AddBoxIcon from "@mui/icons-material/AddBox";

const initialValues = {
  acyearId: null,
  auid: "",
  transportAcyearId: null,
  pickUpPoints: null,
  stageName: "",
  amount: "",
  remarks: "",
  stageNumber: "",
  stageRouteId: null,
  courseId: [],
  assignedId: [],
  studentAuid: "",
  isOpenUsnUpdateModal: false,
  usn: "",
  usnLoading: false,
};

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    // border: "1px solid rgba(224, 224, 224, 1)",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
  },
}));

function StudentDetailsIndex() {
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 50,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [transportWrapperOpen, setTransportWrapperOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const [pickUpPointOptions, setPickUpPointOptions] = useState([]);
  const [validation, setValidation] = useState("");
  const [history, setHistory] = useState([]);
  const [courseWrapperOpen, setCourseWrapperOpen] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [allRecords, setAllrecords] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    {
      field: "student_name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{ cursor: "pointer", textTransform: "capitalize" }}
          onClick={() =>
            navigate(`/StudentDetailsMaster/StudentsDetails/${params.row.id}`)
          }
        >
          {params.row.student_name}
        </Typography>
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1 },
    {
      field: "usn",
      headerName: "USN",
      flex: 1,
      renderCell: (params) =>
        params.row.usn === null ? (
          <IconButton onClick={() => onClickUsn(params)}>
            <AddBoxIcon />
          </IconButton>
        ) : (
          <Typography
            variant="subtitle2"
            color="primary"
            onClick={(e) => onClickUsn(params)}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {params.row?.usn}
          </Typography>
        ),
    },
    {
      field: "application_no_npf",
      headerName: "Application No",
      flex: 1,
      hide: true,
    },
    {
      field: "acharya_email",
      headerName: "Email",
      width: 150,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.acharya_email}>
          <span>{params?.row?.acharya_email?.substr(0, 20) + "..."}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      renderCell: (params) => {
        const mobile = params.row?.mobile;
        if (mobile && mobile.length === 10) {
          const maskedMobile = `${mobile.slice(0, 2)}XXXXXX${mobile.slice(8)}`;
          return <>{maskedMobile}</>;
        } else if (mobile && mobile.length === 13) {
          const maskedMobile = `${mobile.slice(0, 5)}XXXXXX${mobile.slice(8)}`;
          return <>{maskedMobile}</>;
        }
        return <>{mobile ? mobile : ""}</>;
      },
    },
    { field: "program_short_name", headerName: "Program", flex: 1 },

    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "date_of_admission", headerName: "DOA", flex: 1 },
    {
      field: "fee_admission_category_short_name",
      headerName: "Admission Category",
      flex: 1,
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "active",
      headerName: "Action",
      type: "actions",
      hideable: false,
      getActions: (params) => {
        const actionList = [
          <GridActionsCellItem
            icon={<PrintIcon sx={{ color: "primary.main", fontSize: 18 }} />}
            label="Transcript Print"
            component={Link}
            onClick={() => handleDocumentCollection(params.row.id)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<PrintIcon sx={{ color: "primary.main", fontSize: 18 }} />}
            label="Provisional Admission Certificate"
            component={Link}
            onClick={() => handleProvisionalCertificate(params.row.id)}
            showInMenu
          />,
          // <GridActionsCellItem
          //   icon={
          //     <LibraryBooksIcon sx={{ color: "auzColor.main", fontSize: 18 }} />
          //   }
          //   label="Document Collection"
          //   onClick={() => navigate(`/DocumentCollection/${params.row.id}`)}
          //   showInMenu
          // />,
          // <GridActionsCellItem
          //   icon={
          //     <DirectionsBusFilledIcon
          //       sx={{ color: "auzColor.main", fontSize: 18 }}
          //       fontSize="small"
          //     />
          //   }
          //   label="Assign Transport"
          //   onClick={() => handleTransport(params.row)}
          //   showInMenu
          // />,
          // <GridActionsCellItem
          //   icon={<PrintIcon sx={{ color: "auzColor.main", fontSize: 18 }} />}
          //   label="Application Print"
          //   component={Link}
          //   to={`/StudentDetailsPdf/${params.row.id}`}
          //   target="_blank"
          //   showInMenu
          // />,
          // params.row.course_approver_status === 2 ? (
          //   <GridActionsCellItem
          //     icon={
          //       <HighlightOff
          //         sx={{ color: "auzColor.main", fontSize: 18, cursor: "none" }}
          //       />
          //     }
          //     label="COC Initiated"
          //     showInMenu
          //   />
          // ) : (
          //   <GridActionsCellItem
          //     icon={
          //       <PortraitIcon sx={{ color: "auzColor.main", fontSize: 18 }} />
          //     }
          //     label="Change Of Course"
          //     onClick={() => navigate(`/ChangeOfCourse/${params.row.id}`)}
          //     showInMenu
          //   />
          // ),
        ];

        if (params.row.reporting_id !== null) {
          actionList.push(
            <GridActionsCellItem
              icon={
                <AssignmentIcon
                  sx={{ color: "primary.main", fontSize: 18 }}
                  fontSize="small"
                />
              }
              label="Assign Course"
              onClick={() => handleCourseAssign(params.row)}
              showInMenu
            />
          );
        }

        // if (
        //   params.row.deassign_status === null ||
        //   params.row.deassign_status === 2
        // ) {
        //   actionList.push(
        //     <GridActionsCellItem
        //       icon={
        //         <PersonRemoveIcon
        //           sx={{ color: "auzColor.main", fontSize: 18 }}
        //         />
        //       }
        //       label="Cancel Admission"
        //       onClick={() =>
        //         navigate(`/canceladmissioninitiate/${params.row.id}`)
        //       }
        //       showInMenu
        //     />
        //   );
        // } else {
        //   actionList.push(
        //     <GridActionsCellItem
        //       icon={
        //         <Person4Rounded sx={{ color: "auzColor.main", fontSize: 18 }} />
        //       }
        //       label="Cancel Admission Initiated"
        //       showInMenu
        //     />
        //   );
        // }
        return actionList;
      },
    },
  ];

  useEffect(() => {
    getAcademicYears();
  }, []);

  useEffect(() => {
    getData();
  }, [
    paginationData.page,
    paginationData.pageSize,
    filterString,
    values.acyearId,
  ]);

  useEffect(() => {
    getPickUpPointsByAcYear();
  }, [values.transportAcyearId]);

  useEffect(() => {
    getDataBasedOnPickupPoint();
  }, [values.pickUpPoints]);

  const getData = async () => {
    if (values.acyearId) {
      setPaginationData((prev) => ({
        ...prev,
        loading: true,
      }));

      const searchString =
        filterString !== "" ? "&keyword=" + filterString : "";

      await axios(
        `/api/student/studentDetailsIndex?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date&ac_year_id=${values.acyearId}${searchString}`
      )
        .then((res) => {
          // getAllRecords(res.data.data.Paginated_data.totalElements);
          setPaginationData((prev) => ({
            ...prev,
            rows: res.data.data.Paginated_data.content,
            total: res.data.data.Paginated_data.totalElements,
            loading: false,
          }));
        })
        .catch((err) => console.error(err));
    }
  };

  const getAcademicYears = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const getLatestYear = Math.max(
          ...res.data.data.map((obj) => obj.current_year)
        );
        const getLatestYearId = res.data.data.filter(
          (obj) => obj.current_year === getLatestYear
        );

        setValues((prev) => ({
          ...prev,
          acyearId:
            getLatestYearId.length > 0 ? getLatestYearId[0].ac_year_id : "",
        }));

        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((err) => console.error(err));
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

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleTransport = async (data) => {
    setValues((prev) => ({
      ...prev,
      transportAcyearId: null,
      pickUpPoints: null,
      stageName: "",
      amount: "",
      remarks: "",
      stageNumber: "",
      stageRouteId: null,
    }));

    setValidation("");
    setTransportWrapperOpen(true);
    setRowData(data);

    await axios
      .get(`/api/employee/getTransportAssignedByAuid?auid=${data.auid}`)
      .then((res) => {
        setHistory(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getPickUpPointsByAcYear = async () => {
    if (values.transportAcyearId)
      await axios
        .get(
          `/api/employee/getPickUpByAcademicYearId/${values.transportAcyearId}`
        )
        .then((res) => {
          setPickUpPointOptions(
            res.data.data.map((obj) => ({
              value: obj.id,
              label: obj.pickUpPoint,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getDataBasedOnPickupPoint = async () => {
    if (values.pickUpPoints)
      await axios
        .get(`/api/employee/getStageByPickUpId/${values.pickUpPoints}`)
        .then((res) => {
          setValues((prev) => ({
            ...prev,
            amount: res.data.data.charges,
            stageNumber: res.data.data.stageRouteNumber,
            stageName: res.data.data.stageName,
            remarks: res.data.data.description,
            stageRouteId: res.data.data.id,
          }));
        })
        .catch((error) => console.error(error));
  };

  const handleAssign = async () => {
    const temp = {};
    temp.academicYear = values.transportAcyearId;
    temp.auid = rowData.auid;
    temp.description = values.remarks;
    temp.pickUpPoint = values.pickUpPoints;
    temp.stageRouteId = values.stageRouteId;

    await axios
      .post(`/api/employee/assignTransport`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Route Assigned",
          });
          setTransportWrapperOpen(false);
          getData();
          setValues((prev) => ({
            ...prev,
            transportAcyearId: null,
            pickUpPoints: null,
            stageName: "",
            amount: "",
            remarks: "",
            stageNumber: "",
            stageRouteId: null,
          }));
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((error) => {
        setValidation(error.response.data.message);
      });
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

  const handleCourseAssign = async (data) => {
    setValues((prev) => ({
      ...prev,
      ["courseId"]: [],
    }));
    setCourseWrapperOpen(true);
    setRowData(data);

    await axios
      .get(
        `/api/academic/fetchAllCourseDetail/${data.program_id}/${data.program_specialization_id}/${data.current_sem}`
      )
      .then((res) => {
        setCourseOptions(
          res.data.data.map((obj) => ({
            value: obj.course_assignment_id,
            label: obj.course_name_with_code,
          }))
        );
      })
      .catch((err) => console.error(err));
    // [1, 2][(1, 2, 3)][3];
    await axios
      .get(`/api/academic/getcoursesAssignedToStudent/${data.id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          ["assignedId"]: res.data.data,
          ["courseId"]: res.data.data,
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleCourseCreate = async () => {
    const temp = {};

    const newArray = values.courseId.filter(function (val) {
      return values.assignedId.indexOf(val) == -1;
    });

    temp.active = true;
    temp.stud_id = rowData.id;
    temp.course_assignment_ids = newArray;

    await axios
      .post(`/api/academic/assignMultipleCourseToStudent`, temp)
      .then((res) => {
        if (res.data.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Course assigned successfully !!",
          });
          setAlertOpen(true);
        } else {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err?.response?.data?.message,
        });
        setAlertOpen(true);
      });
    setCourseWrapperOpen(false);
  };

  const handleDocumentCollection = async (id) => {
    const transcriptData = await axios
      .get(`/api/student/getDataForTestimonials/${id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const blobFile = await GenerateTranscriptPdf(
      transcriptData.Student_details,
      transcriptData.Student_Transcript_Details
    );
    window.open(URL.createObjectURL(blobFile));
  };

  const handleProvisionalCertificate = async (id) => {
    const provisionalData = await axios
      .get(`/api/student/Student_DetailsAuid/${id}`)
      .then((res) => res.data.data[0])
      .catch((err) => console.error(err));

    const blobFile = await GenerateProvisionalCertificate(provisionalData);
    window.open(URL.createObjectURL(blobFile));
  };

  const onClickUsn = (params) => {
    setValues((prevState) => ({
      ...prevState,
      studentAuid: params.row?.auid,
      isOpenUsnUpdateModal: !values.isOpenUsnUpdateModal,
      usn: !!params.row?.usn ? params.row?.usn : "",
    }));
  };

  const handleUsnUpdateModal = () => {
    setValues((prevState) => ({
      ...prevState,
      isOpenUsnUpdateModal: !values.isOpenUsnUpdateModal,
      studentAuid: "",
    }));
  };

  const setUsnLoading = (val) => {
    setValues((prevState) => ({
      ...prevState,
      usnLoading: val,
    }));
  };

  const handleUsnUpdate = async () => {
    try {
      setUsnLoading(true);
      let payload = {
        auid: values.studentAuid,
        usn: values.usn,
      };
      const res = await axios.put(
        `/api/student/updateUsnDetailsData/${values.studentAuid}`,
        payload
      );
      if (res.status === 200 || res.status === 201) {
        setUsnLoading(false);
        handleUsnUpdateModal();
        getData();
        setAlertMessage({
          severity: "success",
          message: "Student usn updated successfully.",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      setUsnLoading(false);
      handleUsnUpdateModal();
      setAlertMessage({
        severity: "error",
        message: err?.response?.data?.message || "Error Occured",
      });
      setAlertOpen(true);
    }
  };

  console.log(values.courseId);

  return (
    <Box mt={2}>
      {/* Transport Assign   */}
      <ModalWrapper
        open={transportWrapperOpen}
        setOpen={setTransportWrapperOpen}
        maxWidth={1000}
        title={"Assign Transport (" + rowData?.student_name + ")"}
      >
        {/* <AssignTransport
          values={values}
          academicYearOptions={academicYearOptions}
          handleChangeAdvance={handleChangeAdvance}
          pickUpPointOptions={pickUpPointOptions}
          handleChange={handleChange}
          handleAssign={handleAssign}
          validation={validation}
          history={history}
        /> */}
      </ModalWrapper>

      {/* Assign Course  */}
      <ModalWrapper
        open={courseWrapperOpen}
        setOpen={setCourseWrapperOpen}
        maxWidth={600}
        title={"Assign Course (" + rowData?.student_name + ")"}
      >
        <Box mt={2} p={3}>
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <CustomMultipleAutocomplete
                name="courseId"
                label="Course"
                options={courseOptions}
                value={values.courseId}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button variant="contained" onClick={handleCourseCreate}>
                Assign
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {!!values.isOpenUsnUpdateModal && (
        <ModalWrapper
          title="Update USN"
          maxWidth={400}
          open={values.isOpenUsnUpdateModal}
          setOpen={() => handleUsnUpdateModal()}
        >
          <Box component="form" overflow="auto" p={1}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              rowSpacing={4}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12} md={12}>
                <CustomTextField
                  name="usn"
                  label="USN"
                  value={values.usn}
                  handleChange={handleChange}
                  required
                />
                <Typography color="red" fontSize="10px" mt="5px">
                  {values.usn.length > 20
                    ? "Must not be longer than 20 characters"
                    : ""}
                </Typography>
              </Grid>
              <Grid item xs={12} align="right">
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  disabled={
                    values.usn === "" ||
                    values.usnLoading ||
                    values.usn.length > 20
                  }
                  onClick={handleUsnUpdate}
                >
                  {!!values.usnLoading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <strong>Update</strong>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </ModalWrapper>
      )}

      {allRecords.length > 0 && (
        <CustomDataExport dataSet={allRecords} titleText="Student Details" />
      )}
      {/* Index  */}
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="right">
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="acyearId"
                label="Ac Year"
                options={academicYearOptions}
                value={values.acyearId}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentDetailsIndex;
