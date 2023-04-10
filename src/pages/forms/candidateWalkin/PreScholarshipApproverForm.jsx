import { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import FeeTemplateView from "../../../components/FeeTemplateView";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";

const initValues = { remarks: "" };

const requiredFields = ["remarks"];

function PreScholarshipApproverForm() {
  const [values, setValues] = useState(initValues);
  const [feeTemplateId, setFeeTemplateId] = useState();
  const [confirmModalContent, setConfirmModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    remarks: ["This field required"],
  };

  useEffect(() => {
    getCandidateDetails();
  }, [pathname]);

  const getCandidateDetails = async () => {
    // fetching feeTemplateId
    const feetemplateId = await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Index", link: "/PreScholarshipApproverIndex" },
          { name: res.data.data[0].candidate_name },
          { name: "Approve" },
        ]);
        setFeeTemplateId(res.data.data[0].fee_template_id);

        return res.data.data[0].fee_template_id;
      })
      .catch((err) => console.error(err));
  };

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

  const handleCreate = (status) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const submit = async () => {
        // Get scholarshipId and update pre approver data
        const scholarshipId = await axios
          .get(`/api/student/fetchscholarship/${id}`)
          .then((res) => {
            return res.data.data[0].scholarship_id;
          })
          .catch((err) => console.error(err));

        const scholarshipData = await axios
          .get(`/api/student/fetchScholarship2/${scholarshipId}`)
          .then((res) => {
            return res.data.data[0];
          })
          .catch((err) => console.error(err));

        const updateData = await axios
          .get(
            `/api/student/scholarshipapprovalstatus/${scholarshipData.scholarship_approved_status_id}`
          )
          .then((res) => {
            return res.data.data;
          })
          .catch((err) => console.error(err));

        updateData.pre_approval_status = status === "true" ? true : false;
        updateData.prev_approved_amount = scholarshipData.requested_scholarship;
        updateData.prev_approved_date = new Date();
        updateData.pre_approver_remarks = values.remarks;

        const temp = {};
        temp["sas"] = updateData;

        await axios
          .put(`/api/student/updateScholarshipStatus/${scholarshipId}`, temp)
          .then((res) => {})
          .catch((err) => console.error(err));

        // If pre approver reject then offer needs to be in activated
        if (status === "false") {
          await axios
            .delete(`/api/student/deactivatePreAdmissionProcess/${id}`)
            .then((res) => {})
            .catch((err) => console.error(err));

          await axios
            .delete(`/api/student/deactivateScholarship/${id}`)
            .then((res) => {})
            .catch((err) => console.error(err));

          await axios
            .delete(`/api/student/deactivateScholarshipapprovalstatus/${id}`)
            .then((res) => {})
            .catch((err) => console.error(err));

          await axios
            .delete(`/api/student/deactivateScholarshipAttachment/${id}`)
            .then((res) => {})
            .catch((err) => console.error(err));

          await axios
            .get(`/api/student/Candidate_Walkin/${id}`)
            .then((res) => {
              const data = res.data.data;
              data.npf_status = null;

              axios
                .put(`/api/student/Candidate_Walkin/${id}`, data)
                .then((res) => {})
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        }

        setAlertMessage({
          severity: "success",
          message: "Scholarship approved successfully",
        });
        setAlertOpen(true);
        navigate("/PreScholarshipApproverIndex", { replace: true });
      };

      setConfirmModalContent({
        title: "",
        message:
          status === "true"
            ? "Are sure want to approve ? "
            : "Are sure want to reject ? ",
        buttons: [
          { name: "Yes", color: "primary", func: submit },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setConfirmModalOpen(true);
    }
  };
  return (
    <>
      <CustomModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        title={confirmModalContent.title}
        message={confirmModalContent.message}
        buttons={confirmModalContent.buttons}
      />

      <Box component="form" p={1}>
        <FormPaperWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12}>
              {feeTemplateId ? (
                <FeeTemplateView
                  feeTemplateId={feeTemplateId}
                  candidateId={id}
                  type={3}
                />
              ) : (
                <></>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
                multiline
                rows={3}
                checks={checks.remarks}
                errors={errorMessages.remarks}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                justifyContent="flex-end"
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid item xs={12} md={1} align="right">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCreate("false")}
                    fullWidth
                  >
                    Reject
                  </Button>
                </Grid>
                <Grid item xs={12} md={1} align="right">
                  <Button
                    variant="contained"
                    onClick={() => handleCreate("true")}
                    fullWidth
                  >
                    Approve
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default PreScholarshipApproverForm;
