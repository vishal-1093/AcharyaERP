import { useState, useEffect, lazy } from "react";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import axios from "../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const FormWrapper = lazy(() => import("../../../components/FormWrapper"));

const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initialValues = {
  poNumber: null,
};

const requiredFields = ["poNumber"];

function GRNCreationForm() {
  const [values, setValues] = useState(initialValues);
  const [facilityNameOptions, setFacilityNameOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pathname, state } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    month: [values.month !== null],
  };

  const errorMessages = {
    month: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/create-grn") {
      setCrumbs([
        { link: "/grnIndex-user", name: "GRN-Index" },
        { name: "GRN-Create" },
      ]);
    }
  }, []);

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
  useEffect(() => {
    getFacilityData();
  }, []);

  const getFacilityData = async () => {
    try {
      const res = await axios.get(`/api/purchase/getPOIdAndRefNum`);
      const filteredData = res.data.data
        .map(obj => ({
          value: obj.purchaseOrderId,
          label: obj.poReferenceNo,
        }));

      setFacilityNameOptions(filteredData);
    } catch (err) {
      console.error(err);
    }
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
      navigate(`/CreateGrn/${values?.poNumber}`, { state: { fromPath: pathname, prvPath : state?.fromPath } });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container columnSpacing={2}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="poNumber"
              label="Po Number"
              options={facilityNameOptions}
              value={values.poNumber}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            disabled={loading || !values?.poNumber}
            onClick={handleCreate}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong>{"Create"}</strong>
            )}
          </Button>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default GRNCreationForm;
