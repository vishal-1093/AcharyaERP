import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initValues = {
  commencementType: "",
  dateSelection: "",
  restrictionStatus: false,
};

const requiredFields = [
  "commencementType",
  "dateSelection",
  "restrictionStatus",
];

function CommencementTypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [commencementTypeId, setCommencementTypeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/categorytypemaster/commencementtype/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "CategoryTypeMaster",
          link: "/CategoryTypeMaster/CommencementTypes",
        },
        { name: "CommencementType " },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCommencementTypeData();
    }
  }, [pathname]);

  const checks = {
    commencementType: [values.commencementType !== ""],
    dateSelection: [values.dateSelection !== ""],
    restrictionStatus: [values.restrictionStatus !== ""],
  };

  const errorMessages = {
    commencementType: ["This field required"],
    dateSelection: ["This field is required"],
    restrictionStatus: ["This field is required"],
  };

  const getCommencementTypeData = async () => {
    await axios
      .get(`/api/academic/commencementType/${id}`)
      .then((res) => {
        setValues({
          commencementType: res.data.data.commencement_type,
          dateSelection: res.data.data.date_selection,
          restrictionStatus: res.data.data.restriction_status,
        });
        setCommencementTypeId(res.data.data.commencement_id);
        setCrumbs([
          {
            name: "CategoryTypeMaster",
            link: "/CategoryTypeMaster/CommencementTypes",
          },
          { name: "CommencementType " },
          { name: "Update" },
          { name: res.data.data.commencement_type },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.commencement_type = values.commencementType;
      temp.date_selection = values.dateSelection;
      temp.restriction_status = values.restrictionStatus;

      await axios
        .post(`/api/academic/commencementType`, temp)
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
          navigate("/CategoryTypeMaster/CommencementTypes", { replace: true });
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
      temp.commencement_id = commencementTypeId;
      temp.commencement_type = values.commencementType;
      temp.date_selection = values.dateSelection;
      temp.restriction_status = values.restrictionStatus;

      await axios
        .put(`/api/academic/commencementType/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/CategoryTypeMaster/CommencementTypes", {
              replace: true,
            });
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
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 8 }}
        >
          <Grid item xs={12} md={3.5} mt={2.5}>
            <CustomTextField
              name="commencementType"
              label="Commencement Type"
              value={values.commencementType}
              handleChange={handleChange}
              checks={checks.commencementType}
              errors={errorMessages.commencementType}
              required
            />
          </Grid>

          <Grid item xs={12} md={3.5}>
            <CustomRadioButtons
              name="dateSelection"
              label="Date Selection"
              value={values.dateSelection}
              items={[
                { value: "single", label: "Single" },
                { value: "multiple", label: "Multiple" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={3.5}>
            <CustomRadioButtons
              name="restrictionStatus"
              label="Restrict View Status"
              value={values.restrictionStatus}
              items={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={1.5}>
            {" "}
          </Grid>
          <Grid item xs={12} md={6} textAlign="right">
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
      </FormWrapper>
    </Box>
  );
}

export default CommencementTypeForm;
