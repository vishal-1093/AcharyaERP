import { useState, useEffect, lazy } from "react";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";

const FormWrapper = lazy(() => import("../../../components/FormWrapper"));

const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const previousPath = localStorage.getItem("previousPath") || "";

const initialValues = {
  month: null,
  facility: null,
};

const requiredFields = ["facility", "month"];

function RoomCreationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [facilityNameOptions, setFacilityNameOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { pathname } = useLocation();
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
    if (pathname.toLowerCase() === "/eventmaster/room") {
      setIsNew(true);
      setCrumbs([
        { name: "EventMaster", link: previousPath },
        { name: "Amenities", link: "/EventMaster/Room" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
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
      const res = await axios.get(`/api/getFacilityTypeBasedOnEvent`);

      const filteredData = res.data.data
        .map(obj => ({
          value: obj.facility_type_id,
          label: obj.facility_short_name,
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
      const temp = {};
      temp.facility_type_id = values.facility;
      temp.month = moment(values.month).format("MM");
      temp.year = moment(values.month).format("YYYY");
      navigate("/EventMaster/Room/View", { state: { temp } });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container columnSpacing={2}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="facility"
              label="Facility"
              options={facilityNameOptions}
              value={values.facility}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="month"
              label="Month"
              value={values.month}
              handleChangeAdvance={handleChangeAdvance}
              views={["month", "year"]}
              openTo="month"
              inputFormat="MM/YYYY"
              required
            />
          </Grid>
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleCreate}
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
        {/* <EventRoomView/> */}
      </FormWrapper>
    </Box>
  );
}

export default RoomCreationForm;
