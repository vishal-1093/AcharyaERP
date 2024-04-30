import { useState, useEffect } from "react";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmployeeActive from "../../components/EmployeeActive";
import EmployeeInactive from "../../components/EmployeeInactive";

function EmployeeIndex() {
  const [tab, setTab] = useState("Active");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Employee Index" }]);
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

      {tab === "Active" && <EmployeeActive />}
      {tab === "Inactive" && <EmployeeInactive />}
    </Box>
  );
}

export default EmployeeIndex;
