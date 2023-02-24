import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Table,
  Typography,
  TableCell,
  TableRow,
} from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import bot from "../../../assets/bot.jpg";
import t from "../../../assets/t.jpg";
// import html2PDF from "../../../assets/jspdf-html2canvas";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import { StyleSheet } from "@react-pdf/renderer";
import SendIcon from "@mui/icons-material/Send";
import PrintIcon from "@mui/icons-material/Print";

function ProvisionCertificate() {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handlePDF = () => {
    // const new1 = document.getElementById("AuidGen");
    // html2PDF(new1, {
    //   jsPDF: {
    //     format: "A4",
    //   },
    //   imageType: "image/jpeg",
    //   output: "jspdf-generate.pdf",
    // });
  };

  useEffect(() => {
    getStudentData();
  }, []);

  // const print = () => {
  //   window.print();
  // };

  const styles = StyleSheet.create({
    Table: {
      border: 1,
      borderColor: "#aaaaaa",
      borderStyle: "solid",
      width: "50%",
      // borderLeft: "5px",
      // borderRight: "5px",
    },
    TableRow: {
      // borderWidth: "1px",
      // borderRight: "1px",
      // borderColor: "#aaaaaa",
      // borderStyle: "solid",
    },
    Typography: {
      textAlign: "justify",
    },
  });

  const getStudentData = async () => {
    await axios
      .get(`/api/student/Student_DetailsAuid/${id}`)
      .then((res) => {
        setStudentData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box
      // component="form"
      alignItems="center"
      // justifyContent="center"
      // p={2}
      marginTop={-6}
      sx={{
        width: "800px",
      }}
    >
      <Grid container marginLeft={29} id="AuidGen">
        <Grid>
          <img src={t} style={{ width: "100%" }} />
          <Typography sx={{ textAlign: "right" }}>
            {" "}
            Date : {convertDateToString(new Date())}
          </Typography>
          <Grid sx={{ ml: 3, mr: 3, mt: -1, mb: 1 }}>
            <Typography style={styles.Typography}>
              Congratulations{" "}
              <b>
                Mr/Ms .{" "}
                {studentData.student_name
                  ? studentData.student_name.toUpperCase()
                  : ""}{" "}
                !!
              </b>
              <br />
              <br />
              This is to certify that your Provisional Admission is complete,
              please find the details below:
            </Typography>

            <Table
              style={styles.Table}
              border={2}
              size="small"
              sx={{ mt: 1, mb: 1 }}
            >
              <TableRow>
                <TableCell>
                  <b>Course</b>
                </TableCell>
                <TableCell>{studentData.program_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Specialization</b>
                </TableCell>
                <TableCell>{studentData.program_specialization_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Academic Year</b>
                </TableCell>
                <TableCell>{studentData.ac_year}</TableCell>
              </TableRow>
            </Table>

            <Typography style={styles.Typography}>
              Your Acharya Unique Identification(AUID) is{" "}
              <b>{studentData.auid}</b>.. Kindly quote the AUID in all your
              communication and transaction with the college. <br />
              <br />
              All the students of Acharya have their own email provided by the
              college, the same has to be used to receive information and
              communicate with the college. You may now access your Acharya
              Email Id by using the URL m.acharya.ac.in and using the following
              credentials to Login. The email shall be active within 2 working
              days from the date of Admission.
            </Typography>

            <Table
              style={styles.Table}
              border={2}
              size="small"
              sx={{ mt: 1, mb: 1 }}
            >
              <TableRow>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>{studentData.acharya_email}</TableCell>
              </TableRow>
            </Table>

            <Typography style={styles.Typography}>
              You are required to complete your admission process through the
              student dashboard on the Acharya ERP portal. The login credentials
              of ERP shall be sent to you on your Acharya Email only.
              <br />
              <br />
              The ERP provides you access to your programme details, information
              on your teachers, timetable, attendance, pay fee and most
              importantly connect with your Proctor. The information may be
              accessed on a web browser or by using the ERP App on your mobile
              phone. You may download the app using the QR codes below. The
              portal allows multiple logins, allowing parents to use the same to
              be updated on their ward’s academic progress.
              <br />
              <br />
              Please note that the given fee is applicable only for the
              prescribed Academic Batch. Admission shall be ratified only after
              the submission of all original documents for verification and
              payment of all the fee for the semester/year as prescribed in the
              letter of offer. Failure to do so shall result in the withdrawal
              of the Offer of Admission.
              <br />
              <br />
              Please feel free to call or write to us if you need any further
              information. Ms.Josphineg is your counsellor and would be happy to
              assist you.
            </Typography>
          </Grid>
          <img src={bot} style={{ width: "100%" }} />
        </Grid>{" "}
      </Grid>

      <Grid
        container
        alignItems="center"
        justifyContent="flex-end"
        textAlign="right"
      >
        <Grid item xs={4} md={2}>
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "#454545",
            }}
            disabled={loading}
            onClick={handlePDF}
            onMouseOver={(e) => {
              alert("Please select File Type.");
            }}
            // onClick={() => window.print()}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <SendIcon />
            )}
          </Button>
        </Grid>
        <Grid item xs={4} md={2} marginRight={-26}>
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "#454545",
            }}
            disabled={loading}
            onClick={handlePDF}
            // onClick={() => window.print()}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <PrintIcon />
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProvisionCertificate;
