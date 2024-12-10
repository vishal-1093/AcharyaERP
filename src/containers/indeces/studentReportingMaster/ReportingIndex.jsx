import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  remarks: "",
  reportDate: null,
};

function ReportingIndex() {
  const [rows, setRows] = useState([]);
  const [modalContentOne, setModalContentOne] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [values, setValues] = useState(initialValues);
  const [reportId, setReportId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);

  const { schoolId } = useParams();
  const { programId } = useParams();
  const { yearsemId } = useParams();
  const { currentYearSem } = useParams();

  const { setAlertOpen, setAlertMessage } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    remarks: [/^[A-Za-z ]{1,150}$/.test(values.remarks)],
  };

  const errorMessages = {
    remarks: ["Enter Only 150 Characters"],
  };

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

  const handleStatus = (params) => {
    setConfirmModal(true);
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
        eligible_reported_status: 3,
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

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Report Master", link: "/ReportMaster" }]);
  }, []);

  const onSelectionModelChange = (ids) => {
    const selectedRow = ids.map((val) => rows.find((row) => row.id === val));
    setReportId(ids.toString());
    setRowData(selectedRow);
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleModalOpen = () => {
    setConfirmModal(true);
    setModalContentOne({
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
        { name: "Ok", color: "primary", func: handleCreate },
        { name: "Cancel", color: "primary", func: () => {} },
      ],
    });
  };

  const handleCreate = async () => {
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

  const getData = async () => {
    if (parseInt(currentYearSem) === 1) {
      await axios(
        `/api/student/allNotReportedStudentDetails?school_id=${schoolId}&program_id=${programId}&current_year=${yearsemId}`
      )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
    } else {
      await axios(
        `/api/student/allNotReportedStudentDetails?school_id=${schoolId}&program_id=${programId}&current_sem=${yearsemId}`
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
          <Grid container rowSpacing={2} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={3}>
              <CustomDatePicker
                name="reportDate"
                label="Reporting Date"
                value={values.reportDate}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                }}
                onClick={handleModalOpen}
              >
                SUBMIT
              </Button>
            </Grid>

            <Grid item xs={12}>
              <GridIndex
                rows={rows}
                columns={columns}
                checkboxSelection
                onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
              />
            </Grid>
          </Grid>

          <CustomModal
            open={confirmModal}
            setOpen={setConfirmModal}
            title={modalContentOne.title}
            message={modalContentOne.message}
            buttons={modalContentOne.buttons}
          />
        </FormWrapper>
      </Box>
    </>
  );
}

export default ReportingIndex;
