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
      (auid) && getStudentDetail()
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [auid]);

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
      "Please upload a PDF",
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

  const getAttachmentUploadResponse = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("laptop_issue_id", rowDetails?.id)
      attachment?.name?.endsWith(".pdf") && formData.append("file", attachment);
      (attachment?.name?.endsWith(".jpeg") ||
        attachment?.name?.endsWith(".jpg") ||
        attachment?.name?.endsWith(".png") && formData.append("image_file", attachment))
      const res = await axios.post(`api/student/laptopIssueUploadFile`, formData);
      if (res.status == 200 || res.status == 201) {
        return res;
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

  const handleSubmit = async () => {
    try {
      const attachmentRes = await getAttachmentUploadResponse();
      const payload = {
        "laptop_issue_id": rowDetails?.id,
        "student_id": studentDetail?.school_id,
        "issued_date": new Date(),
        "issued_by": loggedInUser?.userId,
        "issued_by_name": loggedInUser?.userName,
        "status": true,
        "serialNo": rowDetails?.serialNo,
        "ack_date": rowDetails?.ack_date,
        "grn_ref_no": rowDetails?.grn_ref_no,
        "description": rowDetails?.description,
        "type": rowDetails?.type,
        "year_sem": studentDetail?.current_sem ? studentDetail?.current_sem : studentDetail?.current_year,
        "attachment_path": attachment?.name,
        "attachment_type": null,
        "acknowledgment_path": null,
        "acknowledgment_type": null,
        "active": true,
      };
      const res = await axios.put(`api/student/updateLaptopIssue/${rowDetails?.id}`, payload);
      if (attachmentRes && (res.status == 200 || res.status == 201)) {
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
