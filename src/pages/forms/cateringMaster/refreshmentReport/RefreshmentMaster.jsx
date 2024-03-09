import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import RefreshmentRequestIndex from "../refreshmentRequest/RefreshmentRequestIndex";

function RefreshmentMaster() {
  const [tab, setTab] = useState("RefreshmentRequestIndex");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase().includes("/refreshmentrequestindex"))setTab("RefreshmentRequestIndex");
   
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/RefreshmentMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
      <Tab value="RefreshmentRequestIndex" label="Indents" />
       
      </Tabs>
      {tab === "RefreshmentRequestIndex" && <RefreshmentRequestIndex />}
     
    </>
  );
}
export default RefreshmentMaster;
