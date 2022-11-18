import { useState, useEffect } from "react";
import { Box, Grid, Button, Divider, Typography } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import ApiUrl from "../../../services/Api";
import axios from "axios";
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
};
const requiredFields = ["report_id", "date_of_joining", "remarks"];

const OfferForm = () => {
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

  useEffect(() => {
    getReportOptions();
    getEmployeeDetails();
    offerDetails();
  }, []);

  const getReportOptions = () => {
    axios
      .get(`${ApiUrl}/UserAuthentication`)
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
      .get(`${ApiUrl}/employee/getJobProfileNameAndEmail/${id}`)
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
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const offerDetails = () => {
    axios
      .get(`${ApiUrl}/employee/Offer/${offerId}`)
      .then((res) => {
        setOfferData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    console.log(newValue);
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = async () => {
    offerData.date_of_joining = values.date_of_joining;
    offerData.remarks = values.remarks;
    offerData.report_id = values.report_id;

    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      values.mail = true;
      values.email = reportOptions
        .filter((f) => f.value === values.report_id)
        .map((val) => val.label)
        .toString();
      console.log(values);
      await axios
        .put(`${ApiUrl}/employee/OfferLetter/${offerId}`, offerData)
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
      await axios
        .post(`${ApiUrl}/employee/emailForOffer/${id}/${offerId}`)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Offer letter sent to candidate Successfully",
          });
          setAlertOpen(true);
          navigate("/JobPortal", { replace: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
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
                disabled={values.mail}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="date_of_joining"
                label="Date of joining"
                value={values.date_of_joining}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.date_of_joining}
                errors={errorMessages.date_of_joining}
                required
                disableFuture
                disabled={values.mail}
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
                disabled={values.mail}
                required
              />
            </Grid>

            {values.mail ? (
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
              ""
            )}

            <Grid item xs={12} textAlign="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handleCreate}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
};

export default OfferForm;
