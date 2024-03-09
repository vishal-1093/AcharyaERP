import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";


import { useLocation, useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import AttendServiceRendorIndex from "./AttendServiceRequestRendorIndex";
import AttendServiceHistory from "./AttendServiceHistory";

function AttendServiceMaster() {
  const [tab, setTab] = useState("ServiceTypes");
  const setCrumbs = useBreadcrumbs();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(
    () => setCrumbs([{ name: "Service Render" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/attendrequest")) setTab("AttendRequest");
    else if (pathname.toLowerCase().includes("/attendhistory"))
      setTab("AttendHistory");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/ServiceRender/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="AttendRequest" label="Render" />
        <Tab value="AttendHistory" label="History" />
    
      </Tabs>
      {tab === "AttendRequest" && <AttendServiceRendorIndex />}
      {tab === "AttendHistory" && <AttendServiceHistory />}
    </>
  );
}

export default AttendServiceMaster;
