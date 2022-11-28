import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import FormWrapper from "../../../components/FormWrapper";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import IconSelector from "../../../components/Inputs/IconSelector";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";

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
  const [moduleOptions, setModuleOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    menuName: [values.menuName !== "", /^[A-Za-z ]+$/.test(values.menuName)],
    menuShortName: [
      values.menuShortName !== "",
      /^[A-Za-z ]{4}$/.test(values.menuShortName),
    ],
    moduleIds: [values.moduleIds.length > 0, values.moduleIds.length < 2],
    description: [values.description],
  };

  const errorMessages = {
    menuName: ["This field required", "Enter Only Characters"],
    menuShortName: [
      "This field required",
      "Enter characters and its length should be four",
    ],
    moduleIds: [
      "This field is required",
      "Module should not be greater than 1",
    ],
    description: ["This field is required"],
  };

  useEffect(() => {
    getModuleOptions();

    if (pathname.toLowerCase() === "/navigationmaster/menu/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Navigation Master", link: "/NavigationMaster/Menu" },
        { name: "Menu" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getMenuData();
    }
  }, [pathname]);

  const getModuleOptions = () => {
    axios
      .get(`/api/Module`)
      .then((res) => {
        setModuleOptions(
          res.data.data.map((obj) => ({
            value: obj.module_id,
            label: obj.module_name,
          }))
        );
      })
      .catch((err) => {
        console.error(err.response.data.message);
      });
  };

  const getMenuData = () => {
    axios
      .get(`/api/Menu/${id}`)
      .then((res) => {
        setValues({
          menuName: res.data.data.menu_name,
          menuShortName: res.data.data.menu_short_name,
          moduleIds: [res.data.data.module_id],
          description: res.data.data.menu_desc,
          iconName: res.data.data.menu_icon_name,
        });
        setMenuId(res.data.data.menu_id);
        setCrumbs([
          { name: "Navigation Master", link: "/NavigationMaster/Menu" },
          { name: "Menu" },
          { name: "Update" },
          { name: res.data.data.menu_name },
        ]);
      })
      .catch((err) => console.error(err));
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      await axios(
        `/api/checkMenuNameAndShortName?menu_name=${values.menuName}&menu_short_name=${values.menuShortName}`
      )
        .then((res) => {
          if (res.data.success) {
            const temp = {};
            temp.active = true;
            temp.menu_name = values.menuName;
            temp.menu_short_name = values.menuShortName;
            temp.module_id = values.moduleIds;
            temp.menu_desc = values.description;
            temp.menu_icon_name = values.iconName;
            axios
              .post(`/api/Menu`, temp)
              .then((res) => {
                setLoading(false);
                if (res.status === 200 || res.status === 201) {
                  navigate("/NavigationMaster/Menu", { replace: true });
                  setAlertMessage({
                    severity: "success",
                    message: "Menu created",
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
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: "A menu with this name or short name already exists",
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
    if (!requiredFieldsValid()) {
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
      temp.module_id = values.moduleIds[0];
      temp.menu_desc = values.description;
      temp.menu_icon_name = values.iconName;
      axios
        .put(`/api/Menu/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/NavigationMaster/Menu", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Menu updated",
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
      // await axios(
      //   `/api/checkMenuNameAndShortName?menu_name=${values.menuName}&menu_short_name=${values.menuShortName}`
      // )
      //   .then((res) => {
      //     if (res.data.success) {
      //       const temp = {};
      //       temp.active = true;
      //       temp.menu_id = menuId;
      //       temp.menu_name = values.menuName;
      //       temp.menu_short_name = values.menuShortName;
      //       temp.module_id = values.moduleIds[0];
      //       temp.menu_desc = values.description;
      //       temp.menu_icon_name = values.iconName;
      //       axios
      //         .put(`/api/Menu/${id}`, temp)
      //         .then((res) => {
      //           setLoading(false);
      //           if (res.status === 200 || res.status === 201) {
      //             navigate("/NavigationMaster/Menu", { replace: true });
      //             setAlertMessage({
      //               severity: "success",
      //               message: "Menu updated",
      //             });
      //           } else {
      //             setAlertMessage({
      //               severity: "error",
      //               message: res.data ? res.data.message : "An error occured",
      //             });
      //           }
      //           setAlertOpen(true);
      //         })
      //         .catch((err) => {
      //           setLoading(false);
      //           setAlertMessage({
      //             severity: "error",
      //             message: err.response
      //               ? err.response.data.message
      //               : "An error occured",
      //           });
      //           setAlertOpen(true);
      //         });
      //     }
      //   })
      //   .catch((err) => {
      //     setLoading(false);
      //     setAlertMessage({
      //       severity: "error",
      //       message: "A menu with this name or short name already exists",
      //     });
      //     setAlertOpen(true);
      //   });
    }
  };

  return (
    <Box component="form" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="menuName"
              label="Menu"
              value={values.menuName}
              handleChange={handleChange}
              checks={checks.menuName}
              errors={errorMessages.menuName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="menuShortName"
              label="Short Name"
              value={values.menuShortName}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              checks={checks.menuShortName}
              errors={errorMessages.menuShortName}
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
              // disabled={!isNew}
              checks={checks.moduleIds}
              errors={errorMessages.moduleIds}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={2}
              name="description"
              label="Description"
              value={values.description}
              handleChange={handleChange}
              checks={checks.description}
              errors={errorMessages.description}
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
