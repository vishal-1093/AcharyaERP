import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import DollartoInr from "../../containers/indeces/bankMaster/DollartoInr";

function FinanceMaster() {
  const [tab, setTab] = useState("Dollar");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Finance Master" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/dollar")) setTab("Dollar");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/FinanceMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Dollar" label="Dollar to Inr" />
      </Tabs>
      {tab === "Dollar" && <DollartoInr />}
    </>
  );
}

export default FinanceMaster;
