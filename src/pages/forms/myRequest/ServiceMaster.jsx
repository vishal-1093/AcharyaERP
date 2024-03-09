import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import ServiceTypeIndex from "./ServiceTypesIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function ServiceMaster() {
  const [tab, setTab] = useState("ServiceTypes");
  const setCrumbs = useBreadcrumbs();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(
    () => setCrumbs([{ name: "ServiceMaster" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/servicetypes")) setTab("ServiceTypes");
    else if (pathname.toLowerCase().includes("/serviceassignment"))
      setTab("ServiceAssignment");

  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/ServiceMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="ServiceTypes" label="Service Types" />
      
      </Tabs>
    
    </>
  );
}

export default ServiceMaster;
