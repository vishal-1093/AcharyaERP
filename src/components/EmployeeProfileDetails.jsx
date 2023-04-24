import { useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// function a11yProps(index) {
//   return {
//     id: `vertical-tab-${index}`,
//     "aria-controls": `vertical-tabpanel-${index}`,
//   };
// }

function EmployeeProfileDetails() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        height: 500,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Employee Details" />
        <Tab label="Education Details" />
        <Tab label="Attendance Details" />
        <Tab label="Punching Details" />
        <Tab label="Leave Kitty Details" />
        <Tab label="Salary Details" />
        <Tab label="Increment Details" />
        <Tab label="Personal Attachments" />
        <Tab label="Research Profile" />
        <Tab label="Academic Assessment" />
        <Tab label="HR Attachments" />
        <Tab label="Assessment Review" />
        <Tab label="Profile Addon" />
        <Tab label="Student Feedback" />
      </Tabs>
      <TabPanel value={value} index={0}>
        Employee Details
      </TabPanel>
      <TabPanel value={value} index={1}>
        Education Details
      </TabPanel>
      <TabPanel value={value} index={2}>
        Attendance Details
      </TabPanel>
      <TabPanel value={value} index={3}>
        Punching Details
      </TabPanel>
      <TabPanel value={value} index={4}>
        Leave Kitty Details
      </TabPanel>
      <TabPanel value={value} index={5}>
        Salary Details
      </TabPanel>
      <TabPanel value={value} index={6}>
        Increment Details
      </TabPanel>
      <TabPanel value={value} index={7}>
        Personal Attachments
      </TabPanel>
      <TabPanel value={value} index={8}>
        Research Profile
      </TabPanel>
      <TabPanel value={value} index={9}>
        Academic Assessment
      </TabPanel>
      <TabPanel value={value} index={10}>
        HR Attachments
      </TabPanel>
      <TabPanel value={value} index={11}>
        Assessment Review
      </TabPanel>
      <TabPanel value={value} index={12}>
        Profile Addon
      </TabPanel>
      <TabPanel value={value} index={13}>
        Student Feedback
      </TabPanel>
    </Box>
  );
}

export default EmployeeProfileDetails;
