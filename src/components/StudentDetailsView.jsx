import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Alert,
  Box,
  Grid,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  styled,
} from "@mui/material";
import StudentDetailsViewAcademics from "./StudentDetailsViewAcademics";
import useAlert from "../hooks/useAlert";
import StudentDetailsViewAccounts from "./StudentDetailsViewAccounts";
import StudentDetailsViewAdmissions from "./StudentDetailsViewAdmissions";
import StudentDetailsViewProctorial from "./StudentDetailsViewProctorial";
import StudentDetailsViewDocuments from "./StudentDetailsViewDocuments";
import { useLocation, useParams } from "react-router-dom";
import CustomDatePicker from "./Inputs/CustomDatePicker";
import CustomTextField from "./Inputs/CustomTextField";
import moment from "moment";
import CandidateFollowUpNote from "../pages/indeces/CandidateFollowUpNote";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { checkFullAccess } from "../utils/DateTimeUtils";
import StudentLibraryDetailsView from "./StudentLibraryDetailsView";

const CustomTabsHorizontal = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "row",
  },
});

const CustomTabHorizontal = styled(Tab)(({ theme }) => ({
  height: "55px",
  fontSize: "14px",
  flex: 1,
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
}));

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

const initialValues = {
  followRemarks: "",
  followDate: null,
  lead_status: "Untouched",
  counselor_name: null,
  counselor_id: null,
};

const requiredFields = ["followRemarks"];

function StudentDetailsView() {
  const [tab, setTab] = useState("Registration");
  const [subTab, setSubTab] = useState("Personal Details");
  const [Image, setImage] = useState(null);
  const [followUpdata, setFollowUpData] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [applicantData, setApplicantData] = useState([]);
  const [courseData, setcourseData] = useState([]);
  const [transcriptData, settranscriptData] = useState([]);
  const [reportingData, setreportingData] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const [candidateProfilePhoto, setCandidateProfilePhoto] = useState();
  const [refreshData, setRefreshData] = useState(false);

  const { auid, id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const Id = id || sessionStorage.getItem("empId");

  const userType = sessionStorage.getItem("usertype");

  const checks = {
    followRemarks: [
      values.followRemarks !== "",
      /^.{1,250}$/.test(values.followRemarks),
    ],
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (
      pathname.toLowerCase() ===
        `/studentdetailsmaster/studentsdetailsview/${Id}` ||
      `/studentdetailsmaster/studentsdetails/${Id}`
    ) {
      setCrumbs([
        {
          name: "Student Master",
          link: "/StudentDetailsMaster/StudentsDetails",
        },
        { name: applicantData?.candidate_name + "-" + applicantData?.auid },
        ,
      ]);
    } else if (pathname.toLowerCase() === `/studentdetailsview/${Id}`) {
      setCrumbs([
        {
          name: "Student Master",
          link: "/ProctorStudentMaster/Proctor",
        },
        { name: applicantData?.candidate_name + "-" + applicantData?.auid },
        ,
      ]);
    } else {
      setCrumbs([
        {
          name: "Student Master",
          link: "/ProctorMaster/Proctor",
        },
        { name: applicantData?.candidate_name + "-" + applicantData?.auid },
        ,
      ]);
    }
  }, [applicantData]);

  useEffect(() => {
    if (refreshData) {
      getData();
      setRefreshData(false);
    }
  }, [refreshData]);

  const getData = async () => {
    await axios
      .get(`/api/student/getAllStudentDetailsData/${Id}`)
      .then((res) => {
        console.log(res.data);

        setApplicantData(res.data.data.Student_details);
        setcourseData(res.data.data.course[0]);
        settranscriptData(
          res.data.data.Student_Transcript_Details.filter(
            (obj) => obj.not_applicable !== "YES"
          )
        );
        setreportingData(res.data.data.reporting_students);
        getRegistrationData(
          res.data.data.Student_details.application_no_npf,
          res.data.data.Student_details.candidate_id
        );
      });
  };

  const getFollowUpData = async () => {
    await axios
      .get(`/api/student/getCandidateFollowUpByCandidateId/${Id}`)
      .then((res) => {
        const temp = res.data.data.sort((a, b) => {
          if (a.candidate_followup_id > b.candidate_followup_id) return -1;
          if (a.candidate_followup_id < b.candidate_followup_id) return 1;
          return 0;
        });

        setFollowUpData(temp);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    const hasFullAccess = checkFullAccess();
    if (
      pathname.toLowerCase() ===
        `/studentdetailsmaster/studentsdetailsview/${Id}` ||
      `/studentdetailsmaster/studentsdetails/${Id}`
    ) {
      if (hasFullAccess) {
        setCrumbs([
          {
            name: "Student Master",
            link: "/student-master",
          },
          { name: applicantData?.candidate_name + "-" + applicantData?.auid },
        ]);
      } else {
        setCrumbs([
          { name: "My Profile" },
          { name: applicantData?.candidate_name + "-" + applicantData?.auid },
        ]);
      }
    }
  }, [applicantData]);

  const getRegistrationData = async (applicationNo, candidateId) => {
    await axios
      .get(
        `/api/student/candidateWalkinDetails?application_no_npf=${applicationNo}`
      )
      .then((res) => {
        setRegistrationData(res.data.data[0]);
      })
      .catch((err) => console.error(err));

    // fetch candidate photo
    await axios
      .get(`/api/student/CandidateAttachmentDetails/${candidateId}`)
      .then((res) => {
        const getImagePath = res.data.data.filter(
          (obj) => obj.attachment_purpose === "photo"
        );

        if (getImagePath.length > 0) {
          const imagePath = getImagePath[0].attachment_path;
          // Fetch image
          axios
            .get(
              `/api/student/imageDownloadOfCandidateAttachment?attachment_path=${imagePath}`,
              {
                responseType: "blob",
              }
            )
            .then((fileRes) => {
              setCandidateProfilePhoto(URL.createObjectURL(fileRes.data));
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = async () => {
    const temp = {};
    temp.active = true;
    temp.follow_up_remarks = values.followRemarks;
    temp.follow_up_date = values.followDate;
    temp.candidate_id = Id;

    await axios
      .post(`/api/student/saveCandidateFollowUp`, temp)
      .then((res) => {
        if (res.data.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Data updated successfully !!",
          });
          setAlertOpen(true);
          setValues(initialValues);
          getFollowUpData();
        }
      })
      .catch((err) => console.error(err));
  };

  const handleRefresh = () => {
    setRefreshData(true);
  };

  return (
    <>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <CustomTabsHorizontal
            value={tab}
            onChange={handleTabChange}
            orientation="horizontal"
            variant="scrollable"
            className="CustomTabsHorizontal"
          >
            <CustomTabHorizontal value="Registration" label="Registration" />
            <CustomTabHorizontal value="Admissions" label="Admissions" />
            <CustomTabHorizontal value="Academics" label="Academics" />
            <CustomTabHorizontal value="Proctorial" label="Proctorial" />
            <CustomTabHorizontal value="Accounts" label="Accounts" />
            <CustomTabHorizontal value="Documents" label="Documents" />
            <CustomTabHorizontal value="Library" label="Library" />
          </CustomTabsHorizontal>
        </Grid>
        {tab === "Registration" && (
          <Grid
            container
            spacing={2}
            columnSpacing={4}
            sx={{ marginTop: "1px" }}
          >
            <Grid item xs={4} md={2}>
              <CustomTabs
                value={subTab}
                onChange={handleSubTabChange}
                orientation="vertical"
                variant="scrollable"
                className="customTabs"
              >
                <CustomTab value="Personal Details" label="Personal Details" />
                <CustomTab value="Bank" label="Bank Details" />
                <CustomTab value="Follow up Notes" label="Follow up Notes" />
              </CustomTabs>
            </Grid>
            <Grid item xs={8} md={10}>
              {subTab === "Personal Details" && (
                <>
                  <Card>
                    <CardHeader
                      title="Personal Details"
                      titleTypographyProps={{ variant: "subtitle2" }}
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        padding: 1,
                      }}
                    />

                    <CardContent>
                      <Grid container rowSpacing={1}>
                        <Grid item xs={12}>
                          <img
                            src={candidateProfilePhoto}
                            alt="Profile Photo"
                            width="80px"
                          />
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">AUID</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {applicantData.auid}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Date Of Admission
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {moment(applicantData.date_of_admission).format(
                              "DD-MM-YYYY"
                            )}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Student Name
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {applicantData.student_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Mobile</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.mobile}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Date Of Birth
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {moment(applicantData.dateofbirth).format(
                              "DD-MM-YYYY"
                            )}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Gender</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.candidate_sex}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Email</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.acharya_email}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Father Name
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.father_name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Mother Name
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.mother_name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Parent Mobile
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.father_mobile}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Nationality
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.nationality}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Blood Group
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.blood_group}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Passport Number
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.passport_no}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Current Address
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.current_address +
                              ", " +
                              applicantData.current_city_name +
                              ", " +
                              applicantData.current_state_name +
                              ", " +
                              applicantData.current_country_name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Permanent Address
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.permanent_address +
                              ", " +
                              applicantData.permanant_city_name +
                              ", " +
                              applicantData.permanant_state_name +
                              ", " +
                              applicantData.permanant_country_name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </>
              )}

              {subTab === "Bank" && (
                <>
                  <Card>
                    <CardHeader
                      title="Bank Details"
                      titleTypographyProps={{ variant: "subtitle2" }}
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        padding: 1,
                      }}
                    />

                    <CardContent>
                      <Grid container rowSpacing={1}>
                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Bank Name</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {applicantData.bank_name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Account No.
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.account_number}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Branch</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {applicantData.bank_branch}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">IFSC Code</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.ifsc_code}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </>
              )}

              {subTab === "Follow up Notes" &&
              userType.toLowerCase() !== "student" ? (
                <Card>
                  <CardHeader
                    title="Notes"
                    titleTypographyProps={{ variant: "subtitle2" }}
                    sx={{
                      backgroundColor: "rgba(74, 87, 169, 0.1)",
                      color: "#46464E",
                      padding: 1,
                    }}
                  />
                  <CardContent>
                    <Box mt={2}>
                      <Grid
                        container
                        justifyContent="flex-start"
                        columnSpacing={4}
                        rowSpacing={2}
                      >
                        <Grid item xs={12}>
                          <CustomTextField
                            name="followRemarks"
                            label="Note"
                            value={values.followRemarks}
                            handleChange={handleChange}
                            multiline
                            rows={4}
                            checks={checks.followRemarks}
                            required
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <CustomDatePicker
                            name="followDate"
                            label="Follow Up Date"
                            value={values.followDate}
                            handleChangeAdvance={handleChangeAdvance}
                            disablePast
                          />
                        </Grid>
                        <Grid item xs={12} align="right">
                          <Button
                            variant="contained"
                            onClick={handleCreate}
                            disabled={!requiredFieldsValid()}
                          >
                            Save
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item xs={12} md={3.4}>
                          <Typography variant="h6" color="primary">
                            Follow-up History
                          </Typography>
                        </Grid>
                        <Grid item xs={12} mr={20}>
                          <CandidateFollowUpNote
                            getFollowUpData={getFollowUpData}
                            followUpdata={followUpdata}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {subTab === "Follow up Notes" ? (
                    <>
                      <Alert severity="error">
                        You do not have permission!
                      </Alert>
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            </Grid>
          </Grid>
        )}
        {tab === "Admissions" && (
          <>
            <StudentDetailsViewAdmissions
              applicantData={applicantData}
              transcriptData={transcriptData}
              handleRefresh={handleRefresh}
            />
          </>
        )}
        {tab === "Academics" && (
          <>
            <StudentDetailsViewAcademics
              courseData={courseData}
              reportingData={reportingData}
              applicantData={applicantData}
              id={id}
            />
          </>
        )}
        {tab === "Proctorial" && (
          <>
            <StudentDetailsViewProctorial />
          </>
        )}
        {tab === "Accounts" && (
          <>
            <StudentDetailsViewAccounts applicantData={applicantData} />
          </>
        )}
        {tab === "Documents" && (
          <>
            <StudentDetailsViewDocuments
              id={id}
              applicantData={applicantData}
              getData={getData}
              Image={Image}
            />
          </>
        )}
        {tab === "Library" && (
          <>
            <StudentLibraryDetailsView />
          </>
        )}
      </Grid>
    </>
  );
}

export default StudentDetailsView;
