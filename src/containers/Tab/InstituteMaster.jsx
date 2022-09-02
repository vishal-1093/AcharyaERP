import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";

import OrganizationIndex from "../Organization/OrganizationIndex";
import SchoolIndex from "../School/SchoolIndex";
import JobtypeIndex from "../JobType/JobtypeIndex";
import EmptypeIndex from "../EmployeeType/EmptypeIndex";

function InstituteMaster() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Group" />
        <Tab label="School" />
        <Tab label="Job Type" />
        <Tab label="EMP Type " />
      </Tabs>

      {value === 0 ? <OrganizationIndex /> : ""}
      {value === 1 && <SchoolIndex />}
      {value === 2 && <JobtypeIndex />}
      {value === 3 && <EmptypeIndex />}
    </>
  );
}
export default InstituteMaster;
