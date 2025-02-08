import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
} from "@mui/material";
import axios from "../services/Api";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";
import SchedulerMaster from "./SchedulerMaster";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

const empId = sessionStorage.getItem("empId");

const EmployeeCalenderAdmin = () => {
  const [Data, setData] = useState([]);
  const [values, setValues] = useState({ employeeId: null });

  const setCrumbs = useBreadcrumbs();

  const getData = async () => {
    await axios
      .get(`/api/getAllEmployeesForLeaveApply`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((item) => {
          data.push({
            label: item?.employeeDetails?.replace(/,/g, "-"),
            value: item.emp_id,
          });
        });

        setData(data);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    getData();
    setCrumbs([]);
  }, []);

  return (
    <>
      <Box m={{ md: 3 }}>
        <Card elevation={3}>
          <CardHeader
            avatar={<IconButton></IconButton>}
            title="Employee Details"
            titleTypographyProps={{ variant: "subtitle2", fontSize: 14 }}
            sx={{
              backgroundColor: "primary.main",
              color: "headerWhite.main",
              padding: 1,
            }}
          />
          <CardContent>
            <Grid
              container
              columnSpacing={{ md: 4, xs: 3 }}
              rowSpacing={{ md: 4, xs: 3 }}
            >
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="employeeId"
                  label="Employee Details"
                  value={values.employeeId}
                  options={Data}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{ marginTop: "24px" }}>
          {values.employeeId && (
            <SchedulerMaster selectedEmpId={values.employeeId} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default EmployeeCalenderAdmin;
