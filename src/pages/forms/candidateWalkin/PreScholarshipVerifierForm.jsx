import { useState, useEffect } from "react";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "../../../services/Api";
import PreScholarshipForm from "./PreScholarshipForm";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";

function PreScholarshipVerifierForm() {
  const [feeTemplateData, setFeeTemplateData] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [scholarshipData, setScholarshipData] = useState([]);
  const [scholarshipValues, setScholarshipValues] = useState();
  const [scholarshipTotal, setScholarshipTotal] = useState(0);
  const userId = JSON.parse(localStorage.getItem("authenticate")).userId;
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [programType, setProgramType] = useState();

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getCandidateDetails();
  }, [pathname]);

  const getCandidateDetails = async () => {
    const feetemplateId = await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Index", link: "/PreScholarshipApproverIndex" },
          { name: "Verify" },
          { name: id },
          { name: res.data.data[0].candidate_name },
        ]);
        return res.data.data[0].fee_template_id;
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/finance/FetchFeeTemplateSubAmountDetail/${feetemplateId}`)
      .then((res) => {
        setFeeTemplateSubAmountData(res.data.data);
      })
      .catch((err) => console.error(err));

    const feetemplateData = await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${feetemplateId}`)
      .then((res) => {
        setFeeTemplateData(res.data.data[0]);
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    const programDetails = await axios
      .get(
        `/api/academic/FetchAcademicProgram/${feetemplateData.ac_year_id}/${feetemplateData.program_id}/${feetemplateData.school_id}`
      )
      .then((res) => {
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    const scholarshipId = await axios
      .get(`/api/student/fetchscholarship/${id}`)
      .then((res) => {
        const scholarshipData = res.data.data[0];
        return scholarshipData;
      })
      .catch((err) => console.error(err));

    const currentScholarshipData = await axios
      .get(`/api/student/fetchScholarship2/${scholarshipId.scholarship_id}`)
      .then((res) => {
        setScholarshipData(res.data.data[0]);
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    const yearSem = [];

    if (feetemplateData.program_type_name.toLowerCase() === "yearly") {
      for (let i = 1; i <= programDetails.number_of_years; i++) {
        yearSem.push({ key: i.toString(), value: "Year " + i });
        setScholarshipValues((prev) => ({
          ...prev,
          ["year" + i]:
            Object.keys(currentScholarshipData).length > 0
              ? currentScholarshipData["year" + i + "_amount"]
              : 0,
        }));
      }
      setProgramType("year");
    } else if (feetemplateData.program_type_name.toLowerCase() === "semester") {
      for (let i = 1; i <= programDetails.number_of_semester; i++) {
        yearSem.push({ key: i.toString(), value: "Sem " + i });
        setScholarshipValues((prev) => ({
          ...prev,
          ["sem" + i]:
            Object.keys(currentScholarshipData).length > 0
              ? currentScholarshipData["year" + i + "_amount"]
              : 0,
        }));
      }
      setProgramType("sem");
    }
    setNoOfYears(yearSem);
  };

  const handleChangeSholarship = (e) => {
    if (pathname.toLowerCase() === "/prescholarshipverifierform/" + id) {
      parseInt(e.target.value) >
      parseInt(scholarshipData["year" + e.target.name + "_amount"])
        ? setScholarshipValues((prev) => ({
            ...prev,
            [programType + e.target.name]:
              scholarshipData["year" + e.target.name + "_amount"],
          }))
        : setScholarshipValues((prev) => ({
            ...prev,
            [programType + e.target.name]: e.target.value,
          }));
    }
  };

  useEffect(() => {
    if (scholarshipValues) {
      const temp = [];
      if (noOfYears) {
        noOfYears.forEach((val) => {
          temp.push(
            parseInt(scholarshipValues[programType + val.key])
              ? parseInt(scholarshipValues[programType + val.key])
              : 0
          );
        });
        setScholarshipTotal(temp.reduce((a, b) => a + b));
      }
    }
  }, [scholarshipValues]);

  const handleCreate = async () => {
    const scholarshipId = await axios
      .get(`/api/student/fetchscholarship/${id}`)
      .then((res) => {
        return res.data.data[0].scholarship_id;
      })
      .catch((err) => {
        console.error(err);
      });

    const scholarshipData = await axios
      .get(`/api/student/fetchScholarship2/${scholarshipId}`)
      .then((res) => {
        return res.data.data[0];
      })
      .catch((err) => {
        console.error(err);
      });

    const updateData = await axios
      .get(
        `/api/student/scholarshipapprovalstatus/${scholarshipData.scholarship_approved_status_id}`
      )
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => {
        console.error(err);
      });

    noOfYears.forEach((val) => {
      updateData["year" + val.key + "_amount"] = parseInt(
        scholarshipValues["year" + val.key]
      );
    });
    updateData.verified_by = userId;
    updateData.is_verified = "yes";
    updateData.verified_amount = scholarshipTotal;

    const temp = {};
    temp["sas"] = updateData;

    const verify = async () => {
      await axios
        .put(`/api/student/updateScholarshipStatus/${scholarshipId}`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Scholarship verified successfully",
          });
          setAlertOpen(true);
          navigate("/PreScholarshipVerifierIndex", { replace: true });
        })
        .catch((err) => {
          console.error(err);
        });
    };

    setModalContent({
      title: "",
      message: "Do you want to submit ?",
      buttons: [
        { name: "Yes", color: "primary", func: verify },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box>
        <Grid
          container
          alignItems="center"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12}>
            {scholarshipValues ? (
              <PreScholarshipForm
                scholarshipValues={scholarshipValues}
                noOfYears={noOfYears}
                feeTemplateData={feeTemplateData}
                handleChangeSholarship={handleChangeSholarship}
                scholarshipTotal={scholarshipTotal}
                feeTemplateSubAmountData={feeTemplateSubAmountData}
                programType={programType}
              />
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={12} mb={1}>
            <Paper elevation={3}>
              <Grid container pl={2} pr={2} pb={1} pt={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" display="inline">
                    Requested Scholarship :
                  </Typography>
                  <Typography variant="body2" display="inline">
                    {" " + scholarshipData.requested_scholarship}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" display="inline">
                    Approved Scholarship :
                  </Typography>
                  <Typography variant="body2" display="inline">
                    {" " + scholarshipData.approved_amount}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6} align="right">
                  <Box mt={2} mb={2}>
                    <Button variant="contained" onClick={handleCreate}>
                      Verify
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PreScholarshipVerifierForm;
