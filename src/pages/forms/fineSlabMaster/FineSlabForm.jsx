import { useState, lazy, useEffect } from "react";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import FormWrapper from "../../../components/FormWrapper.jsx";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);

const weekLists = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];

const initialState = {
  loading: false,
  week: "",
  percent: "",
  weekList: weekLists,
};

const FineSlabForm = () => {
  const [{ loading, week, percent, weekList }, setState] =
    useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Fine Slab", link: "/fine-slab-index" },
      { name: !!location.state ? "Update" : "Create" },
    ]);
    getSchoolData();
  }, []);

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        if (res?.data?.data?.length > 0) {
          setState((prevState) => ({
            ...prevState,
            schoolList: res.data.data.map((el) => ({
              label: el.school_name_short,
              value: el.school_id,
            })),
          }));
        }
        if (!!location.state) {
          setFormField();
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const setFormField = () => {
    setState((prevState) => ({
      ...prevState,
      schoolId: location.state?.schoolId,
      week: location.state?.week,
      percent: location.state?.percentage,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleSelectAll = (name, options) => {
    setState((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value),
    }));
  };
  const handleSelectNone = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === "+" || event.key === "e") {
      event.preventDefault();
    }
  };

  const handleSubmit = async () => {
    try {
      let payload = {
        week: week,
        percentage: percent,
        active: true,
      };
        const res = await axios.post(`/api/createFineSlab`, payload);
        if (res.status == 200 || res.status == 201) {
          if (!!res.data.data) {
            setAlertMessage({
              severity: "error",
              message: res.data.data,
            });
            setAlertOpen(true);
          } else {
            actionAfterResponse();
          }
        }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const actionAfterResponse = () => {
    setLoading(false);
    navigate("/fine-slab-index", { replace: true });
    setAlertMessage({
      severity: "success",
      message: `Fine slab ${
        !!location.state ? "updated" : "created"
      } successfully !!`,
    });
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="week"
              label="Week"
              value={week || ""}
              options={weekList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="percent"
              label="Percent"
              value={percent || ""}
              handleChange={handleChange}
              type="number"
              onKeyDown={handleKeyDown}
              required
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !week || !percent}
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{!!location.state ? "Update" : "Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default FineSlabForm;
