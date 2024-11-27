import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import DatePicker from "react-multi-date-picker";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import CustomMonthYearPicker from "../../../components/Inputs/CustomMonthYearPicker";
import moment from "moment"

const initialValues = {
  complaintType: null,
  blockId: null,
  schoolId: null,
  complaintDetails: "",
  floorAndExtension: "",
  fileName: "",
  date: ""
};
const requiredFields = [
  "complaintType",
  "complaintDetails",
  "floorAndExtension",
];

function ServiceRequestDeptWise() {
  const [values, setValues] = useState(initialValues);
  const [serviceTypeOptions, setServiceTypeOtions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [isAttachment, setIsAttachment] = useState(false);
  const [deptName, setDeptName] = useState("");

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

  const checks = {
    complaintDetails: [values.complaintDetails !== ""],
    fileName: [
      values.fileName,
      values.fileName && values.fileName.size < 2000000,
      values.fileName &&
      (
        values.fileName.name.endsWith(".pdf") ||
        values.fileName.name.endsWith(".PDF"))
      || (values.fileName.name?.endsWith(".jpg") ||
        values.fileName.name?.endsWith(".JPG")) || (values.fileName.name?.endsWith(".jpeg") ||
          values.fileName.name?.endsWith(".JPEG")) || (values.fileName.name?.endsWith(".png") ||
            values.fileName.name?.endsWith(".PNG")),
    ],
  };

  const errorMessages = {
    complaintDetails: ["This field id required"],
    fileName: [
      "This filed is requied",
      "PDF should be less than 2MB",
      "Please upload pdf",
    ],
  };

  useEffect(() => {
    getBlockData();
    getServiceTypeData();
    getSchoolData();
    setCrumbs([{ name: "Service Request", link: "/ServiceRequest" }]);
  }, [pathname]);

  const getServiceTypeData = async () => {
    await axios
      .get(`/api/ServiceType/getAllServiceByDeptTag/${id}`)
      .then((res) => {
        setDeptName(res.data.data[0].dept_name);
        const serviceTypeData = [];
        res.data.data.forEach((obj) => {
          serviceTypeData.push({
            label: obj.serviceTypeName,
            value: obj.id,
            is_attachment: obj.is_attachment,
          });
        });
        setServiceTypeOtions(serviceTypeData);
      })
      .catch((err) => console.error(err));
  };

  const getBlockData = async () => {
    await axios
      .get(`/api/blocks`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.block_id,
            label: obj.block_name,
            school_id: obj.school_id,
          });
        });
        setBlockOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const SchoolData = [];
        res.data.data.forEach((obj) => {
          SchoolData.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(SchoolData);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDatePicker = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "blockId") {
      const schoolId = blockOptions.find((obj) => obj.value === newValue);
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        ["schoolId"]: schoolId?.school_id,
      }));
    }

    if (name === "complaintType") {
      const isAttachmentStatus = serviceTypeOptions.find(
        (obj) => obj.value === newValue
      );
      setIsAttachment(isAttachmentStatus);
    }
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

  const handleChangeDate = async (_, newValue) => {
    setValues((prev) => ({
      ...prev,
      ["dateValue"]: newValue,
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid() || ((values.complaintType == 1 || values.complaintType == 3)  && !values?.dateValue?.validatedValue?.length)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.floorAndExtension = values.floorAndExtension;
      temp.complaintDetails = values.complaintDetails;
      temp.attendedBy = null;
      temp.userId = userId;
      temp.date = (values.complaintType == 1 || values.complaintType == 3) ?  values?.dateValue?.validatedValue?.map(ele => moment(ele)?.format("DD-MMM-YYYY"))?.join(", ") : moment(values.date)?.format("MMM-YYYY")
      temp.serviceTypeId = values.complaintType;
      temp.complaintStage = "";
      temp.complaintStatus = "PENDING";
      temp.remarks = values.remarks;
      temp.purchaseNeed = null;
      temp.dateOfAttended = null;
      temp.complaintAttendedBy = null;
      temp.dateOfClosed = null;
      temp.instituteId = values.schoolId;
      temp.branchId = null;
      temp.blockId = values.blockId
      await axios
        .post(`/api/Maintenance`, temp)
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            if (isAttachment && values.fileName !== "") {
              setLoading(true);
              const dataArray = new FormData();
              dataArray.append("id", res.data.data.id);
              dataArray.append("file", values.fileName)
              await axios
                .post(`/api/Maintenance/maintenanceUploadFile`, dataArray)
                .then((res) => {
                  navigate("/ServiceRequest", { replace: true });
                });
            } else {
              setLoading(false);
              navigate("/ServiceRequest", { replace: true });
            }
            setLoading(false);
            setAlertMessage({
              severity: "success",
              message: "Service Request Created",
            });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
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
  }

  const currentDate = new Date();
  const nextDate = new Date(currentDate.getTime());
  nextDate.setHours(0, 0, 0, 0);

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="complaintType"
              label="Service Type"
              value={values.complaintType}
              options={serviceTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          {(values.complaintType == 1 || values.complaintType == 3) && <Grid item xs={12} md={3} mr={3}>
            <DatePicker
              className="blue"
              inputClass="custom-input"
              multiple={true}
              format="YYYY-MM-DD"
              name="date"
              title="Date"
              placeholder="Select Issue Date"
              value={values.date}
              onChange={handleChangeDate}
              minDate={nextDate}
              required
              plugins={[<DatePanel />]}
            />
          </Grid>}

          {(values.complaintType == 2) && <Grid item xs={12} md={3} mr={3}>
          <CustomMonthYearPicker
              name="date"
              label="Select Date"
              minDate={new Date(`${new Date().getFullYear() + 1}-01-01`)}
              value={values.date}
              handleChangeAdvance={handleDatePicker}
              required
            />
            </Grid>}

          {deptName?.toLowerCase().includes("system") ||
            deptName?.toLowerCase().includes("maintainence") ||
            deptName?.toLowerCase().includes("house keeping") ? (
            <>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="blockId"
                  label="Block"
                  value={values.blockId}
                  options={blockOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>

              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  value={values.schoolId}
                  options={schoolOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  disabled
                  required
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="complaintDetails"
              label="Service Details"
              value={values.complaintDetails}
              handleChange={handleChange}
              checks={checks.complaintDetails}
              errors={errorMessages.complaintDetails}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="floorAndExtension"
              label="Extension No."
              value={values.floorAndExtension}
              handleChange={handleChange}
            />
          </Grid>

          {isAttachment?.is_attachment ? (
            <Grid item xs={12} md={2.4}>
              <CustomFileInput
                name="fileName"
                label="PDF"
                file={values.fileName}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.fileName}
                errors={errorMessages.fileName}
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || values?.fileName?.size > 2000000}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Create"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ServiceRequestDeptWise;
