import { useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";

function AssignUsnForm({ rowData, setUsnModal, getData }) {
  const [values, setValues] = useState({ usn: rowData.usn ?? "" });
  const [usnLoading, setUsnLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const maxLength = 20;

  const handleChange = (e) => {
    if (e.target.value.length > maxLength) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleValidate = () => values.usn === "" || usnLoading;

  const handleCreate = async () => {
    try {
      setUsnLoading(true);
      const { auid } = rowData;
      const { usn } = values;

      const putData = {
        auid,
        usn,
      };
      const resposne = await axios.put(
        `/api/student/updateUsnDetailsData/${auid}`,
        putData
      );

      const status = resposne.status;

      if (status === 200 || status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Student USN has been updated successfully !!",
        });
        setAlertOpen(true);
        getData();
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Unable to update the USN !!",
      });
      setAlertOpen(true);
    } finally {
      setUsnLoading(false);
      setUsnModal(false);
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}>
      <Grid container>
        <Grid item xs={12}>
          <CustomTextField
            name="usn"
            label="USN"
            value={values.usn}
            handleChange={handleChange}
            helperText={`Remaining characters : ${getRemainingCharacters(
              "usn"
            )}`}
            required
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            disabled={handleValidate()}
            onClick={handleCreate}
          >
            {usnLoading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong>Update</strong>
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AssignUsnForm;
