import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "axios";
import ApiUrl from "../../../services/Api";

const initialValues = {
  submenuName: "",
  description: "",
  menuId: "",
  status: "",
  submenuUrl: "",
};

const requiredFields = [
  "submenuName",
  "description",
  "menuId",
  "status",
  "submenuUrl",
];

function SubmenuForm() {
  const [isNew, setIsNew] = useState(true);
  const [menuOptions, setMenuOptions] = useState([]);
  const [submenuId, setSubmenuId] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getMenuOptions();

    if (pathname.toLowerCase() === "/navigationmaster/submenu/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "Navigation Master", link: "/NavigationMaster" },
        { name: "Submenu" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSubmenuData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, []);

  function getMenuOptions() {
    axios
      .get(`${ApiUrl}/MenuForSubmenu`)
      .then((res) => {
        setMenuOptions(
          res.data.data.map((obj) => ({
            value: obj.menu_id,
            label: obj.menu_module_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  }

  const getSubmenuData = async () => {
    axios
      .get(`${ApiUrl}/SubMenu/${id}`)
      .then((res) => {
        setValues({
          submenuName: res.data.data.submenu_name,
          description: res.data.data.submenu_desc,
          menuId: res.data.data.menu_id,
          status: res.data.data.status,
          submenuUrl: res.data.data.submenu_url,
        });
        setSubmenuId(res.data.data.submenu_id);
        setCrumbs([
          { name: "Navigation Master", link: "/NavigationMaster" },
          { name: "Submenu" },
          { name: "Update" },
          { name: res.data.data.submenu_name },
        ]);
      })
      .catch((err) => console.error(err));
  };

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

  const handleCreate = async () => {
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
      temp.submenu_name = values.submenuName;
      temp.submenu_desc = values.description;
      temp.menu_id = values.menuId;
      temp.status = values.status;
      temp.submenu_url = values.submenuUrl;
      await axios
        .post(`${ApiUrl}/SubMenu`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/NavigationMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Submenu created",
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
              ? err.response.value.message
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
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.submenu_id = submenuId;
      temp.submenu_name = values.submenuName;
      temp.submenu_desc = values.description;
      temp.menu_id = values.menuId;
      temp.status = values.status;
      temp.submenu_url = values.submenuUrl;
      await axios
        .put(`${ApiUrl}/SubMenu/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/NavigationMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Submenu updated",
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
              ? err.response.value.message
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
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="submenuName"
              label="Submenu"
              value={values.submenuName}
              handleChange={handleChange}
              errors={["This field required", "Enter Only Characters"]}
              checks={[
                values.submenuName !== "",
                /^[A-Za-z ]+$/.test(values.submenuName),
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="menuId"
              label="Menu"
              value={values.menuId}
              options={menuOptions}
              handleChangeAdvance={handleChangeAdvance}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="submenuUrl"
              label="New Url"
              value={values.submenuUrl}
              handleChange={handleChange}
              errors={["This field required"]}
              checks={[values.submenuUrl !== ""]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomSelect
              label="Status"
              name="status"
              value={values.status}
              handleChange={handleChange}
              items={[
                {
                  value: "Under Maintainence",
                  label: "Under Maintainence",
                },
                { value: "Blocked", label: "Blocked" },
                { value: "Access Denied", label: "Access Denied" },
                { value: "Working", label: "Working" },
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              multiline
              rows={4}
              name="description"
              label="Description"
              value={values.description}
              handleChange={handleChange}
              errors={["This field is required"]}
              checks={[values.description.length !== 0]}
              setFormValid={setFormValid}
              required
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
export default SubmenuForm;
