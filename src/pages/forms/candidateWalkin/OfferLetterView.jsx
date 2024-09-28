import { useEffect, useRef, useState } from "react";
import axios from "../../../services/Api";
import { GenerateOfferPdf } from "./GenerateOfferPdf";
import useAlert from "../../../hooks/useAlert";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Grid, IconButton, Stack } from "@mui/material";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import OverlayLoader from "../../../components/OverlayLoader";
import CustomModal from "../../../components/CustomModal";
import UndoIcon from "@mui/icons-material/Undo";

function OfferLetterView() {
  const [data, setData] = useState([]);
  const [viewPdf, setViewPdf] = useState("");
  const [confirmModalContent, setConfirmModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/student/findAllDetailsPreAdmission/${id}`
      );
      const responseData = response.data[0];
      if (responseData) {
        const {
          fee_template_id,
          program_type,
          number_of_years,
          number_of_semester,
        } = responseData;
        const [{ data: subAmountResponse }, { data: feeTemplateResponse }] =
          await Promise.all([
            axios.get(
              `/api/finance/FetchFeeTemplateSubAmountDetail/${fee_template_id}`
            ),
            axios.get(
              `/api/finance/FetchAllFeeTemplateDetail/${fee_template_id}`
            ),
          ]);
        const feeTemplateData = feeTemplateResponse.data[0];
        const feeTemplateSubAmtData = subAmountResponse.data;
        const totalYearsOrSemesters =
          program_type === "Yearly" ? number_of_years * 2 : number_of_semester;

        const yearSemesters = [];
        for (let i = 1; i <= totalYearsOrSemesters; i++) {
          if (
            feeTemplateData.program_type_name === "Semester" ||
            (feeTemplateData.program_type_name === "Yearly" && i % 2 !== 0)
          ) {
            yearSemesters.push({ key: i, value: `Sem ${i}` });
          }
        }
        console.log("feeTemplateSubAmtData :>> ", feeTemplateSubAmtData);
        const blob = await GenerateOfferPdf(
          responseData,
          feeTemplateSubAmtData,
          yearSemesters
        );
        setViewPdf(URL.createObjectURL(blob));
        setData(responseData);
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

  console.log("data :>> ", data);

  const sendMail = async () => {
    const getContent = await GenerateOfferPdf(data);
    const { data: response } = await axios.get(
      `/api/student/Candidate_Walkin/${id}`
    );
    const candidateResponseData = response.data;
    candidateResponseData.npf_status = 2;
    const [{ data: candidateRes }, documentResponse] = await Promise.all([
      axios.put(`/api/student/Candidate_Walkin/${id}`, candidateResponseData),
      axios.post(
        "/api/student/emailToCandidateRegardingOfferLetter",
        createFormData(getContent)
      ),
    ]);

    if (candidateRes.success) {
      setAlertMessage({
        severity: "success",
        message: "Offer has been sent successfully !!",
      });
      setAlertOpen(true);
      navigate("/CandidateWalkin", { replace: true });
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

  return (
    <>
      <CustomModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        title={confirmModalContent.title}
        message={confirmModalContent.message}
        buttons={confirmModalContent.buttons}
      />

      <Box>
        <Grid container>
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
          <Grid item xs={12} align="center">
            <Stack direction="row" justifyContent="center">
              <IconButton
                onClick={() => navigate("/candidatewalkin")}
                variant="contained"
                color="primary"
              >
                <UndoIcon sx={{ fontSize: 30 }} />
              </IconButton>

              <IconButton
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                <ForwardToInboxIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default OfferLetterView;
