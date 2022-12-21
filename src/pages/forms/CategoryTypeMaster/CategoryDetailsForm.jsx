import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  categoryTypeId: "",
  categoryDetail: "",
};
const requiredFields = ["categoryDetail"];

function CategoryDetailsForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [CategoryDetailsId, setCategoryDetailsId] = useState(null);
  const [CategoryTypeOptions, setCategoryTypeOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    categoryDetail: [values.categoryDetail !== ""],
  };

  const errorMessages = {
    categoryDetail: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/categorytypemaster/categorydetail/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "Category Type Master",
          link: "/CategoryTypeMaster/CategoryDetail",
        },
        { name: "Category Details" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCategoryDetailsData();
    }
  }, [pathname]);

  useEffect(() => {
    getCategoryDetailsOptions();
  }, []);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getCategoryDetailsOptions = async () => {
    await axios
      .get(`/api/categoryTypeCreation`)
      .then((res) => {
        setCategoryTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.category_type_id,
            label: obj.category_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getCategoryDetailsData = async () => {
    await axios
      .get(`/api/categoryTypeDetails/${id}`)
      .then((res) => {
        setValues({
          categoryDetail: res.data.data.category_detail,
          categoryTypeId: res.data.data.category_type_id,
        });
        setCategoryDetailsId(res.data.data.ctd_id);
        setCrumbs([
          {
            name: "CategoryType Master",
            link: "/CategoryTypeMaster/CategoryDetail",
          },
          { name: "Category Details" },
          { name: "Update" },
          { name: res.data.data.category_detail },
        ]);
      })
      .catch((error) => console.error(error));
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
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.category_detail = values.categoryDetail;
      temp.category_type_id = values.categoryTypeId;

      await axios
        .post(`/api/categoryTypeDetails`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CategoryTypeMaster/CategoryDetail", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
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
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
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
      temp.ctd_id = CategoryDetailsId;
      temp.category_detail = values.categoryDetail;
      temp.category_type_id = values.categoryTypeId;

      await axios
        .put(`/api/categoryTypeDetails/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CategoryTypeMaster/CategoryDetail", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
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
              : "An error occured",
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
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="categoryTypeId"
              label="Category Type"
              options={CategoryTypeOptions}
              value={values.categoryTypeId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="categoryDetail"
              label="Category Detail"
              value={values.categoryDetail}
              handleChange={handleChange}
              checks={checks.categoryDetail}
              errors={errorMessages.categoryDetail}
              required
            />
          </Grid>

          <Grid item xs={12} md={6} textAlign="right">
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

export default CategoryDetailsForm;
