import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
// import EventCreationIndex from "../../containers/indeces/eventMaster/EventCreationIndex";
import EventUser from "../../pages/indeces/EventUserMaster"
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function EventUserMaster() {
  const [tab, setTab] = useState("Events");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Event Master" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/events")) setTab("Events/User");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/EventUserMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Events/User" label="Event" />
        <Tab value="Room/User" label="Room" />
      </Tabs>
      {tab === "Events/User" && <EventUser />}
      {tab === "Room/User" && <EventUser />}
    </>
  );
}

export default EventUserMaster;
