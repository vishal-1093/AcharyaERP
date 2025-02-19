import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import EventCreationIndex from "../../containers/indeces/eventMaster/EventCreationIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function EventMaster() {
  const [tab, setTab] = useState("Events");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Event Master" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/events")) setTab("Events");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/EventMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Events" label="Event" />
        <Tab value="Room" label="Amenities" />
      </Tabs>
      {tab === "Events" && <EventCreationIndex />}
      {tab === "Room" && <EventCreationIndex />}
    </>
  );
}

export default EventMaster;
