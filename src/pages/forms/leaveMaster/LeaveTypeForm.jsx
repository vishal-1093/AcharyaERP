import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useLocation, useNavigate, useParams } from "react-router";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  leaveName: "",
  shortName: "",
  type: "",
  remarks: "",
  leaveKitty: "",
  isAttachmentRequired: "",
  hrStatus: "",
};

const requiredFields = [
  "leaveName",
  "shortName",
  "type",
  "remarks",
  "isAttachmentRequired",
  "hrStatus",
];

function LeaveTypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState(null);

  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    leaveName: [values.leaveName !== ""],
    shortName: [values.shortName !== "", /[a-zA-Z]/.test(values.shortName)],
    type: [values.type !== ""],
  };

  const errorMessages = {
    leaveName: ["This field required"],
    shortName: ["This field required", "Enter Only Characters"],
    type: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/leavemaster/leavetypes/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Leave Master", link: "/LeaveMaster/LeaveType" },
        { name: "Leave Type" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getLeaveTypeData();
    }
  }, [pathname]);

  const getLeaveTypeData = async () => {
    await axios
      .get(`/api/LeaveType/${id}`)
      .then((res) => {
        setValues({
          leaveName: res.data.data.leave_type,
          shortName: res.data.data.leave_type_short,
          type: res.data.data.type,
          leaveKitty:
            res.data.data.is_attendance === true
              ? "yes"
              : res.data.data.is_attendance === false
              ? "no"
              : "",
          isAttachmentRequired:
            res.data.data.leave_type_attachment_required === true
              ? "yes"
              : res.data.data.leave_type_attachment_required === false
              ? "no"
              : "",
          hrStatus:
            res.data.data.hr_initialization_status === true
              ? "yes"
              : res.data.data.hr_initialization_status === false
              ? "no"
              : "",
          remarks: res.data.data.remarks,
        });

        setCrumbs([
          { name: "Leave Master", link: "/LeaveMaster/LeaveType" },
          { name: "Leave Type" },
          { name: "Update" },
          { name: res.data.data.leave_type },
        ]);

        setLeaveTypeId(res.data.data.leave_id);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.leave_type = values.leaveName;
      temp.leave_type_short = values.shortName;
      temp.type = values.type;
      temp.remarks = values.remarks;
      temp.is_attendance =
        values.leaveKitty === "yes"
          ? true
          : values.leaveKitty === "no"
          ? false
          : "";
      temp.leave_type_attachment_required =
        values.isAttachmentRequired === "yes"
          ? true
          : values.isAttachmentRequired === "no"
          ? false
          : "";
      temp.hr_initialization_status =
        values.hrStatus === "yes"
          ? true
          : values.hrStatus === "no"
          ? false
          : "";

      await axios
        .post(`/api/LeaveType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            // Document upload commented as of now not required - 04/10/2023
            // const dataArray = new FormData();
            // dataArray.append("file", values.coverLetter);
            // dataArray.append("leave_id", res.data.data.leave_id);

            // axios
            //   .post(`/api/leaveTypeUploadFile`, dataArray)
            //   .then((res) => {})
            //   .catch((err) => console.error(err));
            navigate("/LeaveMaster/LeaveType", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Leave created successfully !!",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.leave_id = leaveTypeId;
      temp.leave_type_short = values.shortName;
      temp.leave_type = values.leaveName;
      temp.type = values.type;
      temp.is_attendance =
        values.leaveKitty === "yes"
          ? true
          : values.leaveKitty === "no"
          ? false
          : "";
      temp.leave_type_attachment_required =
        values.isAttachmentRequired === "yes"
          ? true
          : values.isAttachmentRequired === "no"
          ? false
          : "";
      temp.hr_initialization_status =
        values.hrStatus === "yes"
          ? true
          : values.hrStatus === "no"
          ? false
          : "";
      temp.remarks = values.remarks;

      await axios
        .put(`/api/LeaveType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/LeaveMaster/LeaveType", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <FormWrapper>
      <Box>
        <Grid container rowSpacing={4} columnSpacing={4}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="leaveName"
              label="Leave Name"
              value={values.leaveName}
              handleChange={handleChange}
              checks={checks.leaveName}
              errors={errorMessages.leaveName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              inputProps={{
                style: { textTransform: "uppercase" },
                minLength: 1,
                maxLength: 2,
              }}
              handleChange={handleChange}
              checks={checks.shortName}
              errors={errorMessages.shortName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="type"
              label="Type"
              value={values.type}
              items={[
                { value: "Leave", label: "Leave" },
                { value: "Holiday", label: "Holiday" },
                { value: "Attendence", label: "Attendence" },
              ]}
              handleChange={handleChange}
              checks={checks.type}
              errors={errorMessages.type}
              required
            />
          </Grid>

          {values.type === "Leave" ? (
            <Grid item xs={12} md={4}>
              <CustomRadioButtons
                name="leaveKitty"
                label="Leave Kitty"
                value={values.leaveKitty}
                items={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="isAttachmentRequired"
              label="Is Attachment Required"
              value={values.isAttachmentRequired}
              items={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="hrStatus"
              label="HR Status"
              value={values.hrStatus}
              items={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
              multiline
              rows={2}
              required
            />
          </Grid>

          {/* {isNew ? (
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="coverLetter"
                label="coverLetter"
                helperText="PDF - smaller than 2 MB"
                file={values.coverLetter}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
              />
            </Grid>
          ) : (
            <></>
          )} */}

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              disabled={loading}
              onClick={isNew ? handleCreate : handleUpdate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <Typography variant="subtitle2">
                  {isNew ? "Create" : "Update"}
                </Typography>
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </FormWrapper>
  );
}

export default LeaveTypeForm;
