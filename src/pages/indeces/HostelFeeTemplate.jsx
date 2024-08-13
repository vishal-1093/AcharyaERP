import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import CustomSelect from "../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../components/Inputs/CustomMultipleAutocomplete";

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

function HostelRoomForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [hostelFloors, setHostelFloors] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
console.log(values,"values");
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

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
  }, []);

  const getSchoolName = async () => {
    await axios
      .get(`/api/institute/school`)
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
      .get(`/api/academic/academic_year`)
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
      .get(`/api/hostel/HostelBlocks`)
      .then((res) => {
        const hostelBlocks = res.data.data.map((obj) => ({
          value: obj.hostelBlockId,
          label: obj.blockName,
        }));
        setHostelBlocks(hostelBlocks);
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {
        room_creation_number: values.roomNumber,
        standardAccessories: values.standardAccessories,
        roomTypeId: values.roomType,
        hostelsBlockId: values.hostelBlockName,
        hostelsFloorId: values.hostelFloorName,
        active: values.active,
      };

      await axios
        .post(`/api/hostel/HostelRooms`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelCreationMaster/HostelRoom", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Room created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occurred",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occurred",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {
        hostelRoomId: values?.hostelRoomId,
        room_creation_number: values.roomNumber,
        standardAccessories: values.standardAccessories,
        roomTypeId: values.roomType,
        hostelsBlockId: values.hostelBlockName,
        hostelsFloorId: values.hostelFloorName,
        active: values.active,
      };

      await axios
        .put(`/api/rooms/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelCreationMaster/HostelRoom", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Room updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occurred",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occurred",
          });
          setAlertOpen(true);
        });
    }
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

export default HostelRoomForm;
