import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Stack } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

function DeptHodForm({
  setHodModalOpen,
  deptId,
  setAlertMessage,
  setAlertOpen,
  getData,
  rowData,
}) {
  const [userOptions, setUserOptions] = useState([]);
  const [values, setValues] = useState({
    userId: null,
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUsers();
    if (rowData.hod_id) {
      setValues((prev) => ({
        ...prev,
        userId: rowData.hod_id,
      }));
    }
  }, []);

  const getUsers = async () => {
    await axios
      .get(`/api/staffUserDetails`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.id,
            label: obj.username,
          });
        });
        setUserOptions(optionData);
        setHodModalOpen(true);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreateHod = async (value) => {
    if (value === "deassign") {
      setIsLoading(true);
    } else {
      setLoading(true);
    }

    const departmentData = await axios
      .get(`/api/dept/${deptId}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    if (departmentData.dept_id) {
      departmentData.hod_id = value === "deassign" ? null : values.userId;

      await axios
        .put(`/api/dept/${deptId}`, departmentData)
        .then((res) => {
          if (value === "deassign") {
            setIsLoading(false);
          } else {
            setLoading(false);
          }
          if (res.data.success === true) {
            setAlertMessage({
              severity: value === "deassign" ? "error" : "success",
              message:
                value === "deassign"
                  ? "HOD Deassigned succesfully !!"
                  : "HOD assigned successfully !!",
            });
            setAlertOpen(true);
            setHodModalOpen(false);
            getData();
          }
        })
        .catch((err) => {
          if (value === "deassign") {
            setIsLoading(false);
          } else {
            setLoading(false);
          }
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box mt={2} p={2}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <CustomAutocomplete
            name="userId"
            label="User"
            value={values.userId}
            options={userOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Stack justifyContent="right" direction="row" spacing={2}>
            {rowData.hod_id !== null ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleCreateHod("deassign")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Deassign"
                )}
              </Button>
            ) : (
              <></>
            )}

            <Button
              variant="contained"
              onClick={handleCreateHod}
              disabled={loading || values.userId === null}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Assign"
              )}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DeptHodForm;
