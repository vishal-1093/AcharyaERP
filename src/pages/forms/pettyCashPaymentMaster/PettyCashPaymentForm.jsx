import { useState, lazy, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
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

const initialState = {
  amount: 0,
  remarks: "",
  loading: false,
  school: "",
  schoolList: [],
  hostel: "",
  hostelList: []
};

const PermissionForm = () => {
  const [
    { amount, remarks, loading, type, school, schoolList, hostel, hostelList },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Petty Cash Payment", link: "/petty-cash-payment" },
      { name: !!location.state ? "Update" : "Create" },
    ]);
    getSchoolList();
    setFormField(location.state);
  }, []);

  const setFormField = (formValue) => {
    setState((prevState) => ({
      ...prevState,
      remarks: formValue?.remark,
      school: formValue?.school_id,
      amount: formValue?.amount
    }))
  }

  const getSchoolList = async () => {
    try {
      const res = await axios.get(`api/institute/school`);
      if (res?.data?.data?.length) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res?.data?.data.map((el) => ({
            ...el,
            label: el.school_name,
            value: el.school_id,
          })),
        }));
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    name == "type" && setNullForm();
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setNullForm = () => {
    setState((prevState) => ({
      ...prevState,
      school: "",
      hostel: "",
      amount: "",
      remarks: ""
    }))
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        school_id: school,
        amount: amount,
        remark: remarks
      };

      if (!location.state) {
        const res = await axios.post("api/finance/createPettyCash", payload);
        if (res.status == 200 || res.status == 201) {
          setAlertMessage({
            severity: "success",
            message: "Petty cash payment created successfully!!",
          });
          setAlertOpen(true);
          navigate("/petty-cash-payment")
        }
      } else {
        const res = await axios.put(`api/finance/updatePettyCash/${location.state.id}`, payload);
        if (res.status == 200 || res.status == 201) {
          setAlertMessage({
            severity: "success",
            message: "Petty cash payment update successfully!!",
          });
          setAlertOpen(true);
          navigate("/petty-cash-payment")
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

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }} alignItems={"center"}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="school"
              label="School"
              value={school || ""}
              options={schoolList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled={location.state}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="amount"
              label="Amount"
              value={amount || ""}
              handleChange={handleChange}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={remarks || ""}
              handleChange={handleChange}
              required
              multiline
            />
          </Grid>
          <Grid
            item
            align="right"
            xs={12}
            md={2}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={
                loading || !(amount && remarks && school)}
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

export default PermissionForm;
