import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import useAlert from "../../../hooks/useAlert";
import FeeTemplateView from "../../../components/FeeTemplateView";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import moment from "moment";
import FormWrapper from "../../../components/FormWrapper";

const initialValues = { auid: "", acyearId: null, yearSem: null };

const requiredFields = ["auid"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "right",
  },
}));

function ReadmissionForm() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [feeTemplateData, setFeeTemplateData] = useState({});
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
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

  const getAcyears = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        });
        setAcyearOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getFeeTemplate = async () => {
    if (values.acyearId && values.yearSem) {
      const getFeeTemplateData = await axios
        .get(
          `/api/finance/FetchAllFeeTemplateDetail/${studentData.fee_template_id}`
        )
        .then((res) => {
          const data = res.data.data[0];
          setFeeTemplateData(data);
          return data;
        })
        .catch((err) => console.error(err));

      const getFeeTemplateSubAmtData = await axios
        .get(
          `/api/finance/FetchFeeTemplateSubAmountDetail/${studentData.fee_template_id}`
        )
        .then((res) => {
          const data = res.data.data;
          setFeeTemplateSubAmountData(data);
          return data;
        })
        .catch((err) => console.error(err));

      await axios
        .get(
          `/api/finance/FetchAllFeeTemplateDetail/${studentData.fee_template_id}`
        )
        .then((res) => {
          const data = res.data.data[0];
          setFeeTemplateData(data);
          return data;
        })
        .catch((err) => console.error(err));

      const startYearSem =
        studentData.program_type_name === "Yearly" &&
        getFeeTemplateData.program_type_name === "Semester"
          ? values.yearSem * 2 - 1
          : studentData.program_type_name === "Semester" &&
            getFeeTemplateData.program_type_name === "Yearly"
          ? values.yearSem * 2 - 1
          : values.yearSem;

      const yearSem = [];
      const valueLabel =
        getFeeTemplateData.program_type_name === "Yearly" ? "Year" : "Sem";

      const totYearSem =
        getFeeTemplateData.program_type_name === "Yearly"
          ? "number_of_years"
          : "number_of_semester";

      for (let i = startYearSem; i <= totYearSem; i++) {
        yearSem.push({ key: i, value: valueLabel + " " + i });
      }

      setNoOfYears(yearSem);
    }
  };

  console.log("feeTemplateData :>> ", feeTemplateData);
  console.log("feeTemplateSubData :>> ", feeTemplateSubAmountData);
  console.log("noOfYears :>> ", noOfYears);
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

  const handleSubmit = async () => {
    setLoading(true);
    getAcyears();
    await axios
      .get(`/api/student/studentDetailsByAuid/${values.auid}`)
      .then((res) => {
        const data = res.data.data[0];
        const getYears = [];

        for (let i = 1; i <= data.number_of_semester; i++) {
          getYears.push({ value: i, label: i.toString() });
        }

        setStudentData(data);
        setYearOptions(getYears);
        setLoading(false);
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured !!",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  console.log("studentData :>> ", studentData);

  return (
    <Box m={{ md: 4, xs: 1 }}>
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
                    GO
                  </Button>
                </Grid>

                {studentData && Object.values(studentData).length > 0 ? (
                  <>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Card>
                            <CardHeader
                              title="Student Details"
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
                                <Grid item xs={12} md={1}>
                                  <Typography variant="subtitle2">
                                    AUID
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {studentData.auid}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1}>
                                  <Typography variant="subtitle2">
                                    Student Name
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {studentData.student_name}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1}>
                                  <Typography variant="subtitle2">
                                    USN
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {studentData.usn}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1}>
                                  <Typography variant="subtitle2">
                                    DOA
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {moment(
                                      studentData.date_of_admission
                                    ).format("DD-MM-YYYY")}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1}>
                                  <Typography variant="subtitle2">
                                    Acharya Email
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {studentData.acharya_email}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1}>
                                  <Typography variant="subtitle2">
                                    School
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {studentData.school_name_short}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1}>
                                  <Typography variant="subtitle2">
                                    Program
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {studentData.program_short_name +
                                      " - " +
                                      studentData.program_specialization_short_name}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1}>
                                  <Typography variant="subtitle2">
                                    Gender
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {studentData.candidate_sex}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1}>
                                  <Typography variant="subtitle2">
                                    Mobile No.
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {studentData.mobile}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>

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
                          studentData.program_type_name === "Yearly"
                            ? "Year"
                            : "Semester"
                        }
                        options={yearOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        value={values.yearSem}
                        required
                      />
                    </Grid>
                  </>
                ) : (
                  <></>
                )}

                {feeTemplateData &&
                Object.values(feeTemplateData).length > 0 &&
                feeTemplateSubAmountData.length > 0 ? (
                  <>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Card>
                            <CardHeader
                              title="Fee Template Details"
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
                                <Grid item xs={12} md={1.5}>
                                  <Typography variant="subtitle2">
                                    Fee Template
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={4.5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {feeTemplateData.fee_template_name}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={2}>
                                  <Typography variant="subtitle2">
                                    AC Year
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {feeTemplateData.ac_year}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1.5}>
                                  <Typography variant="subtitle2">
                                    Currency
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={4.5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {feeTemplateData.currency_type_name}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={2}>
                                  <Typography variant="subtitle2">
                                    Fee Scheme
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {feeTemplateData.program_type_name}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={1.5}>
                                  <Typography variant="subtitle2">
                                    Admission Category
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={4.5}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {
                                      feeTemplateData.fee_admission_category_short_name
                                    }
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={2}>
                                  <Typography variant="subtitle2">
                                    Admission Sub Category
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {
                                      feeTemplateData.fee_admission_sub_category_name
                                    }
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Particulars</StyledTableCell>
                              <StyledTableCell>Alias Name</StyledTableCell>
                              {noOfYears.map((val, i) => {
                                return (
                                  <StyledTableCell key={i}>
                                    {val.value}
                                  </StyledTableCell>
                                );
                              })}
                              <StyledTableCell>Total</StyledTableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {feeTemplateSubAmountData.map((obj, i) => {
                              return (
                                <TableRow key={i}>
                                  <StyledTableCellBody
                                    sx={{ textAlign: "left !important" }}
                                  >
                                    {obj.voucher_head}
                                  </StyledTableCellBody>
                                  <StyledTableCellBody
                                    sx={{ textAlign: "left !important" }}
                                  >
                                    {obj.alias_name}
                                  </StyledTableCellBody>
                                  {noOfYears.map((amtObj, j) => {
                                    return (
                                      <StyledTableCellBody key={j}>
                                        {obj["year" + amtObj.key + "_amt"]}
                                      </StyledTableCellBody>
                                    );
                                  })}
                                  <StyledTableCellBody>
                                    {obj.total_amt}
                                  </StyledTableCellBody>
                                </TableRow>
                              );
                            })}
                            <StyledTableCellBody
                              colSpan={2}
                              sx={{ textAlign: "center !important" }}
                            >
                              <Typography variant="subtitle2">Total</Typography>
                            </StyledTableCellBody>
                            {noOfYears.map((totObj, k) => {
                              return (
                                <StyledTableCellBody key={k}>
                                  <Typography variant="subtitle2">
                                    {
                                      feeTemplateSubAmountData[0][
                                        "fee_year" + totObj.key + "_amt"
                                      ]
                                    }
                                  </Typography>
                                </StyledTableCellBody>
                              );
                            })}
                            <StyledTableCellBody>
                              <Typography variant="subtitle2">
                                {feeTemplateData.fee_year_total_amount}
                              </Typography>
                            </StyledTableCellBody>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReadmissionForm;
