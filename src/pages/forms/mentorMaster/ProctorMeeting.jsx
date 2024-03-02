import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import useAlert from "../../../hooks/useAlert";
import ProctorStudentMeeting from "./ProctorStudentMeeting";

const initialValues = {
  meetingType: "",
};

const requiredFields = ["meetingType"];

function ProctorMeeting() {
  const [values, setValues] = useState(initialValues);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    meetingType: [values.meetingType !== ""],
  };

  const errorMessages = {
    meetingType: ["This field required"],
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please select meeting type",
      });
      setAlertOpen(true);
    } else if (values.meetingType === "psm") {
      navigate("/ProctorStudentMeeting");
    } else if (values.meetingType === "ppm") {
    } else {
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
            <CustomSelect
              name="meetingType"
              label="Meetng Type"
              value={values.meetingType}
              items={[
                { label: "Proctor to student meeting", value: "psm" },
                // { label: "Proctor to parent meeting", value: "ppm" },
              ]}
              handleChange={handleChange}
              checks={checks.meetingType}
              errors={errorMessages.meetingType}
              required
            />
          </Grid>

          <Grid item xs={12} mf={8}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleCreate}
            >
              <strong>{"Submit"}</strong>
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ProctorMeeting;
