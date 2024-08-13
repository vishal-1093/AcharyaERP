import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomModal from "../../../components/CustomModal";

const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const ReadmissionFeeTemplate = lazy(() => import("./ReadmissionFeeTemplate"));

const initialValues = { auid: "", acyearId: null, yearSem: null };

const requiredFields = ["auid"];

function ReadmissionForm() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState(null);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [feeTemplateData, setFeeTemplateData] = useState(null);
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [admitLoading, setAdmitLoading] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    auid: [
      values.auid !== "",
      /^[a-zA-Z0-9]*$/.test(values.auid),
      /^[A-Za-z]{3}\d{2}[A-Za-z]{4}\d{3}$/.test(values.auid),
    ],
  };

  const errorMessages = {
    auid: [
      "This field is required",
      "Special characters and space is not allowed",
      "Invalid AUID",
    ],
  };

  useEffect(() => {
    getFeeTemplate();
  }, [values.acyearId, values.yearSem]);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const getAcyears = async (acYearCode) => {
    try {
      const url = "/api/academic/academic_year";
      const response = await axios.get(url);
      const optionData = [];
      response.data.data
        .filter((obj) => obj.ac_year_code > acYearCode)
        .forEach((obj) => {
          optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        });
      setAcyearOptions(optionData);
    } catch (err) {
      console.error(err);
    }
  };

  const getFeeTemplate = async () => {
    if (values.acyearId && values.yearSem) {
      try {
        const feeTemplateUrl = `/api/finance/FetchAllFeeTemplateDetail/${studentData.fee_template_id}`;
        const response = await axios.get(feeTemplateUrl);
        const getFeeTemplateData = response.data.data[0];

        const subAmountUrl = `/api/finance/FetchFeeTemplateSubAmountDetail/${studentData.fee_template_id}`;
        const subAmtResponse = await axios.get(subAmountUrl);
        const getFeeTemplateSubAmtData = subAmtResponse.data.data;

        const startYearSem =
          studentData.program_type_name === "Yearly" &&
          getFeeTemplateData.program_type_name === "Semester"
            ? values.yearSem * 2 - 1
            : studentData.program_type_name === "Semester" &&
              getFeeTemplateData.program_type_name === "Yearly"
            ? values.yearSem * 2 - 1
            : values.yearSem;

        const yearSem = [];

        const totYearSem =
          getFeeTemplateData.program_type_name === "Yearly"
            ? studentData.number_of_years * 2
            : studentData.number_of_semester;

        for (let i = startYearSem; i <= totYearSem; i++) {
          yearSem.push({ key: i, value: "Sem " + i });
        }

        const reAdmissionAmt =
          getFeeTemplateData.program_type_name === "Yearly"
            ? getFeeTemplateSubAmtData[0]["fee_year" + startYearSem + "_amt"] +
              getFeeTemplateSubAmtData[0][
                "fee_year" + (values.yearSem + 1) + "_amt"
              ]
            : getFeeTemplateSubAmtData[0]["fee_year" + startYearSem + "_amt"];
        const percentage = startYearSem % 2 !== 0 ? 50 : 25;

        setValues((prev) => ({
          ...prev,
          ["reAdmissionId"]: 28,
          ["reAdmissionHead"]: "Readmission Fee",
          ["reAdmissionAmt"]: (reAdmissionAmt / 100) * percentage,
          ["year"]: startYearSem,
        }));

        setFeeTemplateSubAmountData(getFeeTemplateSubAmtData);
        setFeeTemplateData(getFeeTemplateData);
        setNoOfYears(yearSem);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occurred. Please try again.",
        });
        setAlertOpen(true);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const url = `/api/student/studentDetailsByAuid/${values.auid}`;

      const response = await axios.get(url);
      const data = response.data.data[0];
      const getYears = [];
      for (let i = 1; i <= data.number_of_semester; i++) {
        getYears.push({ value: i, label: i.toString() });
      }
      getAcyears(data.ac_year_code);
      setStudentData(data);
      setYearOptions(getYears);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch student details. Please try again later.",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const renderAuidRow = () => {
    return (
      <>
        <Grid item xs={12} md={3}>
          <CustomTextField
            name="auid"
            label="AUID"
            value={values.auid}
            handleChange={handleChange}
            checks={checks.auid}
            errors={errorMessages.auid}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={2}
          sx={{ textAlign: { xs: "right", md: "left" } }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !requiredFieldsValid()}
          >
            Submit
          </Button>
        </Grid>
      </>
    );
  };

  const renderAdmissionRow = () => (
    <Card>
      <CardHeader
        title="Admission Details"
        titleTypographyProps={{
          variant: "subtitle2",
        }}
        sx={{
          backgroundColor: "rgba(74, 87, 169, 0.1)",
          color: "#46464E",
          textAlign: "center",
          padding: 1,
        }}
      />
      <CardContent>
        <Grid container columnSpacing={2} rowSpacing={1}>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="acyearId"
              label="Ac Year"
              options={acyearOptions}
              handleChangeAdvance={handleChangeAdvance}
              value={values.acyearId}
              required
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="yearSem"
              label={
                studentData.program_type_name === "Yearly" ? "Year" : "Semester"
              }
              options={yearOptions}
              handleChangeAdvance={handleChangeAdvance}
              value={values.yearSem}
              required
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const handleCreateData = async () => {
    try {
      setAdmitLoading(true);
      const postData = {
        active: true,
        studentId: studentData.student_id,
        auid: studentData.auid,
        voucherHeadNewId: values.reAdmissionId,
        feeTemplateId: studentData.fee_template_id,
        acYearId: values.acyearId,
        semOrYear: values.yearSem,
        totalAmount: values.reAdmissionAmt,
        balance: values.reAdmissionAmt,
      };

      const url = "/api/student/createReadmission";
      const response = await axios.post(url, postData);
      if (response.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Re-admission completed successfully !!",
        });
        setValues(initialValues);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
    } finally {
      setAlertOpen(true);
      setAdmitLoading(false);
    }
  };

  const handleCreate = () => {
    setConfirmContent({
      title: "",
      message: "Are you sure you want to submit?",
      buttons: [
        { name: "Yes", color: "primary", func: handleCreateData },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

      <Box sx={{ margin: { md: 4, xs: 1 } }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={9}>
            <Card elevation={4}>
              <CardHeader
                title="Re-Admission"
                titleTypographyProps={{
                  variant: "subtitle2",
                  fontSize: 14,
                }}
                sx={{
                  backgroundColor: "primary.main",
                  color: "headerWhite.main",
                  textAlign: "center",
                  padding: 1,
                }}
              />
              <CardContent sx={{ padding: 4 }}>
                <Grid container columnSpacing={2} rowSpacing={4}>
                  {renderAuidRow()}
                  {studentData && (
                    <>
                      <Grid item xs={12}>
                        <StudentDetails id={studentData.student_id} />
                      </Grid>
                      <Grid item xs={12}>
                        {renderAdmissionRow()}
                      </Grid>
                      {feeTemplateData &&
                        feeTemplateSubAmountData.length > 0 && (
                          <Grid item xs={12}>
                            <ReadmissionFeeTemplate
                              feeTemplateData={feeTemplateData}
                              feeTemplateSubAmountData={
                                feeTemplateSubAmountData
                              }
                              values={values}
                              noOfYears={noOfYears}
                            />
                          </Grid>
                        )}
                      <Grid item xs={12} align="right">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleCreate}
                          disabled={
                            admitLoading ||
                            values.acyearId === null ||
                            values.yearSem === null
                          }
                        >
                          Admit
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ReadmissionForm;
