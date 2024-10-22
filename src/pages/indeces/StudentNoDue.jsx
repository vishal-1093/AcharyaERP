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

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  yearSem: null,
};

const StudentNoDue = () => {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [programType, setProgramType] = useState([]);

  const [selectedMonth, setMonth] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const roleShortName = JSON.parse(
    sessionStorage.getItem("AcharyaErpUser")
  )?.roleShortName;

  const navigate = useNavigate();
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();

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
    console.log(values, "vvvvvvvvvvv");
    const programData = programOptions?.find(
      (obj) => obj?.value == values.programId
    );
    const yearSemString =
      programType === "Yearly"
        ? "&current_year=" + values.yearSem
        : "&current_sem=" + values.yearSem;
    await axios
      .get(
        `api/student/studentNoDueStudentDetails?school_id=${values.schoolId}&program_id=${values.programId}&program_specialization_id=${programData?.program_specialization_id}&current_sem=${values.yearSem}&current_year=${values.yearSem}`
      )
      .then((res) => {
        setRows(res?.data?.data);
        setIsSubmit(true);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setValues([]);
      });
  };

  useEffect(() => {
    setCrumbs([{ name: "Student NoDue" }]);
    getSchoolDetails();
  }, [setCrumbs]);

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

  const handleSave = async (params) => {
    const { empId, toDate, remainingAmount } = params?.row;
    const valueObject = values?.find((item) => item.empId === empId);
    if (!valueObject || valueObject?.payingAmount === "") {
      setAlertMessage({
        severity: "error",
        message: "Please enter the amount",
      });
      setAlertOpen(true);
      return;
    }
    if (valueObject?.payingAmount >= remainingAmount) {
      setAlertMessage({
        severity: "error",
        message: "paying amount not greater then Remaining Amount",
      });
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/consoliation/saveConsoliation`,
        valueObject
      );
      if (res.status === 200 || res.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Added contract payment",
        });
        getData();
      } else {
        setAlertMessage({
          severity: "error",
          message: res?.message,
        });
      }
      setAlertOpen(true);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err?.response ? err.response.data?.message : "Error",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (params) => {
    const { empId, toDate } = params?.row;
    const valueObject = values?.find((item) => item.empId === empId);
    if (!valueObject || valueObject?.payingAmount === "") {
      setAlertMessage({
        severity: "error",
        message: "Please enter the amount",
      });
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/consoliation/updateConsoliation`,
        valueObject
      );
      if (res.status === 200 || res.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Updated contract payment",
        });
        getData();
      } else {
        setAlertMessage({
          severity: "error",
          message: res?.message,
        });
      }
      setAlertOpen(true);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err?.response ? err.response.data?.message : "Error",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const getRowId = (row) => row?.student_id;

  function formatMonthYear(month, year) {
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}-${formattedYear}`;
  }

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
    { field: "student_status", headerName: "Student Status", flex: 1 },
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
    {
      field: "photo",
      headerName: "Photo",
      flex: 1,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            // onClick={() => onClickAddPhoto(params)}
            sx={{ borderRadius: 1 }}
          >
            Update
          </Button>
        );
      },
    },
    {
      field: "student_id",
      headerName: "Cancel Admission",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(
              `/approve-canceladmission/${params.value}/${params.row.id}`
            )
          }
          title="Cancel Admission"
          sx={{ padding: 0 }}
        >
          <AddBoxIcon color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
    {
      field: "update_student_status",
      headerName: "Update Student Status",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => ""}
          title="Update Student Status"
          sx={{ padding: 0 }}
        >
          <AddBoxIcon color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
    {
      field: "attachment_path",
      headerName: "Upload Document",
      flex: 1,
      renderCell: (params) =>
        params.row.attachment_path ? (
          <IconButton
            // onClick={() => handleUploadDocument(params.row)}
            title="Preview Document"
            sx={{ padding: 0 }}
          >
            <DescriptionSharpIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ) : (
          <CloudUploadIcon color="primary" sx={{ fontSize: 24 }} />
        ),
    },
    {
      field: "attachment_download",
      headerName: "Download",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <IconButton
          // onClick={() => handleDownloadDocument(params.value)}
          title="Download Document"
          sx={{ padding: 0 }}
        >
          <DownloadIcon color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
    // {
    //   field: "period",
    //   headerName: "Period",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {`${moment(params.row.fromDate).format("MM-YY")} to ${moment(
    //           params.row.toDate
    //         ).format("MM-YY")}`}
    //       </>
    //     );
    //   },
    // },
    // {
    //   field: "paydays",
    //   headerName: "Pay Days",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return <>{params?.row?.paydays}</>;
    //   },
    // },
    // {
    //   field: "consoliatedAmount",
    //   headerName: "Consoliated",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <div
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //           textAlign: "right",
    //           width: 100,
    //         }}
    //       >
    //         {params?.row?.consoliatedAmount}
    //       </div>
    //     );
    //   },
    // },
  ];
  // if (roleShortName === "SAA") {
  //   columns.push(
  //     {
  //       field: "payment",
  //       headerName: "Paid",
  //       flex: 1,
  //       hideable: false,
  //       renderCell: (params) => {
  //         const value =
  //           values.find((item) => item.empId === params.row.empId)
  //             ?.payingAmount ??
  //           params?.row?.payingAmount ??
  //           "";
  //         return (
  //           <Box display="flex" alignItems="center" gap={1}>
  //             <TextField
  //               type="number"
  //               variant="standard"
  //               size="small"
  //               inputProps={{ min: 0 }}
  //               value={value}
  //               onChange={(e) =>
  //                 handleChangeAdvance(
  //                   "payingAmount",
  //                   e.target.value,
  //                   params.row.empId
  //                 )
  //               }
  //             />
  //             {params?.row?.payingAmount ? (
  //               <>
  //                 <Button
  //                   variant="contained"
  //                   color="secondary"
  //                   size="small"
  //                   onClick={() => handleUpdate(params)}
  //                 >
  //                   Update
  //                 </Button>
  //               </>
  //             ) : (
  //               <Button
  //                 variant="contained"
  //                 color="primary"
  //                 size="small"
  //                 onClick={() => handleSave(params)}
  //               >
  //                 Save
  //               </Button>
  //             )}
  //           </Box>
  //         );
  //       },
  //     },
  //     {
  //       field: "remainingAmount",
  //       headerName: "Remaining",
  //       flex: 1,
  //       renderCell: (params) => {
  //         return (
  //           <div
  //             style={{
  //               whiteSpace: "nowrap",
  //               overflow: "hidden",
  //               textOverflow: "ellipsis",
  //               textAlign: "right",
  //               width: 100,
  //             }}
  //           >
  //             {params.row?.remainingAmount ?? 0}
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       field: "Year",
  //       headerName: "Pay Month",
  //       flex: 1,
  //       renderCell: (params) => {
  //         const month = moment(selectedMonth.month).format("MM");
  //         const year = moment(selectedMonth.month).format("YYYY");
  //         return <>{formatMonthYear(month, year)}</>;
  //       },
  //     }
  //   );
  // } else {
  //   columns.push(
  //     {
  //       field: "payment",
  //       headerName: "Paid",
  //       flex: 1,
  //       hideable: false,
  //       renderCell: (params) => {
  //         const valueFromParams = params?.row?.payingAmount ?? "";
  //         const valueFromState =
  //           values.find((item) => item.empId === params.row.empId)
  //             ?.payingAmount ?? "";

  //         return valueFromParams !== "" && valueFromParams !== null ? (
  //           <>{valueFromParams}</>
  //         ) : (
  //           <Box display="flex" alignItems="center" gap={2}>
  //             <TextField
  //               type="number"
  //               variant="standard"
  //               size="small"
  //               inputProps={{ min: 0 }}
  //               value={valueFromState}
  //               onChange={(e) =>
  //                 handleChangeAdvance(
  //                   "payingAmount",
  //                   e.target.value,
  //                   params.row.empId
  //                 )
  //               }
  //             />
  //             <Button
  //               variant="contained"
  //               color="primary"
  //               size="small"
  //               onClick={() => handleSave(params)}
  //             >
  //               Save
  //             </Button>
  //           </Box>
  //         );
  //       },
  //     },
  //     {
  //       field: "remainingAmount",
  //       headerName: "Remaining",
  //       flex: 1,
  //       renderCell: (params) => {
  //         return (
  //           <div
  //             style={{
  //               whiteSpace: "nowrap",
  //               overflow: "hidden",
  //               textOverflow: "ellipsis",
  //               textAlign: "right",
  //               width: 100,
  //             }}
  //           >
  //             {params.row?.remainingAmount ?? 0}
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       field: "Year",
  //       headerName: "Pay Month",
  //       flex: 1,
  //       renderCell: (params) => {
  //         const month = moment(selectedMonth.month).format("MM");
  //         const year = moment(selectedMonth.month).format("YYYY");
  //         return <>{formatMonthYear(month, year)}</>;
  //       },
  //     }
  //   );
  // }

  return (
    <Box m={{ sm: 2 }}>
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
            <Grid item xs={12}>
              <GridIndex rows={rows} columns={columns} getRowId={getRowId} />
            </Grid>
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
