import { useState, useEffect, lazy } from "react";
import {
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
  Grid,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate ,useLocation} from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import { Button, Box } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import moment from "moment";
import acharyaLogo from "../../assets/acharyaLogo.png";
import userImage from "../../assets/maleplaceholderimage.jpeg";
import Paper from "@mui/material/Paper";
import PrintIcon from "@mui/icons-material/Print";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  employeeDetail: [],
  modalOpen: false,
  modalContent: modalContents,
};

const IncentiveApplication = () => {
  const [{employeeDetail, modalOpen, modalContent }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCrumbs([{ name: "Add On Report", link: "/AddonReport" }]);
    getUserDetails(location.state?.empId)
  }, []);

  const getUserDetails = async(empId) => {
    try {
      const res = await axios.get(
        `/api/employee/EmployeeDetails/${empId}`
      );
      if (res?.status == 200 || res?.status == 201) {
        setState((prevState)=>({
          ...prevState,
          employeeDetail: res.data.data[0]
        }))        
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

  const handleSubmit = () => {
    setModalOpen(true);
    const handleToggle = async () => {
    };
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
              // component={Paper}
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
                    {(employeeDetail?.school)?.toUpperCase()}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    APPLICATION FOR INCENTIVE - BOOK CHAPTER
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
                          sx={{ border: "1px solid lightgray"  }}
                          component="th"
                          scope="row"
                        >
                          <Typography><b>Faculty Name</b> : &nbsp; &nbsp; {(employeeDetail?.employee_name)}</Typography>
                          
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray"  }}>
                          <Typography><b>Employee Code</b> : &nbsp; &nbsp; {employeeDetail?.empcode}</Typography>
                          
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                        <Typography><b>Designation</b> : &nbsp; &nbsp; {employeeDetail?.designation_name}</Typography>
                          
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                        <Typography><b>Exp at Acharya</b> : &nbsp; &nbsp; 0Y 0M 0D</Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray"}}>
                        <Typography><b>Department</b> : &nbsp; &nbsp; {employeeDetail?.dept_name}</Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                        <Typography><b>Date Of Joining</b> : &nbsp; &nbsp; {employeeDetail?.date_of_joining}</Typography> 
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                        <Typography><b>Phone</b> : &nbsp; &nbsp; {employeeDetail?.mobile}</Typography>   
                        </TableCell>
                        <TableCell
                          colSpan={2}
                          sx={{ border: "1px solid lightgray" }}
                        >
                        <Typography><b>Email</b> : &nbsp; &nbsp; {employeeDetail?.email}</Typography>   
                          
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid mt={1} xs={8} p={1} sx={{border: "1px solid lightgray"}}>
                <Typography
                  paragraph
                  fontSize="13px"
                  sx={{ textAlign: "justify"}}
                >
                  Dear Sir/Madam,
                  <br></br>
                  <br></br>
                  This is to certify that <b>{employeeDetail?.employee_name}</b>,{" "}
                  <b>{(employeeDetail?.gender)?.toLowerCase() == "f" ? "D/O" : "S/O"}{" "} {!!employeeDetail?.father_name ?employeeDetail?.father_name : "fatherName" }</b>, AUID No. <b>{employeeDetail?.empcode}</b>, USN No.{" "}
                  <b>XYZAI00</b> is admitted to <b>AI001</b>.
                  <br></br>
                  <br></br>
                  Signature of Applicant:
                </Typography>
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
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Project Title</b> :
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Sanctioned Body</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>PI (Name &amp; Address)</b> :
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Date of Birth</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Institutes/ Department</b> :
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Emp Id</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Co-PI (Name &amp; Address)</b> :
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Date of Birth</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Broad area of Research</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Approved Objectives of the Proposal</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Date of Start</b> :
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Total cost of Project</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Date of completion</b> :
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>
                            Sanctioned amount:
                            <br></br>
                            Expenditure as on
                          </b>{" "}
                          :
                        </TableCell>
                      </TableRow>
                    </TableBody>
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
                          <b>Duration of the Project</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Methodology</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>
                            Research work which remains to be done under the
                            project (for on-going projects)
                          </b>{" "}
                          :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <Typography>
                            Declaration
                            <br></br>I declare that the above in an accurate
                            description of my contribution to this work, and the
                            contributions of authors are described above.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
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
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Head Of Department</b> :
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Head Of Institute</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Dean R &amp; D</b> :
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>Assistant Director R &amp; D</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>QA</b> :
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <b>HR</b> :
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colspan={2}
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <b>Finance</b> :
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
