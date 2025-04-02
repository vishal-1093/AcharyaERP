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
  IconButton,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import { GridActionsCellItem } from "@mui/x-data-grid";
import PrintIcon from "@mui/icons-material/Print";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import ModalWrapper from "../../../components/ModalWrapper";
import AssignTransport from "../../../pages/forms/studentDetailMaster/AssignTransport";
import useAlert from "../../../hooks/useAlert";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import { CustomDataExport } from "../../../components/CustomDataExport";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Person4Rounded } from "@mui/icons-material";
import { convertDateFormat } from "../../../utils/Utils";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

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

function InactiveStudentsIndex() {
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
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
      acharya_email: false,    
      program_short_name: false,
      created_username: false, 
      program_specialization_short_name: false, 
      created_date: false, 
      csa_approved_remarks: false, 
    });

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
      field: "acharya_email",
      headerName: "Email",
      width: 150,
    //  hide: true,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.acharya_email}>
          <span>{params?.row?.acharya_email?.substr(0, 20) + "..."}</span>
        </HtmlTooltip>
      ),
    },
    { 
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
    //  hide: true
     },

    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    //  hide: true,
    },
    {
      field: "date_of_admission",
      headerName: "DOA",
      flex: 1,
      valueGetter: (value, row) =>
        row.date_of_admission
          ? convertDateFormat(row.date_of_admission)
          : "--",
    },
    {
      field: "csa_approved_date",
      headerName: "DOC",
      flex: 1,
      // type: "date",
      valueGetter: (value, row) =>
        row.csa_approved_date
          ? convertDateFormat(row.csa_approved_date)
          : "",
    },
    { field: "csa_remarks", headerName: "Initiated Remarks", flex: 1 },
    // { field: "branch", headerName: "Branch", flex: 1 },
    {
      field: "created_username",
      headerName: "Initiated By",
      flex: 1,
     // type: "date",
      hide: true,
      valueGetter: (value, row) =>
        row.created_username ? row.created_username : "--",
    },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
     // type: "date",
    //  hide: true,
      valueGetter: (value, row) =>
        row.created_date
          ? convertDateFormat(row.created_date)
          : "--",
    },
    {
      field: "approvedByName",
      headerName: "Approved By",
      flex: 1,
     // type: "date",

      valueGetter: (value, row) =>
        row.approvedByName ? row.approvedByName : "",
    },

    {
      field: "csa_approved_remarks",
      headerName: "Approved Remarks",
      flex: 1,
    //  hide: true,
      // type: "date",
      valueGetter: (value, row) =>
        row.csa_approved_remarks ? row.csa_approved_remarks : "",
    },

    {
      field: "fee_admission_category_short_name",
      headerName: "Admission Category",
      flex: 1,
      renderCell: (params) => (
        <Link
          to={`/CandidateContractPdf/${params.row.candidate_id}`}
          style={{ textDecoration: "none" }}
          target="_blank"
        >
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{ cursor: "pointer", textTransform: "capitalize" }}
            onClick={() => navigate()}
          >
            {params.row.fee_admission_category_short_name}
          </Typography>
        </Link>
      ),
    },

    {
      field: "Cancelled_Details",
      headerName: "Cancelled Details",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            color="primary"
            onClick={() =>
              navigate(`/cancelStudentDeatils`, { state: { id: params?.row } })
            }
          >
            {params?.row?.id ? <RemoveRedEyeIcon fontSize="small" /> : ""}
          </IconButton>
        );
      },
    },
    // {
    //   field: "active",
    //   headerName: "Action",
    //   type: "actions",
    //   hideable: false,
    //   getActions: (params) => {
    //     const actionList = [
    //       <GridActionsCellItem
    //         icon={<PrintIcon sx={{ color: "auzColor.main", fontSize: 18 }} />}
    //         label="Transcript Print"
    //         component={Link}
    //         to={`/StudentDocumentCollectionPdf/${params.row.id}`}
    //         target="_blank"
    //         showInMenu
    //       />,
    //       <GridActionsCellItem
    //         icon={
    //           <LibraryBooksIcon sx={{ color: "auzColor.main", fontSize: 18 }} />
    //         }
    //         label="Document Collection"
    //         onClick={() => navigate(`/DocumentCollection/${params.row.id}`)}
    //         showInMenu
    //       />,
    //       <GridActionsCellItem
    //         icon={
    //           <DirectionsBusFilledIcon
    //             sx={{ color: "auzColor.main", fontSize: 18 }}
    //             fontSize="small"
    //           />
    //         }
    //         label="Assign Transport"
    //         onClick={() => handleTransport(params.row)}
    //         showInMenu
    //       />,
    //       <GridActionsCellItem
    //         icon={<PrintIcon sx={{ color: "auzColor.main", fontSize: 18 }} />}
    //         label="Application Print"
    //         component={Link}
    //         to={`/StudentDetailsPdf/${params.row.id}`}
    //         target="_blank"
    //         showInMenu
    //       />,

    //     ];

    //     if (params.row.reporting_id !== null) {
    //       actionList.push(
    //         <GridActionsCellItem
    //           icon={
    //             <AssignmentIcon
    //               sx={{ color: "auzColor.main", fontSize: 18 }}
    //               fontSize="small"
    //             />
    //           }
    //           label="Assign Course"
    //           onClick={() => handleCourseAssign(params.row)}
    //           showInMenu
    //         />
    //       );
    //     }

    //     if (params.row.deassign_status === null || params.row.deassign_status === 2) {
    //       actionList.push(
    //         <GridActionsCellItem
    //         icon={
    //           <PersonRemoveIcon sx={{ color: "auzColor.main", fontSize: 18 }} />
    //         }
    //         label="Cancel Admission"
    //         onClick={() => navigate(`/canceladmissioninitiate/${params.row.id}`)}
    //         showInMenu
    //       />,
    //       );
    //     }else{
    //       actionList.push(
    //       <GridActionsCellItem
    //       icon={
    //         <Person4Rounded sx={{ color: "auzColor.main", fontSize: 18 }} />
    //       }
    //       label="Cancel Admission Initiated"

    //       showInMenu
    //     />,
    //     );
    //     }
    //     return actionList;
    //   },
    // },
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
        `/api/studentDetailsInactiveIndex?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date&ac_year_id=${values.acyearId}${searchString}`
      )
        .then((res) => {
          getAllRecords(res.data.data.Paginated_data.totalElements);
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

  const getAllRecords = async (pageSize) => {
    const searchString = filterString !== "" ? "&keyword=" + filterString : "";

    await axios(
      `/api/studentDetailsInactiveIndex?page=0&page_size=${pageSize}&sort=created_date&ac_year_id=${values.acyearId}${searchString}`
    )
      .then((res) => {
        setAllrecords(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
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
            value: obj.id,
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
  return (
    <Box mt={2}>
      {/* Transport Assign   */}
      <ModalWrapper
        open={transportWrapperOpen}
        setOpen={setTransportWrapperOpen}
        maxWidth={1000}
        title={"Assign Transport (" + rowData?.student_name + ")"}
      >
        <AssignTransport
          values={values}
          academicYearOptions={academicYearOptions}
          handleChangeAdvance={handleChangeAdvance}
          pickUpPointOptions={pickUpPointOptions}
          handleChange={handleChange}
          handleAssign={handleAssign}
          validation={validation}
          history={history}
        />
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

      {allRecords.length > 0 && (
        <CustomDataExport dataSet={allRecords} titleText="Student Details" />
      )}
      {/* Index  */}
      <Grid container rowSpacing={1}>
        {/* <Grid item xs={12}>
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
        </Grid> */}

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
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default InactiveStudentsIndex;
