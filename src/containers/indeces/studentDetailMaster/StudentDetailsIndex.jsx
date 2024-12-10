import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { maskEmail, maskMobile } from "../../../utils/MaskData";
import ModalWrapper from "../../../components/ModalWrapper";
import AssignUsnForm from "../../../pages/forms/studentMaster/AssignUsnForm";
import moment from "moment";
import { GridActionsCellItem } from "@mui/x-data-grid";
import PrintIcon from "@mui/icons-material/Print";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation, useNavigate } from "react-router-dom";
import { HighlightOff } from "@mui/icons-material";
import PortraitIcon from "@mui/icons-material/Portrait";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Person4Rounded } from "@mui/icons-material";
import { GenerateProvisionalCertificate } from "../../../pages/forms/studentDetailMaster/GenerateProvisionalCertificate";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GenerateTranscriptPdf } from "../../../pages/forms/studentDetailMaster/GenerateTranscriptPdf";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import { CustomDataExport } from "../../../components/CustomDataExport";

const initialValues = {
  acyearId: null, schoolId: null, programId: null, programSpeId: null, categoryId: null
};
const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const breadCrumbsList = [
  { name: "Student Master" },
  { name: "Inactive Students" },
];
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function StudentDetailsIndex() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 100,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");
  const [usnModal, setUsnModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [printLoading, setPrintLoading] = useState(false);
  const [courseWrapperOpen, setCourseWrapperOpen] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [allRecords, setAllrecords] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getAcademicYears();
    getSchoolDetails()
    if ((pathname.toLowerCase() === "/student-master-user" || pathname.toLowerCase() === "/student-master-inst" || pathname.toLowerCase() === "/student-master-dept")) {
      getUserSchoolDetails()
    }
    setCrumbs(breadCrumbsList);
  }, [pathname]);

  useEffect(() => {
    getData();
  }, [
    paginationData.page,
    paginationData.pageSize,
    filterString,
    values.acyearId,
  ]);

  useEffect(() => {
    getProgram()
    getData();
  }, [values.schoolId]);

  useEffect(() => {
    getData();
    getCategoryDetails()
  }, [values.programId]);

  useEffect(() => {
    getData();
  }, [values.categoryId]);

  const getCategoryDetails = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_short_name,
          });
        });
        setCategoryOptions(optionData);
      })
      .catch((err) => console.error(err));
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
  const getUserSchoolDetails = async () => {
    await axios
      .get(`/api/employee/getDeptIdAndSchoolIdBasedOnUser/${userID}`)
      .then((res) => {
        console.log(res?.data, "V");
        setUserData(res?.data?.data)
        setValues((prev) => ({
          ...prev,
          schoolId: res?.data?.data?.school_id,
        }));

      })
      .catch((err) => console.error(err));
  };
  const getProgram = async () => {
    const { schoolId } = values;
    if (!schoolId) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});
      setProgramOptions(optionData);
      setProgramData(programObject);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the programs data",
      });
      setAlertOpen(true);
    }
  };
  const getAcademicYears = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = [];
      const ids = [];
      response.data.data.forEach((obj) => {
        optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        ids.push(obj.current_year);
      });
      const latestYear = Math.max(...ids);
      const latestYearId = response.data.data.filter(
        (obj) => obj.current_year === latestYear
      );
      setAcademicYearOptions(optionData);
      setValues((prev) => ({
        ...prev,
        acyearId: latestYearId[0].ac_year_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };
  const getData = async () => {
    const { acyearId, schoolId, programId, categoryId } = values;
    const { page, pageSize } = paginationData;

    if (!acyearId) return;

    try {
      setPaginationData((prev) => ({
        ...prev,
        loading: true,
      }));

      let params = {
        page,
        page_size: pageSize,
        sort: "created_date",
        ac_year_id: acyearId,
        ...(schoolId && { school_id: schoolId }),
        ...(categoryId && { fee_admission_category_id: categoryId }),
        ...(programId && { program_id: programData[values?.programId]?.program_id }),
        ...(programId && { program_specialization_id: programId }),
        ...(filterString && { keyword: filterString }),
      };

      let apiEndpoint = "/api/student/studentDetailsIndex";

      switch (pathname.toLowerCase()) {
        case "/student-master-user":
          params = {
            ...params,
            userId: userID,
          };
          break;

        case "/student-master-inst":
          params = {
            ...params,
          };
          break;

        case "/student-master-dept":
          apiEndpoint = "/api/student/studentDetailsByDept";
          params = {
            ...params,
            pageSize: params.page_size,
            acYearId: params.ac_year_id,
            dept_id: userData?.dept_id,
          };
          delete params.page_size;
          delete params.ac_year_id;
          delete params.school_id;
          break;

        case "/student-master-intl":
          params = {
            ...params,
            fee_admission_category_id: 2
          };
          break;

        default:
          apiEndpoint = "/api/student/studentDetailsIndex";
      }

      const response = await axios.get(apiEndpoint, { params });

      const { content, totalElements } = response.data.data.Paginated_data;

      if (totalElements > 0) {
        getAllRecords(totalElements);
      }

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

  const getAllRecords = async (pageSize) => {
    const searchString = filterString !== "" ? "&keyword=" + filterString : "";

    await axios(
      `/api/student/studentDetailsIndexCustomExpoet?page=0&page_size=${pageSize}&sort=created_by&ac_year_id=${values.acyearId}${searchString}`
    )
      .then((res) => {
        setAllrecords(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };
  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "schoolId" && { programId: "", categoryId: "" }),
      ...(name === "programId" && { categoryId: "" }),
    }));
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

  const handleUpdateUsn = (data) => {
    setRowData(data);
    setUsnModal(true);
  };
  const handleProvisionalCertificate = async (data) => {
    setPrintLoading(true);
    const blobFile = await GenerateProvisionalCertificate(data);
    window.open(URL.createObjectURL(blobFile));
    setPrintLoading(false);
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

  const handleCOC = async (id) => {
    const cocPaidData = await axios
      .get(`/api/finance/changeOfCourseFeePaidStatusByStudentId/${id}`)
      .then((res) => res.data.data[0])
      .catch((err) => console.error(err));
    if (roleShortName !== "SAA" && cocPaidData?.cocPaidAmount === null) {
      setAlertMessage({
        severity: "error",
        message: "Change of course fee is not paid!!",
      });
      setAlertOpen(true);
    } else {
      navigate(`/course-change/${id}`, { state: { cocPaidData } });
    }
  };
  const handleInitiatedCOC = async (row) => {
    await axios
      .get(`/api/student/studentDetailsForChangeOfCourse/${row?.id}`)
      .then((res) => res.data.data[0])
      .then((cocDetails) => {
        navigate(`/course-change/${row?.id}`, { state: { cocDetails } });
      })
      .catch((err) => console.error(err));
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
  const columns = [
    { field: "candidate_id", headerName: "Candidate ID", flex: 1, hide: true },
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          onClick={() =>
            navigate(`/student-profile/${params.row.id}`, { state: true })
          }
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params.value.toLowerCase()}
        </Typography>
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1, minWidth: 120 },
    {
      field: "usn",
      headerName: "USN",
      flex: 1,
      renderCell: (params) =>
        params.value === null ? (
          <IconButton
            color="primary"
            onClick={() => handleUpdateUsn(params.row)}
            sx={{ padding: 0 }}
          >
            <AddBoxIcon />
          </IconButton>
        ) : (
          <Typography
            variant="subtitle2"
            onClick={() => handleUpdateUsn(params.row)}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "primary.main",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {params.value}
          </Typography>
        ),
    },
    {
      field: "application_no_npf",
      headerName: "Application No.",
      flex: 1,
      hide: true,
    },
    {
      field: "acharya_email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => (params.value ? maskEmail(params.value) : ""),
      hide: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      renderCell: (params) => (params.value ? maskMobile(params.value) : ""),
      hide: true,
    },
    {
      field: "date_of_admission",
      headerName: "DOA",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.date_of_admission).format("DD-MM-YYYY"),
    },
    {
      field: "school_name_short",
      headerName: "INST",
      flex: 1,
    },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.program_short_name} - ${params.row.program_specialization_short_name}`,
    },
    {
      field: "current_year_sem",
      headerName: "Year/Sem",
      flex: 1,
      type: "string",
      valueGetter: (params) =>
        params.row.current_year && params.row.current_sem
          ? `${params.row.current_year}/${params.row.current_sem}`
          : "",
    },
    {
      field: "fee_template_name",
      headerName: "Fee Template",
      flex: 1,
      hide: true,
    },
    { field: "Na_nationality", headerName: "Nationality", flex: 1, hide: true },
    { field: "religion", headerName: "Religion", flex: 1, hide: true },
    { field: "current_state", headerName: "State", flex: 1, hide: true },
    { field: "current_city", headerName: "City", flex: 1, hide: true },
    { field: "current_country", headerName: "Country", flex: 1, hide: true },
    {
      field: "fee_admission_category_short_name",
      headerName: "Category",
      flex: 1,
    },
    { field: "CounselorName", headerName: "Created By", flex: 1, },
    {
      field: "fee_admission_sub_category_short_name",
      headerName: "Sub Category",
      flex: 1,
      hide: true,
    },
    {
      field: "mentor",
      headerName: "Mentor",
      flex: 1,
      hide: pathname.toLowerCase() === "/student-master-user" ? true : false,
    },
    {
      field: "Provisional",
      headerName: "Provisional",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleProvisionalCertificate(params.row)}
          title="Approved"
          sx={{ padding: 0 }}
        >
          <RemoveRedEyeIcon color="primary" />
        </IconButton>
      ),
    },
    { field: "notes", headerName: "Notes", flex: 1, hide: true },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => navigate(`/std-update/${params.row.id}`)}>
          <EditIcon fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "active",
      headerName: "Action",
      type: "actions",
      hideable: false,
      getActions: (params) => {
        const actionList = [
          <GridActionsCellItem
            icon={<PrintIcon sx={{ color: "auzColor.main", fontSize: 18 }} />}
            label="Transcript"
            // component={Link}
            // onClick={() => handleDocumentCollection(params.row.id)}
            onClick={() =>
              navigate(`/StudentDocumentCollectionPdf/${params.row.id}`)
            }
            showInMenu
          />,
          <GridActionsCellItem
            icon={
              <LibraryBooksIcon sx={{ color: "auzColor.main", fontSize: 18 }} />
            }
            label="Document Collection"
            onClick={() =>
              navigate(`/student-master/DocumentCollection/${params.row.id}`)
            }
            showInMenu
          />,
          params.row.course_approver_status === 2 ? (
            <GridActionsCellItem
              icon={
                <HighlightOff
                  sx={{ color: "red", fontSize: 18, cursor: "none" }}
                />
              }
              sx={{ color: "red" }}
              label="COC Initiated"
              onClick={() => handleInitiatedCOC(params.row)}
              showInMenu
            />
          ) : (
            <GridActionsCellItem
              icon={
                <PortraitIcon sx={{ color: "auzColor.main", fontSize: 18 }} />
              }
              label="Change Of Course"
              onClick={() => handleCOC(params.row.id)}
              showInMenu
            />
          ),
        ];

        if (params.row.reporting_id !== null) {
          actionList.push(
            <GridActionsCellItem
              icon={
                <AssignmentIcon
                  sx={{ color: "auzColor.main", fontSize: 18 }}
                  fontSize="small"
                />
              }
              label="Assign Course"
              onClick={() => handleCourseAssign(params.row)}
              showInMenu
            />
          );
        }

        if (
          params.row.deassign_status === null ||
          params.row.deassign_status === 2
        ) {
          actionList.push(
            <GridActionsCellItem
              icon={
                <PersonRemoveIcon
                  sx={{ color: "auzColor.main", fontSize: 18 }}
                />
              }
              label="Cancel Admission"
              onClick={() =>
                navigate(`/initiate-canceladmission/${params.row.id}`)
              }
              showInMenu
            />
          );
        } else {
          actionList.push(
            <GridActionsCellItem
              icon={
                <Person4Rounded sx={{ color: "auzColor.main", fontSize: 18 }} />
              }
              label="Admission Cancellation Initiated"
              showInMenu
            />
          );
        }
        return actionList;
      },
    },
  ];
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
    <>
      {/* Assign USN  */}
      <ModalWrapper
        title="Update USN"
        maxWidth={500}
        open={usnModal}
        setOpen={setUsnModal}
      >
        <AssignUsnForm
          rowData={rowData}
          setUsnModal={setUsnModal}
          getData={getData}
        />
      </ModalWrapper>
      <Box>
        <Grid container alignItems="center" gap={3}>
          <Grid item xs={2}>
            <CustomAutocomplete
              name="acyearId"
              options={academicYearOptions}
              value={values.acyearId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />

          </Grid>
          {pathname.toLowerCase() !== "/student-master-dept" && (
            <>
              {!(pathname.toLowerCase() === "/student-master-inst") && (
                <Grid item xs={12} md={2}>
                  <CustomAutocomplete
                    name="schoolId"
                    label="School"
                    value={values.schoolId}
                    options={schoolOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    disabled={!values.acyearId}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  name="programId"
                  label="Program"
                  options={programOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  value={values.programId}
                  disabled={!values.schoolId}
                />
              </Grid>
              {pathname.toLowerCase() !== "/student-master-intl" && <Grid item xs={2}>
                <CustomAutocomplete
                  name="categoryId"
                  label="Category"
                  options={categoryOptions}
                  value={values.categoryId}
                  handleChangeAdvance={handleChangeAdvance}
                  disabled={!values.programId}
                />
              </Grid>}
            </>
          )}

          <Grid item xs={2} alignItems="center">
            {roleShortName === "SAA" && allRecords.length > 0 && (
              <CustomDataExport
                dataSet={allRecords}
                titleText="Student Details"
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: { xs: 10, md: 3 } }}>
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
      </Box>

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
    </>
  );
}

export default StudentDetailsIndex;
