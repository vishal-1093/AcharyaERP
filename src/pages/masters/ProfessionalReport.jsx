import { useState, useEffect } from "react";
import { Tab, Tabs, Grid, Box, Button, Menu, MenuItem } from "@mui/material";
import PublicationReport from "../indeces/PublicationReport";
import ConferenceReport from "../indeces/ConferenceReport";
import BookChapterReport from "../indeces/BookChapterReport";
import MembershipReport from "../indeces/MembershipReport";
import GrantReport from "../indeces/GrantReport";
import PatentReport from "../indeces/PatentReport";
import { useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ModalWrapperIncentive from "../../components/ModalWrapperIncentive";
import ipr from "../../assets/IPR.pdf";
import researchDevelopment from "../../assets/Research_Publication.pdf";

const tabsData = [
  {
    label: "Publication",
    value: "Publication",
    component: PublicationReport,
  },
  {
    label: "Conference",
    value: "Conference",
    component: ConferenceReport,
  },
  {
    label: "Book Chapter",
    value: "Book",
    component: BookChapterReport,
  },
  {
    label: "Membership",
    value: "Membership",
    component: MembershipReport,
  },
  {
    label: "Grant",
    value: "Grant",
    component: GrantReport,
  },

  {
    label: "Patent",
    value: "Patent",
    component: PatentReport,
  },
];

function ProfessionalReport() {
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value ||
    "Publication";

  useEffect(() => {
    setCrumbs([{ name: "AddOn Report" }]);
  }, [tabsData]);
  const [tabs, setTabs] = useState(initialTab);

  const handleChange = (e, newValue) => {
    setTabs(newValue);
  };

  const handleExport = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (title) => {
    setModalOpen(!modalOpen);
    setTitle(title);
    setFile(title == "IPR" ? ipr : researchDevelopment);
    handleClose()
  };

  return (
    <>
      <Box
        sx={{
          width: { md: "20%", lg: "15%", xs: "68%" },
          position: "absolute",
          right: { xs: 0, md: 30 },
          marginTop: { xs: -3, md: 1 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              aria-controls="export-menu"
              aria-haspopup="true"
              onClick={handleExport}
            >
              Read Sop
            </Button>
            <Menu
              id="export-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleClick("IPR")}>
                IPR
              </MenuItem>
              <MenuItem onClick={() => handleClick("Research & Development")}
              >
                Research & Development
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Box>
      <Tabs style={{ width: "80%" }} value={tabs} onChange={handleChange}>
        {tabsData.map((tabItem) => (
          <Tab
            key={tabItem.value}
            value={tabItem.value}
            label={tabItem.label}
          />
        ))}
      </Tabs>
      {tabsData.map((tabItem) => (
        <div key={tabItem.value}>
          {tabs === tabItem.value && <tabItem.component />}
        </div>
      ))}
      <ModalWrapperIncentive
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={900}
        title={title}
      >
        <Grid container>
          <Grid item xs={12}>
            {file ? <object
              data={file}
              type="application/pdf"
              style={{ height: "500px", width: "100%" }}
            >
              <p>Unable to preview the document</p>
            </object>
              :
              <><p>Unable to preview the document!</p></>
            }
          </Grid>
        </Grid>
      </ModalWrapperIncentive>
    </>
  );
}

export default ProfessionalReport;
