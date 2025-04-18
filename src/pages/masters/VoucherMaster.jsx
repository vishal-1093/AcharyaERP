import { useState, useEffect, lazy } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
const JournalVoucherIndex = lazy(() =>
  import("../indeces/JournalVoucherIndex")
);
const PaymentVoucherIndex = lazy(() =>
  import("../../containers/indeces/accountMaster/PaymentVoucherIndex")
);

function VoucherMaster() {
  const [tab, setTab] = useState("Journal");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setCrumbs([{ name: "Voucher Master" }]);
  }, [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/journal")) setTab("Journal");
    else if (pathname.toLowerCase().includes("/payment")) setTab("Payment");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/VoucherMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Journal" label="Journal" />
        <Tab value="Payment" label="Payment" />
      </Tabs>
      {tab === "Journal" && <JournalVoucherIndex />}
      {tab === "Payment" && <PaymentVoucherIndex />}
    </>
  );
}

export default VoucherMaster;
