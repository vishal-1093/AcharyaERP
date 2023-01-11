import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import DoctorWardenIndex from "../../containers/indeces/Hostel Master/DoctorWardenIndex";
import HostelBlockIndex from "../../containers/indeces/Hostel Master/HostelBlockIndex";
import HostelFloorIndex from "../../containers/indeces/Hostel Master/HostelFloorIndex";
import RoomTypeIndex from "../../containers/indeces/Hostel Master/RoomTypeIndex";
import HostelRoomIndex from "../../containers/indeces/Hostel Master/HostelRoomIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function HostelMaster() {
  const [tab, setTab] = useState("Blocks");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Hostel Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/blocks")) setTab("Blocks");
    else if (pathname.toLowerCase().includes("/floors")) setTab("Floors");
    else if (pathname.toLowerCase().includes("/wardens")) setTab("Wardens");
    else if (pathname.toLowerCase().includes("/roomtypes")) setTab("RoomTypes");
    else if (pathname.toLowerCase().includes("/hostelrooms"))
      setTab("HostelRooms");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/HostelMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Blocks" label="Blocks" />
        <Tab value="Floors" label="Floors" />
        <Tab value="Wardens" label="Wardens" />
        <Tab value="RoomTypes" label="Room Types" />
        <Tab value="HostelRooms" label="Hostel Rooms" />
      </Tabs>
      {tab === "Blocks" && <HostelBlockIndex />}
      {tab === "Floors" && <HostelFloorIndex />}
      {tab === "Wardens" && <DoctorWardenIndex />}
      {tab === "RoomTypes" && <RoomTypeIndex />}
      {tab === "HostelRooms" && <HostelRoomIndex />}
    </>
  );
}

export default HostelMaster;
