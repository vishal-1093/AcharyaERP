import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initialValues = {
  leaveName: "",
  shortName: "",
  type: "",
  remarks: "",
  leaveKitty: false,
  coverLetter: "",
};
const requiredFields = ["leaveName", "shortName", "type", "remarks"];

function LeaveTypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [LeaveTypeId, setLeaveTypeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
        { name: "Leave Master", link: "/LeaveMaster/LeaveTypes" },
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
          remarks: res.data.data.remarks,
          leaveKitty: res.data.data.is_attendance,
        });
        setLeaveTypeId(res.data.data.leave_id);
        setCrumbs([
          { name: "Leave Master", link: "/LeaveMaster/LeaveTypes" },
          { name: "Leave Type" },
          { name: "Update" },
          { name: res.data.data.leave_type },
        ]);
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
        message: "please fill all fields",
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
      temp.is_attendance = values.leaveKitty;

      await axios
        .post(`/api/LeaveType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            const dataArray = new FormData();
            dataArray.append("file", values.coverLetter);
            dataArray.append("leave_id", res.data.data.leave_id);

            axios
              .post(`/api/leaveTypeUploadFile`, dataArray)
              .then((res) => {})
              .catch((err) => console.error(err));
            navigate("/LeaveMaster/LeaveTypes", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
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

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.leave_id = LeaveTypeId;
      temp.leave_type = values.leaveName;
      temp.leave_type_short = values.shortName;
      temp.type = values.type;
      temp.remarks = values.remarks;
      temp.is_attendance = values.leaveKitty;
      await axios
        .put(`/api/LeaveType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/LeaveMaster/LeaveTypes", { replace: true });
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
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <CustomRadioButtons
                name="leaveKitty"
                label="Leave Kitty"
                value={values.leaveKitty}
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={12} md={6}>
            <CustomTextField
              rows={2}
              multiline
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
              required
            />
          </Grid>
          {isNew ? (
            <Grid item xs={12} md={6}>
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
          )}

          <Grid item xs={12} md={6} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
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
                <strong>{isNew ? "Create" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default LeaveTypeForm;
