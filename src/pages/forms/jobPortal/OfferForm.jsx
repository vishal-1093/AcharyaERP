import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  report_id: "",
  date_of_joining: null,
  remarks: "",
  offerstatus: "",
};
const requiredFields = ["report_id", "date_of_joining", "remarks"];

function OfferForm() {
  const [values, setValues] = useState(initialValues);
  const [reportOptions, setReportOptions] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id, offerId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    report_id: [values.report_id !== ""],
    date_of_joining: [values.date_of_joining !== ""],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    report_id: ["This field required"],
    date_of_joining: ["This field required"],
    remarks: ["This field required"],
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
      .get(`/api/UserAuthentication`)
      .then((res) => {
        setReportOptions(
          res.data.data.map((obj) => ({
            value: obj.id,
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
          { name: "Job Offer" },
          { name: res.data.job_id },
          { name: res.data.firstname },
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
          date_of_joining: res.data.data.date_of_joining,
          remarks: res.data.data.remarks,
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
    offerData.date_of_joining = values.date_of_joining;
    offerData.remarks = values.remarks;
    offerData.report_id = values.report_id;
    offerData.offerstatus = values.offerstatus;

    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      offerData.mail = true;
      offerData.email = reportOptions
        .filter((f) => f.value === values.report_id)
        .map((val) => val.label)
        .toString();

      if (offerData.mail) {
        await axios
          .post(
            `/api/employee/emailForOffer?url_domain=http://192.168.0.161:3000/offeraccepted&job_id=${id}&offer_id=${offerId}`
          )
          .then((res) => {})
          .catch((err) => {
            console.error(err);
          });
      }

      await axios
        .put(`/api/employee/OfferLetter/${offerId}`, offerData)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: offerData.mail
              ? "Data saved successfully"
              : "Offer letter sent to candidate Successfully",
          });
          setAlertOpen(true);
          navigate("/JobPortal", { replace: true });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
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
              disabled={offerData.mail}
              required
            />
          </Grid>

          <Grid item xs={12} md={4} mt={2}>
            <CustomDatePicker
              name="date_of_joining"
              label="Date of joining"
              value={values.date_of_joining}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.date_of_joining}
              errors={errorMessages.date_of_joining}
              required
              disablePast
              disabled={offerData.mail}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2}
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
              disabled={offerData.mail}
              required
            />
          </Grid>

          {offerData.mail ? (
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

          <Grid item xs={12} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || offerData.offerstatus}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Save</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default OfferForm;
