import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";

const initialValues = {
  currencyName: "",
  currencyShortName: "",
};

const requiredFields = ["currencyName", "currencyShortName"];

function CurrencyForm() {
  const [isNew, setIsNew] = useState(true);
  const setCrumbs = useBreadcrumbs();
  const [values, setValues] = useState(initialValues);
  const [currencyId, setCurrencyId] = useState(null);

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    currencyName: [
      values.currencyName !== "",
      /^[A-Za-z ]+$/.test(values.currencyName),
    ],
    currencyShortName: [
      values.currencyShortName !== "",
      /^[A-Za-z ]{3}$/.test(values.currencyShortName),
    ],
  };
  const errorMessages = {
    currencyName: ["This field is required", "Enter only characters"],
    currencyShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/admissionmaster/currencytype/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AdmissionMaster", link: "/AdmissionMaster/Currency" },
        { name: "Currency" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCurrencyData();
    }
  }, [pathname]);

  const getCurrencyData = async () => {
    await axios
      .get(`/api/finance/CurrencyType/${id}`)
      .then((res) => {
        setValues({
          currencyName: res.data.data.currency_type_name,
          currencyShortName: res.data.data.currency_type_short_name,
        });
        setCurrencyId(res.data.data.currency_type_id);
        setCrumbs([
          { name: "AdmissionMaster", link: "/AdmissionMaster/Currency" },
          { name: "Currency" },
          { name: "Update" },
          { name: res.data.data.currency_type_name },
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
      temp.currency_type_name = values.currencyName;
      temp.currency_type_short_name = values.currencyShortName.toUpperCase();
      await axios
        .post(`/api/finance/CurrencyType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster/Currency", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Currencytype Created",
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
      temp.currency_type_id = currencyId;
      temp.currency_type_name = values.currencyName;
      temp.currency_type_short_name = values.currencyShortName.toUpperCase();
      await axios
        .put(`/api/finance/CurrencyType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster/Currency", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Currencytype Updated",
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
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="currencyName"
                  label="Currency type"
                  value={values.currencyName}
                  handleChange={handleChange}
                  fullWidth
                  errors={errorMessages.currencyName}
                  checks={checks.currencyName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="currencyShortName"
                  label=" Short Name"
                  value={values.currencyShortName}
                  handleChange={handleChange}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    minLength: 3,
                    maxLength: 3,
                  }}
                  errors={errorMessages.currencyShortName}
                  checks={checks.currencyShortName}
                  disabled={!isNew}
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
                  <Grid item xs={2}>
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
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default CurrencyForm;
