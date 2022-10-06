import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomPassword from "../../components/Inputs/CustomPassword";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomSelect from "../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../components/Inputs/CustomMultipleAutocomplete";
import CheckboxAutocomplete from "../../components/Inputs/CheckboxAutocomplete";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import CustomTimePicker from "../../components/Inputs/CustomTimePicker";
import CustomDateTimePicker from "../../components/Inputs/CustomDateTimePicker";
import CustomColorInput from "../../components/Inputs/CustomColorInput";
import CustomFileInput from "../../components/Inputs/CustomFileInput";

import FormWrapper from "../../components/FormWrapper";
import ModalWrapper from "../../components/ModalWrapper";
import InfoContainer from "./InfoContainer";
import { convertDateToString } from "../../utils/DateTimeUtils";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// all fields in this
const initValues = {
  name: "",
  email: "",
  phone: "", // optional field
  link: "", // optional field
  password: "",
  gender: "",
  status: "", // optional field
  maritalStatus: "",
  degree: "", // optional field
  country: null,
  city: null, // optional field
  people: [],
  cats: [], // optional field
  joinDate: null,
  completeDate: null, // optional field
  startTime: null,
  endTime: null, // optional field
  enterDateTime: null,
  leaveDateTime: null, // optional field
  notes: "",
  comments: "", // optional field
  primaryColor: "",
  secondaryColor: "", // optional field
  resume: "",
  coverLetter: "", // optional field
  toppings: [],
};

// only required fields in this
const formValidInit = {
  name: false,
  email: false,
  password: false,
  gender: false,
  maritalStatus: false,
  country: false,
  people: false,
  joinDate: false,
  startTime: false,
  notes: false,
  primaryColor: false,
  resume: false,
  toppings: false,
};

function FormExample() {
  const [values, setValues] = useState(initValues);
  const [formValid, setFormValid] = useState(formValidInit);
  const [loading, setLoading] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const [discardModalContent, setDiscardModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const toppingOptions = [
    { value: 0, label: "Mushroom" },
    { value: 1, label: "Tomato" },
    { value: 2, label: "Onion" },
    { value: 3, label: "Chicken" },
    { value: 4, label: "Cheese" },
    { value: 5, label: "Pepper" },
    { value: 6, label: "Olives" },
    { value: 7, label: "Pepperoni" },
    { value: 8, label: "Sweet corn" },
    { value: 9, label: "Baby corn" },
  ];

  useEffect(() => {
    setCrumbs([{ name: "Example Form" }]);
  }, []);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // for autocomplete and date/time pickers
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // these are for Checkbox autocomplete component
  const handleSelectAll = (name, options) => {
    console.log(name, options);
    setValues((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value),
    }));
  };
  const handleSelectNone = (name) => {
    setValues((prev) => ({ ...prev, [name]: [] }));
  };

  // for file adding and removing
  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  // action is a string.
  // This function checks the action and opens the appropriate modal based on the action.
  // The action is passed from the place where the modal was called.
  const handlediscardModalOpen = (action) => {
    if (action === "discard") {
      setDiscardModalContent({
        title: "",
        message: "Are you sure? All fields will be discarded.",
        buttons: [
          {
            name: "Continue",
            color: "primary",
            func: handleDiscard,
          },
        ],
      });
    }
    // some other action just for example.
    else if (action === "close-file") {
      setDiscardModalContent({
        title: "Unsaved changes will be lost",
        message: "",
        buttons: [
          {
            name: "Cancel",
            color: "secondary",
            func: () => {},
          },
          {
            name: "Close",
            color: "error",
            func: () => {},
          },
        ],
      });
    }

    setDiscardModalOpen(true);
  };

  const handleDiscard = () => {
    setValues(initValues);
    setFormValid(formValidInit);
  };

  const handleSubmit = async () => {
    if (Object.values(formValid).includes(false)) {
      console.log("failed");
      setAlertMessage({
        severity: "error",
        message: "please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      console.log(values);
      await axios
        .post(``)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: res.data.message,
            });
            navigate("/", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.response
                ? res.response.data.message
                : "Error submitting",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
        });
    }
  };

  // useEffect(() => console.log(values.joinDate), [values]);
  // useEffect(() => console.log(formValid.toppings), [formValid]);

  return (
    <Box component="form" overflow="hidden" p={1}>
      <CustomModal
        open={discardModalOpen}
        setOpen={setDiscardModalOpen}
        title={discardModalContent.title}
        message={discardModalContent.message}
        buttons={discardModalContent.buttons}
      />

      <ModalWrapper
        open={infoModalOpen}
        setOpen={setInfoModalOpen}
        maxWidth={700}
        title="Modal title"
      >
        <InfoContainer rowId={1} />
      </ModalWrapper>

      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          {/* 1st row */}
          <>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="name"
                label="Name"
                value={values.name}
                handleChange={handleChange}
                helperText="As per aadhaar card"
                errors={["This field is required"]} // every required text field first check should be empty or not.
                checks={[values.name !== ""]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="email"
                label="Email"
                value={values.email}
                handleChange={handleChange}
                helperText=" "
                errors={["This field is required", "Invalid email"]} // this is required field so first check has to be empty or not.
                checks={[
                  values.email !== "",
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    values.email
                  ),
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomPassword
                name="password"
                label="Password"
                helperText="Helper text"
                value={values.password}
                handleChange={handleChange}
                errors={[
                  "This field is required",
                  "Must be longer than 4 characters",
                  "Must be shorter than 10 characters",
                  "Must contain at least one alphabet",
                  "Must contain at least one number",
                  "Must contain at least one special character",
                ]}
                checks={[
                  values.password !== "",
                  values.password.length > 4,
                  values.password.length < 10,
                  /[a-zA-Z]/.test(values.password),
                  /[0-9]/.test(values.password),
                  /[`!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(values.password),
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
          </>

          {/* 2nd row */}
          <>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="link"
                label="Link"
                value={values.link}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="phone"
                label="Phone"
                value={values.phone}
                handleChange={handleChange}
                errors={["Invalid phone"]} // since this is optional field we do not add the check for empty or not. only checking other things.
                checks={[/^[0-9]{10}$/.test(values.phone)]}
              />
            </Grid>
            <Grid item xs={0} md={4} />
          </>

          {/* 3rd row */}
          <>
            <Grid item xs={12} md={4}>
              Radio buttons
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomRadioButtons
                name="gender"
                label="Gender"
                value={values.gender}
                items={[
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                ]}
                handleChange={handleChange}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomRadioButtons
                name="status"
                label="Status"
                value={values.status}
                items={[
                  { value: "W", label: "Working" },
                  { value: "N", label: "Not working" },
                ]}
                handleChange={handleChange}
                row={false}
              />
            </Grid>
          </>

          {/* 4th row */}
          <>
            <Grid item xs={12} md={4}>
              Select field
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="maritalStatus"
                label="Marital Status"
                value={values.maritalStatus}
                items={[
                  { value: "M", label: "Married" },
                  { value: "U", label: "Unmarried" },
                  { value: "D", label: "Divorced" },
                  { value: "W", label: "Widow" },
                ]}
                handleChange={handleChange}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="degree"
                label="Degree"
                value={values.degree}
                items={[
                  { value: "BE", label: "BE" },
                  { value: "ME", label: "ME" },
                  { value: "BSc", label: "BSc" },
                ]}
                handleChange={handleChange}
              />
            </Grid>
          </>

          {/* 5th row */}
          <>
            <Grid item xs={12} md={4}>
              Autocomplete field
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="country"
                label="Country"
                value={values.country}
                options={[
                  { value: 0, label: "India" },
                  { value: 1, label: "USA" },
                  { value: 2, label: "Egypt" },
                  { value: 3, label: "UAE" },
                ]}
                handleChangeAdvance={handleChangeAdvance}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="city"
                label="City"
                value={values.city}
                options={[
                  { value: 0, label: "Bangalore" },
                  { value: 1, label: "New York" },
                  { value: 2, label: "Al Giza" },
                  { value: 3, label: "Ajman" },
                ]}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          </>

          {/* 6th row */}
          <>
            <Grid item xs={12} md={4}>
              Multiple autocomplete
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomMultipleAutocomplete
                name="people"
                label="People"
                value={values.people}
                options={[
                  { value: 0, label: "Dipper" },
                  { value: 1, label: "Wendy" },
                  { value: 2, label: "Soos" },
                  { value: 3, label: "Stanford" },
                  { value: 4, label: "Stanley" },
                  { value: 5, label: "Gideon" },
                  { value: 6, label: "Bill" },
                ]}
                handleChangeAdvance={handleChangeAdvance}
                helperText="Select people"
                errors={[
                  "This field is required",
                  "Select more than 2",
                  "Select less than 5",
                ]}
                checks={[
                  values.people.length > 0,
                  values.people.length > 2,
                  values.people.length < 5,
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomMultipleAutocomplete
                name="cats"
                label="Cats"
                value={values.cats}
                options={[
                  { value: 0, label: "Brown" },
                  { value: 1, label: "Candy" },
                  { value: 2, label: "Grenda" },
                  { value: 3, label: "Twix" },
                  { value: 4, label: "Bounty" },
                  { value: 5, label: "Oreo" },
                  { value: 6, label: "Mabel" },
                ]}
                handleChangeAdvance={handleChangeAdvance}
                helperText=" "
              />
            </Grid>
          </>

          {/* 7th row */}
          <>
            <Grid item xs={12} md={4}>
              Multiple autocomplete with select all/none
            </Grid>
            <Grid item xs={12} md={8}>
              <CheckboxAutocomplete
                name="toppings"
                label="Toppings"
                value={values.toppings}
                options={toppingOptions}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                helperText="Select 2 to 7 toppings"
                errors={[
                  "This field is required",
                  "Select more than 2",
                  "Select less than 7",
                ]}
                checks={[
                  values.toppings.length > 0,
                  values.toppings.length > 2,
                  values.toppings.length < 7,
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
          </>

          {/* 8th row */}
          <>
            <Grid item xs={12} md={4}>
              Date picker
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="joinDate"
                label="Date of joining"
                value={values.joinDate}
                handleChangeAdvance={handleChangeAdvance}
                errors={
                  values.completeDate
                    ? [
                        `This field is required`,
                        `Must be before today`,
                        `Must be before ${convertDateToString(
                          values.completeDate.$d
                        )}`,
                      ]
                    : [`This field is required`, `Must be before today`]
                }
                checks={
                  values.completeDate
                    ? [
                        values.joinDate,
                        values.joinDate < dayjs(),
                        values.joinDate < values.completeDate,
                      ]
                    : [values.joinDate, values.joinDate < dayjs()]
                }
                setFormValid={setFormValid}
                required
                disableFuture
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="completeDate"
                label="Date of completion"
                value={values.completeDate}
                handleChangeAdvance={handleChangeAdvance}
                errors={
                  values.joinDate
                    ? [
                        `Must be before today`,
                        `Must be after ${convertDateToString(
                          values.joinDate.$d
                        )}`,
                      ]
                    : [`Must be before today`]
                }
                checks={
                  values.joinDate
                    ? [
                        values.completeDate < dayjs(),
                        values.completeDate > values.joinDate,
                      ]
                    : [values.joinDate < dayjs()]
                }
                minDate={values.joinDate}
                disabled={!values.joinDate}
                disableFuture
              />
            </Grid>
          </>

          {/* 9th row */}
          <>
            <Grid item xs={12} md={4}>
              Time picker
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTimePicker
                name="startTime"
                label="Start time"
                value={values.startTime}
                handleChangeAdvance={handleChangeAdvance}
                seconds
                errors={["This field is required"]}
                checks={[values.startTime]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTimePicker
                name="endTime"
                label="End time"
                value={values.endTime}
                handleChangeAdvance={handleChangeAdvance}
                minTime={values.startTime}
                disabled={!values.startTime}
              />
            </Grid>
          </>

          {/* 10th row */}
          <>
            <Grid item xs={12} md={4}>
              Date and Time picker
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDateTimePicker
                name="enterDateTime"
                label="Entry date and time"
                value={values.enterDateTime}
                handleChangeAdvance={handleChangeAdvance}
                seconds
                errors={["This field is required"]}
                checks={[values.enterDateTime]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDateTimePicker
                name="leaveDateTime"
                label="Leaving date and time"
                value={values.leaveDateTime}
                handleChangeAdvance={handleChangeAdvance}
                minDateTime={values.enterDateTime}
                disabled={!values.enterDateTime}
              />
            </Grid>
          </>

          {/* 11th row */}
          <>
            {/* Just use CustomTextField with multiline and rows props */}
            <Grid item xs={12} md={4}>
              Text area
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                multiline
                rows={4}
                name="notes"
                label="Notes"
                value={values.notes}
                handleChange={handleChange}
                errors={["This field is required"]}
                checks={[values.notes.length !== 0]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                multiline
                rows={4}
                name="comments"
                label="Comments"
                value={values.comments}
                handleChange={handleChange}
              />
            </Grid>
          </>

          {/* 12th row */}
          <>
            <Grid item xs={12} md={4}>
              Color input
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomColorInput
                name="primaryColor"
                label="Primary color"
                value={values.primaryColor}
                handleChange={handleChange}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomColorInput
                name="secondaryColor"
                label="Secondary color"
                value={values.secondaryColor}
                handleChange={handleChange}
              />
            </Grid>
          </>

          {/* 13th row */}
          <>
            <Grid item xs={12} md={4}>
              File input
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="resume"
                label="resume"
                helperText="PDF - smaller than 2 MB"
                file={values.resume}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                errors={[
                  "This field is required",
                  "Please upload a PDF",
                  "Maximum size 2 MB",
                ]}
                checks={[
                  values.resume,
                  values.resume && values.resume.name.endsWith(".pdf"),
                  values.resume && values.resume.size < 2000000,
                ]}
                setFormValid={setFormValid}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="coverLetter"
                label="Cover Letter"
                helperText="PDF - smaller than 2 MB"
                file={values.coverLetter}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
              />
            </Grid>
          </>

          {/* last row buttons */}
          <>
            <Grid item xs={0} md={4} />
            <Grid item xs={0} md={4} mt={2}>
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="secondary"
                onClick={() => setInfoModalOpen(true)}
              >
                <strong>Show Info</strong>
              </Button>
            </Grid>

            <Grid item xs={12} md={4} mt={2}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
              >
                <Grid item xs={6}>
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="error"
                    disabled={loading}
                    onClick={() => handlediscardModalOpen("discard")}
                  >
                    <strong>Discard</strong>
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <strong>Submit</strong>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default FormExample;
