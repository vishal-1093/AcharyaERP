import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import SalaryStructureIndex from "../../containers/indeces/salaryMaster/SalaryStructureIndex";
import SalaryStructureHeadIndex from "../../containers/indeces/salaryMaster/SalaryStructureHeadIndex";
import SlabStructureIndex from "../../containers/indeces/salaryMaster/SlabStructureIndex";
import SalaryStructureAssignment from "../forms/salaryMaster/SalaryStructureAssignment";
import SlabDefinationForm from "../forms/salaryMaster/SlabDefinationForm";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function SalaryMaster() {
  const [tab, setTab] = useState("SalaryStructure");
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => setCrumbs([{ name: "Salary Master" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/salarystructure"))
      setTab("SalaryStructure");
    else if (pathname.toLowerCase().includes("/salaryhead"))
      setTab("SalaryHead");
    else if (pathname.toLowerCase().includes("/assignment"))
      setTab("Assignment");
    else if (pathname.toLowerCase().includes("/slabdefination"))
      setTab("SlabDefination");
    else if (pathname.toLowerCase().includes("/slabstructure"))
      setTab("SlabStructure");
    else if (pathname.toLowerCase().includes("/Assignment"))
      setTab("Assignment");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/SalaryMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="SalaryStructure" label="Salary Structure" />
        <Tab value="SalaryHead" label="Salary Head" />
        <Tab value="Assignment" label="Assignment" />
        <Tab value="SlabDefination" label="Slab Defination" />
        <Tab value="SlabStructure" label="Slab Structure" />
      </Tabs>

      {tab === "SalaryStructure" && <SalaryStructureIndex />}
      {tab === "SalaryHead" && <SalaryStructureHeadIndex />}
      {tab === "Assignment" && <SalaryStructureAssignment />}
      {tab === "SlabDefination" && <SlabDefinationForm />}
      {tab === "SlabStructure" && <SlabStructureIndex />}
    </>
  );
}

export default SalaryMaster;
