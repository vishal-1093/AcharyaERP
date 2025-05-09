import { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import axios from "../../services/Api";
import acharyaLogo from "../../assets/acharyaLogo.png";
import rightCursor from "../../assets/rightCursor.png";
import userImage from "../../assets/maleplaceholderimage.jpeg";
import femaleImage from "../../assets/femalePlaceholderImage.jpg";
import VerifiedIcon from '@mui/icons-material/Verified';
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import moment from "moment";
import { useLocation } from "react-router-dom";

const initialState = {
  employeeDetail: [],
  employeeImageUrl: null,
  approverList: [],
  loading: false,
};

const IncentiveApplication = () => {
  const [
    {
      employeeDetail,
      employeeImageUrl,
      loading,
      approverList
    },
    setState,
  ] = useState(initialState);
  const [timeLineList, setTimeLineList] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();

  useEffect(() => {
    setCrumbs([
      { name: "AddOn Report All", link: `${location.state?.urlName}` },
      { name: "Incentive Application" },
    ]);
    getUserDetails(location.state?.rowData?.emp_id);
    (location.state.tabName)?.toLowerCase() !== "patent" ? getTimeLineData(location.state?.rowData) : getPatentTimeLineData(location.state?.rowData)
  }, []);

  const getUserDetails = async (empId) => {
    try {
      const res = await axios.get(`/api/employee/EmployeeDetails/${empId}`);
      if (res?.status == 200 || res?.status == 201) {
        if (!!res.data.data[0]?.emp_image_attachment_path) {
          getUserImage(res.data.data[0].emp_image_attachment_path);
        }
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

  const getUserImage = async (photoAttachmentPath) => {
    try {
      if (!!photoAttachmentPath) {
        const res = await axios.get(
          `/api/employee/employeeDetailsFileDownload?fileName=${photoAttachmentPath}`,
          { responseType: "blob" }
        );
        if (
          res.status === 200 ||
          res.status === 201
        ) {
          setState((prevState) => ({
            ...prevState,
            employeeImageUrl: URL.createObjectURL(res.data),
          }));
        }
      }
    } catch (error) {
      console.log("imageError", error);
    }
  };

  const getTimeLineData = async (rowData) => {
    try {
      let timeLineLists = [];
      const response = await axios.get(
        `/api/employee/getApproverDetailsData/${rowData?.emp_id}`
      );
      if (response?.status == 200 || response?.status == 201) {
        if (rowData?.incentive_approver_id) {
          const res = await axios.get(
            `/api/employee/incentiveApproverBasedOnEmpId/${rowData?.emp_id}/${rowData?.incentive_approver_id}`
          );
          if (res?.status == 200 || res?.status == 201) {
            if (response.data.data[0]?.hoiName === response.data.data[1]?.hodName) {
              timeLineLists = [
                {
                  date: res.data.data[0]?.date,
                  type: "Applicant",
                  note: res.data.data[0]?.remark,
                  name: location.state?.rowData?.employee_name,
                  status: res.data.data[0]?.status,
                  weight: "10",
                  ipAddress: res.data.data[0]?.ip_address
                },
                {
                  date: res.data.data[0]?.hod_date,
                  type: "Head of Department",
                  note: res.data.data[0]?.hod_remark,
                  name: res.data.data[0]?.hod_name,
                  status: res.data.data[0]?.hod_status,
                  weight: "20",
                  ipAddress: res.data.data[0]?.hod_ip_address
                },
                {
                  date: res.data.data[0]?.hod_date,
                  type: "Reporting Manager",
                  note: res.data.data[0]?.hod_remark,
                  name: res.data.data[0]?.hod_name,
                  status: res.data.data[0]?.hod_status,
                  weight: "30",
                  ipAddress: res.data.data[0]?.hod_ip_address
                },
                {
                  date: res.data.data[0]?.asst_dir_date,
                  type: "Assistant Director R & D",
                  note: res.data.data[0]?.asst_dir_remark,
                  name: res.data.data[0]?.asst_dir_name,
                  status: res.data.data[0]?.asst_dir_status,
                  weight: "40",
                  ipAddress: res.data.data[0]?.asst_ip_address
                },
                {
                  date: res.data.data[0]?.qa_date,
                  type: "Head QA",
                  note: res.data.data[0]?.qa_remark,
                  name: res.data.data[0]?.qa_name,
                  amount: res.data?.data[0]?.amount,
                  status: res.data.data[0]?.qa_status,
                  weight: "60",
                  ipAddress: res.data.data[0]?.qa_ip_address
                },
                {
                  date: res.data.data[0]?.hr_date,
                  type: "Human Resources",
                  note: res.data.data[0]?.hr_remark,
                  name: res.data.data[0]?.hr_name,
                  status: res.data.data[0]?.hr_status,
                  weight: "80",
                  ipAddress: res.data.data[0]?.hr_ip_address
                },
                {
                  date: res.data.data[0]?.finance_date,
                  type: "Finance",
                  note: res.data.data[0]?.finance_remark,
                  name: res.data.data[0]?.finance_name,
                  status: res.data.data[0]?.finance_status,
                  weight: "100",
                  ipAddress: res.data.data[0]?.finance_ip_address
                },
              ];
            } else {
              timeLineLists = [
                {
                  date: res.data.data[0]?.date,
                  type: "Applicant",
                  note: res.data.data[0]?.remark,
                  name: location.state?.rowData?.employee_name,
                  status: res.data.data[0]?.status,
                  weight: "10",
                  ipAddress: res.data.data[0]?.ip_address
                },
                {
                  date: res.data.data[0]?.hod_date,
                  type: "Head of Department",
                  note: res.data.data[0]?.hod_remark,
                  name: res.data.data[0]?.hod_name,
                  status: res.data.data[0]?.hod_status,
                  weight: "20",
                  ipAddress: res.data.data[0]?.hod_ip_address
                },
                {
                  date: res.data.data[0]?.hoi_date,
                  type: "Reporting Manager",
                  note: res.data.data[0]?.hoi_remark,
                  name: res.data.data[0]?.hoi_name,
                  status: res.data.data[0]?.hoi_status,
                  weight: "30",
                  ipAddress: res.data.data[0]?.hoi_ip_address
                },
                {
                  date: res.data.data[0]?.asst_dir_date,
                  type: "Assistant Director R & D",
                  note: res.data.data[0]?.asst_dir_remark,
                  name: res.data.data[0]?.asst_dir_name,
                  status: res.data.data[0]?.asst_dir_status,
                  weight: "40",
                  ipAddress: res.data.data[0]?.asst_ip_address
                },
                {
                  date: res.data.data[0]?.qa_date,
                  type: "Head QA",
                  note: res.data.data[0]?.qa_remark,
                  name: res.data.data[0]?.qa_name,
                  amount: res.data?.data[0]?.amount,
                  status: res.data.data[0]?.qa_status,
                  weight: "60",
                  ipAddress: res.data.data[0]?.qa_ip_address
                },
                {
                  date: res.data.data[0]?.hr_date,
                  type: "Human Resources",
                  note: res.data.data[0]?.hr_remark,
                  name: res.data.data[0]?.hr_name,
                  status: res.data.data[0]?.hr_status,
                  weight: "80",
                  ipAddress: res.data.data[0]?.hr_ip_address
                },
                {
                  date: res.data.data[0]?.finance_date,
                  type: "Finance",
                  note: res.data.data[0]?.finance_remark,
                  name: res.data.data[0]?.finance_name,
                  status: res.data.data[0]?.finance_status,
                  weight: "100",
                  ipAddress: res.data.data[0]?.finance_ip_address
                },
              ];
            }
            setTimeLineList(timeLineLists);
          }
        };
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

  const getPatentTimeLineData = async (rowData) => {
    try {
      let timeLineLists = [];
      const response = await axios.get(
        `/api/employee/getApproverDetailsData/${rowData?.emp_id}`
      );
      if (response?.status == 200 || response?.status == 201) {
        if (rowData?.incentive_approver_id) {
          const res = await axios.get(
            `/api/employee/incentiveApproverBasedOnEmpId/${rowData?.emp_id}/${rowData?.incentive_approver_id}`
          );
          if (res?.status == 200 || res?.status == 201) {
            if (response.data.data[0]?.hoiName === response.data.data[1]?.hodName) {
              timeLineLists = [
                {
                  date: res.data.data[0]?.date,
                  type: "Applicant",
                  note: res.data.data[0]?.remark,
                  name: location.state?.rowData?.employee_name,
                  status: res.data.data[0]?.status,
                  weight: "10",
                  ipAddress: res.data.data[0]?.ip_address
                },
                {
                  date: res.data.data[0]?.hod_date,
                  type: "Head of Department",
                  note: res.data.data[0]?.hod_remark,
                  name: res.data.data[0]?.hod_name,
                  status: res.data.data[0]?.hod_status,
                  weight: "20",
                  ipAddress: res.data.data[0]?.hod_ip_address
                },
                {
                  date: res.data.data[0]?.hod_date,
                  type: "Reporting Manager",
                  note: res.data.data[0]?.hod_remark,
                  name: res.data.data[0]?.hod_name,
                  status: res.data.data[0]?.hod_status,
                  weight: "30",
                  ipAddress: res.data.data[0]?.hod_ip_address
                },
                {
                  date: res.data.data[0]?.ipr_date,
                  type: "IPR Head",
                  note: res.data.data[0]?.ipr_remark,
                  name: res.data.data[0]?.ipr_name,
                  status: res.data.data[0]?.ipr_status,
                  weight: "40",
                  ipAddress: res.data.data[0]?.ipr_ip_address
                },
                {
                  date: res.data.data[0]?.asst_dir_date,
                  type: "Assistant Director R & D",
                  note: res.data.data[0]?.asst_dir_remark,
                  name: res.data.data[0]?.asst_dir_name,
                  status: res.data.data[0]?.asst_dir_status,
                  weight: "",
                  ipAddress: res.data.data[0]?.asst_ip_address
                },
                {
                  date: res.data.data[0]?.qa_date,
                  type: "Head QA",
                  note: res.data.data[0]?.qa_remark,
                  name: res.data.data[0]?.qa_name,
                  amount: res.data?.data[0]?.amount,
                  status: res.data.data[0]?.qa_status,
                  weight: "60",
                  ipAddress: res.data.data[0]?.qa_ip_address
                },
                {
                  date: res.data.data[0]?.hr_date,
                  type: "Human Resources",
                  note: res.data.data[0]?.hr_remark,
                  name: res.data.data[0]?.hr_name,
                  status: res.data.data[0]?.hr_status,
                  weight: "80",
                  ipAddress: res.data.data[0]?.hr_ip_address
                },
                {
                  date: res.data.data[0]?.finance_date,
                  type: "Finance",
                  note: res.data.data[0]?.finance_remark,
                  name: res.data.data[0]?.finance_name,
                  status: res.data.data[0]?.finance_status,
                  weight: "100",
                  ipAddress: res.data.data[0]?.finance_ip_address
                },
              ];
            } else {
              timeLineLists = [
                {
                  date: res.data.data[0]?.date,
                  type: "Applicant",
                  note: res.data.data[0]?.remark,
                  name: location.state?.rowData?.employee_name,
                  status: res.data.data[0]?.status,
                  weight: "10",
                  ipAddress: res.data.data[0]?.ip_address
                },
                {
                  date: res.data.data[0]?.hod_date,
                  type: "Head of Department",
                  note: res.data.data[0]?.hod_remark,
                  name: res.data.data[0]?.hod_name,
                  status: res.data.data[0]?.hod_status,
                  weight: "20",
                  ipAddress: res.data.data[0]?.hod_ip_address
                },
                {
                  date: res.data.data[0]?.hoi_date,
                  type: "Reporting Manager",
                  note: res.data.data[0]?.hoi_remark,
                  name: res.data.data[0]?.hoi_name,
                  status: res.data.data[0]?.hoi_status,
                  weight: "30",
                  ipAddress: res.data.data[0]?.hoi_ip_address
                },
                {
                  date: res.data.data[0]?.ipr_date,
                  type: "IPR Head",
                  note: res.data.data[0]?.ipr_remark,
                  name: res.data.data[0]?.ipr_name,
                  status: res.data.data[0]?.ipr_status,
                  weight: "40",
                  ipAddress: res.data.data[0]?.ipr_ip_address
                },
                {
                  date: res.data.data[0]?.asst_dir_date,
                  type: "Assistant Director R & D",
                  note: res.data.data[0]?.asst_dir_remark,
                  name: res.data.data[0]?.asst_dir_name,
                  status: res.data.data[0]?.asst_dir_status,
                  weight: "",
                  ipAddress: res.data.data[0]?.asst_ip_address
                },
                {
                  date: res.data.data[0]?.qa_date,
                  type: "Head QA",
                  note: res.data.data[0]?.qa_remark,
                  name: res.data.data[0]?.qa_name,
                  amount: res.data?.data[0]?.amount,
                  status: res.data.data[0]?.qa_status,
                  weight: "60",
                  ipAddress: res.data.data[0]?.qa_ip_address
                },
                {
                  date: res.data.data[0]?.hr_date,
                  type: "Human Resources",
                  note: res.data.data[0]?.hr_remark,
                  name: res.data.data[0]?.hr_name,
                  status: res.data.data[0]?.hr_status,
                  weight: "80",
                  ipAddress: res.data.data[0]?.hr_ip_address
                },
                {
                  date: res.data.data[0]?.finance_date,
                  type: "Finance",
                  note: res.data.data[0]?.finance_remark,
                  name: res.data.data[0]?.finance_name,
                  status: res.data.data[0]?.finance_status,
                  weight: "100",
                  ipAddress: res.data.data[0]?.finance_ip_address
                },
              ];
            }
            setTimeLineList(timeLineLists);
          }
        };
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
  }

  return (
    <>
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
                  {employeeDetail?.gender == "M" && (
                    employeeImageUrl ? <img
                      src={employeeImageUrl}
                      alt={`${employeeDetail?.employee_name} image`}
                      style={{ width: "70px", height: "66px" }}
                    /> :
                      <img src={userImage} style={{ width: "80px", height: "66px" }} />

                  )}
                  {employeeDetail?.gender == "F" && (
                    employeeImageUrl ? <img
                      src={employeeImageUrl}
                      alt={`${employeeDetail?.employee_name} image`}
                      style={{ width: "80px", height: "66px" }}
                    /> :
                      <img src={femaleImage} style={{ width: "80px", height: "66px" }} />
                  )}
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
                            <Grid xs={5}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Faculty Name :
                              </Typography>
                            </Grid>
                            <Grid xs={7}>
                              <Typography sx={{ wordWrap: "break-word" }}>
                                {employeeDetail?.employee_name}
                              </Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <Grid container style={{ display: "flex" }}>
                            <Grid xs={employeeDetail?.dept_name?.length > 25 ? 5 : 6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Employee Code :
                              </Typography>
                            </Grid>
                            <Grid xs={employeeDetail?.dept_name?.length > 25 ? 7 : 6}>
                              <Typography>{employeeDetail?.empcode}</Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <Grid container style={{ display: "flex" }}>
                            <Grid xs={employeeDetail?.dept_name?.length > 25 ? 5 : 4}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Designation :
                              </Typography>
                            </Grid>
                            <Grid xs={employeeDetail?.dept_name?.length > 25 ? 7 : 8}>
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
                          <Grid container style={{ display: "flex" }}>
                            <Grid xs={5}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Exp at Acharya :
                              </Typography>
                            </Grid>
                            <Grid xs={7}>
                              <Typography>
                                {employeeDetail?.experience}
                              </Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <Grid container style={{ display: "flex" }}>
                            <Grid xs={employeeDetail?.dept_name?.length > 25 ? 5 : 6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Department :
                              </Typography>
                            </Grid>
                            <Grid xs={employeeDetail?.dept_name?.length > 25 ? 7 : 6}>
                              <Typography>
                                {employeeDetail?.dept_name}
                              </Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid lightgray" }}
                          component="th"
                          scope="row"
                        >
                          <Grid container style={{ display: "flex" }}>
                            <Grid xs={4}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Phone :
                              </Typography>
                            </Grid>
                            <Grid xs={8}>
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
                  variant="body1"
                  fontSize="14px"
                  sx={{ textAlign: "justify" }}
                >
                  Dear Sir/Madam,
                  <br></br>
                  <br></br>
                  I hereby request the approval of an incentive as applicable under the {" "}{location.state?.tabName.charAt(0).toUpperCase() + location.state?.tabName.slice(1).toLowerCase()}{" "} Division,{" "}details given below.
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Book Title :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.book_title}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>

                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Author :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Published :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.publisher}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid conatiner style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Published Year :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  ISBN No. :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.isbn_number}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  DOI :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.doi}
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
                            width="50%"
                          >
                            <Grid container>
                              <Grid
                                xs={4}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Unit :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography>
                                  {location.state.rowData?.unit}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          ></TableCell>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Type :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.Type}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Journal Name :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
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
                            width="50%"
                          >
                            <Grid style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Date :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.date}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Volume :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Issue No. :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.issue_number}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Paper Title :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
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
                            width="50%"
                          >
                            <Grid style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Paper Number :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {location.state.rowData?.page_number}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  ISSN :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.issn}
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  ISSN Type :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.issn_type}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          ></TableCell>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Conference Type :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.conference_type}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Paper Type :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Conference :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.conference_name}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Paper Title :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  City :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  From Date :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  To Date :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Organiser :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.organiser}
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Presentation Type :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {location.state.rowData?.presentation_type}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          ></TableCell>
                        </TableRow>
                      </TableBody>
                    )}

                    {location.state?.tabName == "MEMBERSHIP" && (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Membership Type :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.membership_type}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>

                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Professional Body/Society :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.professional_body}
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Membership ID :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.member_id}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid conatiner style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Membership Citation :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.citation}
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Year of Joining :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.year}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Nature of Membership :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.nature_of_membership}
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid
                                xs={4}
                              >
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Priority :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {location.state.rowData?.priority}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          ></TableCell>
                        </TableRow>
                      </TableBody>
                    )}

                    {location.state?.tabName == "GRANT" && (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Title of the project :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography>
                                  {" "}
                                  {location.state.rowData?.title}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>

                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Funding Agency :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.funding}
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Name of the funding agency :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.funding_name}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid conatiner style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Sanction Amount :
                                </Typography>
                              </Grid>
                              <Grid xs={8} sx={{ wordWrap: "break-word" }}>
                                <Typography>
                                  {" "}
                                  {location.state.rowData?.sanction_amount}
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Tenure :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.tenure}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Principal Investigator :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.pi}
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid
                                xs={4}
                              >
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Copi :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {location.state.rowData?.co_pi}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          ></TableCell>
                        </TableRow>
                      </TableBody>
                    )}

                    {location.state?.tabName == "PATENT" && (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  National / International :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.patent_name}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>

                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Patent Title :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.patent_title}
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Reference No. :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.reference_number}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid conatiner style={{ display: "flex" }}>
                              <Grid xs={4}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Publication Status :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography sx={{ wordWrap: "break-word" }}>
                                  {" "}
                                  {location.state.rowData?.publication_status}
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

              <Grid mt={1} mb={2} xs={10}>
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
                          <Typography variant="body1"
                            fontSize="14px"
                            sx={{ textAlign: "justify" }}>
                            <b> Declaration :</b><br></br><br></br>
                            I here by affirm that the information provided above is true and correct to the best of my knowledge.
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            border: "1px solid lightgray",
                            paddingTop: "20px",
                            overflow: "hidden"
                          }}
                          component="th"
                          scope="row"
                        >
                          {timeLineList && timeLineList.map((ele, index) => (
                            <Grid container sx={{ display: "flex", alignItems: "center" }}>
                              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                <img
                                  src={rightCursor}
                                  alt="rightCursor"
                                  width="22px"
                                />
                                <Timeline sx={{
                                  padding: "0px",
                                  [`& .${timelineItemClasses.root}:before`]: {
                                    flex: 0,
                                    padding: 0
                                  },
                                }}>
                                  <TimelineItem>
                                    <TimelineSeparator>
                                      {!ele?.note && <TimelineDot color="error" width="50px" height="50px">
                                        <Typography sx={{ color: "white" }}>{ele.weight}</Typography>
                                      </TimelineDot>}
                                      {ele.weight ? <TimelineDot color="success">
                                        <Typography sx={{ color: "white" }}>{ele.weight}</Typography>
                                      </TimelineDot> :
                                        <TimelineDot color="success">
                                          <CheckCircleIcon color="white" />
                                        </TimelineDot>
                                      }
                                      {index < timeLineList.length - 1 && (
                                        <TimelineConnector />
                                      )}
                                    </TimelineSeparator>
                                    <TimelineContent>
                                      <Grid container>
                                        <Grid item xs={12} sx={{ display: "flex", alignItems: "baseline" }}>
                                          <Typography
                                            sx={{ fontWeight: "500", fontSize: "13px", marginRight: "5px" }}
                                          >
                                            {`${ele.name?.toUpperCase()}`}
                                          </Typography>
                                          <Typography
                                            sx={{ fontWeight: "400", fontSize: "13px" }}
                                          >
                                            {"-"} {ele.type} {ele.date ? "-" : " "}  {ele.note ? ele.note : ""} {ele.type == "Head QA" ? `- ${ele.amount}` : ""} {ele.date ? `- ${moment(ele.date).format("lll")}` : ""} &nbsp; {ele.note ? <VerifiedIcon color="success" /> : ""}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: "flex", alignItems: "baseline" }}>
                                          IP address : {ele.ipAddress}
                                        </Grid>
                                      </Grid>
                                    </TimelineContent>
                                  </TimelineItem>
                                </Timeline>
                              </Grid>
                            </Grid>
                          ))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default IncentiveApplication;
