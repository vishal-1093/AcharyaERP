import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import moment from "moment";

const initialValues = {
  schoolId: null,
  type: "",
  fromDate: null,
  toDate: null,
  voucherId: [],
  programId: [],
  amount: "",
  remarks: "",
  fixedStatus: "No",
  externalStatus: "No",
  fileName: "",
  userId: [],
};

const requiredFields = ["schoolId", "type"];

function FeePaymentWindow() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [deptId, setDeptId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [voucherHeadOptions, setVoucherHeadOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    amount: [values.amount !== ""],
    remarks: [values.remarks !== ""],
    userId: [values.userId !== null],
    fileName: [
      values.fileName,
      values.fileName && values.fileName.name.endsWith(".pdf"),
      values.fileName && values.fileName.size < 2000000,
    ],
  };

  const errorMessages = {
    amount: ["This field required"],
    remarks: ["This field required"],
    userId: ["This field is required"],
    fileName: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getSchoolDetails();
    getVoucherHeadData();
    getProgramData();
    getUsers();
    if (pathname.toLowerCase() === "/fee-payment-window") {
      setIsNew(true);
      setCrumbs([{ name: "Fee Payment Window" }]);
    } else {
      setIsNew(false);
      getDepartmentData();
    }
  }, [pathname]);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name,
            school_name_short: obj.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getVoucherHeadData = async () => {
    await axios
      .get(`/api/finance/VoucherHeadNew`)
      .then((res) => {
        const voucherData = res.data.data.filter(
          (obj) => obj.voucher_type === "inflow"
        );

        setVoucherHeadOptions(
          voucherData.map((obj) => ({
            value: obj.voucher_head_new_id,
            label: obj.voucher_head,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    await axios
      .get(`/api/academic/Program`)
      .then((res) => {
        setProgramOptions(
          res.data.data.map((obj) => ({
            value: obj.program_id,
            label: obj.program_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getUsers = async () => {
    await axios
      .get(`/api/staffUserDetails`)
      .then((res) => {
        console.log(res);

        setUserOptions(
          res.data.data
            .filter((item) => item.usertype.toLowerCase() === "staff")
            .map((obj) => ({
              value: obj.id,
              label: obj.username,
            }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentData = async () => {
    await axios
      .get(`/api/dept/${id}`)
      .then((res) => {
        setValues({
          deptName: res.data.data.dept_name,
          deptShortName: res.data.data.dept_name_short,
          webStatus: res.data.data.web_status,
          commonService:
            res.data.data.common_service === true
              ? "yes"
              : res.data.data.common_service === false
              ? "no"
              : "",
          noDue:
            res.data.data.no_dues_status === true
              ? "yes"
              : res.data.data.no_dues_status === false
              ? "no"
              : "",
          iconName: res.data.data.dept_icon,
          comments: res.data.data.comments,
          hodId: res.data.data.hod_id,
        });
        setDeptId(res.data.data.dept_id);
        setCrumbs([
          { name: "Academic Master", link: "/AcademicMaster/Department" },
          { name: "Department" },
          { name: "Update" },
          { name: res.data.data.dept_name },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
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

  const handleCreate = async (e) => {
    try {
      if (!requiredFieldsValid()) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all fields",
        });
        setAlertOpen(true);
      } else {
        const payload = {
          active: true,
          school_id: values.schoolId,
          window_type: values.type,
          from_date: values.fromDate,
          to_date: values.toDate,
          voucher_head_new_id: values.voucherId.toString(),
          amount: Number(values.amount),
          remarks: values.remarks,
          fixed: values.fixedStatus === "Yes" ? true : false,
          external_status: values.externalStatus === "Yes" ? true : false,
          user_id: values.userId.toString(),
          program_id: values.programId.toString(),
        };
        setLoading(true);
        const res = await axios.post(`/api/finance/feePaymentWindow`, payload);

        if (
          res.status === 200 ||
          (res.status === 201 && values.type === "BULK")
        ) {
          const dataArray = new FormData();
          dataArray.append(
            "fee_payment_window_id",
            res.data.data.fee_payment_window_id
          );
          dataArray.append("multipartFile", values.fileName);

          const pdfResponse = await axios.post(
            `/api/finance/feePaymentWindowUploadFile`,
            dataArray
          );

          if (pdfResponse.status === 200 || pdfResponse.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Created Successfully",
            });
            setAlertOpen(true);
            setLoading(false);
            navigate("/fee-payment-window-index");
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        } else if (
          res.status === 200 ||
          (res.status === 201 && values.type === "EXAM")
        ) {
          setAlertMessage({
            severity: "success",
            message: "Created Successfully",
          });
          setAlertOpen(true);
          setLoading(false);
          navigate("/fee-payment-window-index");
        }
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error",
      });
      setAlertOpen(true);
    }
  };

  const handleUpdate = async (e) => {
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
      temp.dept_id = deptId;
      temp.dept_name = values.deptName;
      temp.dept_name_short = values.deptShortName;
      temp.web_status = values.webStatus;
      temp.common_service =
        values.commonService === "yes"
          ? true
          : values.commonService === "no"
          ? false
          : "";
      temp.no_dues_status =
        values.noDue === "yes" ? true : values.noDue === "no" ? false : "";
      temp.dept_icon = values.iconName;
      temp.comments = values.comments;
      temp.hod_id = values.hodId;

      await axios
        .put(`/api/dept/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Department updated successfully !!",
            });
            navigate("/AcademicMaster/Department", { replace: true });
          } else {
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
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomSelect
              name="type"
              label="Type"
              value={values.type}
              handleChange={handleChange}
              items={[
                { label: "BULK", value: "BULK" },
                { label: "EXAM", value: "EXAM" },
              ]}
            />
          </Grid>

          {values.type !== "" && (
            <>
              <Grid item xs={12} md={3}>
                <CustomDatePicker
                  name="fromDate"
                  label="From Date"
                  value={values.fromDate}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.fromDate}
                  errors={errorMessages.fromDate}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomDatePicker
                  name="toDate"
                  label="To Date"
                  value={values.toDate}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.toDate}
                  errors={errorMessages.toDate}
                  minDate={values.fromDate}
                  required
                />
              </Grid>
            </>
          )}

          {values.type === "EXAM" && (
            <>
              <Grid item xs={12} md={3}>
                <CustomMultipleAutocomplete
                  name="voucherId"
                  label="Fee Heads"
                  value={values.voucherId}
                  options={voucherHeadOptions}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomMultipleAutocomplete
                  name="programId"
                  label="Program"
                  value={values.programId}
                  options={programOptions}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>
            </>
          )}

          {values.type === "BULK" && (
            <>
              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  name="voucherId"
                  label="Fee Heads"
                  value={values.voucherId}
                  options={voucherHeadOptions}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="amount"
                  label="Amount"
                  value={values.amount}
                  handleChange={handleChange}
                  fullWidth
                  errors={errorMessages.amount}
                  checks={checks.amount}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <CustomTextField
                  rows={2}
                  multiline
                  name="remarks"
                  label="Remarks"
                  value={values.remarks}
                  handleChange={handleChange}
                  fullWidth
                  errors={errorMessages.remarks}
                  checks={checks.remarks}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <CustomRadioButtons
                  name="fixedStatus"
                  label="Fixed"
                  value={values.fixedStatus}
                  items={[
                    {
                      value: "Yes",
                      label: "Yes",
                    },
                    {
                      value: "No",
                      label: "No",
                    },
                  ]}
                  handleChange={handleChange}
                  errors={errorMessages.fixedStatus}
                  checks={checks.fixedStatus}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomRadioButtons
                  name="externalStatus"
                  label="External Status"
                  value={values.externalStatus}
                  items={[
                    {
                      value: "Yes",
                      label: "Yes",
                    },
                    {
                      value: "No",
                      label: "No",
                    },
                  ]}
                  handleChange={handleChange}
                  checks={checks.externalStatus}
                  errors={errorMessages.externalStatus}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <CustomMultipleAutocomplete
                  name="userId"
                  label="User"
                  value={values.userId}
                  options={userOptions}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <CustomFileInput
                  name="fileName"
                  label="PDF"
                  helperText="PDF - smaller than 2 MB"
                  file={values.fileName}
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                  checks={checks.fileName}
                  errors={errorMessages.fileName}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} align="right">
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

export default FeePaymentWindow;
