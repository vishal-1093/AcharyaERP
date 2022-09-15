import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import FormWrapper from "../../components/FormWrapper";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../components/Inputs/CustomSelect";
import axios from "axios";
import ApiUrl from "../../services/Api";

import { useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";

const initialValues = {
  submenuName: "",
  description: "",
  menuId: "",
  status: "",
  submenuUrl: "",
};

function SubmenuCreation() {
  useEffect(() => {
    fetchMenu();
  }, []);

  const [menu, setMenu] = useState([]);
  const [data, setData] = useState(initialValues);
  const [formValid, setFormValid] = useState({
    submenuName: false,
    menuId: false,
    status: false,
    submenuUrl: false,
  });

  const navigate = useNavigate();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      active: true,
    });
  };
  const handleChangeAdvance = (name, newValue) => {
    console.log(newValue);
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  function fetchMenu() {
    axios.get(`${ApiUrl}/Menu`).then(
      (res) => {
        setMenu(
          res.data.data.map((obj) => ({
            value: obj.menu_id,
            label: obj.menu_name,
          }))
        );
      },
      (err) => {
        console.log(err.response.data.message);
      }
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.submenu_name = data.submenuName;
      temp.submenu_desc = data.description;
      temp.menu_id = data.menuId;
      temp.status = data.status;
      temp.submenu_url = data.submenuUrl;
      await axios
        .post(`${ApiUrl}/SubMenu`, temp)
        .then((response) => {
          console.log(response);
          setAlertMessage({
            severity: "success",
            message: response.data.data,
          });
          navigate("/SubmenuIndex", { replace: true });
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
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="submenuName"
                label="Submenu"
                value={data.submenuName}
                handleChange={handleChange}
                fullWidth
                errors={["This field required", "Enter Only Characters"]}
                checks={[
                  data.submenuName !== "",
                  /^[A-Za-z ]+$/.test(data.submenuName),
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="menuId"
                label="Menu"
                value={data.menuId}
                options={menu}
                handleChangeAdvance={handleChangeAdvance}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="submenuUrl"
                label="New Url"
                value={data.submenuUrl}
                handleChange={handleChange}
                errors={["This field required"]}
                checks={[data.submenuUrl !== ""]}
                setFormValid={setFormValid}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomSelect
                label="Status"
                name="status"
                value={data.status}
                handleChange={handleChange}
                fullWidth
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                multiline
                rows={4}
                name="description"
                label="Description"
                value={data.description}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
              >
                <Grid item xs={2}>
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <strong>Submit</strong>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default SubmenuCreation;
