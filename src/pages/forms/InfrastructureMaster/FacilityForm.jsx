import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initValues = {
  typeOfFacility: "",
  shortName: "",
  facilityCode: "",
  description: "",
  remarks: "",
  timeTableStatus: 0,
};

const requiredFields = [
  "typeOfFacility",
  "shortName",
  "facilityCode",
  "description",
  "remarks",
];

function FacilityForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [facilityId, setFacilityId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    typeOfFacility: [
      values.typeOfFacility !== "",
      values.typeOfFacility.trim().split(/ +/).join(" "),
    ],
    shortName: [
      values.shortName !== "",
      values.shortName.trim().split(/ +/).join(" "),
    ],
    facilityCode: [
      values.facilityCode !== "",
      values.facilityCode.trim().split(/ +/).join(" "),
    ],
    description: [
      values.description !== "",
      values.description.trim().split(/ +/).join(" "),
    ],
    remarks: [
      values.remarks !== "",
      values.remarks.trim().split(/ +/).join(" "),
    ],
  };

  const errorMessages = {
    typeOfFacility: ["This field required"],
    shortName: ["This field required"],
    facilityCode: ["This field is required"],
    description: ["This field is required"],
    remarks: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/infrastructuremaster/facility/new") {
      setIsNew(true);

      setCrumbs([
        {
          name: "InfrastructureMaster",
          link: "/InfrastructureMaster/Facility",
        },
        { name: "Facility" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getFaciltyData();
    }
  }, [pathname]);

  const getFaciltyData = async () => {
    await axios
      .get(`/api/facilityType/${id}`)
      .then((res) => {
        setValues({
          typeOfFacility: res.data.data.facility_type_name,
          shortName: res.data.data.facility_short_name,
          facilityCode: res.data.data.facility_code,
          description: res.data.data.description,
          remarks: res.data.data.remarks,
          timeTableStatus: res.data.data.timetable_status,
        });
        setFacilityId(res.data.data.facility_type_id);
        setCrumbs([
          {
            name: "InfrastructureMaster",
            link: "/InfrastructureMaster/Facility",
          },
          { name: "Facility" },
          { name: "Update" },
          { name: res.data.data.facility_type_name },
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
      temp.active = true;
      temp.facility_type_name = values.typeOfFacility;
      temp.facility_short_name = values.shortName.toUpperCase();
      temp.facility_code = values.facilityCode;
      temp.description = values.description;
      temp.remarks = values.remarks;
      temp.timetable_status = values.timeTableStatus;

      await axios
        .post(`/api/facilityType`, temp)
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
          navigate("/InfrastructureMaster/Facility", { replace: true });
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
      temp.facility_type_id = facilityId;
      temp.facility_type_name = values.typeOfFacility;
      temp.facility_short_name = values.shortName.toUpperCase();
      temp.facility_code = values.facilityCode;
      temp.description = values.description;
      temp.remarks = values.remarks;
      temp.timetable_status = values.timeTableStatus;

      await axios
        .put(`/api/facilityType/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/InfrastructureMaster/Facility", { replace: true });
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
              name="typeOfFacility"
              label="Type Of Facility"
              value={values.typeOfFacility}
              handleChange={handleChange}
              checks={checks.typeOfFacility}
              errors={errorMessages.typeOfFacility}
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
              name="facilityCode"
              label="Facility Code"
              value={values.facilityCode}
              handleChange={handleChange}
              checks={checks.facilityCode}
              errors={errorMessages.facilityCode}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              rows={2}
              multiline
              name="description"
              label="Description"
              value={values.description}
              handleChange={handleChange}
              checks={checks.description}
              errors={errorMessages.description}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              rows={2}
              multiline
              name="remarks"
              label="Remarks"
              handleChange={handleChange}
              value={values.remarks}
              checks={checks.remarks}
              errors={errorMessages.remarks}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomRadioButtons
              name="timeTableStatus"
              label="TT Status"
              value={values.timeTableStatus}
              items={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              handleChange={handleChange}
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

export default FacilityForm;
