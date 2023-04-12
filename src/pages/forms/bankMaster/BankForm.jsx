import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  bankName: "",
  bankShortName: "",
  internalStatus: false,
};

const requiredFields = ["bankName", "bankShortName"];

function BankForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [bankId, setBankId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    bankName: [values.bankName !== "", /^[A-Za-z ]+$/.test(values.bankName)],
    bankShortName: [values.bankShortName !== ""],
  };
  const errorMessages = {
    bankName: ["This field is required", "Enter only characters"],
    bankShortName: ["This field required", ""],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/bankmaster/bank/new") {
      setIsNew(true);
      setCrumbs([
        { name: "BankMaster", link: "/BankMaster/Bank" },
        { name: "Bank" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramData();
    }
  }, []);

  const getProgramData = async () => {
    await axios
      .get(`/api/finance/Bank/${id}`)
      .then((res) => {
        setValues({
          bankName: res.data.data.bank_name,
          bankShortName: res.data.data.bank_short_name,
          internalStatus: res.data.data.internal_status,
        });
        setBankId(res.data.data.bank_id);
        setCrumbs([
          { name: "BankMaster", link: "/BankMaster/Bank" },
          { name: "Bank" },
          { name: "Update" },
          { name: res.data.data.bank_name },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "bankShortName") {
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
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.bank_name = values.bankName;
      temp.bank_short_name = values.bankShortName;
      temp.internal_status = values.internalStatus;
      await axios
        .post(`/api/finance/Bank`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Bank Created",
            });
            navigate("/BankMaster/Bank", { replace: true });
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
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.bank_id = bankId;
      temp.bank_name = values.bankName;
      temp.bank_short_name = values.bankShortName;
      temp.internal_status = values.internalStatus;
      await axios
        .put(`/api/finance/Bank/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Bank Updated",
            });
            navigate("/BankMaster/Bank", { replace: true });
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
            message: error.response.data.message,
          });
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="bankName"
              label="Name"
              value={values.bankName}
              handleChange={handleChange}
              errors={errorMessages.bankName}
              checks={checks.bankName}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="bankShortName"
              label="Short Name"
              value={values.bankShortName}
              handleChange={handleChange}
              errors={errorMessages.bankShortName}
              checks={checks.bankShortName}
              inputProps={{
                minLength: 1,
                maxLength: 5,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="internalStatus"
              label="Internal Status"
              value={values.internalStatus}
              handleChange={handleChange}
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
            />
          </Grid>

          <Grid item textAlign="right">
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

export default BankForm;
