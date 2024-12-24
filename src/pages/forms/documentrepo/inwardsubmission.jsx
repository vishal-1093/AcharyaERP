import React, { useEffect, useState, lazy } from "react";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate } from "react-router";
import { GenerateStudentAdmissionCancellation } from "./templates/StudentAdmissionCancellation";
import { GenerateStudentAdmission } from "./templates/StudentAdmission";
import PDFPreview from "./PDFPreview";
import { GenerateJoiningOrder } from "./templates/JoiningOrder";
import { GenerateRelievingOrder } from "./templates/RelievingOrder";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput")
);

let requiredFields = ["schoolId", "groupType", "refNo"];
let requiredaAttachmentFields = ["attachment"];

const groupTypeLists = [
  { label: "Staff", value: "staff" },
  { label: "Student", value: "student" },
  { label: "Institute", value: "institute" },
];

const initialState = {
  groupType: null,
  refNo: "",
  additional: "",
  loading: false,
  attachment: null,
  schoolId: "",
  schoolList: [],
  groupTypeList: groupTypeLists
};

const OutwardCommunicationSubmission = () => {
  const [{ groupType, refNo, additional, groupTypeList, attachment, loading, schoolId, schoolList }, setState] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const [dataLoading, setDataLoading] = React.useState(false);
  const [templateList, setTemplateList] = React.useState([])
  const [selectedTemplate, setSelectedTemplate] = React.useState("Select Template")
  const [withLetterhead, setWithLetterhead] = React.useState("Yes")
  const [userData, setUserdata] = React.useState({})
  const [useridErrorText, setuserIdErrorText] = React.useState("")
  const [userIdSearchError, setUserIdSearchError] = React.useState(false)
  const [searchUserId, setSearchUserId] = React.useState("")
  const [filePath, setFilePath] = useState("")
  const [fileName, setFileName] = useState("")
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Document Repo", link: "/document-repo" },
      { name: "Inward" },
      { name: "Create" },
    ]);
    getSchoolData();
  }, []);

  const checks = {
    schoolId: [schoolId !== ""],
    groupType: [groupType !== null],
    refNo: [refNo !== ""]
  };

  const attachmentChecks = {
    attachment: [
      attachment,
      attachment && attachment.size < 2000000,
      attachment &&
      (
        attachment?.name.endsWith(".pdf") ||
        attachment?.name.endsWith(".PDF"))
    ],
  };

  const errorMessages = {
    schoolId: ["This field is required"],
    groupType: ["This field is required"],
    refNo: ["This field is required"]
  };

  const attachmentErrorMessages = {
    attachment: [
      "This field is required",
      "File should be less than 2MB",
      "Please upload pdf only",
    ],
  };

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`api/institute/getSchoolDetails`);
      if (res?.data?.data?.length) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res?.data?.data.map((el) => ({
            ...el,
            label: el.school_name,
            value: el.id,
            orgType: el.org_type,
            shortName: el.school_name_short,
          }))
        }))
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleChangeFormField = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileDrop = (name, newFile) => {
    setState((prev) => ({
      ...prev,
      [name]: newFile
    }));
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: null
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const attachmentRequiredFieldsValid = () => {
    for (let i = 0; i < requiredaAttachmentFields.length; i++) {
      const field = requiredaAttachmentFields[i];
      if (Object.keys(attachmentChecks).includes(field)) {
        const ch = attachmentChecks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    try {
      const payload = {
        group_type: groupType,
        staff_student_reference: refNo,
        contract_number: additional,
        school_id: schoolId,
        active: true,
      };
      setLoading(true);
      const res = await axios.post("/api/institute/saveDocuments", payload);
      if (res.status == 200 || res.status == 201) {
        if (attachment) {
          handleFileUpload(attachment, res.data.data.documents_id)
        } else {
          navigate("/document-repo", { replace: true });
          setAlertMessage({
            severity: "success",
            message: `Data created successfully !!`,
          });
          setAlertOpen(true);
          setLoading(false);
        }
      }
      // }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    fileAttachment,
    document_id
  ) => {
    try {
      if (!!fileAttachment) {
        const formData = new FormData();
        formData.append("documents_id", document_id);
        formData.append("file", fileAttachment);
        const res = await axios.post(
          "/api/institute/studentStaffUploadFile",
          formData
        );
        if (res.status == 200 || res.status == 201) {
          actionAfterResponse();
        }
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const actionAfterResponse = () => {
    navigate("/document-repo", { replace: true });
    setAlertMessage({
      severity: "success",
      message: `Data created successfully !!`,
    });
    setAlertOpen(true);
    setLoading(false);
  };

  return (
    <>
      {showModal && (
        <PDFPreview
          fileName={fileName}
          filePath={filePath}
          openModal={showModal}
          handleModal={setShowModal}
          templateType=""
          showDownloadButton={false}
        />
      )}
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }} sx={{ display: "flex", alignItems: "center" }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              value={schoolId}
              label="School"
              handleChangeAdvance={handleChangeAdvance}
              options={schoolList || []}
              checks={checks.schoolId}
              errors={errorMessages.schoolId}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="groupType"
              label="Category"
              value={groupType || ""}
              options={groupTypeList}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.groupType}
              errors={errorMessages.groupType}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              fullWidth
              name="refNo"
              label="Staff / Student / Doc Reference No"
              value={refNo}
              handleChange={handleChangeFormField}
              checks={checks.refNo}
              errors={errorMessages.refNo}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              fullWidth
              name="additional"
              label="Additional Info"
              value={additional}
              handleChange={handleChangeFormField}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomFileInput
              name="attachment"
              label="Pdf File Attachment"
              helperText="PDF - smaller than 2 MB"
              file={attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={attachmentChecks.attachment}
              errors={attachmentErrorMessages.attachment}
            />
          </Grid>
          <Grid item xs={12} md={5} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={!requiredFieldsValid() || (!!attachment && !attachmentRequiredFieldsValid())}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Submit</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </>
  );
}

export default OutwardCommunicationSubmission