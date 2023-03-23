import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ExitFormIndex from "../../containers/indeces/exitFormMaster/ExitFormIndex";
import ExitQuestionsIndex from "../../containers/indeces/exitFormMaster/ExitQuestionsIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function ExitFormMaster() {
  const [tab, setTab] = useState("ExitQuestions");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "ExitForm Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/exitquestions"))
      setTab("ExitQuestions");
    else if (pathname.toLowerCase().includes("/exitforms")) setTab("ExitForms");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/ExitFormMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="ExitQuestions" label="Exit Questions" />
        <Tab value="ExitForms" label="Exit Form" />
      </Tabs>

      {tab === "ExitQuestions" && <ExitQuestionsIndex />}
      {tab === "ExitForms" && <ExitFormIndex />}
    </>
  );
}

export default ExitFormMaster;
