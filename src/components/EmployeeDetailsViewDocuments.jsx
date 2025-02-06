import { lazy, useEffect, useState } from "react";
import {
  Backdrop,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  styled,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

const UploadPersonalDocument = lazy(() =>
  import("../pages/forms/employeeMaster/UploadPersonalDocument")
);
const UploadEducationalDocument = lazy(() =>
  import("../pages/forms/employeeMaster/UploadEducationalDocument")
);
const UploadExperienceDocument = lazy(() =>
  import("../pages/forms/employeeMaster/UploadExperienceDocument")
);
const UploadContractDocument = lazy(() =>
  import("../pages/forms/employeeMaster/UploadContractDocument")
);
const UploadMedicalDocument = lazy(() =>
  import("../pages/forms/employeeMaster/UploadMedicalDocument")
);
const UploadPhoto = lazy(() =>
  import("../pages/forms/employeeMaster/UploadPhoto")
);

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
  },
}));

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function EmployeeDetailsViewDocuments({ data, state, type }) {
  const [docSubTab, setDocSubTab] = useState("personalProof");
  const [backDroploading, setBackDropLoading] = useState(false);

  const { userId } = useParams();
  const loggedEmpId = sessionStorage.getItem("empId");
  const empId = userId || loggedEmpId;
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    if (state) {
      setCrumbs([
        {
          name: "Employee Index",
          link: type === "user" ? "/employee-userwiseindex" : "/EmployeeIndex",
        },
        { name: data.employee_name + "-" + data.empcode },
      ]);
    } else {
      setCrumbs([
        { name: "Employee Profile" },
        { name: data.employee_name + "-" + data.empcode },
      ]);
    }
  }, []);

  const documentViewAccess = () =>
    empId === loggedEmpId ||
    roleShortName === "SAA" ||
    roleShortName === "HRD" ||
    roleShortName === "HRR";

  const handleDocSubTabChange = (e, newValue) => {
    setDocSubTab(newValue);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDroploading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={docSubTab}
            onChange={handleDocSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="personalProof" label="Personal Proof" />
            <CustomTab value="educational" label="Educational Documents" />
            <CustomTab value="experience" label="Experience Documents" />
            <CustomTab value="contracts" label="Contract Documents" />
            <CustomTab value="medicaldocument" label="Medical Document" />
            <CustomTab value="photoupload" label="photo" />
            <CustomTab value="medicaldetails" label="Medical Details" />
            {/* <CustomTab value="exportDoc" label="Document Download" /> */}
          </CustomTabs>
        </Grid>

        <Grid item xs={8} md={10}>
          {docSubTab === "personalProof" && (
            <UploadPersonalDocument
              empId={empId}
              documentViewAccess={documentViewAccess}
              setBackDropLoading={setBackDropLoading}
              jobId={data.job_id}
            />
          )}
          {docSubTab === "educational" && (
            <UploadEducationalDocument
              empId={empId}
              documentViewAccess={documentViewAccess}
              setBackDropLoading={setBackDropLoading}
            />
          )}
          {docSubTab === "experience" && (
            <UploadExperienceDocument
              empId={empId}
              documentViewAccess={documentViewAccess}
              setBackDropLoading={setBackDropLoading}
            />
          )}
          {docSubTab === "contracts" && (
            <UploadContractDocument
              empId={empId}
              documentViewAccess={documentViewAccess}
              setBackDropLoading={setBackDropLoading}
            />
          )}
          {docSubTab === "medicaldocument" && (
            <UploadMedicalDocument
              empId={empId}
              documentViewAccess={documentViewAccess}
              setBackDropLoading={setBackDropLoading}
            />
          )}
          {docSubTab === "photoupload" && (
            <UploadPhoto
              empId={empId}
              documentViewAccess={documentViewAccess}
              setBackDropLoading={setBackDropLoading}
            />
          )}
          {/* {docSubTab === "exportDoc" && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    p: 1,
                  }}
                >
                  Download Documents
                </Typography>
              </Grid>

              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-start"
                  item
                  xs={12}
                  elevation={3}
                  p={2}
                >
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                    <Paper elevation={3} sx={{ p: 5, marginTop: 5 }}>
                      <div style={{ marginTop: 20, textAlign: "center" }}>
                        <EmployeeIDCardDownload
                          employeeDocuments={employeeDocuments}
                          isDownload={true}
                        />
                      </div>
                    </Paper>
                  </Grid>
                  {employeeType === "FTE" && (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                      <Paper elevation={3} sx={{ p: 5, marginTop: 5 }}>
                        <div style={{ marginTop: 20, textAlign: "center" }}>
                          <EmployeeFTEDownload
                            employeeDocuments={employeeDocuments}
                            isDownload={true}
                          />
                        </div>
                      </Paper>
                    </Grid>
                  )}
                  {employeeType === "ORR" && (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                      <Paper elevation={3} sx={{ p: 5, marginTop: 5 }}>
                        <div style={{ marginTop: 20, textAlign: "center" }}>
                          <EmployeeAppointmentDownload
                            employeeDocuments={employeeDocuments}
                            isDownload={true}
                          />
                        </div>
                      </Paper>
                    </Grid>
                  )}
                </Grid>

                <Grid item xs={12} elevation={3} p={2} marginTop={5}>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Download Documents
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )} */}
        </Grid>
      </Grid>
    </>
  );
}

export default EmployeeDetailsViewDocuments;
