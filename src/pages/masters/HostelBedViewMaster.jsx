import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import HostelBedViewIndex from "../../containers/indeces/hostelBedViewIndex/HostelBedViewIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function HostelBedViewMaster() {
  const [tab, setTab] = useState("Bed View");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Hostel Bed View" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/hostelbedview"))
      setTab("Bed View");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/HostelBedViewMaster" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Bed View" label="Bed View" />
      </Tabs>
      {tab === "Bed View" && <HostelBedViewIndex />}
    </>
  );
}

export default HostelBedViewMaster;
