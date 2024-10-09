import { useState, useEffect, lazy } from "react";
import { Grid, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import { Button, Box } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import acharyaLogo from "../../assets/acharyaLogo.png";
import userImage from "../../assets/maleplaceholderimage.jpeg";
const CustomTextField = lazy(() =>
  import("../../components/Inputs/CustomTextField")
);

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  employeeDetail: [],
  applicantSignature: "",
  hodSignature: "",
  hoiSignature: "",
  deanRAndDSignature: "",
  assistantDirectorRAndDSignature: "",
  qaSignature: "",
  hrSignature: "",
  financeSignature: "",
  modalOpen: false,
  modalContent: modalContents,
};

const IncentiveApplication = () => {
  const [
    {
      employeeDetail,
      applicantSignature,
      hodSignature,
      hoiSignature,
      deanRAndDSignature,
      assistantDirectorRAndDSignature,
      qaSignature,
      hrSignature,
      financeSignature,
      modalOpen,
      modalContent,
    },
    setState,
  ] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("location=======", location.state);
    setCrumbs([{ name: "Add On Report", link: "/AddonReport" }]);
    getUserDetails(location.state?.empId);
  }, []);

  const getUserDetails = async (empId) => {
    try {
      const res = await axios.get(`/api/employee/EmployeeDetails/${empId}`);
      if (res?.status == 200 || res?.status == 201) {
        setState((prevState) => ({
          ...prevState,
          employeeDetail: res.data.data[0],
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const setModalOpen = (val) => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: val,
    }));
  };

  const setModalContent = (title, message, buttons) => {
    setState((prevState) => ({
      ...prevState,
      modalContent: {
        ...prevState.modalContent,
        title: title,
        message: message,
        buttons: buttons,
      },
    }));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setModalOpen(true);
    const handleToggle = async () => {};
    setModalContent("", "Do you want to submit incentive application?", [
      { name: "No", color: "primary", func: () => {} },
      { name: "Yes", color: "primary", func: handleToggle },
    ]);
  };

  return (
    <>
      {!!modalOpen && (
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
      )}

      {/* <Box
        sx={{
          width: { md: "20%", lg: "15%", xs: "68%" },
          position: "absolute",
          right: 30,
          marginTop: { xs: -2, md: -5 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              disableElevation
              startIcon={<PrintIcon />}
            >
              Print
            </Button>
          </Grid>
        </Grid>
      </Box> */}

      <Box>
        <Grid container>
          <Grid xs={12}>
            <Grid
              align="center"
              container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                xs={8}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "0.3px solid lightgray",
                  backgroundColor: "rgba(74, 87, 169, 0.1)",
                  height: "70px",
                }}
              >
                <div>
                  <img src={acharyaLogo} style={{ width: "80px" }} />
                </div>
                <div>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    JMJ EDUCATION SOCIETY
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    {employeeDetail?.school?.toUpperCase()}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    {`APPLICATION FOR INCENTIVE - ${location.state?.tabName}`}
                  </Typography>
                </div>
                <div style={{ height: "66px" }}>
                  <img
                    src={userImage}
                    style={{ width: "80px", height: "66px" }}
                  />
                </div>
              </Grid>
              <Grid xs={8}>
                <TableContainer>
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <div style={{ display: "flex", gap: "20px" }}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Faculty Name :
                            </Typography>
                            <Typography>
                              {employeeDetail?.employee_name}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <div style={{ display: "flex", gap: "20px" }}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Employee Code :
                            </Typography>
                            <Typography>{employeeDetail?.empcode}</Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <div style={{ display: "flex", gap: "20px" }}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Designation :
                            </Typography>
                            <Typography>
                              {employeeDetail?.designation_name}
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <div style={{ display: "flex", gap: "20px" }}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Exp at Acharya :
                            </Typography>
                            <Typography>0Y 0M 0D</Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <div style={{ display: "flex", gap: "20px" }}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Department :
                            </Typography>
                            <Typography>{employeeDetail?.dept_name}</Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <div style={{ display: "flex", gap: "20px" }}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Date Of Joining :
                            </Typography>
                            <Typography>
                              {employeeDetail?.date_of_joining}
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <div style={{ display: "flex", gap: "20px" }}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Phone :
                            </Typography>
                            <Typography>{employeeDetail?.mobile}</Typography>
                          </div>
                        </TableCell>
                        <TableCell
                          colSpan={2}
                          sx={{ border: "1px solid lightgray" }}
                        >
                          <div style={{ display: "flex", gap: "20px" }}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Email :
                            </Typography>
                            <Typography>{employeeDetail?.email}</Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid mt={1} xs={8} p={1} sx={{ border: "1px solid lightgray" }}>
                <Typography
                  paragraph
                  fontSize="13px"
                  sx={{ textAlign: "justify" }}
                >
                  Dear Sir/Madam,
                  <br></br>
                  <br></br>
                  <Typography variant="body1">
                    This is to certify that{" "}
                    <Typography
                      component="span"
                      variant="body1"
                      fontWeight="500"
                    >
                      {employeeDetail?.employee_name},{" "}
                      {employeeDetail?.gender?.toLowerCase() == "f"
                        ? "D/O"
                        : "S/O"}{" "}
                      {!!employeeDetail?.father_name
                        ? employeeDetail?.father_name
                        : "fatherName"}
                    </Typography>{" "}
                    , AUID No.{" "}
                    <Typography
                      component="span"
                      variant="body1"
                      fontWeight="500"
                    >
                      {employeeDetail?.empcode}
                    </Typography>
                    , USN No.{" "}
                    <Typography
                      component="span"
                      variant="body1"
                      fontWeight="500"
                    >
                      XYZAI00
                    </Typography>{" "}
                    is admitted to{" "}
                    <Typography
                      component="span"
                      variant="body1"
                      fontWeight="500"
                    >
                      AI001.
                    </Typography>
                  </Typography>
                </Typography>
              </Grid>

              <Grid mt={1} xs={8}>
                <TableContainer>
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    {location.state?.tabName == "BOOK CHAPTER" && (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Book Title :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.book_title}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Author :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.authore}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Published :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.publisher}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Published Year :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.published_year}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                ISBN No. :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.isbn_number}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                DOI :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.doi}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Unit :
                              </Typography>
                              <Typography> </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}

                    {location.state?.tabName == "PUBLICATION" && (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Type :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.Type}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Journal Name :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.journal_name}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Date :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.date}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Volume :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.volume}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Issue No. :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.issue_number}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Paper Title :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.paper_title}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Paper Number :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.paper_number}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                ISSN :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.issue_number}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                ISSN Type :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.issn_type}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}

                    {location.state?.tabName == "CONFERENCE" && (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Conference Type :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.conference_type}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Paper Type :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.paper_type}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Conference :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.conference_name}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Paper Title :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.paper_title}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                City :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.place}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                From Date :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.from_date}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                To Date :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.to_date}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Organiser :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.organiser}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <div style={{ display: "flex", gap: "20px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Presentation Type :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.presentation_type}
                              </Typography>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Grid>

              <Grid mt={1} xs={8}>
                <TableContainer>
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <Typography>
                            <Typography
                              component="span"
                              variant="body1"
                              fontWeight="500"
                            >
                              Declaration :
                            </Typography>
                            <br></br>
                            <br></br>I declare that the above in an accurate
                            best of my knowledge.
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Signature of Applicant :
                            </Typography>
                            <Typography>
                              <CustomTextField
                                name="applicantSignature"
                                label=""
                                value={applicantSignature || ""}
                                handleChange={handleChange}
                              />
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Head Of Department :
                            </Typography>
                            <Typography>
                              <CustomTextField
                                name="hodSignature"
                                label=""
                                value={hodSignature || ""}
                                handleChange={handleChange}
                              />
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Head Of Institute :
                            </Typography>
                            <Typography>
                              <CustomTextField
                                name="hoiSignature"
                                label=""
                                value={hoiSignature || ""}
                                handleChange={handleChange}
                              />
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Dean R &amp; D :
                            </Typography>
                            <Typography>
                              <CustomTextField
                                name="deanRAndDSignature"
                                label=""
                                value={deanRAndDSignature || ""}
                                handleChange={handleChange}
                              />
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Assistant Director R &amp; D :
                            </Typography>
                            <Typography>
                              <CustomTextField
                                name="assistantDirectorRAndDSignature"
                                label=""
                                value={assistantDirectorRAndDSignature || ""}
                                handleChange={handleChange}
                              />
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Quality Assurance :
                            </Typography>
                            <Typography>
                              <CustomTextField
                                name="qaSignature"
                                label=""
                                value={qaSignature || ""}
                                handleChange={handleChange}
                              />
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Human Resources :
                            </Typography>
                            <Typography>
                              <CustomTextField
                                name="hrSignature"
                                label=""
                                value={hrSignature || ""}
                                handleChange={handleChange}
                              />
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Finance :
                            </Typography>
                            <Typography>
                              <CustomTextField
                                name="financeSignature"
                                label=""
                                value={financeSignature || ""}
                                handleChange={handleChange}
                              />
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid
                mt={4}
                mb={2}
                xs={10}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disableElevation
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default IncentiveApplication;
