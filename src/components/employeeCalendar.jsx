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

const empId = sessionStorage.getItem("empId");

const EmployeeCalendar = () => {
  const [Data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  const getData = async () => {
    await axios
      .get(`/api/getAllEmployeesForLeaveApply`)
      .then((res) => {
        const reportRows = res.data.data.filter(
          (obj) =>
            (obj.leave_approver1_emp_id || obj.report_id) === Number(empId)
        );

        setData(reportRows);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (name, newValue) => {
    setSelectedValue(newValue);
  };

  useEffect(() => {
    getData();
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
                  name="EmployeeDetails"
                  label="Employee Details"
                  value={selectedValue}
                  options={Data.map((item) => ({
                    label: item?.employeeDetails?.replace(/,/g, "-"),
                    value: item.emp_id,
                  }))}
                  handleChangeAdvance={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{ marginTop: "24px" }}>
          {selectedValue && <SchedulerMaster selectedEmpId={selectedValue} />}
        </Box>
      </Box>
    </>
  );
};

export default EmployeeCalendar;
