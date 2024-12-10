import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { GenerateOfferPdf } from "./GenerateOfferPdf";
import useAlert from "../../../hooks/useAlert";
import { useNavigate, useParams } from "react-router-dom";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import OverlayLoader from "../../../components/OverlayLoader";
import CustomModal from "../../../components/CustomModal";
import UndoIcon from "@mui/icons-material/Undo";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function OfferLetterView() {
  const [data, setData] = useState([]);
  const [viewPdf, setViewPdf] = useState("");
  const [confirmModalContent, setConfirmModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [remarks, setRemarks] = useState([]);

  const { id, type } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([]);
  }, []);

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/student/findAllDetailsPreAdmission/${id}`
      );
      const responseData = response.data[0];
      if (responseData) {
        const {
          program_type: programType,
          number_of_years: noOfYears,
          number_of_semester: noOfSem,
          feeTemplate_program_type_name: feeTemp,
        } = responseData;

        const programAssignmentType = programType.toLowerCase();
        const feeTemplateProgramType = feeTemp.toLowerCase();
        const totalYearsOrSemesters =
          programAssignmentType === "yearly" ? noOfYears * 2 : noOfSem;
        const yearSemesters = [];
        for (let i = 1; i <= totalYearsOrSemesters; i++) {
          // if (
          //   feeTemplateProgramType === "semester" ||
          //   (feeTemplateProgramType === "yearly" && i % 2 !== 0)
          // ) {
          yearSemesters.push({ key: i, value: `Sem ${i}` });
          // }
        }

        const [{ data: feeTemplateResponse }, { data: remarksResponse }] =
          await Promise.all([
            axios.get("/api/student/getFeeDetails", {
              params: { candidateId: id },
            }),
            axios.get(
              `api/finance/getFeeTemplateRemarksDetails/${responseData.fee_template_id}`
            ),
          ]);
        const feeTemplateData = feeTemplateResponse.data;
        const remarksData = remarksResponse.data;
        const remarksTemp = [];
        remarksData.forEach((obj) => {
          remarksTemp.push(obj.remarks);
        });

        const blob = await GenerateOfferPdf(
          responseData,
          feeTemplateData,
          yearSemesters,
          remarksTemp
        );
        setViewPdf(URL.createObjectURL(blob));
        setData(responseData);
        setNoOfYears(yearSemesters);
        setTemplateData(feeTemplateData);
        setRemarks(remarksTemp);
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data",
      });
      setAlertOpen(true);
    }
  };

  const sendMail = async () => {
    try {
      setLoading(true);
      const getContent = await GenerateOfferPdf(
        data,
        templateData,
        noOfYears,
        remarks
      );
      const { data: response } = await axios.post(
        "/api/student/emailToCandidateRegardingOfferLetter",
        createFormData(getContent)
      );
      if (response.success) {
        setAlertMessage({
          severity: "success",
          message: "Offer has been sent successfully !!",
        });
        setAlertOpen(true);
        navigate(
          type === "admin"
            ? "/admissions"
            : type === "intl"
            ? "/admissions-intl"
            : "/admissions-userwise",
          { replace: true }
        );
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to send mail",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const createFormData = (file) => {
    const formData = new FormData();
    formData.append("file", file, "offer-letter.pdf");
    formData.append("candidate_id", id);
    return formData;
  };

  const handleSubmit = () => {
    setConfirmModalContent({
      title: "",
      message: "Are you sure you want to send this email?",
      buttons: [
        { name: "Yes", color: "primary", func: sendMail },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmModalOpen(true);
  };

  if (!viewPdf) return <OverlayLoader />;

  const handleGoback = () =>
    navigate(
      type === "admin"
        ? "/admissions"
        : type === "intl"
        ? "/admissions-intl"
        : "/admissions-userwise",
      { replace: true }
    );

  return (
    <>
      <CustomModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        title={confirmModalContent.title}
        message={confirmModalContent.message}
        buttons={confirmModalContent.buttons}
      />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleGoback()}
            >
              GO Back
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {data?.npf_status === 1 && (
              <IconButton
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                <ForwardToInboxIcon sx={{ fontSize: 30 }} />
              </IconButton>
            )}
          </Grid>

          <Grid item xs={12}>
            <object
              style={{ marginTop: "20px", width: "100%", height: "800px" }}
              data={viewPdf}
              type="application/pdf"
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default OfferLetterView;
