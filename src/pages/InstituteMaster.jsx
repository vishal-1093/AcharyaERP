import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import OrganizationIndex from "../containers/Organization/OrganizationIndex";
import SchoolIndex from "../containers/School/SchoolIndex";
import JobtypeIndex from "../containers/JobType/JobtypeIndex";
import EmptypeIndex from "../containers/EmployeeType/EmptypeIndex";

function InstituteMaster() {
  const [value, setValue] = useState(0);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Organization" />
        <Tab label="School" />
        <Tab label="Job Type" />
        <Tab label="EMP Type " />
      </Tabs>

      {value === 0 && <OrganizationIndex />}
      {value === 1 && <SchoolIndex />}
      {value === 2 && <JobtypeIndex />}
      {value === 3 && <EmptypeIndex />}
    </>
  );
}

export default InstituteMaster;
