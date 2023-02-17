import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomModal from "../../../components/CustomModal";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import {
  convertDateToString,
  convertToDMY,
} from "../../../utils/DateTimeUtils";

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

  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id, offerId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    report_id: [values.report_id !== ""],
    dateofJoining: values.dateofJoining
      ? [
          convertDateToString(new Date(values.dateofJoining)) >=
            convertDateToString(new Date()),
        ]
      : [values.dateofJoining !== null],
    comments: [values.comments !== ""],
  };

  const errorMessages = {
    report_id: ["This field required"],
    dateofJoining: values.dateofJoining
      ? ["Date of joining should be greater than or equal current date !!"]
      : ["This field required"],
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
        setReportOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.email,
          }))
        );
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
          dateofJoining: res.data.data.date_of_joining,
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);

      offerData.date_of_joining = values.dateofJoining;
      offerData.comments = values.comments;
      offerData.report_id = values.report_id;
      offerData.offerstatus = values.offerstatus;
      offerData.email = reportOptions
        .filter((f) => f.value === values.report_id)
        .map((val) => val.label)
        .toString();

      await axios
        .put(`/api/employee/OfferLetter/${offerId}`, offerData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setLoading(false);
            setAlertMessage({
              severity: "success",
              message: "Data saved successfully",
            });
            setAlertOpen(true);
            navigate("/OfferForm/" + id + "/" + offerId, { replace: true });
            offerDetails();
          }
        })
        .catch((err) => console.error(err));

      // if (offerData.mail) {
      //   await axios
      //     .post(
      //       `/api/employee/emailForOffer?url_domain=http://192.168.0.161:3000/offeraccepted&job_id=${id}&offer_id=${offerId}`
      //     )
      //     .then((res) => {})
      //     .catch((err) => console.error(err));
      // }
    }
  };

  const handleMail = () => {
    const sendMail = async () => {
      offerData.mail = true;
      setMailLoading(true);
      await axios
        .post(
          `/api/employee/emailForOffer?url_domain=http://192.168.0.161:3000/offeraccepted&job_id=${id}&offer_id=${offerId}`
        )
        .then((res) => {})
        .catch((err) => console.error(err));

      await axios
        .put(`/api/employee/OfferLetter/${offerId}`, offerData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setMailLoading(false);
            setAlertMessage({
              severity: "success",
              message: "Offer letter sent to candidate Successfully",
            });
            setAlertOpen(true);
            navigate("/JobPortal", { replace: true });
          }
        })
        .catch((err) => console.error(err));
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

      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
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

            <Grid item xs={12} md={4} mt={2}>
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
                multiline
                rows={2}
                name="comments"
                label="Comments"
                value={values.comments}
                handleChange={handleChange}
                checks={checks.comments}
                errors={errorMessages.comments}
                required
              />
            </Grid>

            {offerData.mail &&
            (offerData.offerstatus === null ||
              offerData.offerstatus === false) ? (
              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  name="offerstatus"
                  label="Offer Status"
                  value={values.offerstatus}
                  items={[
                    { value: true, label: "Accepted" },
                    { value: false, label: "Rejected" },
                  ]}
                  handleChange={handleChange}
                  required
                />
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
              <Grid item xs={12} textAlign="right">
                <Grid container rowSpacing={{ xs: 2 }}>
                  <Grid
                    item
                    xs={12}
                    md={offerData.report_id ? 11 : 12}
                    textAlign="right"
                  >
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={loading}
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
                  </Grid>
                  {offerData.report_id ? (
                    <Grid item xs={12} md={1} textAlign="right">
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
                    </Grid>
                  ) : (
                    <></>
                  )}
                </Grid>
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
