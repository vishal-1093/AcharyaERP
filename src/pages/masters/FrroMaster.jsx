import { useState, lazy, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
const FrroBonafied = lazy(() =>
  import("../../pages/forms/studentBonafide/FRROBonafied")
);
const AcerpBonafideIndex = lazy(() =>
  import("../../containers/indeces/studentBonafide/studentBonafideIndex")
);

function FrroMaster() {
  const [tab, setTab] = useState("Frro");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Frro Master" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/frro")) setTab("Frro");
    if (pathname.toLowerCase().includes("/bonafide")) setTab("Bonafide");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/FrroMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Frro" label="FRRO" />
        <Tab value="Bonafide" label="Bonafide" />
      </Tabs>
      {tab === "Frro" && <AcerpBonafideIndex />}
      {tab === "Bonafide" && <FrroBonafied />}
    </>
  );
}

export default FrroMaster;
