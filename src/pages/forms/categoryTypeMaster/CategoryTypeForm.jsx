import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initialValues = {
  categoryName: "",
  shortName: "",
  remarks: "",
};
const requiredFields = ["categoryName", "shortName", "remarks"];

function CategoryTypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [CategoryTypeId, setCategoryTypeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    categoryName: [values.categoryName !== ""],
    shortName: [values.shortName !== ""],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    categoryName: ["This field required"],
    shortName: ["This field is required"],
    remarks: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/categorytypemaster/categorytypes/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "CategoryType Master",
          link: "/CategoryTypeMaster/CategoryTypes",
        },
        { name: "Category Type" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCategoryTypeData();
    }
  }, [pathname]);

  const getCategoryTypeData = async () => {
    await axios
      .get(`/api/categoryTypeCreation/${id}`)
      .then((res) => {
        setValues({
          categoryName: res.data.data.category_name,
          shortName: res.data.data.category_name_sort,
          remarks: res.data.data.remarks,
        });
        setCategoryTypeId(res.data.data.category_type_id);
        setCrumbs([
          {
            name: "CategoryType Master",
            link: "/CategoryTypeMaster/CategoryTypes",
          },
          { name: "Category Type" },
          { name: "Update" },
          { name: res.data.data.category_name },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
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
      temp.category_name = values.categoryName;
      temp.category_name_sort = values.shortName;
      temp.remarks = values.remarks;

      await axios
        .post(`/api/categoryTypeCreation`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CategoryTypeMaster/CategoryTypes", { replace: true });
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
      temp.category_type_id = CategoryTypeId;
      temp.category_name = values.categoryName;
      temp.category_name_sort = values.shortName;
      temp.remarks = values.remarks;

      await axios
        .put(`/api/categoryTypeCreation/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CategoryTypeMaster/CategoryTypes", { replace: true });
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
            <CustomTextField
              name="categoryName"
              label="Category Name"
              value={values.categoryName}
              handleChange={handleChange}
              checks={checks.categoryName}
              errors={errorMessages.categoryName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              checks={checks.shortName}
              errors={errorMessages.shortName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
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

export default CategoryTypeForm;
