import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
    schoolId: "",
    programSpelizationId: "",
    acYearId: "",
};

function NewAdmissionsDueReport() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSplOptions, setProgramSplOptions] = useState([]);
  const [acYearOptions, setAcYearOptions] = useState([]);
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    { field: "student_name", headerName: "Name", flex: 1 },
    { field: "inst", headerName: "School", flex: 1 },
     { field: "year/sem", headerName: "Year/Sem", flex: 1 },
    { field: "fixed", headerName: "Fixed", flex: 1 },
     { field: "paid", headerName: "Paid", flex: 1 },
     { field: "addOn", headerName: "Add On Due", flex: 1 },
     { field: "hostel", headerName: "Hostel Due", flex: 1 },
      { field: "due", headerName: "Total Due", flex: 1 }
      
  ];
 useEffect(() => {
 
         setCrumbs([
             { name: "Student Due Report" }
         ])
 
         getSchoolDetails();
         getAcademicYearDetails();
     }, []);
 
    //  useEffect(() => {
    //      getData();
    //  }, [values?.schoolId, values?.acYearId]);
  
 useEffect(() => {
         getAllProgramsWithSpecialization();
     }, [values?.schoolId]);

//   const getData = async () => {
//     await axios
//     .get(
//         `/api/fetchAllFeedbackAllowForStudentDetails?page=${0}&page_size=${10000}&sort=created_date`
//       )
//       .then((res) => {
//         setRows(res?.data?.data.Paginated_data?.content);
//       })
//       .catch((err) => console.error(err));
//   };
  
    const getSchoolDetails = async () => {
        await axios
            .get(`/api/institute/school`)
            .then((res) => {
                const optionData = [];
                res.data.data.forEach((obj) => {
                    optionData.push({
                        value: obj?.school_id,
                        label: obj?.school_name,
                        school_name_short: obj?.school_name_short,
                    });
                });
                setSchoolOptions(optionData);
            })
            .catch((err) => console.error(err));
    };


     const getAcademicYearDetails = async () => {
        await axios
            .get(`/api/academic/academic_year`)
            .then((res) => {
                const optionData = [];
                res.data.data.forEach((obj) => {
                    optionData.push({
                        value: obj?.ac_year_id,
                        label: obj?.ac_year,
                        ac_year_code: obj?.ac_year_code,
                    });
                });
                setAcYearOptions(optionData);
            })
            .catch((err) => console.error(err));
    };

     const getAllProgramsWithSpecialization = () => {
            axios.get(`/api/academic/fetchAllProgramsWithSpecialization/${values?.schoolId}`)
                .then((res) => {
                                   const optionData = [];
                                   const {data} = res?.data
                data.forEach((obj) => {
                    optionData.push({
                        value: obj.program_specialization_id,
                    label: obj.specialization_with_program,
                    });
                });
                setProgramSplOptions(optionData);  
                })
                .catch((err) => {
                    console.error(err)
                });
    }


    const handleChangeAdvance = (name, newValue) => {

        if (name === "schoolId") {
            setValues((prev) => ({
                ...prev,
                schoolId: newValue,
                schoolShortName: schoolOptions?.find((el) => el?.value == newValue)
                    ?.school_name_short,
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                [name]: newValue
            }));
        }
    };

  return (
      <Box sx={{ position: "relative", marginTop: 3 }}>
        <Box mb={3} mt={2}>
            <Grid container alignItems="center" gap={3} mt={2} mb={2}>
                <Grid item xs={6} md={3}>
                            <CustomAutocomplete
                                name="acYearId"
                                label="Academic Year"
                                value={values.acYearId}
                                options={acYearOptions}
                                handleChangeAdvance={handleChangeAdvance}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
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
                                name="programSpelizationId"
                                label="Program Spelization"
                                value={values.programSpelizationId}
                                options={programSplOptions}
                                handleChangeAdvance={handleChangeAdvance}
                            />
                        </Grid>
                </Grid>
        </Box>
        <GridIndex rows={rows} columns={columns} />
      </Box>
  );
}
export default NewAdmissionsDueReport;
