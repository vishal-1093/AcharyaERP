import { useState, useEffect, lazy } from "react";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, Tab, Tabs } from "@mui/material";
const EmployeeIndex = lazy(() => import("../indeces/EmployeeIndex"));
const EmployeeInactiveIndex = lazy(() =>
  import("../indeces/EmployeeInactiveIndex")
);

function EmployeeDetailsMaster() {
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

      {tab === "Active" && <EmployeeIndex />}
      {tab === "Inactive" && <EmployeeInactiveIndex />}
    </Box>
  );
}

export default EmployeeDetailsMaster;
