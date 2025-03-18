import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import axios from "../../../services/Api";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ModalWrapper from "../../../components/ModalWrapper";
import ModalPopup from "../../../components/ModalPopup";

const initialValues = {
  remarks: "",
  reportDate: null,
};

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
  6: "Promoted",
};

function ReportingIndex() {
  const [rows, setRows] = useState([]);

  const [values, setValues] = useState(initialValues);
  const [reportId, setReportId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [eligibleOpen, setEligibleOpen] = useState(false);

  const { acYearId } = useParams();
  const { schoolId } = useParams();
  const { programId } = useParams();
  const { yearsemId } = useParams();
  const { currentYearSem } = useParams();
  const { speId } = useParams();

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
    { field: "usn", headerName: "USN", flex: 1 },
    {
      field: currentYearSem === "1" ? "current_year" : "current_sem",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        params.row.current_year + "/" + params.row.current_sem,
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "eligible_status",
      headerName: "Eligible Status",
      flex: 1,
      valueGetter: (params) =>
        params.row.eligible_reported_status
          ? ELIGIBLE_REPORTED_STATUS[params.row.eligible_reported_status]
          : "",
    },
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

  const handleStatus = () => {
    setEligibleOpen(true);
  };

  const handleNotEligible = async () => {
    const temp = [];
    rowData.map((val) => {
      temp.push({
        remarks: values.remarks,
        eligible_reported_status: 2,
        reporting_id: val.id,
        student_id: val.student_id,
        current_year: val.current_year,
        current_sem: val.current_sem,
        reporting_date: null,
        reported_ac_year_id: val.reported_ac_year_id,
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
          setEligibleOpen(false);
          setValues((prev) => ({ ...prev, ["remarks"]: "" }));
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
        reported_ac_year_id: acYearId,
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
          setConfirmModal(false);
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
        `/api/student/allNotReportedStudentDetails?school_id=${schoolId}&program_id=${programId}&current_year=${yearsemId}&program_specialization_id=${speId}`
      )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
    } else {
      await axios(
        `/api/student/allNotReportedStudentDetails?school_id=${schoolId}&program_id=${programId}&current_sem=${yearsemId}&program_specialization_id=${speId}`
      )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleButton = () => {
    return (
      <>
        <Button sx={{ borderRadius: 2 }} variant="contained" autoFocus>
          YES
        </Button>
        <Button sx={{ borderRadius: 2 }} variant="contained" autoFocus>
          NO
        </Button>
      </>
    );
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
                disabled={rowData.length === 0}
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
        </FormWrapper>

        <ModalWrapper
          open={eligibleOpen}
          setOpen={setEligibleOpen}
          maxWidth={600}
        >
          <Grid
            container
            rowSpacing={2}
            columnSpacing={2}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                Do you want to make the selected students Not Eligible ??
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                multiline
                rows={2}
                label="Remarks"
                name="remarks"
                value={values.remarks}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleNotEligible}
                variant="contained"
                sx={{ borderRadius: 2 }}
                disabled={values.remarks === ""}
              >
                YES
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ borderRadius: 2, marginLeft: 2 }}
                onClick={() => setEligibleOpen(false)}
              >
                No
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>

        <ModalPopup
          open={confirmModal}
          setOpen={setConfirmModal}
          title={`You are about to report the selected  students to ${
            currentYearSem === "1"
              ? `${
                  rowData?.[0]?.current_year === 1
                    ? "1st Year"
                    : rowData?.[0]?.current_year + "st Year"
                }`
              : `${
                  rowData?.[0]?.current_sem === 1
                    ? "1st Sem"
                    : rowData?.[0]?.current_sem === 2
                    ? "2nd Sem"
                    : rowData?.[0]?.current_sem === 3
                    ? "3rd Sem"
                    : rowData?.[0]?.current_sem + "th Sem"
                }`
          }`}
          title1={`Click OK to proceed !!`}
          handleSubmit={handleCreate}
        ></ModalPopup>
      </Box>
    </>
  );
}

export default ReportingIndex;
