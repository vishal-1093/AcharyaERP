import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/Inputs/CustomTextField";
import FormWrapper from "../../components/FormWrapper";
import axios from "axios";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import ApiUrl from "../../services/Api";
import useAlert from "../../hooks/useAlert";

function MenuUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    menuName: "",
    menuShortName: "",
    moduleId: [],
    description: "",
  });
  const [formValid, setFormValid] = useState({
    menuName: true,
    menuShortName: true,
    moduleId: true,
  });

  const navigate = useNavigate();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState([]);

  useEffect(() => {
    getData();
    getMenuDetails();
  }, []);

  const getMenuDetails = () => {
    axios.get(`${ApiUrl}/Menu/${id}`).then((res) => {
      setData(res.data.data);
      setData({
        menuName: res.data.data.menu_name,
        menuShortName: res.data.data.menu_short_name,
        moduleId: res.data.data.module_id,
        description: res.data.data.menu_desc,
      });
      setMenuId(res.data.data.menu_id);
    });
  };

  function getData() {
    axios.get(`${ApiUrl}/Module`).then(
      (res) => {
        setModule(
          res.data.data.map((obj) => ({
            value: obj.module_id,
            label: obj.module_name,
          }))
        );
      },
      (err) => {
        console.log(err.response.data.message);
      }
    );
  }

  const handleChange = (e) => {
    if (e.target.name === "menuShortName") {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };
  const handleChangeAdvance = (name, newValue) => {
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      console.log("failed");
    } else {
      setLoading(true);
      console.log(data);
      const temp = {};
      temp.active = true;
      temp.menu_id = menuId;
      temp.menu_name = data.menuName;
      temp.menu_short_name = data.menuShortName;
      temp.module_id = data.moduleId;
      temp.menu_desc = data.description;
      await axios.put(`${ApiUrl}/Menu/${id}`, temp).then(
        (response) => {
          setAlertMessage({
            severity: "success",
            message: response.data.data,
          });
          navigate("/MenuIndex", { replace: true });
        },
        (error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        }
      );
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
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="menuName"
                label="Menu"
                value={data.menuName ?? ""}
                handleChange={handleChange}
                fullWidth
                errors={["This field required", "Enter Only Characters"]}
                checks={[
                  data.menuName !== "",
                  /^[A-Za-z ]+$/.test(data.menuName),
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="menuShortName"
                label="Short Name"
                value={data.menuShortName ?? ""}
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
                  data.menuShortName !== "",
                  /^[A-Za-z ]{3,3}$/.test(data.menuShortName),
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="moduleId"
                label="Module"
                value={data.moduleId}
                options={module}
                handleChangeAdvance={handleChangeAdvance}
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
                fullWidth
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
                      <strong>Update</strong>
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
export default MenuUpdate;
