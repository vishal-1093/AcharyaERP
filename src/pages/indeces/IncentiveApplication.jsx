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
  approverList:[]
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
      approverList
    },
    setState,
  ] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCrumbs([{ name: "Add On Report", link: "/AddonReport" }]);
    getUserDetails(location.state?.empId);
    getApproverName(location.state?.empId)
  }, []);

  const getUserDetails = async (empId) => {
    try {
      const res = await axios.get(`/api/employee/EmployeeDetails/${empId}`);
      if (res?.status == 200 || res?.status == 201) {
        // if(!!res.data.data[0]?.attach){
        //   getUserImage(res.data.data[0].attach)
        // }
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

  const getApproverName = async (empId) => {
    try {
      const res = await axios.get(`/api/employee/getApproverDetailsData/${empId}`);
      if (res?.status == 200 || res?.status == 201) {
        let approverLists = [
          {employeeName:res.data.data[1]?.hodName},
          {employeeName:res.data.data[0]?.hoiName},

          {employeeName:res.data.data[3]?.employee_name},
          {employeeName:res.data.data[4]?.employee_name},

          {employeeName:res.data.data[6]?.employee_name},
          {employeeName:res.data.data[7]?.employee_name},

          {employeeName:res.data.data[2]?.employee_name},
        ];

        setState((prevState)=>({
          ...prevState,
          approverList:approverLists
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

  const getUserImage = async(photoAttachmentPath) => {
    try {
      if(!!photoAttachmentPath){
        const res = await axios.get(`/api/employee/employeeDetailsFileDownload?fileName=${photoAttachmentPath}`);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message:"Unable to find the image !!",
      });
      setAlertOpen(true);
    }
  }

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
                xs={10}
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
                    {employeeDetail?.school_name?.toUpperCase()}
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
              <Grid xs={10}>
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
                          <Grid container style={{ display: "flex" }}>
                            <Grid xs={6}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Faculty Name :
                            </Typography>
                            </Grid>
                            <Grid xs={6}>
                            <Typography>
                              {employeeDetail?.employee_name}
                            </Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <Grid container style={{ display: "flex"}}>
                            <Grid xs={6}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Employee Code :
                            </Typography>
                            </Grid>
                            <Grid xs={6}>
                            <Typography>{employeeDetail?.empcode}</Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <Grid container style={{ display: "flex"}}>
                            <Grid xs={6}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Designation :
                            </Typography>
                            </Grid>
                            <Grid xs={6}>
                            <Typography>
                              {employeeDetail?.designation_name}
                            </Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <Grid container style={{ display: "flex"}}>
                            <Grid xs={6}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Exp at Acharya :
                            </Typography>
                            </Grid>
                            <Grid xs={6}>
                            <Typography>{employeeDetail?.experience}</Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <Grid container style={{ display: "flex"}}>
                            <Grid xs={6}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Department :
                            </Typography>
                            </Grid>
                            <Grid xs={6}>
                            <Typography>{employeeDetail?.dept_name}</Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <Grid container style={{ display: "flex"}}>
                            <Grid xs={6}>
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Phone :
                            </Typography>
                            </Grid>
                            <Grid xs={6}>
                            <Typography>{employeeDetail?.mobile}</Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid mt={1} xs={10} p={1} sx={{ border: "1px solid lightgray" }}>
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

              <Grid mt={1} xs={10}>
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
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Book Title :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.book_title}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Author :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.authore}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Published :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.publisher}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <Grid conatiner style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Published Year :
                              </Typography>
                                </Grid>
                                <Grid xs={6}>
                                <Typography>
                                {" "}
                                {location.state.rowData?.published_year}
                              </Typography>
                                </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                ISBN No. :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.isbn_number}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                DOI :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.doi}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container >
                              <Grid xs={3.6} style={{ display: "flex",justifyContent:"space-between"}}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Unit :
                              </Typography>
                              </Grid>
                              <Grid xs={8}>
                              <Typography> </Typography>
                              </Grid>
                            </Grid>
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
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Type :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.Type}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Journal Name :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.journal_name}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Date :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.date}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Volume :
                              </Typography>
                                </Grid>
                                <Grid xs={6}>
                                <Typography>
                                {" "}
                                {location.state.rowData?.volume}
                              </Typography>
                                </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Issue No. :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.issue_number}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Paper Title :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.paper_title}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Paper Number :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {location.state.rowData?.page_number}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                ISSN :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.issue_number}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container>
                              <Grid xs={3.3} style={{ display: "flex",justifyContent:"space-between"}}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                ISSN Type :
                              </Typography>
                              <Typography>
                                {" "}
                                {location.state.rowData?.issn_type}
                              </Typography>
                              </Grid>
                            </Grid>
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
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Conference Type :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.conference_type}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Paper Type :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.paper_type}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Conference :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.conference_name}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgray" }}>
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Paper Title :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.paper_title}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                City :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.place}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                From Date :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.from_date}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                To Date :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.to_date}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container style={{ display: "flex"}}>
                              <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Organiser :
                              </Typography>
                              </Grid>
                              <Grid xs={6}>
                              <Typography>
                                {" "}
                                {location.state.rowData?.organiser}
                              </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                          >
                            <Grid container >
                              <Grid xs={3.6} style={{ display: "flex",justifyContent:"space-between"}}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Presentation Type :
                              </Typography>
                              <Typography>
                                {location.state.rowData?.presentation_type}
                              </Typography>
                                </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Grid>

              <Grid mt={1} xs={10}>
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
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              {(approverList[0]?.employeeName)?.toUpperCase()} :
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
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              {(approverList[1]?.employeeName)?.toUpperCase()} :
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
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              {(approverList[2]?.employeeName)?.toUpperCase()} :
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
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              {(approverList[3]?.employeeName)?.toUpperCase()} :
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
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              {(approverList[4]?.employeeName)?.toUpperCase()} :
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
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                            {(approverList[5]?.employeeName)?.toUpperCase()} :
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
                        colSpan={2}
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap:"150px",
                              justifyContent: "start",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: "500", fontSize: "13px" }}
                            >
                            {(approverList[6]?.employeeName)?.toUpperCase()} :
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
