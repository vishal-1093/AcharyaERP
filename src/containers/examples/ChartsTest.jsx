import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CustomSelect from "../../components/Inputs/CustomSelect";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/styles";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import axios from "../../services/Api";
import { convertToLongDateFormat } from "../../utils/DateTimeUtils";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function ChartsTest() {
  const [selectedGraph, setSelectedGraph] = useState("Department");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [barData, setBarData] = useState([]);

  const keys = useMemo(() => {
    let temp = [];

    barData.forEach((obj) => {
      temp.push(...Object.keys(obj));
    });
    temp = [...new Set(temp)];
    temp.splice(temp.indexOf("school"), 1);
    temp.splice(temp.indexOf("school_name_short"), 1);

    return temp;
  }, [barData]);

  const theme = useTheme();
  const setCrumbs = useBreadcrumbs();

  const graphOptions = [
    { value: "Department", label: "Department" },
    { value: "Designation", label: "Designation" },
    { value: "Gender", label: "Gender" },
    { value: "DateOfBirth", label: "DateOfBirth" },
    { value: "JoiningDate", label: "JoiningDate" },
    { value: "Schools", label: "Schools" },
    { value: "ExperienceInMonth", label: "ExperienceInMonth" },
    { value: "ExperienceInYear", label: "ExperienceInYear" },
    { value: "MaritalStatus", label: "MaritalStatus" },
    { value: "JobType", label: "JobType" },
    { value: "Shift", label: "Shift" },
    { value: "EmployeeType", label: "EmployeeType" },
  ];

  useEffect(() => setCrumbs([]), []);

  useEffect(() => {
    if (selectedGraph === "Department") getDepartmentData();
    else if (selectedGraph === "Designation") getDesignationData();
    else if (selectedGraph === "Gender") getGenderData();
    else if (selectedGraph === "DateOfBirth") getDateOfBirthData();
    else if (selectedGraph === "JoiningDate") getJoiningDateData();
    else if (selectedGraph === "Schools") getSchoolsData();
    else if (selectedGraph === "ExperienceInMonth") getExperienceInMonthData();
    else if (selectedGraph === "ExperienceInYear") getExperienceInYearData();
    else if (selectedGraph === "MaritalStatus") getMaritalStatusData();
    else if (selectedGraph === "JobType") getJobTypeData();
    else if (selectedGraph === "Shift") getShiftData();
    else if (selectedGraph === "EmployeeType") getEmployeeTypeData();
  }, [selectedGraph]);

  const getDepartmentData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnDepartment")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getDesignationData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnDesignation")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getGenderData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnGender")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getDateOfBirthData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnDateOfBirth")
      .then((res) => {
        handleBarData(res.data.data, true);
      })
      .catch((err) => console.error(err));
  };
  const getJoiningDateData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnJoiningDate")
      .then((res) => {
        handleBarData(res.data.data, true);
      })
      .catch((err) => console.error(err));
  };
  const getSchoolsData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnSchools")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getExperienceInMonthData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnExperienceInMonth")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getExperienceInYearData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnExperienceInYear")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getMaritalStatusData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnMaritalStatus")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getJobTypeData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnJobType")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getShiftData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnShift")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getEmployeeTypeData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnEmployeeType")
      .then((res) => {
        handleBarData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleBarData = (apiData, date = false) => {
    if (!date) {
      setBarData(
        apiData.map((obj) => ({
          school: obj.school_name_short,
          ...obj,
        }))
      );
    } else {
      setBarData(
        apiData.map((obj) => {
          let temp = {};
          temp.school = obj.school_name_short;
          let keysArray = Object.keys(obj);
          keysArray.splice(keysArray.indexOf("school_name_short"), 1);

          for (let i = 0; i < keysArray.length; i++) {
            temp = {
              ...temp,
              [convertToLongDateFormat(new Date(keysArray[i]))]:
                obj[keysArray[i]],
            };
          }
          return temp;
        })
      );
    }
  };

  const pieData = [
    {
      id: "haskell",
      label: "haskell",
      value: 461,
      color: "hsl(156, 70%, 50%)",
    },
    {
      id: "sass",
      label: "sass",
      value: 254,
      color: "hsl(320, 70%, 50%)",
    },
    {
      id: "javascript",
      label: "javascript",
      value: 379,
      color: "hsl(185, 70%, 50%)",
    },
    {
      id: "elixir",
      label: "elixir",
      value: 329,
      color: "hsl(348, 70%, 50%)",
    },
    {
      id: "lisp",
      label: "lisp",
      value: 502,
      color: "hsl(57, 70%, 50%)",
    },
  ];

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid item xs={12} sm={6} md={4}>
          <FormControl size="small" fullWidth>
            <InputLabel>Graph</InputLabel>
            <Select
              size="small"
              name="graph"
              value={selectedGraph}
              label="Graph"
              onChange={(e) => setSelectedGraph(e.target.value)}
            >
              {graphOptions.map((obj, index) => (
                <MenuItem key={index} value={obj.value}>
                  {obj.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CustomSelect
            name="selectedSchool"
            label="School"
            value={selectedSchool}
            items={graphOptions}
            handleChange={(e) => setSelectedSchool(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ width: "100%", height: 500 }}>
            {selectedSchool ? (
              <ResponsivePie
                data={pieData}
                // colors={{ datum: "data.color" }}
                colors={{ scheme: "nivo" }}
                margin={{ top: 47, right: 73, left: 73, bottom: 47 }}
                innerRadius={0.5}
                padAngle={1}
                cornerRadius={7}
                activeInnerRadiusOffset={5}
                activeOuterRadiusOffset={11}
                borderWidth={2}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#222"
                arcLinkLabelsThickness={3}
                arcLinkLabelsColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                defs={[]}
              />
            ) : (
              <ResponsiveBar
                data={barData}
                keys={keys}
                // colors={{ datum: "data.color" }}
                colors={{ scheme: "nivo" }}
                indexBy="school"
                margin={{ top: 47, right: 73, left: 73, bottom: 47 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                // colors={{ scheme: "nivo" }}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "School",
                  legendPosition: "middle",
                  legendOffset: 32,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Employees",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                role="application"
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ChartsTest;
