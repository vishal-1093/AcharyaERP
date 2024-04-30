import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import FeetemplateIndex from "../../containers/indeces/feetemplateMaster/FeetemplateIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function FeetemplateMaster() {
  const [tab, setTab] = useState("Feetemplate");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "Feetemplate Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/feetemplate")) setTab("Feetemplate");
    if (pathname.toLowerCase().includes("/route")) setTab("Route");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/FeetemplateMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Feetemplate" label="Feetemplate" />
        <Tab value="Route" label="Route" />
      </Tabs>

      {tab === "Feetemplate" && <FeetemplateIndex />}
    </>
  );
}

export default FeetemplateMaster;
