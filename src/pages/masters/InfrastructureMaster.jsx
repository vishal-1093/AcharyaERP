import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import FacilityIndex from "../../containers/indeces/infrastructureMaster/FacilityIndex";
import BlockIndex from "../../containers/indeces/infrastructureMaster/BlockIndex";
import RoomIndex from "../../containers/indeces/infrastructureMaster/RoomIndex";
import FloorIndex from "../../containers/indeces/infrastructureMaster/FloorIndex";

function InfrastructureMaster() {
  const [tab, setTab] = useState("Facility");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Infrastructure Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/facility")) setTab("Facility");
    else if (pathname.toLowerCase().includes("/block")) setTab("Block");
    else if (pathname.toLowerCase().includes("/floor")) setTab("Floor");
    else if (pathname.toLowerCase().includes("/rooms")) setTab("Rooms");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/InfrastructureMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Facility" label="Facility" />
        <Tab value="Block" label="Block" />
        <Tab value="Floor" label="Floor" />
        <Tab value="Rooms" label="Rooms" />
      </Tabs>
      {tab === "Facility" && <FacilityIndex />}
      {tab === "Block" && <BlockIndex />}
      {tab === "Floor" && <FloorIndex />}
      {tab === "Rooms" && <RoomIndex />}
    </>
  );
}

export default InfrastructureMaster;
