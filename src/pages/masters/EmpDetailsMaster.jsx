import { useState, useEffect, lazy } from "react";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, Tab, Tabs } from "@mui/material";
const EmpIndex = lazy(() => import("../indeces/EmpIndex"));
const EmpInactiveIndex = lazy(() => import("../indeces/EmployeeInactiveIndex"));

function EmpDetailsMaster() {
  const [tab, setTab] = useState("Active");

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([{ name: "Employee Details" }]);
  }, []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Active" label="Active" />
        <Tab value="Inactive" label="Inactive" />
      </Tabs>

      {tab === "Active" && <EmpIndex />}
      {tab === "Inactive" && <EmpInactiveIndex />}
    </Box>
  );
}

export default EmpDetailsMaster;
