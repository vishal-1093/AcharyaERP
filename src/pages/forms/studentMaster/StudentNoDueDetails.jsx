import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableCell,
  tableCellClasses,
  TableBody,
  Checkbox,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StudentDetails from "../../../components/StudentDetails";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import DOCView from "../../../components/DOCView";
import Visibility from "@mui/icons-material/Visibility";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import styled from "@emotion/styled";
import moment from "moment";
import StudentFeeDetails from "../../../components/StudentFeeDetails";

const initialValues = {
  date: convertUTCtoTimeZone(new Date()),
  status: "",
  noDueAttachment: "",
  comments: "",
};

const requiredFields = ["date", "status", "noDueAttachment", "comments"];
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

function StudentNoDueDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);
  const { row } = location?.state;

  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [studentData, setStudentData] = useState({});

  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [admissionCategoryOptions, setAdmissionCategoryOptions] = useState([]);
  const [nationality, setNationality] = useState([]);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentWrapperOpen, setDocumentWrapperOpen] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [attachmentPath, setAttachmentPath] = useState("");

  const setCrumbs = useBreadcrumbs();
  const { student_id } = useParams();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const checks = {
    cocPaper: [
      values.noDueAttachment,
      values.noDueAttachment && values.noDueAttachment.name.endsWith(".pdf"),
      values.noDueAttachment && values.noDueAttachment.size < 2000000,
    ],
  };
  const cocMessages = {
    cocPaper: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };
  useEffect(() => {
    // Setting the breadcrumbs
    setCrumbs([
      { name: "Student NoDue", link: "/StudentNoDue" },
      { name: "Student NoDue Form" },
    ]);

    // Fetch required data
    getNodueOptions();
  }, []);

  const getNodueOptions = async () => {
    let nodueValues = [{
      "dept_name": "Library",
      "id": 1,
    }, {
      "dept_name": "Accounts",
      "id": 2,
    }, {
      "dept_name": "Mentor",
      "id": 3,
    }, {
      "dept_name": "Sports",
      "id": 4,
    }]
    const nodueObj = nodueValues.map((obj, i) => ({
      id: obj.id,
      name: obj.dept_name,
      submittedStatus: false,
    }));
    setValues((prev) => ({
      ...prev,
      nodue: nodueObj,
    }));
    // await axios
    //   .get("/api/allNoDuesDetails")
    //   .then((res) => {
    //     const nodueObj = res.data.data.map((obj, i) => ({
    //       id: obj.id,
    //       name: obj.dept_name,
    //       submittedStatus: false,
    //     }));

    //     setValues((prev) => ({
    //       ...prev,
    //       nodue: nodueObj,
    //     }));
    //   })
    //   .catch((err) => console.error(err));
  };

  const handleChange = async (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreateNoDue = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      //   {
      //     "student_id": 101,
      //     "dept_id": 1,
      //     "date": "07-10-2024",
      //     "status": 1,
      //     "comment": "no dues is there",
      //     "attachment_path": null,
      //     "attachment_name": null,
      //     "active":true
      // }
      // Inserting data into no due assignment table
      const nodueTemp = [];
      // values.nodue.forEach((item) => {
      // console.log(item, "item");
      nodueTemp.push({
        student_id: Number(student_id),
        date: moment(values.date).format("DD-MM-YYYY"),
        status: values.status,
        // not_applicable_status: Boolean(item?.submittedStatus),
        attachment_path: null,
        attachment_name: null,
        active: true,
        comment: values.comments,
        // dept_id: item.id,
        employee_Id: values.empId,
      });
      // });
      setLoading(true);

      await axios
        .post(`/api/student/saveStudentNoDue`, nodueTemp)
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            const documentData = new FormData();
            documentData.append("multipartFile", values?.noDueAttachment);
            documentData.append("student_id", student_id);
            setDocumentLoading(true);
            await axios
              .post(`/api/student/studentNoDueUploadFile`, documentData)
              .then((res) => {
                setLoading(false);
                setAlertMessage({
                  severity: "success",
                  message: "Student NoDue success",
                });
                setAlertOpen(true);
                navigate("/StudentNoDue", { replace: true });
              })
              .catch((err) => {
                setLoading(false);
                setAlertMessage({
                  severity: "error",
                  message: err.response ? err.response.data.message : "Error",
                });
                setAlertOpen(true);
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleChangeNodue = (e) => {
    const splitName = e.target.name.split("-");
    const field = splitName[0]; // either "submittedStatus" or "notApplicableStatus"
    const id = Number(splitName[1]);

    setValues((prev) => ({
      ...prev,
      nodue: prev.nodue.map((obj) => {
        if (obj.id === id) {
          return field === "submittedStatus"
            ? {
              ...obj,
              submittedStatus: e.target.checked ?? false, // Fallback to false
              notApplicableStatus: false, // Automatically reset
            }
            : {
              ...obj,
              submittedStatus: false, // Automatically reset
              notApplicableStatus: e.target.checked ?? false, // Fallback to false
            };
        }
        return obj;
      }),
    }));
  };

  const validateTranscript = () => {
    let status = true;

    values.nodue?.forEach((obj) => {
      // Ensure either "submittedStatus" or "notApplicableStatus" is true
      if (!obj.submittedStatus && !obj.notApplicableStatus) {
        status = false;
      }
    });

    return status;
  };

  return (
    <>
      {/* <ModalWrapper
        open={templateWrapperOpen}
        setOpen={setTemplateWrapperOpen}
        maxWidth={1200}
      >
        <>
          <DOCView
            attachmentPath={`/api/student/changeOfCourseProgramFileDownload?changeOfCourseProgramAttachmentPath=${cocDetails?.changeOfCourseProgramAttachmentPath}`}
          />
        </>
      </ModalWrapper> */}
      <Box
        sx={{
          margin: { md: "20px 60px", xs: "10px" },
          padding: { xs: "10px", md: "20px" },
        }}
      >
        <Grid container spacing={4}>
          {/* Student Details */}
          {student_id && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <StudentDetails
                  id={student_id}
                  isStudentdataAvailable={(data) => {
                    setStudentData(data);
                  }}
                />
                <StudentFeeDetails id={student_id} />
              </Box>
            </Grid>
          )}
          {/* <Grid item xs={12}>
            <StudentDetails
              id={student_id}
              isStudentdataAvailable={(data) => {
                setStudentData(data);
              }}
            />
          </Grid> */}
          <Grid item xs={12} md={12}>
            <TableContainer component={Paper} elevation={2}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>No Due Category</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Not Applicable</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {values?.nodue?.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{obj.name}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {/* Submitted Status Checkbox */}
                          <Checkbox
                            name={"submittedStatus-" + obj.id}
                            checked={obj.submittedStatus ?? false} // Provide fallback to false if undefined
                            onChange={handleChangeNodue}
                            disabled={obj.notApplicableStatus ?? false} // Ensure it's always a boolean
                            sx={{
                              color: "auzColor.main",
                              "&.Mui-checked": {
                                color: "auzColor.main",
                              },
                              padding: 0,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {/* Not Applicable Checkbox */}
                          <Checkbox
                            name={"notApplicableStatus-" + obj.id}
                            checked={obj.notApplicableStatus ?? false} // Provide fallback to false if undefined
                            onChange={handleChangeNodue}
                            disabled={obj.submittedStatus ?? false} // Ensure it's always a boolean
                            sx={{
                              color: "auzColor.main",
                              "&.Mui-checked": {
                                color: "auzColor.main",
                              },
                              padding: 0,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="date"
              label="Date"
              value={values.date}
              handleChangeAdvance={handleChangeAdvance}
              disablePast
              required
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="status"
              label="Status"
              value={values.status}
              options={[
                { value: 0, label: "Passed out - MC not taken" },
                { value: 1, label: "Passed out" },
                { value: 2, label: "NFTC" },
                { value: 3, label: "Course Completed-Degree incomplete" },
                { value: 4, label: "Inactive - Temporary" },
              ]}
              getOptionDisabled={(option) =>
                row?.total_due && (option.value === 0 || option.value === 1)
              }
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          {/* Comments */}
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="comments"
              label="Comments"
              value={values.comments}
              handleChange={handleChange}
              multiline
              rows={2}
              required
            />
          </Grid>
          {/* File Upload */}
          <Grid item xs={12} md={4}>
            <CustomFileInput
              name="noDueAttachment"
              label="NoDue Upload File"
              helperText="PDF - smaller than 2 MB"
              file={values.noDueAttachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checks.cocPaper}
              errors={cocMessages.cocPaper}
              required
            />
          </Grid>
          {/* <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              <Button
                size="small"
                startIcon={<Visibility />}
                onClick={() => setTemplateWrapperOpen(true)}
              >
                View Attachment
              </Button>
            </Typography>
          </Grid> */}
          {/* Submit Button */}
          <Grid item xs={12} textAlign="right" sx={{ marginTop: 3 }}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleCreateNoDue}
              disabled={
                loading || !requiredFieldsValid() || !validateTranscript()
              }
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Create"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default StudentNoDueDetails;
