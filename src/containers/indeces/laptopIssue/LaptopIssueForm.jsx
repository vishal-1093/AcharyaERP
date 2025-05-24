import { useState, lazy, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import FormWrapper from "../../../components/FormWrapper.jsx";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput.jsx")
);

const initialState = {
  rowDetails: null,
  studentDetail: null,
  totalDue: 0,
  auid: "",
  studentName: "",
  yearSem: "",
  grnrefno: "",
  pono: "",
  sno: "",
  attachment: null,
  loading: false
};
const loggedInUser = JSON.parse(sessionStorage.getItem("AcharyaErpUser"));
const requiredAttachment = ["attachment"];

const LaptopIssueForm = () => {
  const [
    {
      rowDetails,
      studentDetail,
      totalDue,
      auid,
      studentName,
      yearSem,
      grnrefno,
      sno,
      attachment,
      loading
    },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      rowDetails: location.state,
      grnrefno: location.state?.grn_ref_no,
      sno: location.state?.serialNo
    }));
    setCrumbs([
      { name: "Laptop Issue", link: "/laptop-issue" }
    ]);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      (auid) && isIssuedOrNot()
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [auid]);

  const isIssuedOrNot = async () => {
    try {
      const res = await axios.get(`/api/student/checkAuidForLaptop/${auid}`);
      if(res.status == 200 || res.status == 201){
        getStudentDetail()
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: `Laptop is already issued to this ${auid} !!`,
      });
      setAlertOpen(true);
    }
  };

  const getStudentDetail = async () => {
    try {
      const res = await axios.get(`/api/student/studentDetailsByAuid/${auid}`);
      if (res.status == 200 || res.status == 201) {
        if (res.data.data[0]) {
          setState((prevState) => ({
            ...prevState,
            studentDetail: res.data.data[0],
            studentName: res.data.data[0]?.student_name || "",
            yearSem: `${res.data.data[0]?.current_year}/${res.data.data[0]?.current_sem}` || ""
          }));
          (res.data.data[0]?.student_id) && getStudentDue(res.data.data[0].student_id);
        } else {
          setAlertMessage({
            severity: "error",
            message: "No student detail found !!",
          });
          setAlertOpen(true);
        }
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

  const getStudentDue = async (studentId) => {
    try {
      const res = await axios.get(`/api/student/getDueAmountForLaptop/${studentId}`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          totalDue: res.data.data.totalDue
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

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  const handleFileDrop = (name, newFile) => {
    setState((prev) => ({
      ...prev,
      [name]: newFile,
    }));
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const errorAttachmentMessages = {
    attachment: [
      "This field is required",
      "Please upload a PDF || JPEG || JPG || PNG",
      "Maximum size 2 MB",
    ],
  };

  const checkAttachment = {
    attachment: [
      attachment !== "",
      attachment?.name?.endsWith(".pdf") ||
      attachment?.name?.endsWith(".jpeg") ||
      attachment?.name?.endsWith(".jpg") ||
      attachment?.name?.endsWith(".png"),
      attachment?.size < 2000000,
    ],
  };

   const isAttachmentValid = () => {
    for (let i = 0; i < requiredAttachment.length; i++) {
      const field = requiredAttachment[i];
      if (Object.keys(checkAttachment).includes(field)) {
        const ch = checkAttachment[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleSubmit = async () => {
      getAttachmentUploadResponse();
  };

  const getAttachmentUploadResponse = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("laptop_issue_id", rowDetails?.id)
      formData.append("file1", attachment);
      const res = await axios.post(`api/student/laptopIssueUploadFile`, formData);
      if (res.status == 200 || res.status == 201) {
        getDetailsByLaptopIssueId(rowDetails?.id);
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getDetailsByLaptopIssueId = async (laptopIssueId) => {
    try {
      const res = await axios.get(`/api/student/getLaptopIssue/${laptopIssueId}`);
      if (res.status == 200 || res.status == 201) {
        updateData(res.data.data)
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false)
    }
  };

  const updateData  = async(data) => {
    try {
      const payload = {
        "laptop_issue_id": data.laptop_issue_id,
        "student_id": studentDetail?.student_id,
        "issued_date": new Date(),
        "issued_by": loggedInUser?.userId,
        "issued_by_name": loggedInUser?.userName,
        "attachment_path": data.attachment_path,
        "attachment_type": data.attachment_type,
        "status": true,
        "serialNo": data.serialNo,
        "ac_year_id":data.ac_year_id,
        "po_ref_no":data.po_ref_no,
        "grn_ref_no": data.grn_ref_no,
        "type": data.type,
        "year_sem": studentDetail.current_sem ? studentDetail.current_sem : studentDetail.current_year,
        "active": true,
      };
      const res = await axios.put(`api/student/updateLaptopIssue/${rowDetails?.id}`, payload);
      if (res.status == 200 || res.status == 201) {
        navigate("/laptop-issue");
        setAlertMessage({
          severity: "success",
          message: "Laptop is successfully issued !!",
        });
        setAlertOpen(true);
        setLoading(false)
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false)
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="auid"
              label="Auid"
              value={auid || ""}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="studentName"
              label="Student Name"
              value={studentName || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="yearSem"
              label="Year Sem"
              value={yearSem || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="sno"
              label="Serial No."
              value={sno || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="grnrefno"
              label="GRN Ref No."
              value={grnrefno || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="totalDue"
              label="Total Due"
              value={totalDue || 0}
              type="number"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomFileInput
              name="attachment"
              label="PDF or JPEG or JPG or PNG  File Attachment"
              helperText="File Attachment - smaller than 2 MB"
              file={attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checkAttachment.attachment}
              errors={errorAttachmentMessages.attachment}
              required
            />
          </Grid>
          <Grid
            item
            align="right"
            xs={12}
            md={8}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={totalDue != 0 || !studentDetail || !attachment || !isAttachmentValid() || loading}
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
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default LaptopIssueForm;
