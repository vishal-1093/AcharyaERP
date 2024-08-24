import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";

const initialValues = {
  dollar: 1,
  inr: "",
  date: null,
};

const requiredFields = ["inr", "date"];

function DollartoInrForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [dollartosomId, setDollartosomId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {};

  useEffect(() => {
    if (pathname.toLowerCase() === "/dollartoinrform") {
      setIsNew(true);
      setCrumbs([
        { name: "Dollar to Inr Index", link: "/FinanceMaster/Dollar" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getData();
    }
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/finance/dollarToInrConversion/${id}`)
      .then((res) => {
        setValues({
          dollar: res.data.data.dollar_value,
          inr: res.data.data.inr,
          date: res.data.data.date,
        });
        setDollartosomId(res.data.data.dollar_to_inr_id);
        setCrumbs([
          { name: "Dollar To Inr Index", link: "/FinanceMaster/Dollar" },
          { name: "Update" },
          { name: res.data.data.program_name },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "inr") {
      var t = e.target.value;
      e.value = t.indexOf(".") >= 0 ? t.slice(0, t.indexOf(".") + 3) : t;

      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.value,
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
      temp.dollar_value = values.dollar;
      temp.inr = values.inr;
      temp.date = values.date;

      await axios
        .post(`/api/finance/dollarToInrConversion`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Created Successfully",
            });
            navigate("/FinanceMaster/Dollar", { replace: true });
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
      temp.dollar_value = values.dollar;
      temp.inr = values.inr;
      temp.date = values.date;
      temp.dollar_to_inr_id = dollartosomId;

      await axios
        .put(`/api/finance/dollarToInrConversion/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Updated Successfully",
            });
            navigate("/FinanceMaster/Dollar", { replace: true });
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
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="dollar"
              label="Dollar"
              value={values.dollar}
              handleChange={handleChange}
              fullWidth
              required
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="inr"
              label="INR"
              value={values.inr}
              handleChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={3} mt={2}>
            <CustomDatePicker
              name="date"
              label="Date"
              value={values.date}
              handleChangeAdvance={handleChangeAdvance}
              disablePast
              required
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

export default DollartoInrForm;
