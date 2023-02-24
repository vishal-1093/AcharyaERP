import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab, IconButton } from "@mui/material";
import OrganizationIndex from "../../containers/indeces/instituteMaster/OrganizationIndex";
import SchoolIndex from "../../containers/indeces/instituteMaster/SchoolIndex";
import JobtypeIndex from "../../containers/indeces/instituteMaster/JobtypeIndex";
import EmptypeIndex from "../../containers/indeces/instituteMaster/EmptypeIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import InfoIcon from "@mui/icons-material/Info";
import InfoModal from "../../components/InfoModal";
import SchoolInfo from "../../docs/schoolInfo/SchoolInfo";

function InstituteMaster() {
  const [tab, setTab] = useState("Organization");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (tab === "School") {
      setCrumbs([
        { name: "Institute Master" },
        { name: tab },
        {
          name: (
            <InfoModal>
              <SchoolInfo />
            </InfoModal>
          ),
        },
      ]);
    } else {
      setCrumbs([{ name: "Institute Master" }, { name: tab }]);
    }
  }, [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/organization"))
      setTab("Organization");
    else if (pathname.toLowerCase().includes("/school")) setTab("School");
    else if (pathname.toLowerCase().includes("/jobtype")) setTab("JobType");
    else if (pathname.toLowerCase().includes("/emptype")) setTab("EmpType");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/InstituteMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Organization" label="Organization" />
        <Tab value="School" label="School" />
        <Tab value="JobType" label="Job Type" />
        <Tab value="EmpType" label="EMP Type " />
      </Tabs>

      {tab === "Organization" && <OrganizationIndex />}
      {tab === "School" && <SchoolIndex />}
      {tab === "JobType" && <JobtypeIndex />}
      {tab === "EmpType" && <EmptypeIndex />}
    </>
  );
}

export default InstituteMaster;
