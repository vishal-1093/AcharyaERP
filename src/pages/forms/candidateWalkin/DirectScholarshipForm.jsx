import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import StudentDetailsByAuid from "../../../components/StudentDetailsByAuid";
import useAlert from "../../../hooks/useAlert";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import occupationList from "../../../utils/OccupationList";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CustomModal from "../../../components/CustomModal";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";

const initialValues = {
  auid: "",
  residency: "",
  scholarship: "",
  scholarshipYes: "",
  reason: "",
  past: "",
  exemptionType: "",
  income: "",
  occupation: "",
  scholarshipData: {},
  document: "",
};

const requiredFields = [
  "residency",
  "scholarship",
  "reason",
  "past",
  "income",
  "occupation",
  "document",
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function DirectScholarshipForm() {
  const [values, setValues] = useState(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reasonOptions, setReasonOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [scholarshipTotal, setScholarshipTotal] = useState(0);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [feeTemplateData, setFeeTemplateData] = useState({});
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState([]);
  const [studentId, setStudentId] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    auid: [values.auid !== ""],
    income: [values.income !== "", /^[0-9.]*$/.test(values.income)],
  };

  const errorMessages = {
    auid: ["This field required"],
    income: ["This field required", "Enter valid income"],
  };

  useEffect(() => {
    if (Object.values(values.scholarshipData).length > 0) {
      setScholarshipTotal(
        Object.values(values.scholarshipData).reduce((a, b) => {
          const x = Number(a) > 0 ? Number(a) : 0;
          const y = Number(b) > 0 ? Number(b) : 0;
          return x + y;
        })
      );
    }
  }, [values.scholarshipData]);

  const getFeeTemplateData = async () => {
    const feetemplateId = await axios
      .get(`/api/student/studentDetailsByAuid/${values.auid}`)
      .then((res) => {
        setStudentId(res.data.data[0].student_id);
        return res.data.data[0].fee_template_id;
      })
      .catch((err) => console.error(err));

    // fetching feeTemplateSubAmount
    const feeTemplateSubAmount = await axios
      .get(`/api/finance/FetchFeeTemplateSubAmountDetail/${feetemplateId}`)
      .then((res) => {
        setFeeTemplateSubAmountData(res.data.data);
        return res.data.data;
      })
      .catch((err) => console.error(err));

    // fetching feeTemplateData
    const feetemplateData = await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${feetemplateId}`)
      .then((res) => {
        setFeeTemplateData(res.data.data[0]);
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    // for fetching program is yearly or semester

    const programDetails = await axios
      .get(
        `/api/academic/FetchAcademicProgram/${feetemplateData.ac_year_id}/${feetemplateData.program_id}/${feetemplateData.school_id}`
      )
      .then((res) => {
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    const yearSem = []; //in this array pushing the no of year or sem of the particular program
    const yearValue = {}; // creating an object for  maintaining the state of year or semwise values scholarship Data
    const tempSubAmount = {};

    if (feetemplateData.program_type_name.toLowerCase() === "yearly") {
      for (let i = 1; i <= programDetails.number_of_years; i++) {
        yearSem.push({ key: i.toString(), value: "Year " + i });
        yearValue["year" + i] = "";
        tempSubAmount["year" + i] =
          feeTemplateSubAmount[0]["fee_year" + i + "_amt"];
      }
    } else if (feetemplateData.program_type_name.toLowerCase() === "semester") {
      for (let i = 1; i <= programDetails.number_of_semester; i++) {
        yearSem.push({ key: i.toString(), value: "Sem " + i });
        yearValue["year" + i] = "";
        tempSubAmount["year" + i] =
          feeTemplateSubAmount[0]["fee_year" + i + "_amt"];
      }
    }

    setYearwiseSubAmount(tempSubAmount);
    setNoOfYears(yearSem);
    setValues((prev) => ({
      ...prev,
      scholarshipData: yearValue,
    }));
  };

  const getFeeexcemptions = async () => {
    await axios
      .get(`/api/categoryTypeDetails`)
      .then((res) => {
        setReasonOptions(
          res.data.data.map((obj) => ({
            value: obj.category_type_id,
            label: obj.category_detail,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "scholarship" && e.target.value === "true") {
      requiredFields.push("scholarshipYes");
      checks["scholarshipYes"] = ["scholarshipYes" !== ""];
      errorMessages["scholarshipYes"] = ["This field is required"];
    }

    if (e.target.name === "past" && e.target.value === "true") {
      requiredFields.push("exemptionType");
      checks["exemptionType"] = ["exemptionType" !== ""];
      errorMessages["exemptionType"] = ["This field is required"];
    }

    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeSholarship = (e) => {
    setValues((prev) => ({
      ...prev,
      scholarshipData: {
        ...prev.scholarshipData,
        [e.target.name]:
          Number(e.target.value) > yearwiseSubAmount[e.target.name]
            ? yearwiseSubAmount[e.target.name]
            : e.target.value,
      },
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

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSubmit = async () => {
    if (!values.auid) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setIsSubmitted(true);
      getFeeexcemptions();
      getFeeTemplateData();
    }
  };

  const handleCreate = (e) => {
    const submit = async () => {
      if (!requiredFieldsValid()) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all fields",
        });
        setAlertOpen(true);
      } else {
        const temp = {};

        const scholaship = {};
        scholaship.active = true;
        scholaship.award = values.scholarship;
        if (values.scholarship === "true") {
          scholaship.award_details = values.scholarshipYes;
        }
        scholaship.exemption_received = values.past;
        if (values.past === "true") {
          scholaship.exemption_type = reasonOptions
            .filter((f) => f.value === values.exemptionType)
            .map((val) => val.label)
            .toString();
        }

        scholaship.occupation = values.occupation;
        scholaship.parent_income = values.income;
        scholaship.reason = reasonOptions
          .filter((f) => f.value === values.reason)
          .map((val) => val.label)
          .toString();
        scholaship.residence = values.residency;
        scholaship.requested_scholarship = scholarshipTotal;
        scholaship.student_id = studentId;

        const scholashipApprover = {};
        scholashipApprover.active = true;
        noOfYears.forEach((val) => {
          scholashipApprover["year" + val.key + "_amount"] = Number(
            values.scholarshipData["year" + val.key]
          );
        });
        scholashipApprover.student_id = studentId;
        scholashipApprover.pre_approval_status = true;
        scholashipApprover.prev_approved_amount = scholarshipTotal;

        temp.s = scholaship;
        temp.sas = scholashipApprover;

        // const documentData = new FormData();
        // documentData.append("file", values.document);
        // documentData.append("candidate_id", id);

        // setLoading(true);
        // // Scholarship document upload
        // await axios
        //   .post(`/api/uploadFile`, documentData)
        //   .then((res) => {})
        //   .catch((err) => console.error(err));

        await axios
          .post(`/api/student/saveDirectScholarship`, temp)
          .then((res) => {})
          .catch((error) => {
            setAlertMessage({
              severity: "error",
              message: error.response ? error.response.data.message : "Error",
            });
            setAlertOpen(true);
          });
      }
    };

    setConfirmModalContent({
      title: "",
      message: "Do you want to submit ?",
      buttons: [
        { name: "Yes", color: "primary", func: submit },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        title={confirmModalContent.title}
        message={confirmModalContent.message}
        buttons={confirmModalContent.buttons}
      />

      <Box component="form" p={1}>
        <FormPaperWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={3}>
              <CustomTextField
                name="auid"
                label="AUID"
                value={values.auid}
                handleChange={handleChange}
                checks={checks.auid}
                errors={errorMessages.auid}
                required
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button variant="contained" onClick={handleSubmit}>
                GO
              </Button>
            </Grid>

            {isSubmitted ? (
              <>
                <Grid item xs={12}>
                  <StudentDetailsByAuid auid={values.auid} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomRadioButtons
                    name="residency"
                    label="Residence"
                    value={values.residency}
                    items={[
                      {
                        value: "own",
                        label: "Own",
                      },
                      {
                        value: "rented",
                        label: "Rented",
                      },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomRadioButtons
                    name="scholarship"
                    label="Scholarship Awarded From An OutSide Body"
                    value={values.scholarship}
                    items={[
                      {
                        value: "true",
                        label: "Yes",
                      },
                      {
                        value: "false",
                        label: "No",
                      },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                </Grid>

                {values.scholarship === "true" ? (
                  <Grid item xs={12} md={4}>
                    <CustomTextField
                      name="scholarshipYes"
                      label="If Yes, Please Specify"
                      value={values.scholarshipYes}
                      handleChange={handleChange}
                      checks={checks.scholarshipYes}
                      errors={errorMessages.scholarshipYes}
                      required
                    />
                  </Grid>
                ) : (
                  <></>
                )}

                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="reason"
                    label="Reason For Fee Exemption"
                    value={values.reason}
                    options={reasonOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.reason}
                    errors={errorMessages.reason}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomRadioButtons
                    name="past"
                    label="Fee Exemption Received In Past From Acharya Institutes"
                    value={values.past}
                    items={[
                      {
                        value: "true",
                        label: "Yes",
                      },
                      {
                        value: "false",
                        label: "No",
                      },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                </Grid>

                {values.past === "true" ? (
                  <Grid item xs={12} md={4}>
                    <CustomAutocomplete
                      name="exemptionType"
                      label="Kind Of Fee Exemption Availing"
                      value={values.exemptionType}
                      options={reasonOptions}
                      handleChangeAdvance={handleChangeAdvance}
                      checks={checks.exemptionType}
                      errors={errorMessages.exemptionType}
                      required
                    />
                  </Grid>
                ) : (
                  <></>
                )}

                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="income"
                    label="Parent Income (pa)"
                    value={values.income}
                    handleChange={handleChange}
                    checks={checks.income}
                    errors={errorMessages.income}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="occupation"
                    label="Occupation"
                    value={values.occupation}
                    options={occupationList}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.occupation}
                    errors={errorMessages.occupation}
                    required
                  />
                </Grid>

                {feeTemplateSubAmountData.length > 0 ? (
                  <Grid item xs={12}>
                    <TableContainer component={Paper} elevation={3}>
                      <Table
                        size="small"
                        stickyHeader
                        sx={{ width: noOfYears.length > 5 ? "120%" : "100%" }}
                      >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Particulars</StyledTableCell>
                            {noOfYears.map((obj, i) => {
                              return (
                                <StyledTableCell key={i} align="right">
                                  {obj.value}
                                </StyledTableCell>
                              );
                            })}
                            <StyledTableCell align="right">
                              Total
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {feeTemplateSubAmountData.map((obj, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>{obj.voucher_head}</TableCell>
                                {noOfYears.map((obj1, j) => {
                                  return (
                                    <TableCell key={j} align="right">
                                      <Typography variant="body2">
                                        {obj["year" + obj1.key + "_amt"]}
                                      </Typography>
                                    </TableCell>
                                  );
                                })}
                                <TableCell align="right">
                                  <Typography variant="subtitle2">
                                    {obj.total_amt}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell>
                              <Typography variant="subtitle2">Total</Typography>
                            </TableCell>
                            {noOfYears.map((obj, i) => {
                              return (
                                <TableCell key={i} align="right">
                                  <Typography variant="subtitle2">
                                    {feeTemplateSubAmountData.length > 0 ? (
                                      feeTemplateSubAmountData[0][
                                        "fee_year" + obj.key + "_amt"
                                      ]
                                    ) : (
                                      <></>
                                    )}
                                  </Typography>
                                </TableCell>
                              );
                            })}
                            <TableCell align="right">
                              <Typography variant="subtitle2">
                                {feeTemplateData.fee_year_total_amount}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          {/* Pre Scholarhip  */}
                          <TableRow>
                            <TableCell>
                              <Typography variant="subtitle2">
                                Pre Scholarship
                              </Typography>
                            </TableCell>
                            {noOfYears.map((obj, i) => {
                              return (
                                <TableCell key={i} align="right">
                                  <CustomTextField
                                    name={"year" + obj.key}
                                    value={
                                      values.scholarshipData["year" + obj.key]
                                    }
                                    handleChange={handleChangeSholarship}
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        "& input": {
                                          textAlign: "right",
                                        },
                                      },
                                    }}
                                  />
                                </TableCell>
                              );
                            })}
                            <TableCell align="right">
                              <Typography variant="subtitle2">
                                {scholarshipTotal}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          {/* Grand Total */}
                          <TableRow>
                            <TableCell>
                              <Typography variant="subtitle2">
                                Grand Total
                              </Typography>
                            </TableCell>
                            {noOfYears.map((obj, i) => {
                              return (
                                <TableCell key={i} align="right">
                                  <Typography variant="subtitle2">
                                    {yearwiseSubAmount["year" + obj.key] -
                                      values.scholarshipData["year" + obj.key]}
                                  </Typography>
                                </TableCell>
                              );
                            })}
                            <TableCell align="right">
                              <Typography variant="subtitle2">
                                {(
                                  feeTemplateData.fee_year_total_amount -
                                  scholarshipTotal
                                ).toString()}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                ) : (
                  <></>
                )}

                <Grid item xs={12} md={4}>
                  <CustomFileInput
                    name="document"
                    label="Document"
                    helperText="PDF - smaller than 2 MB"
                    file={values.document}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.document}
                    errors={errorMessages.document}
                  />
                </Grid>

                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    disabled={
                      loading ||
                      !requiredFieldsValid() ||
                      (scholarshipTotal <= 0 ? true : false)
                    }
                    onClick={handleCreate}
                  >
                    Submit
                  </Button>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default DirectScholarshipForm;
