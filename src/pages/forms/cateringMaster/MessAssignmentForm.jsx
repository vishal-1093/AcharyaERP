import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
const CustomAutocomplete = lazy(() => import("../../../components/Inputs/CustomAutocomplete"));
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));

const initialValues = {
  mess_meal_type: "",
  mess_meal_content: "",
  active: true,
  mess_meal_type: "",
  date: [],
};
const requiredFields = [
  "mess_meal_content",
  "mess_meal_type",
];

function MessAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    mess_meal_type: [values.mess_meal_type !== ""],
    mess_meal_content: [values.mess_meal_content !== ""],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/cateringmaster/messassign/new") {
      setIsNew(true);

      setCrumbs([
        { name: "Mess Assignment Index", link: "/CateringMaster/MessAssignmentIndex" },
        { name: "Mess Assignment" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);

      getMealTypeData();
    }
  }, [pathname]);


  useEffect(() => {
    if (values.mess_meal_type) {
      menuContentOptions(values.mess_meal_type)
    }
  }, [values.mess_meal_type]);

  const getMealOptions = [
    { value: "BREAKFAST", label: "Breakfast" },
    { value: "LUNCH", label: "Lunch" },
    { value: "SNACKS", label: "Snacks" },
    { value: "DINNER", label: "Dinner" },
  ]

  const menuContentOptions = async (meal) => {
    await axios
      .get(
        `/api/fetchMessMealTypeContents/${meal}`
      )
      .then((Response) => {
        const data = [];
        Response.data.data.forEach((obj) => {
            data.push({
              value: obj.meal_id,
              label: obj.menu_contents,
            })
          })

        setMenuData(data);
      })
      .catch((err) => console.error(err));
  };

  const getMealTypeData = async () => {
    await axios
      .get(`/api/getMealRefreshmentRequestByRefreshmentId/${id}`)
      .then((res) => {
        setValues({
          mess_meal_type: res.data.data.mess_meal_type.toUpperCase(),
          mess_meal_content: res.data.data.meal_id,
          active: true,
          date: res.data.data.date,
        });
        setCrumbs([
          { name: "Mess Assignment Index", link: "/CateringMaster/MessAssignmentIndex" },
          { name: "Mess Assignment" },
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

  const handleChangeDate = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      ["dateValue"]: newValue,
    }));
  };

  const handleChange = (e) => {
    if (e.target.name === "mess_meal_content") {
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
      temp.meal_id = values.mess_meal_content;
      temp.count = null;
      temp.date = values?.dateValue?.validatedValue;
      temp.remarks = "";
      temp.time = "";
      await axios
        .post(`/api/MealRefreshmentRequestForMultipleDates`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CateringMaster/MessAssignmentIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Mess Assigned",
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
      const selectedOption = menuData.find(option => option.value == values.mess_meal_content);
      const temp = {};
      temp.meal_id = values.mess_meal_content;
      temp.refreshment_id = id;
      temp.active = true;
      temp.count = null;
      temp.date = values?.date ? values?.date : values?.dateValue?.validatedValue[0];
      temp.remarks = "";

      await axios
        .put(`/api/updateMealRefreshmentRequest/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Mess Assignment Updated",
            });
            navigate("/CateringMaster/MessAssignmentIndex", { replace: true });
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

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="mess_meal_type"
              label="Mess Meal Type"
              options={getMealOptions}
              value={values.mess_meal_type}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="mess_meal_content"
              label="Menu"
              options={menuData}
              value={values.mess_meal_content}
              handleChangeAdvance={handleChangeAdvance}
              required
            />

          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              className="blue"
              inputClass="custom-input"
              multiple={isNew ? true : false}
              format="YYYY-MM-DD"
              name="date"
              title="Date"
              placeholder="Select Date"
              value={values.date}
              onChange={handleChangeDate}
              required
              plugins={[
                <DatePanel />
              ]}
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

export default MessAssignmentForm;
