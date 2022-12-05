import { React, useState, useEffect } from "react";
import axios from "../../../services/Api";
import FormWrapper from "../../../components/FormWrapper";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = { program_id: "", trans_id: "" };
const requiredFields = ["program_id", "trans_id"];

function TranscriptAssignmentForm() {
  const [values, setValues] = useState(initialValues);
  const [transcript, setTranscript] = useState([]);
  const [program, setProgram] = useState([]);
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const setCrumbs = useBreadcrumbs();

  const checks = {
    trans_id: [values.trans_id !== ""],
    program_id: [values.program_id !== ""],
  };

  const errorMessages = {
    trans_id: ["This field required"],
    program_id: ["This field required"],
  };

  const handleSelectAll = () => {
    setValues((prev) => ({
      ...prev,
      program_id: program.map((obj) => obj.value),
    }));
  };
  const handleSelectNone = () => {
    setValues((prev) => ({ ...prev, program_id: [] }));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "trans_id") {
      axios
        .get(`/api/academic/allUnassignedProgramDetail/${newValue}`)
        .then((res) => {
          setProgram(
            res.data.data.map((obj) => ({
              value: obj.program_id,
              label: obj.program_name,
            }))
          );
        });
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      })).catch((err) => console.error(err));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };
  useEffect(() => {
    getTranscriptData();
  }, []);

  const getTranscriptData = async () => {
    await axios
      .get(`/api/academic/ProgramTranscript`)
      .then((res) => {
        setTranscript(
          res.data.data.map((obj) => ({
            value: obj.trans_id,
            label: obj.transcript,
          })),
          setCrumbs([
            { name: "TranscriptMaster", link: "/TranscriptMaster" },
            { name: "TranscriptAssignment" },
            { name: "Assign" },
          ])
        );
      })
      .catch((err) => console.error(err));
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

  const handleSubmit = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.program_id = values.program_id;
      temp.trans_id = values.trans_id;
      await axios
        .post(`/api/academic/ProgramTranscriptDetails`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/TranscriptMaster", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
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
          justifyContent="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="trans_id"
              label="Transcript"
              options={transcript}
              handleChangeAdvance={handleChangeAdvance}
              value={values.trans_id}
              checks={checks.trans_id}
              errors={errorMessages.trans_id}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CheckboxAutocomplete
              name="program_id"
              label="Program"
              options={program}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              value={values.program_id}
              checks={checks.program_id}
              errors={errorMessages.program_id}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              textAlign="right"
            >
              <Grid item xs={2}>
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  ASSIGN
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}
export default TranscriptAssignmentForm;
