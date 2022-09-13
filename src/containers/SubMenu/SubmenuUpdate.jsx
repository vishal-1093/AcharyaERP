import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import ApiUrl from "../../services/Api";
import axios from "axios";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../components/Inputs/CustomSelect";
import useAlert from "../../hooks/useAlert";
function SubmenuUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    submenuName: "",
    description: "",
    menuId: "",
    status: "",
    submenuUrl: "",
  });
  const [formValid, setFormValid] = useState({
    submenuName: true,
    menuId: true,
    status: true,
    submenuUrl: true,
  });
  const [menu, setMenu] = useState([]);
  const [submenuId, setSubmenuId] = useState(null);
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const [loading, setLoading] = useState(false);
  const getData = async () => {
    axios.get(`${ApiUrl}/SubMenu/${id}`).then((res) => {
      console.log(res);
      setData(res.data.data);
      setData({
        submenuName: res.data.data.submenu_name,
        description: res.data.data.submenu_desc,
        menuId: res.data.data.menuId,
        status: res.data.data.status,
        submenuUrl: res.data.data.submenu_url,
      });
      setSubmenuId(res.data.data.submenu_id);
    });
  };

  const getMenu = () => {
    axios.get(`${ApiUrl}/Menu`).then((res) => {
      setMenu(
        res.data.data.map((obj) => ({
          value: obj.menu_id,
          label: obj.menu_short_name,
        }))
      );
    });
  };

  useEffect(() => {
    getData();
    getMenu();
  }, []);

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
      const temp = {};
      temp.active = true;
      temp.submenu_id = submenuId;
      temp.submenu_name = data.submenuName;
      temp.submenu_desc = data.description;
      temp.menu_id = data.menuId;
      temp.status = data.status;
      temp.submenu_url = data.submenuUrl;
      await axios.put(`${ApiUrl}/SubMenu/${id}`, temp).then((response) => {
        navigate("/SubmenuIndex", { replace: true });
        if (response.status == 208) {
          setAlertMessage({
            severity: "error",
            message: response.data.message,
          });
          setAlertOpen(true);
        }
      });
    }
  };
  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
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
              </Grid>{" "}
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
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default SubmenuUpdate;
