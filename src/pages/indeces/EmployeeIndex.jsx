import { useState, useEffect } from "react";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmployeeActive from "../../components/EmployeeActive";
import EmployeeInactive from "../../components/EmployeeInactive";

function EmployeeIndex() {
  const [tab, setTab] = useState("Staff");

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
        <Tab value="Staff" label="Staff" />
        <Tab value="Consultant" label="Consultant" />
        <Tab value="Relieved Staff" label="Relieved Staff" />
        
      </Tabs>

      {tab === "Staff" && <EmployeeActive tab ={tab} />}
      {tab === "Consultant" && <EmployeeActive tab ={tab}/>}
      {tab === "Relieved Staff" && <EmployeeInactive />}
    </Box>
  );
}

export default EmployeeIndex;
