import React, { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  IconButton,
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import moment from "moment";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import FormPaperWrapper from "../../components/FormPaperWrapper";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import FilterListIcon from "@mui/icons-material/FilterList";
import dayjs from "dayjs";
import useAlert from "../../hooks/useAlert";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ModalWrapper from "../../components/ModalWrapper";
import DOCView from "../../components/DOCView";

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  yearSem: null,
};
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const empID = sessionStorage.getItem("empId");

const StudentNoDue = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [noDueHistoryData, setNoDueHistoryData] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [programType, setProgramType] = useState([]);
  const [tab, setTab] = useState("NoDueList");
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);
  const [selectedMonth, setMonth] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const handleClickOpen = (params) => {
    if (params?.row.total_due === 0) {
      navigate(`/StudentNoDueForm/${params?.row?.student_id}`, {
        state: { row: params?.row },
      });
    } else {
      setAlertMessage({
        severity: "error",
        message: "Clear the due amount",
      });
      setAlertOpen(true);
    }
  };
  useEffect(() => {
    if (roleShortName !== "SAA") {
      getSchoolDetailsBasedOnEmpId();
    }
    // Fetch required data
  }, []);

  const getSchoolDetailsBasedOnEmpId = async () => {
    await axios
      .get(`/api/employee/getSchoolDetailsBasedOnEmpId/${empID}`)
      .then((res) => {
        const school_id = res.data.data.school_id;

        setValues((prev) => ({
          ...prev,
          schoolId: school_id,
        }));
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
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
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "npf_status", headerName: "Student Status", flex: 1 },
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
      field: "fee_admission_category_short_name",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "fee_admission_sub_category_short_name",
      headerName: "Sub Category",
      flex: 1,
    },
  ];

  if (tab === "NoDueList") {
    columns.push(
      {
        field: "attachment_download",
        headerName: "Download",
        flex: 1,
        hideable: false,
        renderCell: (params) => (
          <IconButton title="Download Document" sx={{ padding: 0 }}>
            <DownloadIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ),
      },
      {
        field: "update_student_status",
        headerName: "Update Student Status",
        flex: 1,
        renderCell: (params) => (
          <IconButton
            onClick={() => handleClickOpen(params)}
            title="Update Student Status"
            sx={{ padding: 0 }}
          >
            <AddBoxIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ),
      }
    );
  } else {
    columns.push(
      {
        field: "comment",
        headerName: "Comments",
        flex: 1,
      },
      {
        field: "date",
        headerName: "No Due Date",
        flex: 1,
      },
      {
        field: "created_date",
        headerName: "Created Date",
        flex: 1,
        renderCell: (params) =>
          moment(params.row.created_date).format("DD-MM-YYYY"),
      },
      {
        field: "attachment_path",
        headerName: "Upload Document",
        flex: 1,
        renderCell: (params) =>
          params.row.attachment_path ? (
            <IconButton
              onClick={() => handleUploadDocument(params.row)}
              title="Preview Document"
              sx={{ padding: 0 }}
            >
              <DescriptionSharpIcon color="primary" sx={{ fontSize: 24 }} />
            </IconButton>
          ) : (
            <CloudUploadIcon color="primary" sx={{ fontSize: 24 }} />
          ),
      }
    );
  }

  const getSchoolDetails = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      const optionData = res.data.data.map((obj) => ({
        value: obj.school_id,
        label: obj.school_name,
        school_name_short: obj.school_name_short,
      }));
      setSchoolOptions(optionData);
    } catch (err) {
      console.error(err);
    }
  };

  const getPrograms = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          setProgramOptions(
            res.data.data.map((obj) => ({
              value: obj.program_id,
              label: obj.specialization_with_program,
              program_assignment_id: obj?.program_assignment_id,
              program_specialization_id: obj?.program_specialization_id,
            }))
          );
          setProgramData(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const getYearSems = () => {
    if (values.programId) {
      const filterData = programData.filter(
        (obj) => obj.program_specialization_id === values.programId
      );

      if (filterData.length > 0) {
        const data = filterData[0];
        let maxYearSem = "";
        let type = "";
        if (data.number_of_semester > data.number_of_years) {
          maxYearSem = data.number_of_semester;
          type = "Sem";
        } else {
          maxYearSem = data.number_of_years;
          type = "Year";
        }

        const optionData = [];
        for (let i = 1; i <= maxYearSem; i++) {
          optionData.push({
            value: i,
            label: type + " " + i,
          });
        }
        setYearSemOptions(optionData);
        setProgramType(data.program_type_name);
      }
    }
  };

  const getData = async () => {
    const programData = programOptions?.find(
      (obj) => obj?.value === values.programId
    );

    if (!programData) {
      console.error("Program data not found for the selected programId");
      return;
    }

    const yearSemString =
      programType === "Yearly"
        ? `&current_year=${values.yearSem}`
        : `&current_sem=${values.yearSem}`;

    try {
      const url =
        tab === "NoDueList"
          ? `/api/student/studentNoDueStudentDetails?school_id=${values.schoolId}&program_id=${values.programId}&program_specialization_id=${programData.program_specialization_id}${yearSemString}&current_year=1`
          : `/api/student/fetchAllStudentNoDue?page=0&page_size=1000&sort=created_by&school_id=${values.schoolId}&program_id=${values.programId}&program_specialization_id=${programData.program_specialization_id}${yearSemString}`;

      const res = await axios.get(url);
      if (tab === "NoDueList") {
        setRows(res?.data?.data);
      } else {
        setNoDueHistoryData(res?.data?.data?.Paginated_data?.content);
      }
      setIsSubmit(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setCrumbs([{ name: "Student NoDue" }, { name: tab }]);
    getSchoolDetails();
  }, [setCrumbs]);

  useEffect(() => {
    getData();
  }, [tab]);

  useEffect(() => {
    getPrograms();
  }, [values.schoolId]);

  useEffect(() => {
    getYearSems();
  }, [values.programId]);

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async () => {
    getData();
  };

  const getRowId = (row) => row?.student_id;

  const handleUploadDocument = (row) => {
    setTemplateWrapperOpen(true);
    setRowData(row);
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <Box m={{ sm: 2 }}>
      <Tabs value={tab} onChange={handleChangeTab}>
        <Tab value="NoDueList" label="Student NoDue" />
        <Tab value="NoDueHistory" label="NoDue History" />
      </Tabs>
      <ModalWrapper
        open={templateWrapperOpen}
        setOpen={setTemplateWrapperOpen}
        maxWidth={1200}
      >
        <>
          <DOCView
            attachmentPath={`/api/student/studentNoDueFileviews?fileName=${rowData?.attachment_path}`}
          />
        </>
      </ModalWrapper>
      <Grid container rowSpacing={4}>
        {isSubmit ? (
          <>
            <Grid
              container
              alignItems="baseline"
              columnSpacing={4}
              justifyContent="flex-end"
            >
              <Grid item>
                <IconButton onClick={() => setIsSubmit(false)}>
                  <FilterListIcon fontSize="large" color="primary" />
                </IconButton>
              </Grid>
            </Grid>
            {tab === "NoDueList" && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <GridIndex
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            )}
            {tab === "NoDueHistory" && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <GridIndex
                    rows={noDueHistoryData}
                    columns={columns}
                    getRowId={(row) => row?.id}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>
            )}
          </>
        ) : (
          <Grid item xs={12}>
            <FormPaperWrapper>
              <Grid container columnSpacing={4} rowSpacing={3}>
                {/* School */}
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="schoolId"
                    label="School"
                    value={values.schoolId}
                    options={schoolOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                    disabled={roleShortName !== "SAA"}
                  />
                </Grid>
                {/* Program Major */}
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="programId"
                    label="Program Specialization"
                    value={values.programId}
                    options={programOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                </Grid>
                {/* YearSem */}
                <Grid item xs={12} md={2.4}>
                  <CustomAutocomplete
                    name="yearSem"
                    label="Year/Sem"
                    value={values.yearSem}
                    options={yearSemOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                </Grid>
                <Grid item xs={12} align="right">
                  <Button variant="contained" onClick={handleSubmit}>
                    {isLoading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      "GO"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </FormPaperWrapper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentNoDue;
