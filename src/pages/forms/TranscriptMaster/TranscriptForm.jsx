import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initialValues = {
  transcript: "",
  shortName: "",
  priority: "",
};

const requiredFields = ["transcript", "shortName", "priority"];

function TranscriptForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [transcriptId, setTranscriptId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    transcript: [
      values.transcript !== "",
      values.transcript.trim().split(/ +/).join(" "),
    ],
    shortName: [
      values.shortName !== "",
      values.shortName.trim().split(/ +/).join(" "),
    ],
    priority: [values.priority !== "", /^[0-9]*$/.test(values.priority)],
  };

  const errorMessages = {
    transcript: ["This field required"],
    shortName: ["This field required"],
    priority: ["This field is required", "Allow only Number"],
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
    if (pathname.toLowerCase() === "/transcriptmaster/transcript/new") {
      setIsNew(true);
      setCrumbs([
        { name: "TranscriptMaster", link: "/TranscriptMaster" },
        { name: "Transcript" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getTranscriptData();
    }
  }, [pathname]);

  const getTranscriptData = () => {
    axios
      .get(`/api/academic/ProgramTranscript/${id}`)
      .then((res) => {
        setValues({
          transcript: res.data.data.transcript,
          shortName: res.data.data.transcript_short_name,
          priority: res.data.data.priority,
        });
        setTranscriptId(res.data.data.trans_id);
        setCrumbs([
          { name: "TranscriptMaster", link: "/TranscriptMaster" },
          { name: "Transcript" },
          { name: "Update" },
          { name: res.data.data.transcript },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleCreate = async () => {
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
      temp.transcript = values.transcript;
      temp.transcript_short_name = values.shortName;
      temp.priority = values.priority;

      await axios
        .post(`/api/academic/ProgramTranscript`, temp)
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
          console.log(err);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(false);
      const temp = {};
      temp.active = true;
      temp.trans_id = transcriptId;
      temp.transcript = values.transcript;
      temp.transcript_short_name = values.shortName;
      temp.priority = values.priority;

      await axios
        .put(`/api/academic/ProgramTranscript/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
            navigate("/TranscriptMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={6}>
            <CustomTextField
              name="transcript"
              label="Transcript"
              handleChange={handleChange}
              value={values.transcript}
              checks={checks.transcript}
              errors={errorMessages.transcript}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              value={values.shortName}
              checks={checks.shortName}
              errors={errorMessages.shortName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="priority"
              label="Priority"
              value={values.priority}
              handleChange={handleChange}
              checks={checks.priority}
              errors={errorMessages.priority}
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
              <Grid item xs={4} md={2}>
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  onClick={isNew ? handleCreate : handleUpdate}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <strong>{isNew ? "Create" : "Update"}</strong>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default TranscriptForm;
