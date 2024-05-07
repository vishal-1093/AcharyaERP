import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import moment from "moment";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "../../../../services/Api";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import useAlert from "../../../../hooks/useAlert";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
const CustomTextField = lazy(() =>
  import("../../../../components/Inputs/CustomTextField")
);
const CustomTimePicker = lazy(() =>
  import("../../../../components/Inputs/CustomTimePicker")
);
const FormWrapper = lazy(() => import("../../../../components/FormWrapper"));
const CustomAutocomplete = lazy(() =>
  import("../../../../components/Inputs/CustomAutocomplete")
);
const initialValues = {
  date: "",
  count: "",
  active: true,
  meal_id: "",
  time: "",
  remarks: "",
  schoolId: null,
  deptId: null,
};
const requiredFields = ["meal_id", "count"];

function RefreshmentRequestForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [refreshmentData, setRefreshmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [mealData, setMealData] = useState([]);

  const checks = {
    count: [values.count !== ""],
    active: [values.active !== ""],
    for_end_user: [values.for_end_user !== ""],
    for_mess: [values.for_mess !== ""],
  };

  const errorMessages = {
    count: ["This field required"],
    active: ["This field is required"],
    for_end_user: ["This field is required"],
    for_mess: ["This field is required"],
  };

  useEffect(() => {
    getSchoolData();
    if (
      pathname.toLowerCase() === "/refreshmentdetails/refreshmenttypeindex/new"
    ) {
      setIsNew(true);
      getMealOptions();
      setCrumbs([
        {
          name: "Refreshment Request Index",
          link: "/RefreshmentDetails",
        },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getMealOptions();
      getRefreshRequestData();
    }
  }, [pathname]);

  useEffect(() => {
    getDepartmentData();
  }, [values.schoolId]);

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const schoolData = [];
        res.data.data.forEach((obj) => {
          schoolData.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });

        setSchoolOptions(schoolData);
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          const deptData = [];

          res.data.data.forEach((obj) => {
            deptData.push({
              value: obj.dept_id,
              label: obj.dept_name,
            });
          });

          setDeptOptions(deptData);
        })
        .catch((err) => console.error(err));
  };

  const getMealOptions = async () => {
    await axios
      .get(`/api/getOnlyEndUserMealType`)
      .then((Response) => {
        const data = [];
        Response.data.data.forEach((obj) => {
          data.push({
            value: obj.meal_id,
            label: obj.meal_type,
          });
        });
        setMealData(data);
      })
      .catch((err) => console.error(err));
  };

  const getRefreshRequestData = async () => {
    await axios
      .get(`/api/MealRefreshmentRequest/${id}`)
      .then((res) => {
        setValues({
          time: res.data.data.time,
          count: res.data.data.count,
          active: true,
          date: res.data.data.date,
          remarks: res.data.data.remarks,

          meal_id: res.data.data.meal_id,
        });
        setRefreshmentData(res.data.data);
        setCrumbs([
          {
            name: "Refreshment Request Index",
            link: "/CateringMaster/RefreshmentRequestIndex",
          },
          { name: "Refreshment Request" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeDate = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      ["dateValue"]: newValue,
    }));
  };

  const handleChange = (e) => {
    if (e.target.name === "count") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);

      const temp = {};
      temp.active = true;
      temp.meal_id = values.meal_id;
      temp.count = values.count;
      temp.time = values.time;

      const allDates = values?.dateValue?.validatedValue.map((obj) =>
        moment(obj).format("DD-MM-YYYY")
      );

      temp.date = allDates;
      temp.remarks = values.remarks;
      temp.approved_status = 0;
      temp.school_id = values.schoolId;
      temp.dept_id = values.deptId;

      await axios
        .post(`/api/MealRefreshmentRequestForMultipleDates`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/RefreshmentDetails", {
              replace: true,
            });
            setAlertMessage({
              severity: "success",
              message: "Meal Refreshment Requested",
            });
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.created_username = refreshmentData.created_username;
      temp.meal_id = values.meal_id;
      temp.refreshment_id = refreshmentData.refreshment_id;
      temp.count = values.count;
      temp.time = moment(new Date(values.time)).format("HH:mm:ss A");
      temp.date = values?.dateValue?.validatedValue[0];
      temp.remarks = values.remarks;
      await axios
        .put(`/api/updateMealRefreshmentRequest/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Refreshment Request Updated",
            });
            navigate("/RefreshmentDetails", {
              replace: true,
            });
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

  const currentDate = new Date();
  const nextDate = new Date(currentDate.getTime() - 48 * 60 * 60 * 1000);
  nextDate.setHours(0, 0, 0, 0);

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="meal_id"
              label="Meal Type"
              options={mealData}
              value={values.meal_id}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Count"
              value={values?.count}
              name="count"
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              handleChangeAdvance={handleChangeAdvance}
              options={schoolOptions}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="deptId"
              label="Department"
              value={values.deptId}
              handleChangeAdvance={handleChangeAdvance}
              options={deptOptions}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <DatePicker
              className="blue"
              inputClass="custom-input"
              multiple={true}
              format="YYYY-MM-DD"
              name="date"
              title="Date"
              placeholder="Select Date"
              value={values.date}
              onChange={handleChangeDate}
              minDate={nextDate}
              required
              plugins={[<DatePanel />]}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTimePicker
              name="time"
              label="Time"
              value={values.time}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.time}
              errors={errorMessages.time}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              label="Event"
              value={values?.remarks}
              name="remarks"
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} align="right">
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

export default RefreshmentRequestForm;
