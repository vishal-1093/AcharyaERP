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
import axios from "../../../services/Api";
import LeaveApplyForm from "./LeaveApplyForm";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const InitialLeave = () => {
  const [Data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const getData = async () => {
    await axios
      .get(`/api/getAllEmployeesForLeaveApply`)
      .then((res) => {
        setData(res.data.data);
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
            title="Leave"
            titleTypographyProps={{ variant: "subtitle2", fontSize: 14 }}
            sx={{
              backgroundColor: "auzColor.main",
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
                  label="EmployeeDetails"
                  value={selectedValue}
                  options={Data.map((item) => ({
                    label: item.employeeDetails.replace(/,/g, "-"),
                    value: item.emp_id,
                  }))}
                  handleChangeAdvance={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      {selectedValue && (
        <LeaveApplyForm showTable={false} empId={selectedValue} />
      )}
    </>
  );
};

export default InitialLeave;
