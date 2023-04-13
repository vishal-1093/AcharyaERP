import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initValues = {
  blockName: "",
  shortName: "",
  schoolId: null,
  totalNoOfFloors: "",
  blockCode: "",
  buildUpArea: "",
  surveyNumber: "",
  documentNumber: "",
  facilityId: null,
  remarks: "",
  basement: 0,
};

const requiredFields = [
  "schoolId",
  "blockName",
  "shortName",
  "totalNoOfFloors",
  "blockCode",
  "buildUpArea",
  "surveyNumber",
  "documentNumber",
  "facilityId",
  "remarks",
];

function BlockForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [blockId, setBlockId] = useState(null);
  const [schoolShortName, setSchoolName] = useState([]);
  const [facilityName, setFacilityName] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    blockName: [values.blockName !== ""],
    shortName: [values.shortName !== ""],
    schoolId: [values.schoolId !== ""],
    totalNoOfFloors: [
      values.totalNoOfFloors !== "",
      values.totalNoOfFloors <= 9,
      /^[0-9]*$/.test(values.totalNoOfFloors),
    ],
    blockCode: [values.blockCode !== ""],
    buildUpArea: [
      values.buildUpArea !== "",
      /^[0-9]*$/.test(values.buildUpArea),
    ],
    surveyNumber: [values.surveyNumber !== ""],
    documentNumber: [values.documentNumber !== ""],
    typeOfFacility: [values.typeOfFacility !== ""],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    blockName: ["This field required"],
    shortName: ["This field required"],
    schoolId: ["This field is required"],
    totalNoOfFloors: [
      "This field required",
      "total floors less than or equals to 9",
      "Allow Only Number",
    ],
    blockCode: ["This field is required"],
    buildUpArea: ["This field required", "Allow Only Number"],
    surveyNumber: ["This field is required"],
    documentNumber: ["This field required"],
    typeOfFacility: ["This field is required"],
    remarks: ["This field required"],
    basement: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/infrastructuremaster/block/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "InfrastructureMaster",
          link: "/InfrastructureMaster/Block",
        },
        { name: "Block" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getBlockData();
    }
  }, [pathname]);

  const getBlockData = async () => {
    await axios
      .get(`/api/blocks/${id}`)
      .then((res) => {
        setValues({
          blockName: res.data.data.block_name,
          shortName: res.data.data.block_short_name,
          blockCode: res.data.data.blockcode,
          schoolId: res.data.data.school_id,
          totalNoOfFloors: res.data.data.total_no_of_floor,
          buildUpArea: res.data.data.total_built_up_area,
          surveyNumber: res.data.data.survey_number,
          documentNumber: res.data.data.document_number,
          facilityId: res.data.data.facility_type_id,
          remarks: res.data.data.remarks,
          basement: res.data.data.basement ? res.data.data.basement : 0,
        });
        setBlockId(res.data.data.block_id);
        setCrumbs([
          { name: "InfrastructureMaster", link: "/InfrastructureMaster/Block" },
          { name: "Block" },
          { name: "Update" },
          { name: res.data.data.block_name },
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
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    getSchoolName();
    getFacilityName();
  }, []);
  const getSchoolName = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolName(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getFacilityName = async () => {
    await axios
      .get(`/api/facilityType`)
      .then((res) => {
        setFacilityName(
          res.data.data.map((obj) => ({
            value: obj.facility_type_id,
            label: obj.facility_type_name,
          }))
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
      temp.school_id = values.schoolId;
      temp.block_name = values.blockName;
      temp.block_short_name = values.shortName.toUpperCase();
      temp.priority = values.priority;
      temp.blockcode = values.blockCode;
      temp.remarks = values.remarks;
      temp.survey_number = values.surveyNumber;
      temp.total_built_up_area = values.buildUpArea;
      temp.document_number = values.documentNumber;
      temp.total_no_of_floor = values.totalNoOfFloors;
      temp.basement = values.basement;
      temp.facility_type_id = values.facilityId;
      await axios
        .post(`/api/blocks`, temp)
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
          navigate("/InfrastructureMaster/Block", { replace: true });
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
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.block_id = blockId;
      temp.block_name = values.blockName;
      temp.block_short_name = values.shortName.toUpperCase();
      temp.blockcode = values.blockCode;
      temp.remarks = values.remarks;
      temp.survey_number = values.surveyNumber;
      temp.total_built_up_area = values.buildUpArea;
      temp.document_number = values.documentNumber;
      temp.school_id = values.schoolId;
      temp.total_no_of_floor = values.totalNoOfFloors;
      temp.basement = values.basement;
      temp.facility_type_id = values.facilityId;

      await axios
        .put(`/api/blocks/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/InfrastructureMaster", { replace: true });
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
              name="blockName"
              label="Block Name"
              value={values.blockName}
              handleChange={handleChange}
              checks={checks.blockName}
              errors={errorMessages.blockName}
              required
              fullWidth
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
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="schoolId"
              label="School Name"
              options={schoolShortName}
              handleChangeAdvance={handleChangeAdvance}
              value={values.schoolId}
              checks={checks.schoolId}
              errors={errorMessages.schoolId}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="totalNoOfFloors"
              label="Total no of Floors"
              value={values.totalNoOfFloors}
              handleChange={handleChange}
              checks={checks.totalNoOfFloors}
              errors={errorMessages.totalNoOfFloors}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="blockCode"
              label="Block Code"
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              value={values.blockCode}
              handleChange={handleChange}
              checks={checks.blockCode}
              errors={errorMessages.blockCode}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="buildUpArea"
              label="Total build Up Area(sq ft)"
              value={values.buildUpArea}
              handleChange={handleChange}
              checks={checks.buildUpArea}
              errors={errorMessages.buildUpArea}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="surveyNumber"
              label="Survey Number"
              value={values.surveyNumber}
              handleChange={handleChange}
              checks={checks.surveyNumber}
              errors={errorMessages.surveyNumber}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="documentNumber"
              label="Document Number"
              value={values.documentNumber}
              handleChange={handleChange}
              checks={checks.documentNumber}
              errors={errorMessages.documentNumber}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="facilityId"
              label="Type Of Facility"
              options={facilityName}
              handleChangeAdvance={handleChangeAdvance}
              value={values.facilityId}
              handleChange={handleChange}
              checks={checks.facilityId}
              errors={errorMessages.facilityId}
              required
              fullWidth
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
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid item xs={12} md={4}>
              <CustomRadioButtons
                name="basement"
                label="Basement"
                items={[
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" },
                ]}
                value={values.basement}
                handleChange={handleChange}
                checks={checks.basement}
                errors={errorMessages.basement}
                required
              />
            </Grid>
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

export default BlockForm;
