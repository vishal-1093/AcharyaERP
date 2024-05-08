import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import {
  convertDateToString,
  convertToDMY,
} from "../../../utils/DateTimeUtils";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import moment from "moment";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomModal = lazy(() => import("../../../components/CustomModal"));

const initialValues = {
  report_id: "",
  dateofJoining: null,
  comments: "",
  offerstatus: "",
};
const requiredFields = ["report_id", "dateofJoining", "comments"];

function OfferForm() {
  const [values, setValues] = useState(initialValues);
  const [reportOptions, setReportOptions] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mailLoading, setMailLoading] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id, offerId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    report_id: [values.report_id !== ""],
    dateofJoining: [values.dateofJoining !== null],
    comments: [values.comments !== ""],
  };

  const errorMessages = {
    report_id: ["This field required"],
    dateofJoining: ["This field required"],
    comments: ["This field required"],
  };

  useEffect(() => {
    getReportOptions();
    getEmployeeDetails();
    offerDetails();
  }, []);

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

  const getReportOptions = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.emp_id,
            label: obj.email,
          });
        });
        setReportOptions(optionData);
      })
      .catch((err) => console.error(err));
  };
  const getEmployeeDetails = async () => {
    await axios
      .get(`/api/employee/getJobProfileNameAndEmail/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Job Portal", link: "/jobportal" },
          { name: res.data.firstname },
          { name: "Job Offer" },
        ]);
        setCandidateEmail(res.data.email);
      })
      .catch((err) => console.error(err));
  };

  const offerDetails = async () => {
    await axios
      .get(`/api/employee/Offer/${offerId}`)
      .then((res) => {
        setOfferData(res.data.data);

        setValues((prev) => ({
          ...prev,
          report_id: res.data.data.report_id,
          dateofJoining:
            res.data.data.date_of_joining !== null
              ? new Date(
                  res.data.data.date_of_joining?.split("-").reverse().join("-")
                )
              : null,
          comments: res.data.data.comments ? res.data.data.comments : "",
          offerstatus: res.data.data.offerstatus,
        }));
      })
      .catch((err) => console.error(err));
  };

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

  const handleCreate = async () => {
    const temp = { ...offerData };
    temp.date_of_joining = moment(values.dateofJoining).format("DD-MM-YYYY");
    temp.comments = values.comments;
    temp.report_id = values.report_id;
    temp.offerstatus = values.offerstatus;
    const reportingFilter = reportOptions.filter(
      (f) => f.value === values.report_id
    );
    temp.email = reportingFilter[0].label;

    setLoading(true);
    await axios
      .put(`/api/employee/OfferLetter/${offerId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Saved successfully !!",
          });
          setAlertOpen(true);
          navigate("/OfferForm/" + id + "/" + offerId, { replace: true });
          offerDetails();
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleMail = () => {
    const sendMail = async () => {
      const temp = { ...offerData };
      temp.mail = true;
      setMailLoading(true);
      await axios
        .post(
          `/api/employee/emailForOffer?url_domain=https://456b-2401-4900-1f27-5868-15f9-f9fc-945-3303.ngrok-free.app/offeraccepted&job_id=${id}&offer_id=${offerId}`
        )
        .then((res) => {
          axios
            .put(`/api/employee/OfferLetter/${offerId}`, temp)
            .then((offerRes) => {
              if (offerRes.status === 200 || offerRes.status === 201) {
                setMailLoading(false);
                setAlertMessage({
                  severity: "success",
                  message: "Offer letter sent to candidate Successfully",
                });
                setAlertOpen(true);
                navigate("/JobPortal", { replace: true });
              }
            })
            .catch((err) => {
              setAlertMessage({
                severity: "error",
                message: err.response
                  ? err.response.data.message
                  : "An error occured",
              });
              setAlertOpen(true);
              setMailLoading(false);
            });
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
          setMailLoading(false);
        });
    };

    setConfirmContent({
      title: "",
      message: "Do you want to send mail?",
      buttons: [
        { name: "Yes", color: "primary", func: sendMail },
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

      <Box p={1}>
        <FormWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="report_id"
                label="Reporting To"
                value={values.report_id}
                options={reportOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.report_id}
                errors={errorMessages.report_id}
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
                rows={2}
                required
              />
            </Grid>
            {(offerData.offerstatus === null ||
              offerData.offerstatus === false) &&
            offerData.report_id ? (
              <Grid item xs={12} md={4}>
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
                  &nbsp;For consultant onboarding HR Manual Offer Status should
                  be done manually.
                </Typography>
              </Grid>
            ) : (
              <></>
            )}

            {offerData.offerstatus === true ? (
              <>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Grid container rowSpacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2">
                            Offer Status
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {offerData.offerstatus ? (
                            <CheckCircleOutlineRoundedIcon
                              sx={{ color: "green" }}
                            />
                          ) : (
                            <HighlightOffRoundedIcon sx={{ color: "red" }} />
                          )}
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2">
                            Accecpted On
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            {`${convertToDMY(
                              offerData.modified_date.slice(0, 10)
                            )}`}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2">Email</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            {candidateEmail}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2">
                            IP Address
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            {offerData.ip_address}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            ) : (
              <></>
            )}
            {offerData.offerstatus !== true ? (
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

                  {offerData.report_id &&
                  offerData.mail !== true &&
                  offerData.ctc_status !== 2 ? (
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
                        "Send Mail"
                      )}
                    </Button>
                  ) : (
                    ""
                  )}
                </Stack>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}

export default OfferForm;
