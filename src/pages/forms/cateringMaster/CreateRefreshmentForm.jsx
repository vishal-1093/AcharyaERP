import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() => import("../../../components/Inputs/CustomTextField"));
const CustomRadioButtons = lazy(() => import("../../../components/Inputs/CustomRadioButtons"));
const CustomAutocomplete = lazy(() => import("../../../components/Inputs/CustomAutocomplete"));

const initialValues = {
  meal_type: "",
  menu_contents: "",
  active: true,
  for_end_user: true,
  for_mess: false,
  mess_meal_type: "",
  select_type: "Institue",
};
const requiredFields = [
  "menu_contents",
];

function RefreshmentTypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [refreshmentData, setRefreshmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const checks = {
    menu_contents: [values.menu_contents !== ""],

  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/cateringmaster/refreshmenttypeindex/new") {
      setIsNew(true);

      setCrumbs([
        { name: "Refreshment Type Index", link: "/CateringMaster/RefreshmentTypeIndex" },
        { name: "RefreshmentType" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);

      getMealTypeData();
    }
  }, [pathname]);


  const getMealOptions = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Snacks", label: "Snacks" },
    { value: "Dinner", label: "Dinner" },
  ]

  const MealTypeOptions = [
    { value: "Institue", label: "For Institute" },
    { value: "Mess", label: "For Mess" },
  ]

  const getMealTypeData = async () => {
    await axios
      .get(`/api/mealType/${id}`)
      .then((res) => {
        setValues({
          meal_type: res.data.data.for_mess === true ? res.data.data.meal_id : res.data.data.meal_type,
          menu_contents: res.data.data.menu_contents,
          active: res.data.data.active === true
            ? "Yes"
            : res.data.data.active === false
              ? "No"
              : "",
          for_end_user: res.data.data.for_end_user === true
            ? "yes"
            : res.data.data.for_end_user === false
              ? "no"
              : "",
          for_mess:
            res.data.data.for_mess === true
              ? "yes"
              : res.data.data.for_mess === false
                ? "no"
                : "",
          mess_meal_type: res.data.data.mess_meal_type ? res.data.data.mess_meal_type : "",
          select_type: res.data.data.for_end_user === true ? "Institue" : "Mess"
        });
        setRefreshmentData(res.data.data);
        setCrumbs([
          { name: "Refreshment Type Index", link: "/CateringMaster/RefreshmentTypeIndex" },
          { name: "RefreshmentType" },
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

  const handleChange = (e) => {
    if (e.target.name === "menu_contents") {
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
      temp.meal_type = values.meal_type;
      temp.menu_contents = values.menu_contents;
      temp.for_end_user = values.select_type === "Mess" ? false : true;
      temp.for_mess =
        values.select_type === "Mess" ? true : false;
      temp.mess_meal_type = values.mess_meal_type
      await axios
        .post(`/api/mealType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CateringMaster/RefreshmentTypeIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Refreshment Type Created",
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
      temp.meal_id = id;
      temp.meal_type = values.for_end_user === "yes" ? values.meal_type : "";
      temp.menu_contents = values.menu_contents;
      temp.for_end_user = values.for_end_user === "yes" ? true : values.for_end_user === "no" ? false : "";
      temp.for_mess =
        values.for_mess === "yes" ? true : values.for_mess === "no" ? false : "";
      temp.mess_meal_type = values.for_mess === "yes" ? values.mess_meal_type : ""
      await axios
        .put(`/api/updateMealType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Refreshment Type Updated",
            });
            navigate("/CateringMaster/RefreshmentTypeIndex", { replace: true });
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
              name="select_type"
              label="Select"
              options={MealTypeOptions}
              value={values.select_type}
              handleChangeAdvance={handleChangeAdvance}
            />

          </Grid>
          {values?.select_type == "Institue" && (
            <>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="meal_type"
                  label="Meal Type"
                  value={values.meal_type}
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={3} justifyContent={"center"}>
                <CustomRadioButtons
                  name="for_end_user"
                  label="For End User"
                  value={values.for_end_user}
                  items={[
                    {
                      value: "yes",
                      label: "Yes",
                    },
                    {
                      value: "no",
                      label: "No",
                    },
                  ]}
                  handleChange={handleChange}
                />
              </Grid>
            </>
          )}

          {values?.select_type === "Mess" && (
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="mess_meal_type"
                label="Mess Meal Type"
                options={getMealOptions}
                value={values.mess_meal_type}
                handleChangeAdvance={handleChangeAdvance}
              />

            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              label="Menu"
              value={values?.menu_contents}
              name="menu_contents"
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

export default RefreshmentTypeForm;
