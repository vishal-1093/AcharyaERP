import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import SalaryStructureIndex from "../../containers/indeces/salaryMaster/SalaryStructureIndex";
import SalaryStructureHeadIndex from "../../containers/indeces/salaryMaster/SalaryStructureHeadIndex";
import SlabStructureIndex from "../../containers/indeces/salaryMaster/SlabStructureIndex";
import SalaryStructureAssignment from "../forms/salaryMaster/SalaryStructureAssignment";
import SlabDefinationForm from "../forms/salaryMaster/SlabDefinationForm";

import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function SalaryMaster() {
  const [value, setValue] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "SalaryMaster" }]), []);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Salary Structure" />
        <Tab label="Salary Head" />
        <Tab label="Assignment" />
        <Tab label="Slab Defination" />
        <Tab label="Slab Structure" />
      </Tabs>

      {value === 0 && <SalaryStructureIndex />}
      {value === 1 && <SalaryStructureHeadIndex />}
      {value === 2 && <SalaryStructureAssignment />}
      {value === 3 && <SlabDefinationForm />}
      {value === 4 && <SlabStructureIndex />}
    </>
  );
}

export default SalaryMaster;
