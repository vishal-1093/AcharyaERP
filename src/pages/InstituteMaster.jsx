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
        <Tab value={0} label="Organization" />
        <Tab value={1} label="School" />
        <Tab value={2} label="Job Type" />
        <Tab value={3} label="EMP Type " />
      </Tabs>

      {value === 0 && <OrganizationIndex />}
      {value === 1 && <SchoolIndex />}
      {value === 2 && <JobtypeIndex />}
      {value === 3 && <EmptypeIndex />}
    </>
  );
}

export default InstituteMaster;
