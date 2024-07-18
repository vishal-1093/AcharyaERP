import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";

const initialValues = {
  acYearId: "",
  occupancyType: "",
  currencyType: "",
  blockName: "",
  schoolId: "",
  active: true,
};

const requiredFields = [
  "acYearId",
  "occupancyType",
  "currencyType",
  "blockName",
  "schoolId",
];

function HostelFeeTemplateForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [rows, setRows] = useState([
    { feeHead: "", year1: 0, year2: 0, total: 0 },
  ]);

  const checks = {
    acYearId: [values.acYearId !== ""],
    occupancyType: [values.occupancyType !== ""],
    currencyType: [values.currencyType !== ""],
    blockName: [values.blockName !== ""],
    schoolId: [values.schoolId !== ""],
  };

  const errorMessages = {
    acYearId: ["This field is required"],
    occupancyType: ["This field is required"],
    currencyType: ["This field is required"],
    blockName: ["This field is required"],
    schoolId: ["This field is required"],
  };

  useEffect(() => {
    getAcademicyear();
    getHostelBlocks();
    getSchoolName();
    getFeeHeads();
  }, []);

  const getSchoolName = async () => {
    await axios
      .get("/api/institute/school")
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((object) => ({
            value: object.school_id,
            label: object.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getAcademicyear = async () => {
    await axios
      .get("/api/academic/academic_year")
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getHostelBlocks = async () => {
    await axios
      .get("/api/hostel/HostelBlocks")
      .then((res) => {
        const hostelBlocks = res.data.data.map((obj) => ({
          value: obj.hostelBlockId,
          label: obj.blockName,
        }));
        setHostelBlocks(hostelBlocks);
      })
      .catch((err) => console.error(err));
  };

  const getFeeHeads = async () => {
    await axios
      .get("/api/feeHeads") // replace with actual endpoint
      .then((res) => {
        const feeHeads = res.data.data.map((obj) => ({
          value: obj.feeHeadId,
          label: obj.feeHeadName,
        }));
        setFeeHeads(feeHeads);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
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

  const handleCreate = async () => {};

  const handleUpdate = async () => {};

  const addRow = () => {
    setRows([...rows, { feeHead: "", year1: 0, year2: 0, total: 0 }]);
  };

  const removeRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    if (field === "year1" || field === "year2") {
      newRows[index].total =
        parseFloat(newRows[index].year1 || 0) +
        parseFloat(newRows[index].year2 || 0);
    }
    setRows(newRows);
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              checks={checks.acYearId}
              errors={errorMessages.acYearId}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="occupancyType"
              label="Occupancy Type"
              value={values.occupancyType}
              items={[
                { value: 1, label: "SINGLE OCCUPANCY" },
                { value: 2, label: "DOUBLE OCCUPANCY" },
                { value: 3, label: "TRIPLE OCCUPANCY" },
                { value: 4, label: "QUADRUPLE OCCUPANCY" },
                { value: 6, label: "SIXTAPLE OCCUPANCY" },
                { value: 7, label: "SEVEN OCCUPANCY" },
                { value: 8, label: "EIGHT OCCUPANCY" },
              ]}
              handleChange={handleChange}
              checks={checks.occupancyType}
              errors={errorMessages.occupancyType}
              required
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="currencyType"
              label="Currency Type"
              value={values.currencyType}
              items={[
                {
                  value: "INR",
                  label: "INR",
                },
                {
                  value: "USD",
                  label: "USD",
                },
              ]}
              handleChange={handleChange}
              checks={checks.currencyType}
              errors={errorMessages.currencyType}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomMultipleAutocomplete
              name="blockName"
              label="Block Name"
              value={values.blockName}
              options={hostelBlocks}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.blockName}
              errors={errorMessages.blockName}
              required
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomMultipleAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.schoolId}
              errors={errorMessages.schoolId}
              required
            />
          </Grid>
          {rows.map((row, index) => (
            <Grid container item xs={12} spacing={2} key={index}>
              <Grid item xs={3}>
                <CustomSelect
                  name={`feeHead-${index}`}
                  label="Fee Head"
                  value={row.feeHead}
                  items={feeHeads}
                  handleChange={(e) => handleRowChange(index, "feeHead", e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomTextField
                  name={`year1-${index}`}
                  label="Year 1"
                  value={row.year1}
                  onChange={(e) => handleRowChange(index, "year1", e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomTextField
                  name={`year2-${index}`}
                  label="Year 2"
                  value={row.year2}
                  onChange={(e) => handleRowChange(index, "year2", e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomTextField
                  name={`total-${index}`}
                  label="Total"
                  value={row.total}
                  disabled
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => removeRow(index)}>
                  <RemoveIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <IconButton onClick={addRow}>
              <AddIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={isNew ? handleCreate : handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isNew ? (
                "Create"
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default HostelFeeTemplateForm;
