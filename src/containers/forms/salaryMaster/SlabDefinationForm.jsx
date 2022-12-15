import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import SlabDefinitionDetails from "../../../pages/forms/salaryMaster/SlabDefinationDetails";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import { useNavigate } from "react-router-dom";

const initialValues = {
  slabDetailsName: "",
  slabDetailsShortName: "",
  description: "",
  salaryHeadId: [],
};

const requiredFields = [
  "slabDetailsName",
  "slabDetailsShortName",
  "salaryHeadId",
];

function SlabDefinitionForm() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [salaryHeadOptions, setSalaryHeadOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    slabDetailsName: [values.slabDetailsName !== ""],
    slabDetailsShortName: [values.slabDetailsShortName !== ""],
  };

  const errorMessages = {
    slabDetailsName: ["This field is required"],
    slabDetailsShortName: ["This field is required"],
  };

  useEffect(() => {
    getSalaryHeads();
  }, []);

  const getSalaryHeads = async () => {
    await axios
      .get(`/api/finance/SalaryStructureHead`)
      .then((res) => {
        setSalaryHeadOptions(
          res.data.data.map((obj) => ({
            value: obj.salary_structure_head_id,
            label: obj.voucher_head,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleChange = (e) => {
    if (e.target.name === "slabDetailsShortName") {
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.slab_details_name = values.slabDetailsName;
      temp.slab_details_short_name = values.slabDetailsShortName;
      temp.salary_structure_head_ids = values.salaryHeadId.toString();
      temp.description = values.description;

      await axios
        .post(`/api/finance/SlabDetails`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/SalaryMaster/SlabDefinition", { replace: true });
          setAlertOpen(true);
          window.location.reload();
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
          justifyContent="flex-end"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="slabDetailsName"
              label="Name"
              value={values.slabDetailsName}
              handleChange={handleChange}
              fullWidth
              errors={errorMessages.slabDetailsName}
              checks={checks.slabDetailsName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="slabDetailsShortName"
              label="Short Name"
              value={values.slabDetailsShortName}
              handleChange={handleChange}
              fullWidth
              errors={errorMessages.slabDetailsShortName}
              checks={checks.slabDetailsShortName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomMultipleAutocomplete
              name="salaryHeadId"
              label="Salary Head"
              value={values.salaryHeadId}
              options={salaryHeadOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              name="description"
              label="Description"
              value={values.description}
              handleChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Create</strong>
              )}
            </Button>
          </Grid>

          <Grid item xs={12} md={12}>
            <SlabDefinitionDetails />
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default SlabDefinitionForm;
