import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initValues = {
  StoreName: "",
  ShortName: "",
};

const requiredFields = ["StoreName", "ShortName"];

function StoreForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    StoreName: [
      values.StoreName !== "",
      values.StoreName.trim().split(/ +/).join(" "),
    ],
    ShortName: [
      values.ShortName !== "",
      values.ShortName.trim().split(/ +/).join(" "),
    ],
  };

  const errorMessages = {
    StoreName: ["This field required"],
    ShortName: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/inventorymaster/store/new") {
      setIsNew(true);
      setCrumbs([
        { name: "InventoryMaster", link: "/InventoryMaster" },
        { name: "Store" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getStoreData();
    }
  }, [pathname]);

  const getStoreData = () => {
    axios
      .get(`/api/inventory/StoresStock/${id}`)
      .then((res) => {
        setValues({
          StoreName: res.data.data.stock_type_name,
          ShortName: res.data.data.stock_type_short_name,
        });
        setStoreId(res.data.data.stock_type_id);
        setCrumbs([
          { name: "InventoryMaster", link: "/InventoryMaster" },
          { name: "Store" },
          { name: "Update" },
          { name: res.data.data.StoreName },
        ]);
      })

      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    if (e.target.name === "ShortName") {
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
      temp.stock_type_name = values.StoreName;
      temp.stock_type_short_name = values.ShortName;

      await axios
        .post(`/api/inventory/StoresStock`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/InventoryMaster", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
          console.error(err);
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
      temp.stock_type_id = storeId;
      temp.stock_type_name = values.StoreName;
      temp.stock_type_short_name = values.ShortName;

      await axios
        .put(`/api/inventory/UpdateStoresStock/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/InventoryMaster", { replace: true });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data.message,
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
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="StoreName"
              label="StoreName"
              handleChange={handleChange}
              value={values.StoreName}
              checks={checks.StoreName}
              errors={errorMessages.StoreName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="ShortName"
              label="Short Name"
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              value={values.ShortName}
              handleChange={handleChange}
              checks={checks.ShortName}
              errors={errorMessages.ShortName}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              textAlign="right"
            >
              <Grid item xs={4} md={2}>
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
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default StoreForm;
