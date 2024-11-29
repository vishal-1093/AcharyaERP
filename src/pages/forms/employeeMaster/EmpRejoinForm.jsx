import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import domainUrl from "../../../services/Constants";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import { useNavigate } from "react-router-dom";
import { GenerateOfferLetter } from "../jobPortal/GenerateOfferLetter";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import {
  convertDateToString,
  convertToDMY,
} from "../../../utils/DateTimeUtils";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";

const SalaryBreakupViewByOfferId = lazy(() =>
  import("../../../components/SalaryBreakupViewByOfferId")
);

const initialValues = {
  offer: false,
  jobForm: false,
  reportId: null,
  dateofJoining: null,
  comments: "",
  offerstatus: "",
};

const requiredFields = ["reportId", "dateofJoining", "comments"];

function EmpRejoinForm({
  rowData,
  setAlertMessage,
  setAlertOpen,
  setRejoinWrapperOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [confirmRejoin, setConfirmRejoin] = useState(false);
  const [offerLetterLoading, setOfferLetterLoading] = useState(false);
  const [reportOptions, setReportOptions] = useState([]);
  const [offerDetailsData, setOfferDetailsData] = useState([]);
  const [mailLoading, setMailLoading] = useState(false);
  const [rejoinLoading, setRejoinLoading] = useState(false);
  const [confirmMail, setConfirmMail] = useState(false);

  const { job_id, emp_id, id } = rowData;

  const navigate = useNavigate();

  const checks = {
    dateofJoining: [values.dateofJoining !== null],
    comments: [values.comments !== ""],
  };

  const errorMessages = {
    dateofJoining: ["This field required"],
    comments: ["This field required"],
  };

  useEffect(() => {
    getReportOptions();
    getOfferDetailsData();
  }, []);

  const getReportOptions = async () => {
    try {
      const response = await axios.get("/api/employee/EmployeeDetails");
      const optionData = [];
      response.data.data.forEach((obj) => {
        optionData.push({
          value: obj.emp_id,
          label: obj.email,
        });
      });
      setReportOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
      setRejoinWrapperOpen(false);
    }
  };

  const getOfferDetailsData = async () => {
    try {
      const { data: jobResponse } = await axios.get(
        `/api/employee/offerDetailsByJobId/${job_id}`
      );
      const jobData = jobResponse?.data?.[0];
      const { offer_id: offerId } = jobData;
      const { data: offerResponse } = await axios.get(
        `/api/employee/Offer/${offerId}`
      );
      const responseData = offerResponse.data;

      const { report_id, date_of_joining, comments } = responseData;
      setValues((prev) => ({
        ...prev,
        reportId: report_id,
        dateofJoining: date_of_joining
          ? moment(date_of_joining, "DD-MM-YYYY")
          : null,
        comments: comments ?? "",
      }));
      setOfferDetailsData(responseData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
      setRejoinWrapperOpen(false);
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
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

  const handleCreate = async () => {
    const { dateofJoining, comments, reportId, offerstatus } = values;
    try {
      setLoading(true);
      const putData = { ...offerDetailsData };
      const reportName = reportOptions.find(
        (obj) => obj.value === reportId
      )?.label;
      putData.date_of_joining = moment(dateofJoining).format("DD-MM-YYYY");
      putData.comments = comments;
      putData.report_id = reportId;
      putData.offerstatus = offerstatus;
      putData.email = reportName;
      const { data: response } = await axios.put(
        `/api/employee/OfferLetter/${offerDetailsData.offer_id}`,
        putData
      );

      if (response.success) {
        setAlertMessage({
          severity: "success",
          message: "Saved successfully !!",
        });
        setAlertOpen(true);
        setValues(initialValues);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to save the data",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
      setRejoinWrapperOpen(false);
    }
  };

  const handleRejoin = async () => {
    try {
      setRejoinLoading(true);

      const { data: response } = await axios.post(
        `/api/employee/rejoinEmployeeDetails/${emp_id}`
      );

      if (response.success) {
        const resignationResponse = await axios.get(
          `api/employee/resignation/${id}`
        );
        const empResponse = await axios.get(
          `/api/employee/getEmployeeDetailsByJobId/${job_id}`
        );
        const resignationData = resignationResponse.data.data;
        const empData = empResponse.data.data;
        const offerData = { ...offerDetailsData };

        resignationData.resignation_status = true;

        empData.annual_salary = offerData["basic"];
        empData.cca = offerData["cca"];
        empData.cea = offerData["cea"];
        empData.cha = offerData["cha"];
        empData.ctc = offerData["ctc"];
        empData.da = offerData["da"];
        empData.fr = offerData["fr"];
        empData.grosspay_ctc = offerData["gross"];
        empData.hra = offerData["hra"];
        empData.me = offerData["me"];
        empData.mr = offerData["mr"];
        empData.net_pay = offerData["net_pay"];
        empData.other_allow = offerData["other_allow"];
        empData.punched_card_status = "mandatory";
        empData.pt = offerData["pt"];
        empData.spl_1 = offerData["spl_1"];
        empData.ta = offerData["ta"];

        const [resignationStatus, inactiveStatus, empStatus] =
          await Promise.all([
            axios.put(`/api/employee/resignation/${id}`, resignationData),
            axios.delete(`/api/activateUserByEmployeeId/${emp_id}`),
            axios.put(
              `/api/employee/updateEmployeeDetailsAfterRejoin/${empData.emp_id}`,
              empData
            ),
          ]);

        if (empStatus.data.success) {
          setAlertMessage({
            severity: "success",
            message: "Rejoined successfully !!",
          });
          setAlertOpen(true);
        }
      } else {
        setAlertMessage({
          severity: "error",
          message: "Something went wrong !!",
        });
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to rejoin",
      });
      setAlertOpen(true);
    } finally {
      setRejoinLoading(false);
      setRejoinWrapperOpen(false);
    }
  };

  const handleSubmitRejoin = () => {
    setConfirmRejoin(true);
    setValues(initialValues);
  };

  const handleDownloadOffer = async () => {
    try {
      setValues(initialValues);
      setOfferLetterLoading(true);

      const empResponse = await axios.get(
        `/api/employee/getJobProfileNameAndEmail/${job_id}`
      );
      const getEmpData = empResponse.data;

      if (getEmpData) {
        getEmpData.firstname =
          getEmpData.gender === "M"
            ? `Mr. ${getEmpData.firstname}`
            : getEmpData.gender === "F"
            ? `Ms. ${getEmpData.firstname}`
            : getEmpData.firstname;
      }
      offerDetailsData.school_name_short = rowData.school_name_short;
      offerDetailsData.school_name = rowData.school_name;
      offerDetailsData.dept_name = rowData.dept_name;

      const blobFile = await GenerateOfferLetter(
        offerDetailsData,
        getEmpData,
        rowData.org_type
      );

      if (blobFile) {
        window.open(URL.createObjectURL(blobFile));
      } else {
        setAlertMessage({
          severity: "error",
          message: "Failed to generate the offer letter !!",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      console.error(err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setAlertMessage({
        severity: "error",
        message: `An error occurred: ${errorMessage}`,
      });
      setAlertOpen(true);
    } finally {
      setOfferLetterLoading(false);
    }
  };

  const handleMail = async () => {
    try {
      setMailLoading(true);
      const putData = { ...offerDetailsData };
      putData.mail = true;
      const { data: response } = await axios.post(
        `/api/employee/emailForOffer?url_domain=${domainUrl}offeraccepted&job_id=${id}&offer_id=${offerDetailsData.offer_id}`
      );
      if (response.success) {
        setMailLoading(false);
        setAlertMessage({
          severity: "success",
          message: "Offer letter has been sent to the candidate Successfully",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setAlertMessage({
        severity: "error",
        message: `An error occurred: ${errorMessage}`,
      });
      setAlertOpen(true);
    } finally {
      setMailLoading(false);
      setRejoinWrapperOpen(false);
    }
  };

  const switchLabels = (label) => (
    <Typography variant="subtitle2" color="primary">
      {label}
    </Typography>
  );

  const displayLabels = (label) => (
    <Typography variant="subtitle2">{label}</Typography>
  );

  const displayValues = (label) => (
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
  );

  return (
    <Box sx={{ padding: 1 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <FormGroup row>
              {offerDetailsData.ctc_status !== 2 && (
                <FormControlLabel
                  label={switchLabels("Salary Breakup")}
                  control={
                    <Switch
                      name="offer"
                      checked={values.offer}
                      onChange={handleSwitchChange}
                    />
                  }
                />
              )}

              <FormControlLabel
                label={switchLabels("Job Form")}
                control={
                  <Switch
                    name="jobForm"
                    checked={values.jobForm}
                    onChange={handleSwitchChange}
                  />
                }
              />
            </FormGroup>
            {offerDetailsData.ctc_status !== 2 && (
              <Button
                size="small"
                endIcon={<DownloadIcon />}
                onClick={handleDownloadOffer}
                disabled={offerLetterLoading}
              >
                {offerLetterLoading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Download Offer"
                )}
              </Button>
            )}

            <Button
              size="small"
              endIcon={<EditIcon />}
              onClick={() =>
                navigate(
                  `/jobportal/salary-breakup/New/${job_id}/${offerDetailsData.offer_id}/change`
                )
              }
            >
              Change Offer
            </Button>
            {offerDetailsData.offerstatus && (
              <Button
                size="small"
                endIcon={<AddBoxIcon />}
                onClick={handleSubmitRejoin}
                disabled={loading}
              >
                Rejoin
              </Button>
            )}
          </Stack>
        </Grid>

        {values.offer && (
          <Grid item xs={12}>
            <SalaryBreakupViewByOfferId id={offerDetailsData.offer_id} />
          </Grid>
        )}

        {values.jobForm && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="reportId"
                    label="Reporting To"
                    value={values.reportId}
                    options={reportOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomDatePicker
                    name="dateofJoining"
                    label="Date of joining"
                    value={values.dateofJoining}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.dateofJoining}
                    errors={errorMessages.dateofJoining}
                    minDate={
                      values.dateofJoining === null ||
                      convertDateToString(new Date()) <
                        convertDateToString(new Date(values.dateofJoining))
                        ? new Date()
                        : values.dateofJoining
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="comments"
                    label="Comments"
                    value={values.comments}
                    handleChange={handleChange}
                    checks={checks.comments}
                    errors={errorMessages.comments}
                    multiline
                    required
                  />
                </Grid>

                {(offerDetailsData.offerstatus === null ||
                  offerDetailsData.offerstatus === false) &&
                  offerDetailsData.report_id && (
                    <Grid item xs={12}>
                      <CustomRadioButtons
                        name="offerstatus"
                        label="HR Manual Offer Status"
                        value={values.offerstatus}
                        items={[
                          { value: true, label: "Accepted" },
                          { value: false, label: "Rejected" },
                        ]}
                        handleChange={handleChange}
                        required
                      />
                      <Typography variant="subtitle2" display="inline">
                        *Note :
                      </Typography>
                      <Typography variant="body2" display="inline">
                        &nbsp;For consultant onboarding HR Manual Offer Status
                        should be done manually.
                      </Typography>
                    </Grid>
                  )}

                {offerDetailsData.offerstatus && (
                  <Grid item xs={12} md={4}>
                    <Grid container rowSpacing={2}>
                      <Grid item xs={12} md={4}>
                        {displayLabels("Offer Status")}
                      </Grid>
                      <Grid item xs={12} md={8}>
                        {displayValues(
                          offerDetailsData.offerstatus
                            ? "Accepted"
                            : "Not Accepted"
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {displayLabels("Accecpted On")}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {displayValues(
                          `${convertToDMY(
                            offerDetailsData.modified_date.slice(0, 10)
                          )}`
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {displayLabels("IP Address")}
                        <Typography variant="subtitle2"></Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {displayValues(offerDetailsData.ip_address)}
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {!offerDetailsData.offerstatus && (
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1} justifyContent="right">
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={loading || !requiredFieldsValid()}
                        onClick={handleCreate}
                      >
                        {loading ? (
                          <CircularProgress
                            size={25}
                            color="blue"
                            style={{ margin: "2px 13px" }}
                          />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      {offerDetailsData.report_id &&
                        offerDetailsData.mail !== true &&
                        offerDetailsData.ctc_status !== 2 &&
                        !confirmMail && (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => setConfirmMail(true)}
                          >
                            Send Mail
                          </Button>
                        )}
                      {confirmMail && (
                        <>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => setConfirmMail(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            disabled={mailLoading}
                            onClick={handleMail}
                          >
                            {mailLoading ? (
                              <CircularProgress
                                size={25}
                                color="blue"
                                style={{ margin: "2px 13px" }}
                              />
                            ) : (
                              "Confirm"
                            )}
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        )}

        {confirmRejoin && (
          <Grid item xs={12} align="right">
            <Button variant="contained" size="small" onClick={handleRejoin}>
              {rejoinLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Confirm"
              )}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default EmpRejoinForm;
