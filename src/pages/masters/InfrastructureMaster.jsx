import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import FacilityIndex from "../../containers/indeces/InfrastructureMaster/FacilityIndex";
import BlockIndex from "../../containers/indeces/InfrastructureMaster/BlockIndex";
import RoomIndex from "../../containers/indeces/InfrastructureMaster/RoomIndex";
import FloorIndex from "../../containers/indeces/InfrastructureMaster/FloorIndex";

function InfrastructureMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "Infrastructure Master" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="Facility" />
        <Tab value={1} label="Block" />
        <Tab value={2} label="Floor" />
        <Tab value={3} label="Rooms" />
      </Tabs>

      {tab === 0 && <FacilityIndex />}
      {tab === 1 && <BlockIndex />}
      {tab === 2 && <FloorIndex />}
      {tab === 3 && <RoomIndex />}
    </>
  );
}

export default InfrastructureMaster;
