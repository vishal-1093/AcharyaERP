import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import HostelDueIndex from "../../containers/indeces/hostelDueIndex/HostelDueIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function HostelDueMaster() {
  const [tab, setTab] = useState("Hostel Due");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setCrumbs([{ name: "Hostel Due Master", link: "/HostelDueMaster/HostelDue" }, { name: tab }]);
  }, [tab]);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Hostel Due" label="Hostel Due" />
      </Tabs>
      {tab === "Hostel Due" && <HostelDueIndex tab={tab} />}
    </>
  );
}

export default HostelDueMaster;
