import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ReportIndex from "../../containers/indeces/reportMaster/ReportIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function ReportMaster() {
  const [tab, setTab] = useState("Report");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Report Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/report")) setTab("Report");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/ReportMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Report" label="Report" />
      </Tabs>
      {tab === "Report" && <ReportIndex />}
    </>
  );
}

export default ReportMaster;
