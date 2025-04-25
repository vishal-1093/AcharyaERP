import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const StudentFeeDetails = lazy(() =>
  import("../../../components/StudentFeeDetails")
);

const initialValues = {
  auid: "",
};

function StudentLedger() {
  const [values, setValues] = useState(initialValues);
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);
  const [allExpand, setAllExpand] = useState({});
  const [isPrintClick, setIsPrintClick] = useState(false)

  const { auid } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    auid: [
      values.auid !== "",
      /^[a-zA-Z0-9]*$/.test(values.auid),
      /^[A-Za-z]{3}\d{2}[A-Za-z]{4}\d{3}$/.test(values.auid),
    ],
  };

  const errorMessages = {
    auid: [
      "This field is required",
      "Special characters and space is not allowed",
      "Invalid AUID",
    ],
  };

  useEffect(() => {
    if (auid) {
      setValues((prev) => ({ ...prev, ["auid"]: auid }));
    }
  }, [auid]);

  useEffect(() => {
    handleSubmit();
  }, [values.auid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { auid } = values;
    if (Object.values(checks).flat().includes(false)) return;
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/student/getStudentDetailsByAuid/${values.auid}`
      );
      const responseData = response.data;
      if (Object.keys(responseData).length === 0) {
        setAlertMessage({
          severity: "error",
          message: "AUID is not present !!",
        });
        setAlertOpen(true);
        return;
      } else {
        setId(responseData.student_id);
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to fetch the student data.",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

 
   
  const handleDownloadPdf = () => {
      setIsPrintClick(true)
    // Backup the current expansion state
    const previousState = { ...allExpand };
    const allExpanded = {}

    for (let k in allExpand) {
      allExpanded[k] = true
    }
    setAllExpand({ ...allExpanded });
    setTimeout(() => {
      const receiptElement = document.getElementById("ledger");
      if (receiptElement) {
        html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          const imgWidth = 190;
          const pageHeight = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let yPosition = 5;
          pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
          const pdfBlob = pdf.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);

        const printWindow = window.open(pdfUrl, "_blank");
        if (printWindow) {
          printWindow.addEventListener("load", () => {
            printWindow.focus();
            printWindow.print();
          });
        }
         setAllExpand({...previousState});
         setIsPrintClick(false)
        });
      }
    }, 100);
  };


  return (
    <Box sx={{ margin: { xs: 1, md: 2, lg: 2, xl: 4 } }}>
       <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={handleDownloadPdf}>
            Print
          </Button>
        </Box>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Card elevation={4}>
            <CardHeader
              title="Student Ledger"
              titleTypographyProps={{
                variant: "subtitle2",
              }}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
                padding: 1,
              }}
            />
            <CardContent sx={{ p: { xs: 2, md: 5 } }}>
              <Grid container columnSpacing={2} rowSpacing={4}>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    name="auid"
                    label="AUID"
                    value={values.auid}
                    handleChange={handleChange}
                    checks={checks.auid}
                    errors={errorMessages.auid}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={2}
                  sx={{ textAlign: { xs: "right", md: "left" } }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      values.auid === "" ||
                      Object.values(checks).flat().includes(false)
                    }
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Grid>

                {id && (
                  <Grid item xs={12} id="ledger">
                    <Box
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <StudentDetails id={id} header={isPrintClick ? "Student Ledger" : "Student Details"}/>
                      <StudentFeeDetails id={id} allExpand={allExpand} setAllExpand={setAllExpand} studentLedger={true}/>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentLedger;
