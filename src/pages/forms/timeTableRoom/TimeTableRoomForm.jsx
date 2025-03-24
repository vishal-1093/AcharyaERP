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
  block: null,
  floor:null
};

const requiredFields = ["block","floor", "month"];

function TimeTableRoom() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [blockNameOptions, setBlockNameOptions] = useState([]);
  const [floorNameOptions, setFloorNameOptions] = useState([]);
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
      // setCrumbs([
      //   { name: "EventMaster", link: previousPath },
      //   { name: "Amenities", link: "/EventMaster/Room" },
      //   { name: "Create" },
      // ]);
  
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
    getBlockData();
  }, []);

  useEffect(() => {
    getFloorData();
  }, [values.block]);

  const getBlockData = async () => {
    try {
      const res = await axios.get(`/api/getFacilityTypeForTimeTable`);
      const filteredData = res.data.data
        .map(obj => ({
          value: obj.block_id,
          label: obj.block_name,
        }));

      setBlockNameOptions(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  const getFloorData = async () => {
    try {
      const res = await axios.get(`/api/getFloors/${values.block}`);
      const filteredData = res.data.data?.map(obj => ({
          value: obj.floor_id,
          label: obj.floor_name,
        }));
      setFloorNameOptions(filteredData);
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
      // https://www.stageapi-acharyainstitutes.in/Acharya_University/api/getEventRoomAvailabilityForTimeTable?block_id=2&month=02&year=2025&floor_id=11
      setLoading(true);
      const temp = {};
      temp.block_id = values.block;
      temp.floor_id = values.floor;
      temp.month = moment(values.month).format("MM");
      temp.year = moment(values.month).format("YYYY");
      navigate("/TimeTable/View", { state: { temp } });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container columnSpacing={2}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="block"
              label="Block"
              options={blockNameOptions}
              value={values.block}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="floor"
              label="Floor"
              options={floorNameOptions}
              value={values.floor}
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
              <strong>View</strong>
            )}
          </Button>
        </Grid>
        {/* <EventRoomView/> */}
      </FormWrapper>
    </Box>
  );
}

export default TimeTableRoom;
