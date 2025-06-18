import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import axios from "../services/Api";
import useAlert from "../hooks/useAlert";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";
import GridIndex from "../components/GridIndex";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";


const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  programSpeId: null,
  categoryId: null,
  mainCategoryId: null,
  subCategoryId: null,
  year: null,
  sem: null
};

const yearList = [
  { value: "1", label: "Year 1", semValue: "0" },
  { value: "2", label: "Year 2", semValue: "0" },
  { value: "3", label: "Year 3", semValue: "0" },
  { value: "4", label: "Year 4", semValue: "0" },
  { value: "5", label: "Year 5", semValue: "0" },
  { value: "6", label: "Year 6", semValue: "0" }
];

const semList = [
  { value: "1", label: "1 yr/sem 1", yearValue: "1" },
  { value: "2", label: "1 yr/sem 2", yearValue: "1" },
  { value: "3", label: "2 yr/sem 3", yearValue: "2" },
  { value: "4", label: "2 yr/sem 4", yearValue: "2" },
  { value: "5", label: "3 yr/sem 5", yearValue: "3" },
  { value: "6", label: "3 yr/sem 6", yearValue: "3" },
  { value: "7", label: "4 yr/sem 7", yearValue: "4" },
  { value: "8", label: "4 yr/sem 8", yearValue: "4" },
  { value: "9", label: "5 yr/sem 9", yearValue: "5" },
  { value: "10", label: "5 yr/sem 10", yearValue: "5" },
  { value: "11", label: "6 yr/sem 11", yearValue: "6" },
  { value: "12", label: "6 yr/sem 12", yearValue: "6" },
];

const StudentDocument = () => {
  const [rows, setRows] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState([]);
  const [incrementCreationIds, setIncrementCreationIds] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    dateofJoining: false,
  });
  useEffect(() => {
    getData();
    getAcademicYears();
    getSchoolDetails();
    fetchMainCategories()
  }, []);

  useEffect(() => {
    getProgram();
    getData();
  }, [values.schoolId]);

  useEffect(() => {
    getCategoryDetails();
    getData();
  }, [values.programId]);

  useEffect(() => {
    if (values?.mainCategoryId) {
      fetchSubCategories();
    }
  }, [values?.mainCategoryId]);


  useEffect(() => {
    getData();
  }, [values.acyearId, values.subCategoryId, values.categoryId, values.mainCategoryId]);

  const getData = async () => {
    const { acyearId, schoolId, programId, categoryId, mainCategoryId, subCategoryId } = values;
    try {
      let params = {
        ac_year_id: acyearId,
        ...(schoolId && { school_id: schoolId }),
        ...(mainCategoryId && { attachments_category_id: mainCategoryId }),
        ...(subCategoryId && { attachments_subcategory_id: subCategoryId }),
        ...(categoryId && { fee_admission_category_id: categoryId }),
        ...(programId && {
          program_id: programData?.[programId]?.program_id,
          program_specialization_id: programId
        }),
      };

      const res = await axios.get("/api/student/getStudentAttachmentDetails", { params });

      const updatedRows = res?.data?.data?.map((row) => ({
        ...row,
        id: row.attachments_id,
      })) || [];

      setRows(updatedRows);

    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || err.message || "An unknown error occurred",
      });
      setAlertOpen(true);
    }
  };

  const fetchMainCategories = async () => {
    try {
      const res = await axios.get("/api/getAllAttachmentCategory");
      const categories = res.data.data || [];
      const optionData = categories.map((obj) => ({
        value: obj.attachments_category_id,
        label: obj.attachments_category_name,
      }));

      setMainCategories(optionData);
    } catch (err) {
      setAlertMessage({ severity: "error", message: "Failed to load categories" });
      setAlertOpen(true);
    }
  };

  const fetchSubCategories = async () => {
    if (!values.mainCategoryId) return
    try {
      const res = await axios.get(`/api/getAttachCategoryDetails?attachments_category_id=${values.mainCategoryId}`);
      const optionData = res.data.data.map(obj => ({
        value: obj.id,
        label: obj.attachments_subcategory_name
      }));
      setSubCategoriesMap(optionData);
    } catch {
      setAlertMessage({ severity: "error", message: "Failed to load subcategories" });
      setAlertOpen(true);
    }
  };

  const getCategoryDetails = async () => {
    try {
      const res = await axios.get(`/api/student/FeeAdmissionCategory`);
      const optionData = res.data.data.map(obj => ({
        value: obj.fee_admission_category_id,
        label: obj.fee_admission_category_short_name,
      }));
      setCategoryOptions(optionData);
    } catch (err) {
      console.error(err);
    }
  };

  const getAcademicYears = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = response.data.data.map(obj => ({
        value: obj.ac_year_id,
        label: obj.ac_year
      }));
      const latest = response.data.data.find(obj => obj.current_year === Math.max(...response.data.data.map(o => o.current_year)));
      setAcademicYearOptions(optionData);
      setValues(prev => ({ ...prev, acyearId: latest?.ac_year_id }));
    } catch (err) {
      setAlertMessage({ severity: "error", message: "Failed to fetch the academic years !!" });
      setAlertOpen(true);
    }
  };

  const getSchoolDetails = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      const optionData = res.data.data.map(obj => ({
        value: obj.school_id,
        label: obj.school_name_short,
      }));
      setSchoolOptions(optionData);
    } catch (err) {
      console.error(err);
    }
  };

  const getProgram = async () => {
    const { schoolId } = values;
    if (!schoolId) return;

    try {
      const { data: response } = await axios.get(`/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`);
      const optionData = response.data.map(obj => ({
        value: obj.program_specialization_id,
        label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
      }));
      const programObject = response.data.reduce((acc, obj) => {
        acc[obj.program_specialization_id] = obj;
        return acc;
      }, {});
      setProgramOptions(optionData);
      setProgramData(programObject);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the programs data",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue, rowValues) => {
    getYearSemValue(newValue, rowValues);
    setValues(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === "schoolId" && { programId: "", categoryId: "" }),
      ...(name === "programId" && { categoryId: "" }),
      ...(name === "mainCategoryId" && { subCategoryId: "" }),

    }));
  };

  const getYearSemValue = (newValue, rowValues) => {
    setValues(prev => ({
      ...prev,
      year: rowValues?.program_type === "Semester"
        ? semList.find(li => li.value === newValue)?.yearValue
        : newValue,
      sem: rowValues?.program_type === "Semester"
        ? newValue
        : yearList.find(li => li.value === newValue)?.semValue,
    }));
  };

  // const handleDownload = async (path, fileNamePrefix) => {
  //   try {
  //     const response = await axios.get(`/api/student/downloadMultipleFiles?fileNames=${path}`, {
  //       responseType: "blob",
  //     });

  //     const contentType = response.headers["content-type"]; // e.g., application/zip
  //     const extension = contentType?.includes("zip") ? "zip" : path?.split(".").pop() || "file";
  //     const fileName = `${fileNamePrefix}.${extension}`;

  //     const blob = new Blob([response.data], { type: contentType });
  //     const url = URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = fileName;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error("Download error:", err);
  //   }
  // };
  const handleDownload = async (path, fileNamePrefix) => {
    await axios
      .get(`/api/student/downloadMultipleFiles?fileNames=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
    },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
    },
    {
      field: "program_specialization_name",
      headerName: "Specialization",
      flex: 1.5,
    },
    {
      field: "fee_template_name",
      headerName: "Fee Template",
      flex: 1.2,
    },
    {
      field: "attachments_category_name",
      headerName: "Category",
      flex: 1.5,
    },
    {
      field: "attachments_subcategory_name",
      headerName: "Subcategory",
      flex: 1.5,
    },
    // {
    //   field: "attachments_file_name",
    //   headerName: "Document",
    //   flex: 2,
    //   renderCell: (params) => (
    //     <a
    //       href={params.value}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       style={{ color: "#1a73e8", textDecoration: "underline" }}
    //     >
    //       View Document
    //     </a>
    //   ),
    // },

    {
      field: "download",
      headerName: "Download",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const {
          auid,
          attachments_subcategory_name,
          attachments_file_path,
        } = params.row;

        const fileNamePrefix = `${auid}_${attachments_subcategory_name?.replace(/\s+/g, "_")}`;

        return (
          <IconButton
            onClick={(e) => {
              e.stopPropagation(); // prevents row click selection
              handleDownload(attachments_file_path, fileNamePrefix);
            }}
            color="primary"
            size="small"
            title="Download File"
          >
            <CloudDownloadIcon fontSize="small" />
          </IconButton>
        );
      },
    }





  ];


  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setIncrementCreationIds(
      selectedRowsData.map(({ id }) => ({
        id,
      }))
    );
  };
  const handleBulkDownload = async () => {
    // if (incrementCreationIds.length === 0) return;

    // // Collect file paths of selected documents
    // const selectedFilePaths = incrementCreationIds
    //   .map(({ id }) => {
    //     const row = rows.find((r) => r.id === id);
    //     return row?.attachments_file_path;
    //   })
    //   .filter(Boolean); // remove nulls

    // if (selectedFilePaths.length === 0) return;

    // try {
    //   const query = selectedFilePaths
    //     .map((file) => `fileNames=${encodeURIComponent(file)}`)
    //     .join("&");

    //   const res = await axios.get(`/api/student/downloadMultipleFiles?${query}`, {
    //     responseType: "blob",
    //   });

    //   // Create a blob and download (assuming the backend returns a zip or single file)
    //   const blob = new Blob([res.data]);
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = "StudentDocuments.zip"; // Change name as needed
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // } catch (err) {
    //   console.error("Download failed:", err);
    //   setAlertMessage({
    //     severity: "error",
    //     message: "Failed to download documents",
    //   });
    //   setAlertOpen(true);
    // }
  };


  return (
    <>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="acyearId"
                label="Academic Year"
                options={academicYearOptions}
                value={values.acyearId}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
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
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="programId"
                label="Program"
                options={programOptions}
                handleChangeAdvance={handleChangeAdvance}
                value={values.programId}
                disabled={!values.schoolId}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="categoryId"
                label="Category"
                options={categoryOptions}
                value={values.categoryId}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!values.programId}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="mainCategoryId"
                label="Doc Category"
                options={mainCategories}
                value={values.mainCategoryId}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="subCategoryId"
                label="Sub Category"
                options={subCategoriesMap}
                value={values.subCategoryId}
                disabled={!values.mainCategoryId}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              variant="contained"
              disableElevation
              sx={{ borderRadius: 2, ml: 2, mt: 2 }}
              disabled={incrementCreationIds.length === 0}
              color="error"
              onClick={handleBulkDownload}
            >
              Download Document
            </Button>

          </Grid>
        </Box>
      </Paper>
      <Box sx={{ position: "relative", mt: 1 }}>
        <GridIndex
          rows={rows}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(ids) => onSelectionModelChange(ids)}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
        />
      </Box>

    </>
  );
};

export default StudentDocument;
