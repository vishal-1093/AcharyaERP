import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initialValues = {
  admCategoryName: "",
  shortName: "",
  yearSem: "",
  regularStatus: "No",
};

const requiredFields = ["admCategoryName", "shortName"];

function AdmCategoryForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [admId, setAdmId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    admCategoryName: [
      values.admCategoryName !== "",
      /^[A-Za-z ]+$/.test(values.admCategoryName),
    ],
    shortName: [
      values.shortName !== "",
      /^[A-Za-z ]{3}$/.test(values.shortName),
    ],
  };
  const errorMessages = {
    admCategoryName: ["This field required", "Enter Only Characters"],
    shortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/admissionmaster/admissioncategory/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Admission Master", link: "/AdmissionMaster/Category" },
        { name: "Admission Category" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getAdmData();
    }
  }, [pathname]);

  const getAdmData = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory/${id}`)
      .then((res) => {
        setValues({
          admCategoryName: res.data.data.fee_admission_category_type,
          shortName: res.data.data.fee_admission_category_short_name,
          yearSem:
            res.data.data.year_sem === null ? "" : res.data.data.year_sem,
          regularStatus: res.data.data.is_regular ? "Yes" : "No",
        });
        setAdmId(res.data.data.fee_admission_category_id);
        setCrumbs([
          { name: "AdmissionMaster", link: "/AdmissionMaster/Category" },
          { name: "AdmissionCategory" },
          { name: "Update" },
          { name: res.data.data.fee_admission_category_type },
        ]);
      })
      .catch((err) => console.error(err));
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.fee_admission_category_type = values.admCategoryName;
      temp.fee_admission_category_short_name = values.shortName.toUpperCase();
      temp.year_sem = values.yearSem;
      temp.is_regular = values.regularStatus === "Yes" ? true : false;

      await axios
        .post(`/api/student/FeeAdmissionCategory`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster/Category", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Admission Category Created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
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
  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.fee_admission_category_id = admId;
      temp.fee_admission_category_type = values.admCategoryName;
      temp.fee_admission_category_short_name = values.shortName.toUpperCase();
      temp.year_sem = values.yearSem;
      temp.is_regular = values.regularStatus === "Yes" ? true : false;

      await axios
        .put(`/api/student/FeeAdmissionCategory/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster/Category", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Admission Category Updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
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
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="admCategoryName"
              label="Admission Category Name"
              value={values.admCategoryName}
              handleChange={handleChange}
              errors={errorMessages.admCategoryName}
              checks={checks.admCategoryName}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="shortName"
              label=" Short Name"
              value={values.shortName}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
                minLength: 3,
                maxLength: 3,
              }}
              fullWidth
              errors={errorMessages.shortName}
              checks={checks.shortName}
              required
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="yearSem"
              label="Is YearSem"
              value={values.yearSem}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="regularStatus"
              label="Is Regular"
              value={values.regularStatus}
              items={[
                {
                  value: "Yes",
                  label: "Yes",
                },
                {
                  value: "No",
                  label: "No",
                },
              ]}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
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

export default AdmCategoryForm;
