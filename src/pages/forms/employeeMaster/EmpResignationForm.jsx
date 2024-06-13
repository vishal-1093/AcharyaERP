import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useAlert from "../../../hooks/useAlert";
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);

const initialValues = {
  comments: "",
  requestedDate: null,
  reason: "",
  remarks: "",
};

const requiredFields = ["requestedDate", "reason", "remarks"];

const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;

function EmpResignationForm() {
  const [values, setValues] = useState(initialValues);
  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    comments: [values.comments !== "", values.comments.length < 100],
    requestedDate: [values.requestedDate !== null],
    reason: [values.reason !== "", values.reason.length < 100],
    remarks: [values.remarks !== "", values.remarks.length < 100],
  };

  const errorMessages = {
    comments: ["This field is required", "Maximum characters 100"],
    requestedDate: ["This field is required"],
    reason: ["This field is required", "Maximum characters 100"],
    remarks: ["This field is required", "Maximum characters 100"],
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  const getEmployeeData = async () => {
    if (userId)
      await axios
        .get(`/api/employee/getEmployeeDetailsByUserID/${userId}`)
        .then((res) => {
          setEmpData(res.data.data);
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
    const temp = {};
    temp.active = true;
    temp.emp_id = empData.emp_id;
    temp.comments =
      "<p style='margin-bottom: 15px;'>Dear Sir/Madam,</p><p style='margin-bottom: 8px;'>It is with regret that I tender my resignation as &nbsp;&nbsp;<b>" +
      empData?.designation_name +
      "</b></p><p style='margin-bottom: 15px;text-align:justify'>May I take this opportunity to thank you for all of the invaluable help, advice and encouragement that you have given me during my service in your esteemed organisation. I have thoroughly enjoyed my time here but I feel the moment is now right for me to take up new responsibilities and challenges.</p><p>Yours sincerely</p>";
    temp.requested_relieving_date = values.requestedDate;
    temp.employee_reason = values.reason;
    temp.additional_reason = values.remarks;

    await axios
      .post("/api/employee/resignation", temp)
      .then((res) => {
        if (res.data.status === 201) {
          setValues((prev) => ({
            ...prev,
            ["comments"]: "",
            ["requestedDate"]: null,
            ["reason"]: "",
            ["remarks"]: "",
          }));
          setAlertMessage({
            severity: "success",
            message: "Relieving request sent successfully !!",
          });
          setAlertOpen(true);
          setLoading(false);
        } else {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!",
          });
          setAlertOpen(true);
          setLoading(false);
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

  const content = () => {
    return (
      <div>
        <p style={{ marginBottom: "15px" }}>Dear Sir/Madam,</p>
        <p style={{ marginBottom: "8px" }}>
          It is with regret that I tender my resignation as &nbsp;&nbsp;
          <b>{empData?.designation_name}</b>
        </p>
        <p style={{ marginBottom: "15px", textAlign: "justify" }}>
          May I take this opportunity to thank you for all of the invaluable
          help, advice and encouragement that you have given me during my
          service in your esteemed organisation. I have thoroughly enjoyed my
          time here but I feel the moment is now right for me to take up new
          responsibilities and challenges.
        </p>
        <p>Yours sincerely</p>
      </div>
    );
  };

  return (
    <Box>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <IconButton>
                  <ExitToAppIcon sx={{ color: "#f7f7f7", fontSize: 25 }} />
                </IconButton>
              }
              title="Apply for Resignation"
              titleTypographyProps={{ variant: "subtitle2", fontSize: 14 }}
              subheader={empData?.employee_name + " - " + empData?.empcode}
              subheaderTypographyProps={{ variant: "body2", color: "#f7f7f7" }}
              sx={{
                backgroundColor: "blue.main",
                color: "headerWhite.main",
                padding: 1,
              }}
            />
            <CardContent>
              <Grid container>
                <Grid item xs={12} p={2}>
                  <Grid container rowSpacing={4}>
                    <Grid item xs={12}>
                      {content()}
                    </Grid>

                    <Grid item xs={12}>
                      <CustomDatePicker
                        name="requestedDate"
                        label="Expected Relieving Date"
                        value={values.requestedDate}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.requestedDate}
                        errors={errorMessages.requestedDate}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomTextField
                        name="reason"
                        label="Reason For Leaving"
                        value={values.reason}
                        handleChange={handleChange}
                        checks={checks.reason}
                        errors={errorMessages.reason}
                        multiline
                        rows={2}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomTextField
                        name="remarks"
                        label="Addtional Remarks"
                        value={values.remarks}
                        handleChange={handleChange}
                        checks={checks.remarks}
                        errors={errorMessages.remarks}
                        multiline
                        rows={2}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        color="error"
                        sx={{
                          fontSize: 14,
                          textAlign: "justify",
                          marginTop: 1,
                        }}
                      >
                        Please note hard copy of Resignation Letter to be
                        submitted to HR Department with reporting officer
                        signature.
                      </Typography>
                    </Grid>

                    <Grid item xs={12} align="right" mt={2}>
                      <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={loading || !requiredFieldsValid()}
                        sx={{
                          backgroundColor: "blue.main",
                          ":hover": {
                            bgcolor: "blue.main",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress
                            size={25}
                            color="blue"
                            style={{ margin: "2px 13px" }}
                          />
                        ) : (
                          <Typography variant="subtitle2">Apply</Typography>
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmpResignationForm;
