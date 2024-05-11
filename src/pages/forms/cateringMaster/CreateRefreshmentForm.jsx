import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomRadioButtons = lazy(() =>
  import("../../../components/Inputs/CustomRadioButtons")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initialValues = {
  selectType: "Institute",
  mealType: "",
  forEndUser: false,
  menuContents: "",
  messMealType: "",
};
const requiredFields = ["menu_contents"];

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
        {
          name: "Refreshment Type Index",
          link: "/CateringMaster/RefreshmentTypeIndex",
        },
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
  ];

  const MealTypeOptions = [
    { value: "Institute", label: "For Institute" },
    { value: "Mess", label: "For Mess" },
  ];

  const getMealTypeData = async () => {
    await axios
      .get(`/api/mealType/${id}`)
      .then((res) => {
        setValues({
          mealType: res.data.data.meal_type,
          menuContents: res.data.data.menuContents,
          selectType: res.data.data.for_mess === false ? "Institute" : "Mess",
          forEndUser: res.data.data.for_end_user ? "yes" : "no",
          menuContents: res.data.data.menu_contents,
          messMealType: res.data.data.mess_meal_type,
        });

        setRefreshmentData(res.data.data);
        setCrumbs([
          {
            name: "Refreshment Type Index",
            link: "/CateringMaster/RefreshmentTypeIndex",
          },
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

  const isNewQuestion = async () => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `/api/fetchAllMealTypeDetails?page=${0}&page_size=${10000}&sort=created_date`
        )
        .then((res) => {
          const questionsList = res.data.data.Paginated_data.content;
          resolve(
            questionsList.every((obj) => {
              if (
                obj.meal_type.replaceAll(" ", "").toLowerCase() !==
                values.meal_type.replaceAll(" ", "").toLowerCase()
              )
                return true;

              return false;
            })
          );
        })
        .catch((err) => {
          console.error(err);
          resolve(true);
        });
    });
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.meal_type = values.mealType;
      temp.menu_contents = values.menuContents;
      temp.for_end_user = values.forEndUser === "yes" ? true : false;
      temp.for_mess = values.selectType === "Mess" ? true : false;
      temp.mess_meal_type = values.messMealType;

      if (!(await isNewQuestion())) {
        setAlertMessage({
          severity: "error",
          message: "Meal Type already exist!!",
        });
        setAlertOpen(true);
        setLoading(false);
        return;
      } else {
        setLoading(true);

        await axios
          .post(`/api/mealType`, temp)
          .then((res) => {
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
              navigate("/CateringMaster/RefreshmentTypeIndex", {
                replace: true,
              });
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
      temp.meal_type = values.selectType === "Institute" ? values.mealType : "";
      temp.menu_contents = values.menuContents;
      temp.for_end_user =
        values.forEndUser === "yes" && values.selectType === "Institute"
          ? true
          : values.forEndUser === "no"
          ? false
          : false;
      temp.for_mess = values.selectType === "Mess" ? true : false;
      temp.mess_meal_type =
        values.selectType === "Mess" ? values.messMealType : "";

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
              name="selectType"
              label="Select"
              options={MealTypeOptions}
              value={values.selectType}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          {values?.selectType == "Institute" && (
            <>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="mealType"
                  label="Meal Type"
                  value={values.mealType}
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={3} justifyContent={"center"}>
                <CustomRadioButtons
                  name="forEndUser"
                  label="For End User"
                  value={values.forEndUser}
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

          {values?.selectType === "Mess" && (
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="messMealType"
                label="Mess Meal Type"
                options={getMealOptions}
                value={values.messMealType}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              label="Menu"
              value={values?.menuContents}
              name="menuContents"
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
