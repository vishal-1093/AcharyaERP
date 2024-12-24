import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import NotificationIndex from "../../containers/indeces/notificationMaster/NotificationIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function NotificationMaster() {
  const [tab, setTab] = useState("Notifications");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Notification Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/nofifications"))
      setTab("Notifications");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/NotificationMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Notifications" label="Notifications" />
      </Tabs>
      {tab === "Notifications" && <NotificationIndex />}
    </>
  );
}

export default NotificationMaster;
