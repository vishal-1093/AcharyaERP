import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import FeeTemplateIndex from "../../containers/indeces/hostelFeeMaster/FeeTemplateIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function HostelFeeMaster() {
  const [tab, setTab] = useState("HostelFees");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "HostelFee Master" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/hostelfees")) setTab("HostelFees");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/HostelFeeMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="HostelFees" label="Hostel Fee " />
      </Tabs>
      {tab === "HostelFees" && <FeeTemplateIndex />}
    </>
  );
}

export default HostelFeeMaster;
