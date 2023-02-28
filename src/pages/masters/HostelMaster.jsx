import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import DoctorWardenIndex from "../../containers/indeces/hostelMaster/DoctorWardenIndex";
import HostelBlockIndex from "../../containers/indeces/hostelMaster/HostelBlockIndex";
import HostelFloorIndex from "../../containers/indeces/hostelMaster/HostelFloorIndex";
import RoomTypeIndex from "../../containers/indeces/hostelMaster/RoomTypeIndex";
import HostelRoomIndex from "../../containers/indeces/hostelMaster/HostelRoomIndex";
import StandardAccessoriesIndex from "../../containers/indeces/hostelMaster/StandardAccessoriesIndex";
import HostelGridIndex from "../../containers/indeces/hostelMaster/HostelGridIndex";
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
    else if (pathname.toLowerCase().includes("/standardaccessories"))
      setTab("StandardAccessories");
    else if (pathname.toLowerCase().includes("/gridview")) setTab("GridView");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/HostelMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Blocks" label="Block" />
        <Tab value="Floors" label="Floor" />
        <Tab value="Wardens" label="Warden" />
        <Tab value="StandardAccessories" label="Accessories" />
        <Tab value="HostelRooms" label="Hostel Rooms" />
        <Tab value="RoomTypes" label="Room Type" />
        <Tab value="GridView" label="Grid View" />
      </Tabs>
      {tab === "Blocks" && <HostelBlockIndex />}
      {tab === "Floors" && <HostelFloorIndex />}
      {tab === "Wardens" && <DoctorWardenIndex />}
      {tab === "StandardAccessories" && <StandardAccessoriesIndex />}
      {tab === "HostelRooms" && <HostelRoomIndex />}
      {tab === "RoomTypes" && <RoomTypeIndex />}
      {tab === "GridView" && <HostelGridIndex />}
    </>
  );
}

export default HostelMaster;
