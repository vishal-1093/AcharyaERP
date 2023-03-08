import { useState, useEffect } from "react";
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

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function ChartsTest() {
  const [selectedGraph, setSelectedGraph] = useState("Gender");
  const [selectedSchool, setSelectedSchool] = useState("");

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
    { value: "JobType", label: "JobType" },
    { value: "EmployeeType", label: "EmployeeType" },
  ];

  useEffect(() => setCrumbs([]), []);

  useEffect(() => {
    getDepartmentData();
  }, []);

  const getDepartmentData = async () => {
    await axios
      .get("/api/employee/getEmployeeDetailsForReportOnDepartment")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  };

  // console.log(theme);

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

  const barData = [
    {
      country: "AD",
      "hot dog": 82,
      "hot dogColor": "hsl(155, 70%, 50%)",
      burger: 112,
      burgerColor: "hsl(28, 70%, 50%)",
      sandwich: 8,
      sandwichColor: "hsl(221, 70%, 50%)",
      kebab: 34,
      kebabColor: "hsl(235, 70%, 50%)",
      fries: 127,
      friesColor: "hsl(272, 70%, 50%)",
      donut: 64,
      donutColor: "hsl(85, 70%, 50%)",
    },
    {
      country: "AE",
      "hot dog": 21,
      "hot dogColor": "hsl(112, 70%, 50%)",
      burger: 59,
      burgerColor: "hsl(14, 70%, 50%)",
      sandwich: 23,
      sandwichColor: "hsl(95, 70%, 50%)",
      kebab: 38,
      kebabColor: "hsl(310, 70%, 50%)",
      fries: 149,
      friesColor: "hsl(16, 70%, 50%)",
      donut: 170,
      donutColor: "hsl(38, 70%, 50%)",
    },
    {
      country: "AF",
      "hot dog": 69,
      "hot dogColor": "hsl(37, 70%, 50%)",
      burger: 142,
      burgerColor: "hsl(291, 70%, 50%)",
      sandwich: 68,
      sandwichColor: "hsl(16, 70%, 50%)",
      kebab: 106,
      kebabColor: "hsl(36, 70%, 50%)",
      fries: 124,
      friesColor: "hsl(176, 70%, 50%)",
      donut: 56,
      donutColor: "hsl(74, 70%, 50%)",
    },
    {
      country: "AG",
      "hot dog": 61,
      "hot dogColor": "hsl(104, 70%, 50%)",
      burger: 143,
      burgerColor: "hsl(133, 70%, 50%)",
      sandwich: 151,
      sandwichColor: "hsl(245, 70%, 50%)",
      kebab: 48,
      kebabColor: "hsl(278, 70%, 50%)",
      fries: 87,
      friesColor: "hsl(129, 70%, 50%)",
      donut: 106,
      donutColor: "hsl(125, 70%, 50%)",
    },
    {
      country: "AI",
      "hot dog": 134,
      "hot dogColor": "hsl(282, 70%, 50%)",
      burger: 53,
      burgerColor: "hsl(128, 70%, 50%)",
      sandwich: 164,
      sandwichColor: "hsl(208, 70%, 50%)",
      kebab: 126,
      kebabColor: "hsl(69, 70%, 50%)",
      fries: 133,
      friesColor: "hsl(317, 70%, 50%)",
      donut: 154,
      donutColor: "hsl(310, 70%, 50%)",
    },
    {
      country: "AL",
      "hot dog": 67,
      "hot dogColor": "hsl(45, 70%, 50%)",
      burger: 145,
      burgerColor: "hsl(22, 70%, 50%)",
      sandwich: 173,
      sandwichColor: "hsl(212, 70%, 50%)",
      kebab: 167,
      kebabColor: "hsl(3, 70%, 50%)",
      fries: 146,
      friesColor: "hsl(131, 70%, 50%)",
      donut: 47,
      donutColor: "hsl(124, 70%, 50%)",
    },
    {
      country: "AM",
      "hot dog": 52,
      "hot dogColor": "hsl(318, 70%, 50%)",
      burger: 167,
      burgerColor: "hsl(89, 70%, 50%)",
      sandwich: 77,
      sandwichColor: "hsl(310, 70%, 50%)",
      kebab: 27,
      kebabColor: "hsl(225, 70%, 50%)",
      fries: 149,
      friesColor: "hsl(308, 70%, 50%)",
      donut: 190,
      donutColor: "hsl(172, 70%, 50%)",
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
                keys={[
                  "hot dog",
                  "burger",
                  "sandwich",
                  "kebab",
                  "fries",
                  "donut",
                ]}
                // colors={{ datum: "data.color" }}
                colors={{ scheme: "nivo" }}
                indexBy="country"
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
                  legend: "country",
                  legendPosition: "middle",
                  legendOffset: 32,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "food",
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
