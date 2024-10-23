import { useState, useEffect, lazy } from "react";
import { Grid, Typography, CircularProgress } from "@mui/material";
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
import rightCursor from "../../assets/rightCursor.png";
import userImage from "../../assets/maleplaceholderimage.jpeg";
import femaleImage from "../../assets/femalePlaceholderImage.jpg";
const CustomTextField = lazy(() =>
  import("../../components/Inputs/CustomTextField")
);

const empId = sessionStorage.getItem("empId");

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  employeeDetail: [],
  modalOpen: false,
  modalContent: modalContents,
  approverList: [],
  remark: "",
  amount: null,
  loading: false,
  allApproved: false,
  isRemarkDone: false,
};

const IncentiveApplication = () => {
  const [
    {
      employeeDetail,
      modalOpen,
      modalContent,
      approverList,
      remark,
      amount,
      loading,
      allApproved,
      isRemarkDone,
    },
    setState,
  ] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCrumbs([
      { name: "AddOn Report", link: `${location.state.urlName}` },
      { name: "Incentive Application" },
    ]);
    getUserDetails(location.state?.rowData?.emp_id);
    getApproverName(location.state?.rowData?.emp_id);
    checkApprover(location.state?.rowData?.incentive_approver_id);
    checkApproverRemark(location.state?.rowData?.incentive_approver_id);
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

  const getApproverName = async (emp_id) => {
    try {
      const res = await axios.get(
        `/api/employee/getApproverDetailsData/${emp_id}`
      );
      if (res?.status == 200 || res?.status == 201) {
        let approverLists = [
          {
            employeeName: res.data.data[1]?.hodName,
            emp_id: res.data.data[1]?.emp_id,
            designation: "Hod",
          },
          {
            employeeName: res.data.data[0]?.hoiName,
            emp_id: res.data.data[0]?.emp_id,
            designation: "Hoi",
          },
          {
            employeeName: res.data.data[3]?.employee_name,
            emp_id: res.data.data[3]?.emp_id,
            designation: res.data.data[3]?.book_chapter_approver_designation,
          },
          {
            employeeName: res.data.data[6]?.employee_name,
            emp_id: res.data.data[6]?.emp_id,
            designation: res.data.data[6]?.book_chapter_approver_designation,
          },
          {
            employeeName: res.data.data[4]?.employee_name,
            emp_id: res.data.data[4]?.emp_id,
            designation: res.data.data[4]?.book_chapter_approver_designation,
          },
          {
            employeeName: res.data.data[5]?.employee_name,
            emp_id: res.data.data[5]?.emp_id,
            designation: res.data.data[5]?.book_chapter_approver_designation,
          },
          {
            employeeName: res.data.data[2]?.employee_name,
            emp_id: res.data.data[2]?.emp_id,
            designation: res.data.data[2]?.book_chapter_approver_designation,
          },
        ];
        setState((prevState) => ({
          ...prevState,
          approverList: approverLists,
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
          `/api/employee/employeeDetailsFileDownload?fileName=${photoAttachmentPath}`
        );
      }
    } catch (error) {
      console.log("imageError", error);
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

  const handleLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const getIncentiveApproverData = async () => {
    try {
      const res = await axios.get(
        `/api/employee/getIncentiveApprover/${location.state.rowData?.incentive_approver_id}`
      );
      if (res.status == 200 || res.status == 201) {
        return res.data.data;
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      handleLoading(false);
      setAlertOpen(true);
    }
  };

  const checkApprover = async (incentive_approver_id) => {
    try {
      const isFinance =
        approverList.find((ele) => ele.emp_id == empId)?.designation ==
        "Finance";
      if (!!isFinance) {
        const res = await axios.get(
          `api/employee/checkIncentiveApprover/${incentive_approver_id}`
        );
        if (res.status == 200 || res.status == 201) {
          setState((prevState) => ({
            ...prevState,
            allApproved: true,
          }));
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      handleLoading(false);
      setAlertOpen(true);
    }
  };

  const checkApproverRemark = async (incentive_approver_id) => {
    try {
      if (!!incentive_approver_id) {
        const res = await axios.get(
          `api/employee/checkIncentiveApproverRemarks/${incentive_approver_id}`
        );
        if (res.status == 200 || res.status == 201) {
          setState((prevState) => ({
            ...prevState,
            isRemarkDone: res.data.map((ele) => +ele.Emp_id)?.includes(+empId),
          }));
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      handleLoading(false);
      setAlertOpen(true);
    }
  };

  const handleSubmit = () => {
    setModalOpen(true);
    const handleToggle = async () => {
      let payload = {};
      if (!!location.state.rowData?.incentive_approver_id) {
        const incentiveApproverData = await getIncentiveApproverData();
        if (!!incentiveApproverData) {
          payload = {
            emp_id: location.state.rowData?.emp_id || null,
            hod_id:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Hod"
                ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
                : incentiveApproverData.hod_id,
            hoi_id:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Hoi"
                ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
                : incentiveApproverData.hoi_id,
            dean_id:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Dean Research & Development"
                ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
                : incentiveApproverData.dean_id,
            asst_dir_id:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Assistant Director Research & Development"
                ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
                : incentiveApproverData.asst_dir_id,
            qa_id:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Head QA"
                ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
                : incentiveApproverData.qa_id,
            hr_id:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Human Resource"
                ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
                : incentiveApproverData.hr_id,
            finance_id:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Finance"
                ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
                : incentiveApproverData.finance_id,
            publications_id:
              location.state.tabName == "PUBLICATION"
                ? location.state.rowData?.id
                : incentiveApproverData.publications_id,
            conferences_id:
              location.state.tabName == "CONFERENCE"
                ? location.state.rowData?.id
                : incentiveApproverData.conferences_id,
            book_chapter_id:
              location.state.tabName == "BOOK CHAPTER"
                ? location.state.rowData?.id
                : incentiveApproverData.book_chapter_id,
            membership_id:
              location.state.tabName == "MEMBERSHIP"
                ? location.state.rowData?.id
                : incentiveApproverData.membership_id,
            grant_id:
              location.state.tabName == "GRANT"
                ? location.state.rowData?.id
                : incentiveApproverData.grant_id,
            patent_id:
              location.state.tabName == "PATENT"
                ? location.state.rowData?.id
                : incentiveApproverData.patent_id,
            remark: null,
            date: null,
            amount: amount || incentiveApproverData.amount,
            hoi_remark:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Hoi"
                ? remark
                : incentiveApproverData.hoi_remark,
            hod_remark:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Hod"
                ? remark
                : incentiveApproverData.hod_remark,
            dean_remark:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Dean Research & Development"
                ? remark
                : incentiveApproverData.dean_remark,
            asst_dir_remark:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Assistant Director Research & Development"
                ? remark
                : incentiveApproverData.asst_dir_remark,
            qa_remark:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Head QA"
                ? remark
                : incentiveApproverData.qa_remark,
            hr_remark:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Human Resource"
                ? remark
                : incentiveApproverData.hr_remark,
            finance_remark:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Finance"
                ? remark
                : incentiveApproverData.finance_remark,
            hoi_date:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Hoi"
                ? new Date()
                : incentiveApproverData.hoi_date,
            hod_date:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Hod"
                ? new Date()
                : incentiveApproverData.hod_date,
            dean_date:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Dean Research & Development"
                ? new Date()
                : incentiveApproverData.dean_date,
            asst_dir_date:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Assistant Director Research & Development"
                ? new Date()
                : incentiveApproverData.asst_dir_date,
            qa_date:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Head QA"
                ? new Date()
                : incentiveApproverData.qa_date,
            hr_date:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Human Resource"
                ? new Date()
                : incentiveApproverData.hr_date,
            finance_date:
              approverList.find((ele) => ele.emp_id == empId)?.designation ==
              "Finance"
                ? new Date()
                : incentiveApproverData.finance_date,
            active: true,
          };
        }
      } else {
        payload = {
          emp_id: location.state.rowData?.emp_id || null,
          hod_id:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Hod"
              ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
              : null,
          hoi_id:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Hoi"
              ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
              : null,
          dean_id:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Dean Research & Development"
              ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
              : null,
          asst_dir_id:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Assistant Director Research & Development"
              ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
              : null,
          qa_id:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Head QA"
              ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
              : null,
          hr_id:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Human Resource"
              ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
              : null,
          finance_id:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Finance"
              ? approverList.find((ele) => ele.emp_id == empId)?.emp_id
              : null,
          publications_id:
            location.state.tabName == "PUBLICATION"
              ? location.state.rowData?.id
              : null,
          conferences_id:
            location.state.tabName == "CONFERENCE"
              ? location.state.rowData?.id
              : null,
          book_chapter_id:
            location.state.tabName == "BOOK CHAPTER"
              ? location.state.rowData?.id
              : null,
          membership_id:
            location.state.tabName == "MEMBERSHIP"
              ? location.state.rowData?.id
              : null,
          grant_id:
            location.state.tabName == "GRANT"
              ? location.state.rowData?.id
              : null,
          patent_id:
            location.state.tabName == "PATENT"
              ? location.state.rowData?.id
              : null,
          remark: null,
          date: null,
          amount: amount || null,
          hoi_remark:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Hoi"
              ? remark
              : null,
          hod_remark:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Hod"
              ? remark
              : null,
          dean_remark:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Dean Research & Development"
              ? remark
              : null,
          asst_dir_remark:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Assistant Director Research & Development"
              ? remark
              : null,
          qa_remark:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Head QA"
              ? remark
              : null,
          hr_remark:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Human Resource"
              ? remark
              : null,
          finance_remark:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Finance"
              ? remark
              : null,
          hoi_date:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Hoi"
              ? new Date()
              : null,
          hod_date:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Hod"
              ? new Date()
              : null,
          dean_date:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Dean Research & Development"
              ? new Date()
              : null,
          asst_dir_date:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Assistant Director Research & Development"
              ? new Date()
              : null,
          qa_date:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Head QA"
              ? new Date()
              : null,
          hr_date:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Human Resource"
              ? new Date()
              : null,
          finance_date:
            approverList.find((ele) => ele.emp_id == empId)?.designation ==
            "Finance"
              ? new Date()
              : null,
          active: true,
        };
      }
      try {
        handleLoading(true);
        if (!location.state.rowData?.incentive_approver_id) {
          const res = await axios.post("api/employee/saveIncentiveApprover", [
            payload,
          ]);
          actionAftersubmit(res);
        } else {
          payload["incentive_approver_id"] =
            location.state.rowData?.incentive_approver_id;
          const res = await axios.put(
            `api/employee/updateIncentiveApprover/${location.state.rowData?.incentive_approver_id}`,
            payload
          );
          actionAftersubmit(res);
        }
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response
            ? error.response.data.message
            : "An error occured !!",
        });
        handleLoading(false);
        setAlertOpen(true);
      }
    };
    setModalContent("", "Do you want to approve incentive application?", [
      { name: "No", color: "primary", func: () => {} },
      { name: "Yes", color: "primary", func: handleToggle },
    ]);
  };

  const actionAftersubmit = (res) => {
    if (res.status == 201 || res.status == 200) {
      handleLoading(false);
      navigate("/approve-incentive", { replace: true });
      setAlertMessage({
        severity: "success",
        message: `Incentive application approved successfully !!`,
      });
      setAlertOpen(true);
    }
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
                  {employeeDetail?.gender == "M" && (
                    <img
                      src={userImage}
                      style={{ width: "80px", height: "66px" }}
                    />
                  )}
                  {employeeDetail?.gender == "F" && (
                    <img
                      src={femaleImage}
                      style={{ width: "80px", height: "66px" }}
                    />
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
                          <Grid container style={{ display: "flex" }}>
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
                          <Grid container style={{ display: "flex" }}>
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
                          <Grid container style={{ display: "flex" }}>
                            <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Exp at Acharya :
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography>
                                {employeeDetail?.experience}
                              </Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid lightgray" }}>
                          <Grid container style={{ display: "flex" }}>
                            <Grid xs={6}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                Department :
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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

                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid conatiner style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          >
                            <Grid container>
                              <Grid
                                xs={6}
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
                              <Grid xs={6}>
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
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid style={{ display: "flex" }}>
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
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            sx={{ border: "1px solid lightgray" }}
                            component="th"
                            scope="row"
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
                              <Grid xs={6}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  ISSN Type :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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
                          <TableCell
                            width="50%"
                            sx={{ border: "1px solid lightgray" }}
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container style={{ display: "flex" }}>
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
                            width="50%"
                          >
                            <Grid container>
                              <Grid
                                xs={3.4}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Membership Type :
                                </Typography>
                              </Grid>
                              <Grid xs={9}>
                                <Typography>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Professional Body/Society :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Membership ID :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Membership Citation :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Year of Joining :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Nature of Membership :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
                                  {" "}
                                  {location.state.rowData?.nature_of_membership}
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
                            width="50%"
                          >
                            <Grid container>
                              <Grid
                                xs={3.4}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Priority :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography>
                                  {location.state.rowData?.priority}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Title of the project :
                                </Typography>
                              </Grid>
                              <Grid xs={9}>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Funding Agency :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Name of the funding agency :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Sanction Amount :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Tenure :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Principal Investigator :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
                                  {" "}
                                  {location.state.rowData?.pi}
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
                            width="50%"
                          >
                            <Grid container>
                              <Grid
                                xs={3.4}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Copi :
                                </Typography>
                              </Grid>
                              <Grid xs={8}>
                                <Typography>
                                  {location.state.rowData?.co_pi}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
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
                              <Grid xs={6}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  National / International :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={6}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Patent Title :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={6}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Reference No. :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                              <Grid xs={6}>
                                <Typography
                                  sx={{ fontWeight: "500", fontSize: "13px" }}
                                >
                                  Publication Status :
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography>
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
                          sx={{
                            border: "1px solid lightgray",
                            paddingTop: "20px",
                          }}
                          component="th"
                          scope="row"
                        >
                          <Grid container>
                            <Grid xs={0.5}>
                              <img
                                src={rightCursor}
                                alt="rightCursor"
                                width="22px"
                              />
                            </Grid>
                            <Grid xs={11} sx={{ display: "flex", gap: "10px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                {`${approverList[0]?.employeeName?.toUpperCase()}`}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: "400", fontSize: "13px" }}
                              >
                                {"-"} Head Of Department
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container mt={1}>
                            <Grid xs={0.5}>
                              <img
                                src={rightCursor}
                                alt="rightCursor"
                                width="22px"
                              />
                            </Grid>
                            <Grid xs={11} sx={{ display: "flex", gap: "10px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                {`${approverList[1]?.employeeName?.toUpperCase()}`}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: "400", fontSize: "13px" }}
                              >
                                {"-"} Reporting Manager 1
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid container mt={1}>
                            <Grid xs={0.5}>
                              <img
                                src={rightCursor}
                                alt="rightCursor"
                                width="22px"
                              />
                            </Grid>
                            <Grid xs={11} sx={{ display: "flex", gap: "10px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                {`${approverList[2]?.employeeName?.toUpperCase()}`}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: "400", fontSize: "13px" }}
                              >
                                {"-"} Dean Research & Development
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container mt={1}>
                            <Grid xs={0.5}>
                              <img
                                src={rightCursor}
                                alt="rightCursor"
                                width="22px"
                              />
                            </Grid>
                            <Grid xs={11} sx={{ display: "flex", gap: "10px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                {`${approverList[3]?.employeeName?.toUpperCase()}`}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: "400", fontSize: "13px" }}
                              >
                                {"-"} Assistant Director Research & Development
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container mt={1}>
                            <Grid xs={0.5}>
                              <img
                                src={rightCursor}
                                alt="rightCursor"
                                width="22px"
                              />
                            </Grid>
                            <Grid xs={11} sx={{ display: "flex", gap: "10px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                {`${approverList[4]?.employeeName?.toUpperCase()}`}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: "400", fontSize: "13px" }}
                              >
                                {"-"} Head QA
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid container mt={1}>
                            <Grid xs={0.5}>
                              <img
                                src={rightCursor}
                                alt="rightCursor"
                                width="22px"
                              />
                            </Grid>
                            <Grid xs={11} sx={{ display: "flex", gap: "10px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                {`${approverList[5]?.employeeName?.toUpperCase()}`}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: "400", fontSize: "13px" }}
                              >
                                {"-"} HR
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid container mt={1}>
                            <Grid xs={0.5}>
                              <img
                                src={rightCursor}
                                alt="rightCursor"
                                width="22px"
                              />
                            </Grid>
                            <Grid xs={11} sx={{ display: "flex", gap: "10px" }}>
                              <Typography
                                sx={{ fontWeight: "500", fontSize: "13px" }}
                              >
                                {`${approverList[6]?.employeeName?.toUpperCase()}`}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: "400", fontSize: "13px" }}
                              >
                                {"-"} Finance
                              </Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              {!!location.state.isApprover && !isRemarkDone && (
                <Grid
                  mb={4}
                  xs={10}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Grid xs={6}>
                    <CustomTextField
                      name="remark"
                      label="Remarks"
                      value={remark}
                      handleChange={handleChange}
                      multiline="true"
                    />
                  </Grid>
                  {approverList.find((ele) => ele.emp_id == empId)
                    ?.designation == "Head QA" && (
                    <Grid xs={4}>
                      <CustomTextField
                        name="amount"
                        label="Amount"
                        value={amount}
                        handleChange={handleChange}
                        type="number"
                      />
                    </Grid>
                  )}
                  <Grid
                    xs={2}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      disableElevation
                      disabled={
                        !remark ||
                        (approverList.find((ele) => ele.emp_id == empId)
                          ?.designation == "Head QA" &&
                          !amount)
                      }
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="secondary"
                          style={{ margin: "2px 13px" }}
                          disabled={!!allApproved ? false : true}
                        />
                      ) : (
                        <strong>Approve</strong>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default IncentiveApplication;
