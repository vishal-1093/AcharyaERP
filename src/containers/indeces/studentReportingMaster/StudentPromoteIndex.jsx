import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
};

function StudentPromoteIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalContentOne, setModalContentOne] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [reportId, setReportId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmModalOne, setConfirmModalOne] = useState(false);
  const [currentYear, setCurrentYear] = useState();
  const [currentSem, setCurrentSem] = useState();
  const [values, setValues] = useState({
    eligibleStatus: null,
    remarks: "",
    reportDate: null,
  });

  const { schoolId } = useParams();
  const { programId } = useParams();
  const { acYearId } = useParams();
  const { yearsemId } = useParams();
  const { currentYearSem } = useParams();
  const { status } = useParams();

  const { setAlertOpen, setAlertMessage } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    { field: "student_name", headerName: " Name", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },

    {
      field: currentYearSem === "1" ? "current_year" : "current_sem",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        params.row.current_year + "/" + params.row.current_sem,
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "eligible_reported_status",
      headerName: "Status",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <Button variant="text" onClick={() => handleStatus(params)}>
          Eligible
        </Button>,
      ],
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Report Master", link: "/ReportMaster/Promote" }]);
  }, []);

  const onSelectionModelChange = (ids) => {
    const selectedRow = ids.map((val) => rows.find((row) => row.id === val));
    setReportId(ids.toString());
    setRowData(selectedRow);
    setCurrentYear(selectedRow[0]?.current_year);
    setCurrentSem(selectedRow[0]?.current_sem);
  };

  const handleStatus = (params) => {
    setConfirmModalOne(true);
    setModalContentOne({
      message: "Do you want to make them Not Eligible",
      buttons: [
        { name: "Yes", color: "primary", func: handleNotEligible },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  const handleNotEligible = async () => {
    const temp = [];
    rowData.map((val) => {
      temp.push({
        remarks: val.remarks,
        eligible_reported_status: 2,
        reporting_id: val.id,
        student_id: val.student_id,
        current_year: val.current_year,
        current_sem: val.current_sem,
        reporting_date: null,
        distinct_status: val.distinct_status,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        year_back_status: val.year_back_status,
        section_id: val.section_id,
        active: true,
      });
    });

    await axios
      .put(`/api/student/ReportingStudents/${reportId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });

    const tempOne = [];
    rowData.map((val) => {
      tempOne.push({
        active: true,
        reporting_id: val.id,
        current_sem: val.current_sem,
        current_year: val.current_year,
        distinct_status: val.distinct_status,
        eligible_reported_status: val.eligible_reported_status,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        program_specialization_id: val.program_specialization_id,
        program_type_id: val.program_type_id,
        remarks: val.remarks,
        reported_ac_year_id: val.reported_ac_year_id,
        reporting_date: val.reporting_date,
        school_id: val.school_id,
        student_id: val.student_id,
        section_id: val.section_id,
        year_back_status: val.year_back_status,
      });
    });

    await axios
      .post(`/api/student/createMultipleStdReportingStudentsHistory`, tempOne)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Status Updated",
          });
          getData();
          setAlertOpen(true);
        }
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });
  };

  const handleModalOpen = () => {
    if (values.eligibleStatus === 6) {
      setModalContent({
        message: `You are about to promote the selected students to ${
          currentYearSem === "1" ? "Year" : "Sem"
        } ${
          currentYearSem === "1" ? currentYear + 1 : currentSem + 1
        } , click  ok to proceed`,
        buttons: [
          { name: "Ok", color: "primary", func: handleCreate },
          { name: "Cancel", color: "primary", func: () => {} },
        ],
      });
      setConfirmModal(true);
    } else if (values.eligibleStatus === 2) {
      setModalContent({
        message: "Do you want to make them Not Eligible",
        buttons: [
          { name: "Yes", color: "primary", func: handleNotEligible },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setConfirmModal(true);
    } else if (values.eligibleStatus === 3) {
      setModalContent({
        message: "Do you want to make them Eligible",
        buttons: [
          { name: "Yes", color: "primary", func: handleEligible },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setConfirmModal(true);
    } else if (values.eligibleStatus === 4) {
      setModalContent({
        message: "Do you want to make them Not Reported",
        buttons: [
          { name: "Yes", color: "primary", func: handleNotReport },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setConfirmModal(true);
    }
  };

  const handleReportOpen = () => {
    setConfirmModal(true);
    setModalContent({
      message: `You are about to report the selected  students to ${
        currentYearSem === "1"
          ? `${
              rowData[0].current_year === 1
                ? "1st Year"
                : rowData[0].current_year + "st Year"
            }`
          : `${
              rowData[0].current_sem === 1
                ? "1st Sem"
                : rowData[0].current_sem + "nd Sem"
            }`
      },  click  ok to proceed `,
      buttons: [
        { name: "OK", color: "primary", func: handleReportCreate },
        { name: "CANCEL", color: "primary", func: () => {} },
      ],
    });
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleReportCreate = async () => {
    const temp = [];

    rowData.map((val) => {
      temp.push({
        remarks: values.remarks,
        reporting_id: val.id,
        student_id: val.student_id,
        current_year: val.current_year,
        current_sem: val.current_sem,
        reporting_date: values.reportDate,
        current_sem: val.current_sem,
        current_year: val.current_year,
        distinct_status: val.distinct_status,
        eligible_reported_status: 3,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        year_back_status: val.year_back_status,
        section_id: val.section_id,
        active: true,
      });
    });

    await axios
      .put(`/api/student/ReportingStudents/${reportId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Reporting Date Updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });

    const tempOne = [];
    rowData.map((val) => {
      tempOne.push({
        active: true,
        reporting_id: val.id,
        current_sem: val.current_sem,
        current_year: val.current_year,
        distinct_status: val.distinct_status,
        eligible_reported_status: val.eligible_reported_status,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        program_specialization_id: val.program_specialization_id,
        program_type_id: val.program_type_id,
        remarks: val.remarks,
        reported_ac_year_id: val.reported_ac_year_id,
        reporting_date: val.reporting_date,
        school_id: val.school_id,
        student_id: val.student_id,
        section_id: val.section_id,
        year_back_status: val.year_back_status,
      });
    });

    const historyData = [...tempOne];

    await axios
      .post(
        `/api/student/createMultipleStdReportingStudentsHistory`,
        historyData
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Reporting Date Updated",
          });
          getData();
        }
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });
  };

  const handleEligible = async () => {
    const temp = [];

    rowData.map((val) => {
      temp.push({
        remarks: values.remarks,
        reporting_id: val.id,
        student_id: val.student_id,
        current_year: val.current_year,
        current_sem: val.current_sem,
        reporting_date: val.reporting_date,
        current_sem: val.current_sem,
        current_year: val.current_year,
        distinct_status: val.distinct_status,
        eligible_reported_status: values.eligibleStatus,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        year_back_status: val.year_back_status,
        section_id: val.section_id,
        active: true,
      });
    });

    await axios
      .put(`/api/student/ReportingStudents/${reportId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Reporting Date Updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });

    const tempOne = [];
    rowData.map((val) => {
      tempOne.push({
        active: true,
        reporting_id: val.id,
        current_sem: val.current_sem,
        current_year: val.current_year,
        distinct_status: val.distinct_status,
        eligible_reported_status: val.eligible_reported_status,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        program_specialization_id: val.program_specialization_id,
        program_type_id: val.program_type_id,
        remarks: val.remarks,
        reported_ac_year_id: val.reported_ac_year_id,
        reporting_date: val.reporting_date,
        school_id: val.school_id,
        student_id: val.student_id,
        section_id: val.section_id,
        year_back_status: val.year_back_status,
      });
    });

    const historyData = [...tempOne];

    await axios
      .post(
        `/api/student/createMultipleStdReportingStudentsHistory`,
        historyData
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Reporting Date Updated",
          });
          getData();
        }
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });
  };

  const handleCreate = async () => {
    const temp = [];
    rowData.map((val) => {
      temp.push({
        remarks: values.remarks,
        eligible_reported_status: 4,
        reporting_id: val.id,
        student_id: val.student_id,
        current_year:
          currentYearSem === "1"
            ? val.current_year + 1
            : (val.current_sem + 1) % 2 === 0
            ? val.current_year
            : val.current_year + 1,
        current_sem:
          currentYearSem === "1" ? val.current_sem : val.current_sem + 1,
        reporting_date: null,
        distinct_status: val.distinct_status,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        year_back_status: val.year_back_status,
        section_id: val.section_id,
        active: true,
      });
    });

    await axios
      .put(`/api/student/ReportingStudents/${reportId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Promoted",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });

    const tempOne = [];
    rowData.map((val) => {
      tempOne.push({
        active: true,
        reporting_id: val.id,
        current_sem: val.current_sem,
        current_year: val.current_year,
        distinct_status: val.distinct_status,
        eligible_reported_status: val.eligible_reported_status,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        program_specialization_id: val.program_specialization_id,
        program_type_id: val.program_type_id,
        remarks: val.remarks,
        reported_ac_year_id: val.reported_ac_year_id,
        reporting_date: val.reporting_date,
        school_id: val.school_id,
        student_id: val.student_id,
        section_id: val.section_id,
        year_back_status: val.year_back_status,
      });
    });

    const historyData = [...tempOne];

    await axios
      .post(
        `/api/student/createMultipleStdReportingStudentsHistory`,
        historyData
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Promoted",
          });
          getData();
          setAlertOpen(true);
        }
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });
  };

  const handleNotReport = async () => {
    const temp = [];
    rowData.map((val) => {
      temp.push({
        remarks: values.remarks,
        eligible_reported_status: 4,
        reporting_id: val.id,
        student_id: val.student_id,
        current_year: val.current_year,
        current_sem: val.current_sem,
        reporting_date: null,
        distinct_status: val.distinct_status,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        year_back_status: val.year_back_status,
        section_id: val.section_id,
        active: true,
      });
    });

    await axios
      .put(`/api/student/ReportingStudents/${reportId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Promoted",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });

    const tempOne = [];
    rowData.map((val) => {
      tempOne.push({
        active: true,
        reporting_id: val.id,
        current_sem: val.current_sem,
        current_year: val.current_year,
        distinct_status: val.distinct_status,
        eligible_reported_status: val.eligible_reported_status,
        previous_sem: val.previous_sem,
        previous_year: val.previous_year,
        program_specialization_id: val.program_specialization_id,
        program_type_id: val.program_type_id,
        remarks: val.remarks,
        reported_ac_year_id: val.reported_ac_year_id,
        reporting_date: val.reporting_date,
        school_id: val.school_id,
        student_id: val.student_id,
        section_id: val.section_id,
        year_back_status: val.year_back_status,
      });
    });

    const historyData = [...tempOne];

    await axios
      .post(
        `/api/student/createMultipleStdReportingStudentsHistory`,
        historyData
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Not Reported",
          });
          getData();
          setAlertOpen(true);
        }
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });
  };

  const getData = async () => {
    if (parseInt(currentYearSem) === 1) {
      await axios
        .get(
          `/api/student/getAllStudentDetailsWithEligibleStatus?school_id=${schoolId}&program_id=${programId}&ac_year_id=${acYearId}&current_year=${yearsemId}&eligible_reported_status=${status}`
        )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/student/getAllStudentDetailsWithEligibleStatus?school_id=${schoolId}&program_id=${programId}&ac_year_id=${acYearId}&current_sem=${yearsemId}&eligible_reported_status=${status}`
        )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid container columnSpacing={{ xs: 2, md: 4 }} mb={2}>
            {status == 4 ? (
              <>
                {/* <Grid item xs={12} md={3}>
                  <CustomSelect
                    name="eligibleStatus"
                    label="Eligible Status"
                    value={values.eligibleStatus}
                    items={[{ value: 2, label: "Not Eligible" }]}
                    handleChange={handleChange}
                    required
                  />
                </Grid> */}
                <Grid item xs={12} md={3}>
                  <CustomDatePicker
                    name="reportDate"
                    label="Reporting Date"
                    value={values.reportDate}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12} md={3}>
                {status == 2 ? (
                  <CustomSelect
                    name="eligibleStatus"
                    label="Eligible Status"
                    value={values.eligibleStatus}
                    items={[
                      { value: 3, label: "Eligible" },
                      { value: 2, label: "Not Eligible" },
                      { value: 4, label: "Not Reported" },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                ) : (
                  <CustomSelect
                    name="eligibleStatus"
                    label="Eligible Status"
                    value={values.eligibleStatus}
                    items={[
                      { value: 6, label: "Promote" },
                      { value: 2, label: "Not Eligible" },
                      { value: 4, label: "Not Reported" },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                )}
              </Grid>
            )}

            <Grid item xs={12} md={3}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              {status == 4 ? (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                    }}
                    onClick={handleReportOpen}
                  >
                    SUBMIT
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                    }}
                    onClick={handleModalOpen}
                  >
                    SUBMIT
                  </Button>
                </>
              )}
            </Grid>
          </Grid>

          <CustomModal
            open={confirmModal}
            setOpen={setConfirmModal}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />

          <CustomModal
            open={confirmModalOne}
            setOpen={setConfirmModalOne}
            title={modalContentOne.title}
            message={modalContentOne.message}
            buttons={modalContentOne.buttons}
          />

          <GridIndex
            rows={rows}
            columns={columns}
            checkboxSelection
            onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
          />
        </FormWrapper>
      </Box>
    </>
  );
}

export default StudentPromoteIndex;
