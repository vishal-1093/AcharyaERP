import { useState, useEffect, lazy } from "react";
import {
  Box, Grid, Button, CircularProgress
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import SmsIcon from '@mui/icons-material/Sms';
import FormGroup from "@mui/material/FormGroup";
import useAlert from "../../hooks/useAlert.js";
import axios from "../../services/Api.js";
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));

const yearLists = [
  { label: "1/0", value: "1/0" },
  { label: "2/0", value: "2/0" },
  { label: "3/0", value: "3/0" },
  { label: "4/0", value: "4/0" },
  { label: "5/0", value: "5/0" },
  { label: "6/0", value: "6/0" },
  { label: "7/0", value: "7/0" },
  { label: "8/0", value: "8/0" },
  { label: "9/0", value: "9/0" },
  { label: "10/0", value: "10/0" }
];

const semLists = [
  { label: "1/1", value: "1/1" },
  { label: "1/2", value: "1/2" },
  { label: "2/3", value: "2/3" },
  { label: "2/4", value: "2/4" },
  { label: "3/5", value: "3/5" },
  { label: "3/6", value: "3/6" },
  { label: "4/7", value: "4/7" },
  { label: "4/8", value: "4/8" },
  { label: "5/9", value: "5/9" },
  { label: "5/10", value: "5/10" },
  { label: "6/11", value: "6/11" },
  { label: "6/12", value: "6/12" }
];

const initialState = {
  acYear: null,
  acYearList: [],
  schoolId: null,
  programSpecializationId: null,
  loading: false,
  schoolList: [],
  programmeSpecializationList: [],
  whatsappTemplateList: [],
  feeAdmissionCategoryList: [],
  yearSem: "",
  yearSemLists: [],
  whatsappTemplate: null,
  whatsappTemplateList: [],
  feeAdmissionCategory: null,
  feeAdmissionCategoryList: [],
  programSpecilizationDetail: null,
  studentList: [],
  checked: false,
  dateAndTemplateDetail: []
};

const SendWhatsApp = () => {
  const [{ acYear, acYearList, schoolId, loading, schoolList, programSpecializationId, programmeSpecializationList, yearSem, yearSemLists,
    whatsappTemplate, whatsappTemplateList, feeAdmissionCategory, feeAdmissionCategoryList, studentList, checked, dateAndTemplateDetail
  }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  useEffect(() => {
    getAcyear();
    getSchoolData();
    getWhatsappData();
    getFeeCategory();
  }, []);

  const columns = [
    { field: "auid", headerName: "Auid", flex: 1 },
    { field: "studentName", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone No.", flex: 1, renderCell: (params) => params.row.phone.replace(/\d(?=\d{2})/g, '*') },
    {
      field: "isSelected",
      headerName: "Checkbox Selection",
      flex: 1,
      align: "center",
      renderHeader: () => (
        <FormGroup>
          {" "}
          <FormControlLabel control={headerCheckbox} />
        </FormGroup>
      ),
      renderCell: (params) => (
        <Checkbox
          sx={{ padding: 0 }}
          checked={params.value}
          onChange={handleCellCheckboxChange(params.row.id)}
        />
      ),
    },
  ];

  const handleCellCheckboxChange = (id) => (event) => {
    let updatedLists = studentList.map((el) =>
      el.id === id ? { ...el, isSelected: event.target.checked } : el
    );
    setState((prevState) => ({
      ...prevState,
      checked: updatedLists.every((ele) => ele.isSelected),
      studentList: updatedLists,
    }));
  };

  const handleHeaderCheckboxChange = (event) => {
    event.stopPropagation();
    const updatedList = studentList.map((el) => ({ ...el, isSelected: event.target.checked }));
    setState((prevState) => ({
      ...prevState,
      studentList: updatedList,
      checked: event.target.checked,
    }));
  };

  const headerCheckbox = (
    <Checkbox
      checked={checked ? true : false}
      onClick={(e) => handleHeaderCheckboxChange(e)}
      indeterminate={studentList?.some((row) => row.isSelected)}
    />
  );

  const handleChangeAdvance = (name, newValue) => {
    if (name == "schoolId") {
      getProgramSpecilization(newValue)
    };
    if (name == "programSpecializationId") {
      getYearSemData(newValue)
    };
    setState((prevState) => ({
      ...prevState,
      [name]: newValue
    }))
  };

  const getAcyear = async () => {
    try {
      const res = await axios.get(`/api/academic/academic_year`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          acYearList: res.data.data.map((ele) => ({ value: ele.ac_year_id, label: ele.ac_year }))?.filter((li)=>li.label >= "2025")
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res.data.data.map((ele) => ({ value: ele.school_id, label: ele.school_name_short }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getProgramSpecilization = async (schoolId = null) => {
    try {
      const res = await axios.get(`/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          programmeSpecializationList: res.data.data.map((ele) => ({
            value: ele.program_specialization_id,
            label: ele.specialization_with_program,
            programId: ele.program_id,
            program_type_name: ele.program_type_name,
            number_of_years: ele.number_of_years,
            number_of_semester: ele.number_of_semester
          }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getYearSemData = (programSpecilizationId) => {
    const programeSpecilizationDetails = programmeSpecializationList.find((ele) => ele.value == programSpecilizationId);

    const list = (programeSpecilizationDetails.program_type_name == "YEARLY") ? (yearLists.slice(0, programeSpecilizationDetails.number_of_years)) :
      semLists.slice(0, programeSpecilizationDetails.number_of_semester);

    setState((prevState) => ({
      ...prevState,
      yearSemLists: list
    }))
  };


  const getWhatsappData = async () => {
    try {
      const res = await axios.get(`api/whatsapp/getAllTemplates`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          whatsappTemplateList: res.data.data.map((ele) => ({ value: ele.whatsappTemplateId, label: ele.templateName }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getFeeCategory = async () => {
    try {
      const res = await axios.get(`api/student/FeeAdmissionCategory`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          feeAdmissionCategoryList: res.data.data.map((ele) => ({ value: ele.fee_admission_category_id, label: ele.fee_admission_category_short_name }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getStudentData = async () => {
    try {
      setLoading(true);
      const [year, sem] = yearSem?.split("/").map(Number)
      const payload = {
        "schoolId": schoolId,
        "programSpecializationId": programSpecializationId,
        "programId":programmeSpecializationList?.find((li)=>li.value == programSpecializationId)?.programId,
        "year": year,
        "Sem": sem,
        "whatsappTemplateId": whatsappTemplate,
        "acYear": acYear,
        "feeAdmissionCategoryId": feeAdmissionCategory
      }
      const res = await axios.post(`/api/whatsapp/getStudentList`, payload);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data.filter((li) => (li.studentName));
        const dateAndTemplateDetails = res.data.data.filter((li) => !(li.studentName));
        setState((prevState) => ({
          ...prevState,
          studentList: list.map((ele, index) => ({ ...ele, id: index + 1, isSelected: false })),
          dateAndTemplateDetail: dateAndTemplateDetails
        }));
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const InvokeWhatsappMSg = async () => {
    try {
      const studentIds = studentList.filter((obj) => obj.isSelected).map((li) => li.studentId)
      const params = new URLSearchParams();
      const paramsObj = {
        studentIdList: studentIds.join(" , "),
        templateName: dateAndTemplateDetail.find((obj) => obj.templateName)?.templateName,
        lastDateToPay: dateAndTemplateDetail.find((obj) => obj.lastDateToPay)?.lastDateToPay
      }
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value != null) {
          params.append(key, value);
        }
      });
      const res = await axios.post(`/api/whatsapp/sendMessageToStudents?${params.toString()}`);
      if (res.status == 200 || res.status == 201) {
        setState(initialState);
        setAlertMessage({
          severity: "success",
          message: res.data.data,
        });
        setAlertOpen(true);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Box
      sx={{
        position: "relative"
      }}
    >
      <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={1.6}>
          <CustomAutocomplete
            name="acYear"
            value={acYear}
            label="Ac Year"
            handleChangeAdvance={handleChangeAdvance}
            options={acYearList || []}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="schoolId"
            value={schoolId}
            label="School"
            handleChangeAdvance={handleChangeAdvance}
            options={schoolList || []}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="programSpecializationId"
            value={programSpecializationId}
            label="Programme Specialization"
            disabled={!schoolId}
            handleChangeAdvance={handleChangeAdvance}
            options={programmeSpecializationList || []}
          />
        </Grid>
        <Grid item xs={12} md={1.4}>
          <CustomAutocomplete
            name="yearSem"
            value={yearSem || ""}
            label="Year/Sem"
            handleChangeAdvance={handleChangeAdvance}
            options={yearSemLists}
          />
        </Grid>
        <Grid item xs={12} md={1.8}>
          <CustomAutocomplete
            name="whatsappTemplate"
            value={whatsappTemplate || ""}
            label="Whatsapp Template"
            handleChangeAdvance={handleChangeAdvance}
            options={whatsappTemplateList}
          />
        </Grid>
        <Grid item xs={12} md={1.2}>
          <CustomAutocomplete
            name="feeAdmissionCategory"
            value={feeAdmissionCategory || ""}
            label="Category"
            handleChangeAdvance={handleChangeAdvance}
            options={feeAdmissionCategoryList}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            variant="contained"
            disableElevation
            onClick={getStudentData}
            disabled={!(acYear && schoolId && programSpecializationId && yearSem && whatsappTemplate && feeAdmissionCategory)}
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            variant="contained"
            startIcon={<SmsIcon />}
            disableElevation
            disabled={!studentList.some((obj) => obj.isSelected)}
            onClick={InvokeWhatsappMSg}
          >
            Send
          </Button>
        </Grid>
      </Grid>
      <Box mt={3} sx={{ position: "absolute", width: "100%" }}>
        <GridIndex rows={studentList}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
          loading={loading} />
      </Box>
    </Box>
  );
};

export default SendWhatsApp;
