import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import axios from "../../services/Api";
import useAlert from "../../hooks/useAlert";
import moment from "moment";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";

const initialValues = {
  type: "",
  fromDate: null,
  toDate: null,
  comments: "",
  wardensId: "",
  name: "",
};
const requiredFields = ["type", "fromDate", "toDate"];

const RoomAssign = ({ hostelRoomId, getData }) => {
  console.log(hostelRoomId, "hostelRoomId");
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [wardensName, setWardensName] = useState([]);

  const checks = {
    type: [values.type !== ""],
  };

  const errorMessages = {
    fromDate: ["This field is required"],
    toDate: [
      "This field is required",
      "To date must be greater than from date",
    ],
  };
  const getUserDetails = async () => {
    await axios
      .get(`/api/staffUserDetails`)
      .then((res) => {
        const userData = res.data.data.map((obj) => ({
          value: obj.username,
          label: obj.username,
        }));
        setWardensName(userData);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    if (values.type === "Warden") {
      getUserDetails();
    }
  }, [values.type]);

  const handleChange = (e) => {
    console.log(e.target.name, "e.target.name");
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      ...(e.target.name == "type" && { wardensId: "", name: "" }),
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    console.log(name, newValue, "name, newValue");

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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.fromDate = moment(values?.fromDate).format("YYYY-MM-DD");
      temp.toDate = moment(values?.toDate).format("YYYY-MM-DD");
      temp.comments = values?.comments;
      temp.active = true;
      temp.status = values.type;
      temp.hostelRoomId = hostelRoomId?.id;
      temp.name = values.name;
      await axios
        .post(`/api/hostel/hostelRoomAssignment`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Assigned Successfully",
          });
          setAlertOpen(true);
          getData();
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
      <Grid container rowSpacing={2} columnSpacing={6} mt={1}>
        <Grid item xs={12} md={6}>
          <CustomRadioButtons
            name="type"
            label="Type"
            value={values.type}
            items={[
              { value: "Warden", label: "Warden" },
              { value: "Guest", label: "Guest" },
              { value: "Maintenance", label: "Maintenance" },
            ]}
            handleChange={handleChange}
            required
          />
        </Grid>
        {values.type === "Warden" && values.type !== "Maintenance" && (
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="name"
              label="Warden Name"
              value={values.name}
              options={wardensName}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.name}
              errors={errorMessages.name}
              required
            />
          </Grid>
        )}
        {values.type === "Guest" && values.type !== "Maintenance" && (
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="name"
              label="Name"
              value={values.name}
              handleChange={handleChange}
              checks={checks.name}
              errors={errorMessages.name}
              required
            />
          </Grid>
        )}
        <Grid item xs={12} md={4}>
          <CustomDatePicker
            name="fromDate"
            label="From Date"
            value={values.fromDate}
            handleChangeAdvance={handleChangeAdvance}
            checks={checks.fromDate}
            errors={errorMessages.fromDate}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomDatePicker
            name="toDate"
            label="To Date"
            value={values.toDate}
            handleChangeAdvance={handleChangeAdvance}
            checks={checks.toDate}
            errors={errorMessages.toDate}
            minDate={values.fromDate}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomTextField
            name="comments"
            label="Comments"
            value={values.comments}
            handleChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12} align="right">
          <Button
            sx={{ borderRadius: 2 }}
            variant="contained"
            onClick={handleCreate}
            // disabled={!(values.auid && values.doj)}
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Assign"
            )}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default RoomAssign;
