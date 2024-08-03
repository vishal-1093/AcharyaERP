import { useRef, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const initialValues = {
  cancelReason: "",
};

const requiredFields = ["cancelReason"];

function EmpRetainForm({
  rowData,
  setAlertMessage,
  setAlertOpen,
  setCancelModalOpen,
  getData,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const totalCharacters = 200;
  const remainingCharacter = useRef(200);

  const checks = {
    cancelReason: [values.cancelReason !== ""],
  };

  const errorMessages = {
    cancelReason: ["This field is required"],
  };

  const handleChange = (e) => {
    if (e.target.value.length > totalCharacters) return;

    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    remainingCharacter.current = totalCharacters - e.target.value.length;
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

  const handleRetainCreate = async () => {
    const resignationData = await axios
      .get(`api/employee/resignation/${rowData.id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    if (resignationData.resignation_id) {
      const temp = { ...resignationData };
      temp.reason = values.cancelReason;
      temp.status = 2;

      setLoading(true);

      await axios
        .put(`/api/employee/resignation/${rowData.id}`, temp)
        .then((res) => {
          if (res.data.success === true) {
            setAlertMessage({
              severity: "success",
              message: "Retained successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setCancelModalOpen(false);
            getData();
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box p={2}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <CustomTextField
                name="cancelReason"
                label="Reason"
                value={values.cancelReason}
                handleChange={handleChange}
                checks={checks.cancelReason}
                errors={errorMessages.cancelReason}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} align="right">
              <Typography variant="body2">
                Characters Remaining {remainingCharacter.current}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            color="success"
            onClick={handleRetainCreate}
            disabled={loading || !requiredFieldsValid()}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Retain"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmpRetainForm;
