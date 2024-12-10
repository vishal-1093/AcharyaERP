import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import axios from "../../../services/Api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import iconsList from "../../../utils/MenuIcons";

const getIcon = (iName) => {
  const object = iconsList.filter((obj) => obj.name === iName)[0];
  return object
    ? object.icon
    : iconsList.filter((obj) => obj.name === "Default")[0].icon;
};

const StockRegister = () => {
  const [deptOptions, setDeptOptions] = useState([]);
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    localStorage.setItem("ticketDeptId", null);
    setCrumbs([]);
    getDepartment();
  }, []);

  const getDepartment = async () => {
    await axios
      .get(`/api/getActiveDepartmentAssignmentBasedOnTag`)
      .then((res) => {
        const departMents = res.data.data.filter(
          (obj) => obj.dept_name !== "Transport"
        );
        setDeptOptions(departMents);
      })
      .catch((err) => console.error(err));
  };

  const goToServiceRequestDeptWise = (deptName,deptId ) => {
    localStorage.setItem("ticketDeptId", JSON.stringify({key:deptId}));
    navigate('/ServiceRequestDeptWise',{state:{deptName,deptId }})
  };

  return (
    <Grid container alignItems="flex-start" spacing={3} mt={1}>
      {deptOptions?.map((obj, i) => {
        return (
          <Grid item sm={12} md={4} key={i}>
            <Card sx={{ backgroundColor: "#F0F0F0" }}>
              <CardContent>
                <Grid container justifyContent="flex-start" rowSpacing={2}>
                  <Grid item xs={12} align="center">
                    <IconButton
                      color="primary"
                      onClick={() => goToServiceRequestDeptWise(obj?.dept_name,obj?.id)}
                    >
                      {getIcon(obj.dept_icon)}
                    </IconButton>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "auzColor.main",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                      gutterBottom
                      variant="subtitle2"
                        onClick={() => goToServiceRequestDeptWise(obj?.dept_name,obj?.id)}
                    >
                      {obj.dept_name.toUpperCase()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StockRegister;