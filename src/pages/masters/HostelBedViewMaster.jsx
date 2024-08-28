import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import HostelBedViewIndex from "../../containers/indeces/hostelBedViewIndex/HostelBedViewIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function HostelBedViewMaster() {
  const [tab, setTab] = useState("Active Bed");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      pathname.toLowerCase() === "/allhostelbedviewmaster/allhostelbedview"
    ) {
      setCrumbs([{ name: "All Hostel Bed View" }, { name: tab }]);
    } else {
      setCrumbs([{ name: "Hostel Bed View" }, { name: tab }]);
    }
  }, [tab]);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Active Bed" label="Active Bed" />
        <Tab value="InActive Bed" label="InActive Bed" />
      </Tabs>
      {tab === "Active Bed" && <HostelBedViewIndex tab={tab} />}
      {tab === "InActive Bed" && <HostelBedViewIndex tab={tab} />}
    </>
  );
}

export default HostelBedViewMaster;
