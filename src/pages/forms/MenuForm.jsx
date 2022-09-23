import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import FormWrapper from "../../components/FormWrapper";
import CustomMultipleAutocomplete from "../../components/Inputs/CustomMultipleAutocomplete";
import IconSelector from "../../components/Inputs/IconSelector";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ApiUrl from "../../services/Api";
import axios from "axios";

const initialValues = {
  menuName: "",
  menuShortName: "",
  moduleIds: [],
  description: "",
  iconName: "",
};

const requiredFields = [
  "menuName",
  "menuShortName",
  "moduleIds",
  "description",
  "iconName",
];

function MenuForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [menuId, setMenuId] = useState(null);
  const [formValid, setFormValid] = useState({});
  const [moduleOptions, setModuleOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getModuleOptions();

    if (pathname.toLowerCase() === "/navigationmaster/menu/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "NavigationMaster", link: "/NavigationMaster" },
        { name: "Menu" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getMenuData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getModuleOptions = () => {
    axios
      .get(`${ApiUrl}/Module`)
      .then((res) => {
        setModuleOptions(
          res.data.data.map((obj) => ({
            value: obj.module_id,
            label: obj.module_name,
          }))
        );
      })
      .catch((err) => {
        console.error(err.response.values.message);
      });
  };

  const getMenuData = () => {
    axios
      .get(`${ApiUrl}/Menu/${id}`)
      .then((res) => {
        setValues({
          menuName: res.data.data.menu_name,
          menuShortName: res.data.data.menu_short_name,
          moduleIds: [res.data.data.module_id],
          description: res.data.data.menu_desc,
        });
        setMenuId(res.data.data.menu_id);
        setCrumbs([
          { name: "NavigationMaster", link: "/NavigationMaster" },
          { name: "Menu" },
          { name: "Update" },
          { name: res.data.data.menu_name },
        ]);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "menuShortName") {
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
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleSelectIcon = (icon) => {
    setValues((prev) => ({
      ...prev,
      iconName: icon,
    }));
  };

  const handleCreate = async () => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      console.log("failed");
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.menu_name = values.menuName;
      temp.menu_short_name = values.menuShortName;
      temp.module_id = values.moduleIds;
      temp.menu_desc = values.description;
      await axios
        .post(`${ApiUrl}/Menu`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Menu created",
            });
            setAlertOpen();
            navigate("/NavigationMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
            setAlertOpen(true);
          }
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
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.menu_id = menuId;
      temp.menu_name = values.menuName;
      temp.menu_short_name = values.menuShortName;
      temp.module_id = values.moduleIds;
      temp.menu_desc = values.description;
      await axios
        .put(`${ApiUrl}/Menu/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Menu updated",
            });
            setAlertOpen();
            navigate("/NavigationMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
            setAlertOpen(true);
          }
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
    <Box component="form" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="menuName"
              label="Menu"
              value={values.menuName ?? ""}
              handleChange={handleChange}
              fullWidth
              errors={["This field required", "Enter Only Characters"]}
              checks={[
                values.menuName !== "",
                /^[A-Za-z ]+$/.test(values.menuName),
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="menuShortName"
              label="Short Name"
              value={values.menuShortName ?? ""}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
                minLength: 3,
                maxLength: 3,
              }}
              fullWidth
              errors={[
                "This field required",
                "Enter characters and its length should be three",
              ]}
              checks={[
                values.menuShortName !== "",
                /^[A-Za-z ]{3}$/.test(values.menuShortName),
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomMultipleAutocomplete
              name="moduleIds"
              label="Module"
              value={values.moduleIds}
              options={moduleOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              errors={["This field is required"]}
              checks={[values.moduleIds.length > 0]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={4}
              name="description"
              label="Description"
              value={values.description ?? ""}
              handleChange={handleChange}
              errors={["This field is required"]}
              checks={[values.description]}
              setFormValid={setFormValid}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <IconSelector
              value={values.iconName}
              onSelectIcon={handleSelectIcon}
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
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
export default MenuForm;
