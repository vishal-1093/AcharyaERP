import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import HostelFeeTemplateIndex from "../../containers/indeces/hostelFeeTemplateMaster/HostelFeeTemplateIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function HostelFeeTemplateMaster() {
  const [tab, setTab] = useState("Fee Template");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Hostel Fee Template" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/feetemplate"))
      setTab("Fee Template");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/HostelFeeTemplateMaster" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Fee Template" label="Fee Template" />
      </Tabs>
      {tab === "Fee Template" && <HostelFeeTemplateIndex />}
    </>
  );
}

export default HostelFeeTemplateMaster;
