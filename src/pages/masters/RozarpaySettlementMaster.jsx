import { useState, useEffect, lazy } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
//import RazarPaySettlementIndex from "../../containers/indeces/razorpaySettlementMaster/razorpayAllSettlementIndex";
const RazorPaySettlementIndex = lazy(() =>
  import("../../containers/indeces/razorpaySettlementMaster/razorpayAllSettlementIndex")
);

function RazorPaySettlementMaster() {
  const [tab, setTab] = useState("all-settlement");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setCrumbs([{ name: "Razorpay Settlement Master" }]);
  }, [tab]);

  useEffect(() => {
    const tabName =  pathname.split("/").filter(Boolean)[1]
    if(tabName)
    setTab(tabName)
    // if (pathname.toLowerCase().includes("/all-settlement")) setTab("all-settlement");
    // else if (pathname.toLowerCase().includes("/payment")) setTab("tabName");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    setTab(newValue)
    navigate("/razorpay-settlement-master/" + newValue);
  }

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="all-settlement" label="All Settlement" />
        <Tab value="pending-settlement" label="Pending Settlement" />
      </Tabs>
      {tab === "all-settlement" && <RazorPaySettlementIndex />}
      {tab === "pending-settlement" && <RazorPaySettlementIndex />}
    </>
  );
}

export default RazorPaySettlementMaster;
