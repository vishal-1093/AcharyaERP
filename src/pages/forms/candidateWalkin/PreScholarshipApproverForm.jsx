import { useState, useEffect } from "react";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "../../../services/Api";
import PreScholarshipForm from "./PreScholarshipForm";
import { Box, Button, Grid, Paper } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import useAlert from "../../../hooks/useAlert";

const initialValues = { remarks: "", document: "", approval: "" };

const requiredFields = ["remarks", "approval"];

function PreScholarshipApproverForm() {
  const [values, setValues] = useState(initialValues);
  const [feeTemplateData, setFeeTemplateData] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [scholarshipData, setScholarshipData] = useState([]);
  const [scholarshipValues, setScholarshipValues] = useState();
  const [scholarshipTotal, setScholarshipTotal] = useState(0);
  const [programType, setProgramType] = useState();

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    remarks: [values.remarks !== ""],
    approval: [values.approval !== ""],
  };

  const errorMessages = {
    remarks: ["This field required"],
    approval: ["This field required"],
  };

  useEffect(() => {
    getCandidateDetails();
  }, [pathname]);

  const getCandidateDetails = async () => {
    const feetemplateId = await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Index", link: "/PreScholarshipApproverIndex" },
          { name: res.data.data[0].candidate_name },
          { name: "Pre Scholarship Approval" },
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
    if (pathname.toLowerCase() === "/prescholarshipapproverform/" + id) {
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

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const approvalList = { 1: "Yes", 2: "Yes", 3: "No" };

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
          scholarshipValues[programType + val.key]
        );
      });
      updateData.approval = approvalList[values.approval];
      updateData.comments = values.remarks;
      updateData.prev_approved_amount = scholarshipData.scholarshipTotal;
      updateData.is_approved = "yes";
      updateData.approved_amount = scholarshipTotal;

      const temp = {};
      temp["sas"] = updateData;

      const documentData = new FormData();
      documentData.append("file", values.document);
      documentData.append("candidate_id", id);

      await axios
        .put(`/api/uploadFile`, documentData)
        .then((res) => {})
        .catch((err) => console.error(err));

      await axios
        .put(`/api/student/updateScholarshipStatus/${scholarshipId}`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Scholarship approved successfully",
          });
          setAlertOpen(true);
          navigate("/PreScholarshipApproverIndex", { replace: true });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  return (
    <>
      <Box>
        <Grid
          container
          alignItems="center"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} mb={3}>
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
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Grid
                container
                columnSpacing={3}
                rowSpacing={3}
                pl={2}
                pr={2}
                pb={1}
                pt={2}
              >
                <Grid item xs={12} md={4}>
                  <CustomRadioButtons
                    name="approval"
                    label="Approval"
                    value={values.isScholarship}
                    items={[
                      {
                        value: "1",
                        label: "Conditional",
                      },
                      {
                        value: "2",
                        label: "Unconditional",
                      },
                      {
                        value: "3",
                        label: "Reject",
                      },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="remarks"
                    label="Remarks"
                    value={values.remarks}
                    handleChange={handleChange}
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFileInput
                    name="document"
                    label="Document"
                    helperText="PDF - smaller than 2 MB"
                    file={values.document}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.document}
                    errors={errorMessages.document}
                  />
                </Grid>

                <Grid item xs={12} align="right">
                  <Box mt={2} mb={2}>
                    <Button variant="contained" onClick={handleCreate}>
                      Submit
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

export default PreScholarshipApproverForm;
