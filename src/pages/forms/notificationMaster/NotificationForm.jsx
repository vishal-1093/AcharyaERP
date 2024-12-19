import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import moment from "moment";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";


const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;
const schoolID = JSON.parse(sessionStorage.getItem("userData"))?.school_id;
const deptID = JSON.parse(sessionStorage.getItem("userData"))?.dept_id;

const initialValues = {
  schoolId: "",
  deptId: "",
  notify: "",
  notifyType: "",
  title: "",
  message: "",
  notificationDate: "",
  attachment: "",
  notifyAll: 0
};
const requiredFields = ["schoolId", "deptId", "notify", "notifyType", "title", "message", "notificationDate",];

function NotificationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [notificationId, setNotificationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const checks = {
    schoolId: [values?.schoolId !== ""],
    deptId: [values?.deptId !== ""],
    notify: [values.notify !== ""],
    notifyType: [values.notifyType !== ""],
    title: [values.title !== ""],
    message: [values.message !== ""],
    notificationDate: [values.notificationDate !== ""],
    attachment: [
      values.attachment !== "",
      values.attachment &&
      values.attachment?.name &&
      values.attachment &&
      values.attachment?.size < 2000000,
    ],
  };

  const errorMessages = {
    schoolId: ["This field required"],
    deptId: ["This field required"],
    notify: ["This field required"],
    notifyType: ["This field required"],
    title: ["This field required"],
    message: ["This field is required",
      "Must not be longer than 200 characters",],
    notificationDate: ["This field required"],
    attachment: [
      "This field required",
      "Maximum size 2 MB",
    ],
  };
  console.log(values, "values");

  useEffect(() => {
    if (roleShortName !== "SAA") {
      setValues((prev) => ({
        ...prev,
        schoolId: [schoolID],
        deptId: [deptID],
      }));
    }
    if (pathname.toLowerCase() === "/notificationmaster/notification/new") {
      setIsNew(true);
      setCrumbs([
        { name: "NotificationMaster", link: "/NotificationMaster/Notification" },
        { name: "Notification" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getNotificationData();
    }
    getSchoolName()
  }, [pathname]);

  useEffect(() => {
    getDepartmentName();
  }, [values.schoolId]);

  const getSchoolName = async () => {
    await axios
      .get("/api/institute/school")
      .then((res) => {
        setSchoolOptions(
          res?.data?.data?.map((object) => ({
            value: object.school_id,
            label: object.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentName = async () => {
    try {
      const schoolIds = Array.isArray(values?.schoolId)
        ? values.schoolId.join(",")
        : values?.schoolId || null;

      if (!schoolIds) {
        // If schoolIds is null or empty, set empty options and exit
        setDepartmentOptions([]);
        return;
      }

      const url = `/api/institute/getDepartmentWithSchools/${schoolIds}`;
      const response = await axios.get(url);

      setDepartmentOptions(
        response?.data?.data?.map((object) => ({
          value: object.dept_id,
          label: object.dept_school_combined,
        }))
      );
    } catch (error) {
      console.error("Error fetching department names:", error);
    }
  };


  const getNotificationData = async () => {
    try {
      const res = await axios.get(`/api/institute/getNotification/${id}`);

      const data = res.data?.data;
      console.log(data, "data");

      setValues({
        schoolId: data.school_ids.split(",").map(Number) || "",
        deptId: data.dept_ids.split(",").map(Number) || "",
        notifyAll: data.notify,
        notifyType: data.notification_type || "",
        title: data.title || "",
        message: data.description || "",
        notificationDate: new Date(data?.notification_date.split('-').reverse().join('-')),
        attachment: data.notification_attach_path || "",
        notify: data.notify_to,
      });
      setNotificationId(data?.notification_id)
      // Set breadcrumbs
      setCrumbs([
        {
          name: "NotificationMaster",
          link: "/NotificationMaster/Notification",
        },
        { name: "Notification" },
        { name: "Update" },
      ]);
    } catch (error) {
      console.error("Error fetching notification data:", error);
    }
  };


  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "notifyAll" && { deptId: "", schoolId: "" }),
    });

  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      // Skip validation for "schoolId" and "deptId"
      if (
        (field === "schoolId" && values.notifyAll == 1) ||
        (field === "deptId" && values.notifyAll == 1)
      ) {
        continue;
      }

      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) {
          if (!ch[j]) return false;
        }
      } else if (!values[field]) {
        return false;
      }
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
      return;
    }
    setLoading(true);
    const temp = {
      school_ids: values?.notifyAll == 1 ? null : values?.schoolId?.join(",") ?? null,
      dept_ids: values?.notifyAll == 1 ? null : values?.deptId?.join(",") ?? null,
      notify: values?.notifyAll,
      notify_to: values?.notify,
      notification_type: values?.notifyType,
      title: values?.title,
      description: values?.message,
      active: true,
      notification_date: moment(values?.notificationDate).format("DD-MM-YYYY"),
    };

    try {
      const notificationResponse = await axios.post(`/api/institute/notification`, temp);
      if (notificationResponse.status === 200 || notificationResponse.status === 201) {
        if (values.attachment) {
          const formData = new FormData();
          formData.append("file", values.attachment);
          formData.append("notification_id", notificationResponse.data?.data?.notification_id);

          try {
            const uploadResponse = await axios.post(`/api/institute/notificationUploadFile`, formData);

            if (uploadResponse.status === 200 || uploadResponse.status === 201) {
              navigate("/NotificationMaster/Notification", { replace: true });
              setAlertMessage({
                severity: "success",
                message: "Form Submitted Successfully!",
              });
            }
          } catch (uploadError) {
            setAlertMessage({
              severity: "error",
              message: uploadError.response?.data?.message || "File upload failed!",
            });
          }
        } else {
          navigate("/NotificationMaster/Notification", { replace: true });
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully!",
          });
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response?.data?.message || "An error occurred during submission.",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    const temp = {
      school_ids: values?.notifyAll === 1 ? null : Array.isArray(values?.schoolId) ? values.schoolId.join(",") : null,
      dept_ids: values?.notifyAll === 1 ? null : Array.isArray(values?.deptId) ? values.deptId.join(",") : null,
      notify: values?.notifyAll,
      notify_to: values?.notify,
      notification_type: values?.notifyType,
      title: values?.title,
      description: values?.message,
      active: true,
      notification_date: values?.notificationDate
        ? moment(values.notificationDate).format("DD-MM-YYYY")
        : null,
      notification_id: notificationId,
    };

    try {
      const notificationResponse = await axios.put(`/api/institute/Notifications/${notificationId}`, temp);
      if (notificationResponse.status === 200 || notificationResponse.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Form Updated Successfully!",
        });
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response?.data?.message || "An error occurred during submission.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (name, options) => {
    setValues((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value),
    }));
  };

  const handleSelectNone = (name) => {
    setValues((prev) => ({ ...prev, [name]: [] }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "schoolId" && { deptId: "" }),
    }));
  };
  const handleFileDrop = (name, newFile) => {
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
          {roleShortName === "SAA" && <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="notifyAll"
              label="Notify All"
              value={Number(values.notifyAll)}
              items={[{ value: 1, label: "Yes" }, { value: 0, label: "No" }]}
              handleChange={handleChange}
            />
          </Grid>}
          <Grid item xs={12} md={4}>
            <CheckboxAutocomplete
              name="schoolId"
              label="School"
              value={values?.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              checks={checks.schoolId}
              errors={errorMessages.schoolId}
              required
              disabled={values.notifyAll == 1 || roleShortName !== "SAA"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CheckboxAutocomplete
              name="deptId"
              label="Department"
              value={values?.deptId}
              options={departmentOptions}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              checks={checks.deptId}
              errors={errorMessages.deptId}
              disabled={values.notifyAll == 1 || roleShortName !== "SAA"}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="notify"
              label="Select Notify"
              value={values.notify || ''}
              items={[
                {
                  value: "All",
                  label: "All",
                },
                {
                  value: "Student",
                  label: "Student",
                },
                {
                  value: "Employee",
                  label: "Employee",
                },
              ]}
              required
              handleChange={handleChange}
              checks={checks.notify}
              errors={errorMessages.notify}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="notifyType"
              label="Select Notify Type"
              value={values.notifyType || ''}
              items={[
                {
                  value: 'Generic',
                  label: 'Generic',
                },
                {
                  value: 'Informative',
                  label: 'Informative',
                },
                {
                  value: 'Reminder',
                  label: 'Reminder',
                },
                {
                  value: 'Event',
                  label: 'Event',
                },
                {
                  value: 'Alert',
                  label: 'Alert',
                },
              ]}
              required
              handleChange={handleChange}
              checks={checks.notifyType}
              errors={errorMessages.notifyType}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="notificationDate"
              label="Notification Date"
              minDate={new Date()}
              value={values.notificationDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.notificationDate}
              errors={errorMessages.notificationDate}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="title"
              label="Title"
              value={values.title}
              handleChange={handleChange}
              checks={checks.title}
              errors={errorMessages.title}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2}
              label="Message"
              value={values?.message}
              name="message"
              handleChange={handleChange}
              checks={checks.message}
              errors={errorMessages.message}
              required
            />
          </Grid>
          {isNew && <Grid item xs={12} md={4} align="center">
            <CustomFileInput
              name="attachment"
              label="Attachment"
              helperText="smaller than 2 MB"
              file={values.attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checks.attachment}
              errors={errorMessages.attachment}
            />
          </Grid>}
          <Grid item xs={12} md={4}>

          </Grid>
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

export default NotificationForm;
