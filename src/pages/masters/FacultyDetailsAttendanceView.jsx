import React, { useState, useEffect } from "react";
import axios from "../../services/Api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Grid,
  Alert,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";
import useAlert from "../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import CustomTextField from "../../components/Inputs/CustomTextField";
import GridIndex from "../../components/GridIndex";
import { convertUTCtoTimeZone } from "../../utils/DateTimeUtils";
import CustomModal from "../../components/CustomModal";

const FacultyDetailsAttendanceView = ({ eventDetails, checkStatus }) => {
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState([]);
  const [data, setData] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [alert, setAlert] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);

    const updatedData = data.map((item) => ({
      ...item,
      selected: !selectAll,
      present:
        item.reporting_date === null && selectAll
          ? "A"
          : item.reporting_date !== null && selectAll
          ? "P"
          : "A",
    }));
    setData(updatedData);
  };

  useEffect(() => {
    getLessonData();
    fetchData();
    getPreviousAttendance();
  }, []);

  const getPreviousAttendance = async () => {
    await axios
      .get(`api/student/getPreviousStudentAttendanceDetails/${eventDetails.id}`)
      .then((res) => {})
      .catch((err) => console.error(err));
  };

  const fetchData = async () => {
    let url = "";
    if (eventDetails.sectionAssignmentId !== null) {
      url = `api/academic/assignedStudentDetailsBySectionAssignmentId/${eventDetails?.sectionAssignmentId}`;
    } else {
      url = `api/academic/assignedStudentDetailsByBatchAssignmentId/${eventDetails?.batch_assignment_id}`;
    }

    const response = await axios.get(url);

    if (Array.isArray(response.data.data)) {
      const updatedData = response.data.data.map((item, index) => ({
        ...item,
        id: index,
        selected: false,
        present: item.reporting_date === null ? "A" : "P",
      }));

      setData(updatedData);
    } else {
      console.error("Data is not an array.");
    }
  };

  const getLessonData = async () => {
    let url = "";
    let sem_year = eventDetails.current_sem || eventDetails.current_year;
    if (eventDetails.sectionAssignmentId !== null) {
      url = `api/academic/getLessonPlanByAcademicYearProgramSpecilizationCourseYearOrSemAndEmployeeId/${eventDetails.acYearId}/${eventDetails.programId}/${eventDetails.programSpecializationId}/${eventDetails?.course_assignment_id}/${sem_year}/${eventDetails.empId}`;
    } else {
      url = `/api/academic/getLessonPlanByAcademicYearCourseYearOrSemAndEmployeeId/${eventDetails.acYearId}/${eventDetails.course_assignment_id}/${sem_year}/${eventDetails.empId}`;
    }

    await axios
      .get(url)
      .then((res) => {
        const responseData = res.data.data;

        if (responseData.length === 0) {
          setAlert(true);
        } else {
          setLessonData(responseData);
          setAlert(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLessionPlan = (obj) => {
    setSelectedLesson({
      lesson_assignment_id: obj?.lesson_assignment_id,
      lesson_id: obj?.id,
    });
  };

  const handleSubmit = async () => {
    const payload = data?.map((_data) => {
      return {
        ac_year_id: eventDetails?.acYearId,
        active: true,
        batch_id: eventDetails?.batch_id,
        course_id: eventDetails?.courseId,
        date_of_class: new Date(eventDetails?.date)?.toISOString(),
        description: description,
        lesson_id: selectedLesson?.lesson_id,
        offline_status: _data?.offline_status,
        present_status: _data?.present === "P" ? true : false,
        remarks: "",
        school_id: eventDetails?.schoolID,
        section_id: eventDetails?.secID,
        student_id: _data?.student_id,
        time_slots_id: eventDetails?.time_slots_id,
        time_table_id: eventDetails?.id,
        year_or_sem: eventDetails?.current_sem,
        course_assignment_id: eventDetails?.course_assignment_id,
        lesson_assignment_id: selectedLesson?.lesson_assignment_id,
        emp_id: eventDetails?.empId,
      };
    });

    let url = "";

    if (eventDetails.sectionAssignmentId !== null) {
      url = `sectionAssignmentId=${eventDetails?.sectionAssignmentId}`;
    } else {
      url = `batchAssignmentId=${eventDetails?.batch_assignment_id}`;
    }

    await axios
      .post(`api/student/studentAttendance?${url}`, payload)
      .then((res) => {
        if (res.data.success) {
          setSubmitted(true);
          setAlertMessage({
            severity: "success",
            message: <>Attendance submitted successfully!</>,
          });
          setAlertOpen(true);
          checkStatus();
        } else {
          setSubmitted(false);
          setAlertMessage({
            severity: "error",
            message: <>Error while submitting attendance!</>,
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setSubmitted(false);
        setAlertMessage({
          severity: "error",
          message: err?.response?.data?.message || "error",
        });
        setAlertOpen(true);
      });
  };

  const handleEdit = () => {
    const reportingIds = [];
    data.map((val) => {
      if (val.selected === true) {
        reportingIds.push(val.reporting_id);
      }
    });

    reportingIds.length > 0
      ? setModalContent({
          title: "Update Reporting Date",
          message: `You are about to report the selected  students , click  ok to proceed `,
          buttons: [
            { name: "Skip", color: "primary", func: () => {} },
            { name: "Ok", color: "primary", func: handleUpdateReportingDate },
          ],
        })
      : setModalContent({
          title: "Update Reporting Date",
          message: `Please select the students to report`,
          buttons: [{ name: "Ok", color: "primary", func: () => {} }],
        });

    setModalOpen(true);
  };

  const handleUpdateReportingDate = async () => {
    const temp = [];
    const reportingIds = [];
    data.map((val) => {
      if (val.selected === true) {
        reportingIds.push(val.reporting_id);
        temp.push({
          remarks: val.remarks,
          reporting_id: val.reporting_id,
          student_id: val.student_id,
          current_year: val.current_year,
          current_sem: val.current_sem,
          reporting_date: convertUTCtoTimeZone(new Date()),
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
      }
    });

    await axios
      .put(`/api/student/ReportingStudents/${reportingIds.toString()}`, temp)
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
    data?.map((val) => {
      if (val.selected === true)
        tempOne.push({
          active: true,
          reporting_id: val.reporting_id,
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
    const historyData = [...temp, ...tempOne];
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
        }
        fetchData();
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });
  };

  const handleSelect = (params) => {
    data.map((obj) => {
      if (
        obj.reporting_date === null &&
        data[params.row.id]?.id === obj.id &&
        obj.selected === false
      ) {
        setAlertMessage({
          severity: "error",
          message:
            "To make the students present please update the students reporting date",
        });
        setAlertOpen(true);

        const updatedData = [...data];
        updatedData[params.row.id].selected = !params?.row?.selected;
        updatedData[params.row.id].present =
          params.row.reporting_date === null
            ? "A"
            : params?.row?.selected
            ? "A"
            : "P";

        setData(updatedData);
      } else if (
        obj.reporting_date === null &&
        data[params.row.id]?.id === obj.id &&
        obj.selected === true
      ) {
        setAlertOpen(false);
        const updatedData = [...data];
        updatedData[params.row.id].selected = !params?.row?.selected;
        updatedData[params.row.id].present =
          params.row.reporting_date === null
            ? "A"
            : params?.row?.selected
            ? "A"
            : "P";
      } else if (
        obj.reporting_date !== null &&
        data[params.row.id]?.id === obj.id
      ) {
        const updatedData = [...data];
        updatedData[params.row.id].selected = !params?.row?.selected;
        updatedData[params.row.id].present = params?.row?.selected ? "A" : "P";
        setData(updatedData);
      }
    });
  };

  const columns = [
    { field: "student_id", headerName: "SL.NO", flex: 1 },
    {
      field: "selected",
      headerName: (
        <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
      ),
      flex: 1,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.row.selected}
          onChange={() => handleSelect(params)}
        />
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    {
      field: "reporting_date",
      headerName: "Reporting Date",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.reporting_date === null ? (
          <Button variant="contained" onClick={() => handleEdit(params)}>
            Report
          </Button>
        ) : (
          <Typography>
            {moment(params.row.reporting_date).format("DD-MM-YYYY")}
          </Typography>
        ),
      ],
    },
    {
      field: "Present",
      headerName: "Attendance",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <CustomTextField
          type="text"
          value={params.row.present}
          style={{
            backgroundColor: params.row.present === "P" ? "#90EE90" : "	#ff3333",
            width: "36px",
          }}
        />,
      ],
    },
  ];

  return (
    <div>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      {alert && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          Before taking attendance, map the lesson plan.&nbsp;
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {
              navigate("/StudentMaster/LessonplanForm");
            }}
          >
            Click here to create the lesson plan.
          </span>
        </Alert>
      )}
      {!alert && !submitted && (
        <TableContainer component={Paper} sx={{ margin: 4, marginLeft: 0 }}>
          <Table
            size="small"
            sx={{
              "& .MuiTableCell-root": {
                border: "1px solid rgba(224, 224, 224, 1)",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Sl No</TableCell>
                <TableCell>Plan Date</TableCell>
                <TableCell>Topic taught </TableCell>
                <TableCell>Teaching Aid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lessonData?.map((obj, i) => {
                const slNo = i + 1;
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <input
                        type="radio"
                        name="lessonRadio"
                        onChange={() => handleLessionPlan(obj)}
                      />
                    </TableCell>
                    <TableCell>{slNo}</TableCell>
                    <TableCell>{obj.plan_date}</TableCell>
                    <TableCell>{obj.contents}</TableCell>
                    <TableCell>{obj.teaching_aid}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!alert && !submitted && (
        <>
          <Grid container rowSpacing={2} columnSpacing={2} sx={{ mb: 3 }}>
            {/* <Grid item xs={12} md={4}>
              <CustomTextField
                rows={2}
                multiline
                name="remarks"
                label="Remarks"
                value={remarks}
                handleChange={(e) => setRemarks(e.target.value)}
              />
            </Grid> */}
            <Grid item xs={12} md={4}>
              <CustomTextField
                rows={2}
                multiline
                name="description"
                label="Topic description"
                value={description}
                handleChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>

          <GridIndex rows={data} columns={columns} getRowId={(row) => row.id} />

          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              backgroundColor: "green",
              color: "white",
              margin: 2,
              float: "right",
            }}
            onClick={handleSubmit}
            disabled={data?.length === 0 || selectedLesson === null}
          >
            SUBMIT
          </Button>
        </>
      )}
    </div>
  );
};

export default FacultyDetailsAttendanceView;
