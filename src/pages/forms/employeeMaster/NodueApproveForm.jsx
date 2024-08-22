import { useRef, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import moment from "moment";

const initialValues = { comments: "" };

const requiredFields = [];

function NodueApproveForm({
  rowData,
  getData,
  setModalOpen,
  setAlertMessage,
  setAlertOpen,
  userId,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const totalCharacters = 200;
  const remainingCharacter = useRef(200);

  const checks = {
    comments: [values.comments !== ""],
  };

  const errorMessages = {
    comments: ["This field is required"],
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

  const handleCreate = async () => {
    const getIpAddress = await fetch("https://api.ipify.org?format=json")
      .then((data) => data.json())
      .then((res) => res.ip)
      .catch((err) => console.error(err));

    const resignationData = await axios
      .get(`/api/employee/resignation/${rowData.id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const noDueData = await axios
      .get(`/api/employee/getAllNoDueAssignmentData/${rowData.id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const filterNoDueData = noDueData.filter(
      (obj) => obj.approver_id === userId
    );

    const approvePending = noDueData.filter(
      (obj) => obj.no_due_status !== true
    );

    const checkDuplicateApprover = approvePending.filter(
      (obj) => obj.approver_id === userId
    );

    if (filterNoDueData.length > 0) {
      setLoading(true);

      if (approvePending.length === checkDuplicateApprover.length) {
        resignationData.nodues_approve_status = 2;

        await axios
          .put(`/api/employee/resignation/${rowData.id}`, resignationData)
          .then((res) => {})
          .catch((err) => console.error(err));
      }

      const putData = [];
      const ids = [];

      filterNoDueData.forEach((obj) => {
        putData.push({
          no_dues_assignment_id: obj.id,
          comments: values.comments,
          no_due_status: true,
          approver_date: moment(),
          ip_address: getIpAddress,
        });
        ids.push(obj.id);
      });

      await axios
        .put(`/api/employee/updateNoDuesAssignment/${ids.toString()}`, putData)
        .then((res) => {
          if (res.data.success === true) {
            setAlertMessage({
              severity: "success",
              message: "Approved successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setModalOpen(false);
            getData();
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
          setModalOpen(false);
        });
    } else {
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
      setLoading(false);
      setModalOpen(false);
    }
  };

  return (
    <Box p={2}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <CustomTextField
                name="comments"
                label="Comments"
                value={values.comments}
                handleChange={handleChange}
                checks={checks.comments}
                errors={errorMessages.comments}
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
            onClick={handleCreate}
            disabled={loading || !requiredFieldsValid()}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "No Dues"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NodueApproveForm;
