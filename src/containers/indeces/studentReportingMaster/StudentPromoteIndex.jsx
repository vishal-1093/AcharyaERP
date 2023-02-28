import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";

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

  const { schoolId } = useParams();
  const { programId } = useParams();
  const { acYearId } = useParams();
  const { yearsemId } = useParams();
  const { currentYearSem } = useParams();
  const navigate = useNavigate();
  const { setAlertOpen, setAlertMessage } = useAlert();

  const columns = [
    { field: "student_name", headerName: " Name", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    {
      field: currentYearSem === "1" ? "current_year" : "current_sem",
      headerName: "Year/Sem",
      flex: 1,
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
  }, []);

  const onSelectionModelChange = (ids) => {
    const selectedRow = ids.map((val) => rows.find((row) => row.id === val));
    setReportId(ids.toString());
    setRowData(selectedRow);
    setCurrentYear(selectedRow[0].current_year);
    setCurrentSem(selectedRow[0].current_sem);
  };

  const handleStatus = (params) => {
    setConfirmModalOne(true);
    setModalContentOne({
      message: "Do you want to make them Not Eligible",
      buttons: [
        { name: "No", color: "primary", func: () => {} },
        { name: "Yes", color: "primary", func: handleNotEligible },
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
        reporting_date: val.reporting_date,
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
          window.location.reload();
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
    setConfirmModal(true);
    setModalContent({
      message: `You are about to make the selected students Promote to ${
        currentYearSem === "1" ? "Year" : "Sem"
      } ${
        currentYearSem === "1" ? currentYear + 1 : currentSem + 1
      } , click  ok to proceed`,
      buttons: [
        { name: "Skip", color: "primary", func: () => {} },
        { name: "Ok", color: "primary", func: handleCreate },
      ],
    });
  };

  const handleCreate = async () => {
    const temp = [];
    rowData.map((val) => {
      temp.push({
        remarks: val.remarks,
        eligible_reported_status: 1,
        reporting_id: val.id,
        student_id: val.student_id,
        current_year:
          currentYearSem === "1"
            ? val.current_year + 1
            : (val.current_sem + 1) % 2,
        current_sem:
          currentYearSem === "1" ? val.current_sem : val.current_sem + 1,
        reporting_date: val.reporting_date,
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
          window.location.reload();
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
            message: "Promoted",
          });
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
      await axios(
        `/api/student/getAllStudentDetailsWithEligibleStatus?school_id=${schoolId}&program_id=${programId}&ac_year_id=${acYearId}&current_year=${yearsemId}`
      )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
    } else {
      await axios(
        `/api/student/getAllStudentDetailsWithEligibleStatus?school_id=${schoolId}&program_id=${programId}&ac_year_id=${acYearId}&current_sem=${yearsemId}`
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
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                }}
                onClick={handleModalOpen}
              >
                Promote
              </Button>
            </Grid>
            <Grid item xs={12} md={9} textAlign="right">
              <Button
                onClick={() => navigate("/ReportMaster/Promote")}
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 2,
                }}
                startIcon={<AddIcon />}
              >
                Create
              </Button>
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
