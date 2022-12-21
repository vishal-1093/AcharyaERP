import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initValues = {
  measureName: "",
  shortName: "",
};

const requiredFields = ["measureName", "shortName"];

function MeasureForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [measureId, setMeasureId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    measureName: [
      values.measureName !== "",
      values.measureName.trim().split(/ +/).join(" "),
    ],
    shortName: [values.shortName !== ""],
  };

  const errorMessages = {
    measureName: ["This field required"],
    shortName: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/inventorymaster/measures/new") {
      setIsNew(true);
      setCrumbs([
        { name: "InventoryMaster", link: "/InventoryMaster/Measures" },
        { name: "Measure" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getMeasureData();
    }
  }, [pathname]);

  const getMeasureData = async () => {
    await axios
      .get(`/api/measure/${id}`)
      .then((res) => {
        setValues({
          measureName: res.data.data.measure_name,
          shortName: res.data.data.measure_short_name,
        });
        setMeasureId(res.data.data.measure_id);
        setCrumbs([
          { name: "InventoryMaster", link: "/InventoryMaster/Measures" },
          { name: "Measure" },
          { name: "Update" },
          { name: res.data.data.MeasureName },
        ]);
      })
      .catch((err) => console.error(err));
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
      temp.active = 1;
      temp.measure_name = values.measureName;
      temp.measure_short_name = values.shortName;

      await axios
        .post(`/api/measure`, temp)
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
          navigate("/InventoryMaster/Measures", { replace: true });
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

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = 1;
      temp.measure_id = measureId;
      temp.measure_name = values.measureName;
      temp.measure_short_name = values.shortName;

      await axios
        .put(`/api/updateMeasure/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/InventoryMaster/Measures", { replace: true });
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
              name="measureName"
              label="Measure"
              value={values.measureName}
              handleChange={handleChange}
              checks={checks.measureName}
              errors={errorMessages.measureName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              checks={checks.shortName}
              errors={errorMessages.shortName}
              inputProps={{
                style: { textTransform: "uppercase" },
                minLength: 1,
                maxLength: 4,
              }}
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

export default MeasureForm;
