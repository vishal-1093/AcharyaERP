import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);

const initialValues = {
  vendor_id: "",
  rate_per_count: "",
  active: true,
  meal_id: "",
  remarks: "",
};
const requiredFields = ["vendor_id", "rate_per_count", "active"];

function MealAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [refreshmentData, setRefreshmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [mealData, setMealData] = useState([]);
  const [mealOptions, setMealOptions] = useState([]);

  const [vendorOptions, setVendorOptions] = useState([]);
  const checks = {
    rate_per_count: [values.rate_per_count !== ""],
    active: [values.active !== ""],
    for_end_user: [values.for_end_user !== ""],
    for_mess: [values.for_mess !== ""],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/cateringmaster/mealassign/new") {
      setIsNew(true);
      getMealOptions();
      setCrumbs([
        {
          name: "Meal Assignment Index",
          link: "/CateringMaster/InstituteMealIndex",
        },
        { name: "Meal Assignment" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getMealOptions();
      getMealTypeData();
    }
  }, [pathname]);

  useEffect(() => {
    if (values.meal_id) {
      getMealVendor();
      getMenuContents(values.meal_id);
    }
  }, [values.meal_id]);

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

  const getMenuContents = async (meal_id) => {
    await axios
      .get(`/api/mealType/${meal_id}`)
      .then((Response) => {
        setMealOptions(Response.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getMealVendor = async (meal_id) => {
    await axios
      .get(`/api/inventory/getVoucherHeadNewDataFromVendor`)
      .then((Response) => {
        const data = [];
        Response.data.data.forEach((obj) => {
          data.push({
            value: obj.voucherHeadNewId,
            label: obj.vendor_name,
          });
        });
        setVendorOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getMealTypeData = async () => {
    await axios
      .get(`/api/getMealVendorAssignmentById/${id}`)
      .then((res) => {
        setValues({
          vendor_id: res.data.data.voucher_head_new_id,
          rate_per_count: res.data.data.rate_per_count,
          active: true,
          remarks: res.data.data.remarks,
          meal_id: res.data.data.meal_id,
        });
        setRefreshmentData(res.data.data);
        setCrumbs([
          {
            name: "Meal Assignment Index",
            link: "/CateringMaster/InstituteMealIndex",
          },
          { name: "Meal Assignment" },
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
    if (e.target.name === "rate_per_count") {
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
      temp.voucher_head_new_id = values.vendor_id;
      temp.rate_per_count = values.rate_per_count;
      temp.remarks = values.remarks;
      temp.meal_id = values.meal_id;
      await axios
        .post(`/api/saveMealVendorAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CateringMaster/InstituteMealIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Vendor Assignment Created",
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
      temp.created_by = refreshmentData?.created_by;
      temp.created_date = refreshmentData.created_date;
      temp.created_username = refreshmentData.created_username;
      temp.meal_id = values.meal_id;
      temp.voucher_head_new_id = values.vendor_id;
      temp.rate_per_count = values.rate_per_count;
      temp.meal_vendor_assignment_id =
        refreshmentData.meal_vendor_assignment_id;
      temp.remarks = values.remarks;

      await axios
        .put(`/api/updateMealVendorAssignment/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Vendor Assignment Updated",
            });
            navigate("/CateringMaster/InstituteMealIndex", { replace: true });
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
              name="meal_id"
              label="Meal Type"
              options={mealData}
              value={values.meal_id}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="vendor_id"
              label="Vendor"
              options={vendorOptions}
              value={values.vendor_id}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              label="Rate Per Count"
              value={values?.rate_per_count}
              name="rate_per_count"
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              disabled
              value={mealOptions?.menu_contents}
              name="menu"
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              label="Remarks"
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

export default MealAssignmentForm;
