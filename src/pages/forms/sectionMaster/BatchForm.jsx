import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initValues = {
  batchName: "",
  shortName: "",
  remarks: "",
};

const requiredFields = ["batchName", "shortName", "remarks"];

function BatchForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [BatchId, setBatchId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    batchName: [
      values.batchName !== "",
      values.batchName.trim().split(/ +/).join(" "),
    ],
    shortName: [
      values.shortName !== "",
      values.shortName.trim().split(/ +/).join(" "),
    ],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    batchName: ["This field required", "Enter Only Characters"],
    shortName: ["This field required"],
    remarks: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/sectionmaster/batch/new") {
      setIsNew(true);
      setCrumbs([
        { name: "SectionMaster", link: "/SectionMaster/Batches" },
        { name: "Batch" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getBatchData();
    }
  }, [pathname]);

  const getBatchData = async () => {
    await axios
      .get(`/api/academic/Batch/${id}`)
      .then((res) => {
        setValues({
          batchName: res.data.data.batch_name,
          shortName: res.data.data.batch_short_name,
          remarks: res.data.data.remarks,
        });
        setBatchId(res.data.data.batch_id);
        setCrumbs([
          { name: "SectionMaster", link: "/SectionMaster/Batches" },
          { name: "Batch" },
          { name: "Update" },
          { name: res.data.data.batch_name },
        ]);
      })
      .catch((error) => console.error(error));
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
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.batch_name = values.batchName;
      temp.batch_short_name = values.shortName;
      temp.remarks = values.remarks;

      await axios
        .post(`/api/academic/Batch`, temp)
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
          navigate("/SectionMaster/Batches", { replace: true });
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
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.batch_id = BatchId;
      temp.batch_name = values.batchName;
      temp.batch_short_name = values.shortName;
      temp.remarks = values.remarks;

      await axios
        .put(`/api/academic/Batch/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/SectionMaster/Batches", { replace: true });
          } else {
            setLoading(false);
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
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="batchName"
              label="Batch Name"
              value={values.batchName}
              handleChange={handleChange}
              checks={checks.batchName}
              errors={errorMessages.batchName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              value={values.shortName}
              handleChange={handleChange}
              checks={checks.shortName}
              errors={errorMessages.shortName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              rows={2}
              multiline
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
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

export default BatchForm;
