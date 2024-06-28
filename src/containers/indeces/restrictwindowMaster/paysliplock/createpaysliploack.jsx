import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import axios from "../../../../services/Api";
import CheckboxAutocomplete from "../../../../components/Inputs/CheckboxAutocomplete";
import CustomDatePicker from "../../../../components/Inputs/CustomDatePicker";
import { convertUTCtoTimeZone } from "../../../../utils/DateTimeUtils";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import FormWrapper from "../../../../components/FormWrapper";

const PaysliplockCreate = () => {
  const navigate = useNavigate();
  const today = new Date();
  const selectedMonthYear_ = convertUTCtoTimeZone(
    new Date(today.getFullYear(), today.getMonth())
  );
  const setCrumbs = useBreadcrumbs();
  const [employeesList, setEmployeesList] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [displayDate, setDisplayDate] = useState(null);
  const [selectedMonthYear, setSelectedMonthYear] =
    useState(selectedMonthYear_);
  const [startDisplayDate, setstartDisplayDate] = useState(null);

  useEffect(() => {
    setCrumbs([
      {
        name: "Restrict window",
        link: "/restrictwindow/paysliplock",
      },
      { name: "Create Payslip Lock" },
    ]);

    getEmployeeList();
    getSchoolsList();
  }, []);

  useEffect(() => {
    const handleDisplayDate = () => {
      const selectedMonth = new Date(selectedMonthYear).getMonth() + 1;
      let d = new Date();
      d.setDate(1);
      d.setMonth(selectedMonth);
      if (selectedMonth === 12) d.setFullYear(selectedYear + 1);
      else d.setFullYear(selectedYear);
      const nextMonth = new Date(d);
      setstartDisplayDate(nextMonth);
      setDisplayDate(nextMonth);
    }
    
    const selectedMonth = new Date(selectedMonthYear).getMonth() + 1;
    const currentMonth = new Date().getMonth() + 1;
    const selectedYear = new Date(selectedMonthYear).getFullYear();
    const currentYear = new Date().getFullYear();

    if(selectedYear >= currentYear && selectedMonth <= currentMonth){
      handleDisplayDate()
    }else if(selectedYear >= currentYear && selectedMonth >= currentMonth){
      handleDisplayDate()
    }else if (selectedYear <= currentYear && selectedMonth <= currentMonth) {
      setstartDisplayDate(new Date());
    } else {
      setstartDisplayDate(new Date());
    }
  }, [selectedMonthYear]);

  const getEmployeeList = () => {
    axios
      .get("/api/employee/getEmployeeNameConcateWithEmployeeCode")
      .then((response) => {
        const empList = response.data.data.map((obj) => {
          return { value: obj.emp_id, label: obj.EmpolyeeName };
        });

        setEmployeesList(empList);
      });
  };

  const getSchoolsList = () => {
    axios.get("/api/institute/school").then((response) => {
      const schoolList = response.data.data.map((obj) => {
        return { value: obj.school_id, label: obj.display_name };
      });
      setSchoolList(schoolList);
      setSelectedSchool([schoolList[0].value]);
    });
  };

  const handleChangeAdvance = (name, value) => {
    setSelectedEmployees([...value]);
  };

  const handleChangeSchool = (name, value) => {
    setSelectedSchool([...value]);
  };

  const handleSelectAll = (name, options) => {
    setSelectedEmployees(options.map((obj) => obj.value));
  };

  const handleSelectAllSchool = (name, options) => {
    setSelectedSchool(options.map((obj) => obj.value));
  };

  const handleSelectNone = (name) => setSelectedEmployees([]);

  const handleSelectNoneSchool = (name) => setSelectedSchool([]);

  const handleCreate = () => {
    if (displayDate == null) return alert("Please provide display date");

    const payload = selectedSchool.map(schoolId => {
      return {
        school_id: schoolId,
        month: new Date(selectedMonthYear).getMonth() + 1,
        year: new Date(selectedMonthYear).getFullYear(),
        display_date: moment(displayDate).format("DD-MM-YYYY"),
        active: true,
        emp_id:
          selectedEmployees.length > 0 ? selectedEmployees.toString() : null,
      }
    })

    axios
      .post("/api/employee/paySlipLockDate", payload)
      .then((res) => {
        navigate("/restrictwindow/paysliplock");
      })
      .catch((err) => {
        const msg = err
          ? err.response
            ? err.response.data.message
            : "Failed to create data!!!"
          : "Failed to create data!!!";
        alert(msg);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      rowGap={4}
      component="form" overflow="hidden" p={1}
    >
      <FormWrapper>
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item xs={12} md={12} lg={5}>
            <Grid container rowGap={4}>
              <Grid item xs={12}>
                  <CheckboxAutocomplete
                    name="School"
                    label="Schools list"
                    value={selectedSchool}
                    options={schoolList}
                    handleChangeAdvance={handleChangeSchool}
                    handleSelectAll={handleSelectAllSchool}
                    handleSelectNone={handleSelectNoneSchool}
                  />
              </Grid>
              <CustomDatePicker
                name="month"
                label="Pay Month"
                value={selectedMonthYear}
                handleChangeAdvance={(name, newValue) =>
                  setSelectedMonthYear(newValue)
                }
                views={["month", "year"]}
                openTo="month"
                inputFormat="MM/YYYY"
                required
              />
              <Grid item xs={12}>
                <CustomDatePicker
                  name="displayDate"
                  label="Payslip Display Date"
                  value={displayDate}
                  handleChangeAdvance={(name, newValue) =>
                    setDisplayDate(newValue)
                  }
                  minDate={startDisplayDate}
                  required
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={5}>
            <CheckboxAutocomplete
              name="Restrict Employees"
              label="Restrict Employees to view payslip"
              value={selectedEmployees}
              options={employeesList}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item>
            <Button variant="contained" size="medium" onClick={handleCreate}>
              Create
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default PaysliplockCreate;
