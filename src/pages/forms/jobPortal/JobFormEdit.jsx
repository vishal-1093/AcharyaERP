import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  name: "",
  street: "",
  locality: "",
  pincode: "",
  country: null,
  state: null,
  city: null,
};

function JobFormEdit({ id, setIsEdit }) {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    fetchStates();
  }, [values.country]);

  useEffect(() => {
    fetchCities();
  }, [values.state]);

  const getCountry = async () => {
    try {
      const [{ data: response }, { data: res }] = await Promise.all([
        axios.get(`/api/employee/getJobProfileById/${id}`),
        axios.get("/api/Country"),
      ]);
      const responseData = response.data;

      const {
        firstname,
        street,
        locality,
        country_id,
        state_id,
        city_id,
        pincode,
      } = responseData;

      const countryOptionData = [];

      res.forEach((obj) => {
        countryOptionData.push({
          value: obj.id,
          label: obj.name,
        });
      });

      setValues((prev) => ({
        ...prev,
        ["name"]: firstname,
        ["street"]: street,
        ["locality"]: locality,
        ["country"]: country_id,
        ["state"]: state_id,
        ["city"]: city_id,
        ["pincode"]: pincode,
      }));
      setCountry(countryOptionData);
      setData(responseData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load country",
      });
      setAlertOpen(true);
    }
  };

  const fetchStates = async () => {
    const { country } = values;

    if (country) {
      try {
        const res = await axios(`/api/State1/${country}`);
        const data = res.data.map((obj) => ({
          value: obj.id,
          label: obj.name,
        }));
        setStates(data);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: err.response?.data?.message || "Failed to load states",
        });
        setAlertOpen(true);
      }
    }
  };

  const fetchCities = async () => {
    const { country, state } = values;
    if (country && state) {
      try {
        const res = await axios(`/api/City1/${state}/${country}`);
        const data = res.data.map((obj) => ({
          value: obj.id,
          label: obj.name,
        }));
        setCities(data);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: err.response?.data?.message || "Failed to load states",
        });
        setAlertOpen(true);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCreate = async () => {
    const { name, street, locality, country, state, city, pincode } = values;
    try {
      setLoading(true);
      const updateData = { ...data };
      updateData.firstname = name;
      updateData.street = street;
      updateData.locality = locality;
      updateData.country_id = country;
      updateData.state_id = state;
      updateData.city_id = city;
      updateData.pincode = pincode;

      const { data: response } = await axios.put(
        `/api/employee/JobProfile/${id}`,
        updateData
      );
      if (response.success) {
        setAlertMessage({
          severity: "success",
          message: "updated successfully !!",
        });
        setAlertOpen(true);
        setIsEdit(false);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        <Grid item xs={12} md={4}>
          <CustomTextField
            name="name"
            label="Name"
            value={values.name}
            handleChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="street"
            label="House No. / Street"
            value={values.street}
            handleChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="locality"
            label="Locality"
            value={values.locality}
            handleChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="country"
            label="Country"
            value={values.country}
            options={country}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="state"
            label="State"
            value={values.state}
            options={states}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="city"
            label="City"
            value={values.city}
            options={cities}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="pincode"
            label="Pincode"
            value={values.pincode}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsEdit(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={handleCreate}>
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default JobFormEdit;
