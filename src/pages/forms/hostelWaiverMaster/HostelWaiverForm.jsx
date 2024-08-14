import { useState, lazy, useEffect } from "react";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput")
);
const StudentDetails = lazy(() => import("../../../components/StudentDetails"));

const formFields = {
  acYearId: "",
  totalAmount: "",
  remarks: "",
};

const initialState = {
  auid: "",
  auidValue: "",
  formField: formFields,
  academicYearList: [],
  loading: false,
  hwLoading: false,
  studentDetail: null,
};

const requiredFields = ["acYearId", "totalAmount", "remarks"];

const HostelWaiverForm = () => {
  const [
    {
      auid,
      auidValue,
      formField,
      loading,
      studentDetail,
      academicYearList,
      hwLoading,
    },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    if (!!location.state) setAuidAndFormField();
    setCrumbs([
      { name: "Hostel Waiver", link: "/HostelWaiverIndex" },
      { name: !!location.state ? "Update" : "Create" },
    ]);
    getAcademicYearData();
  }, []);

  const setAuidAndFormField = () => {
    setState((prevState) => ({
      ...prevState,
      auidValue: location.state?.auid,
      formField: {
        ...prevState.formField,
        acYearId: location.state?.ac_year_id,
        totalAmount: location.state?.total_amount,
        remarks: location.state?.remarks,
      },
    }));
  };

  const checks = {
    acYearId: [formField.acYearId !== ""],
    totalAmount: [formField.totalAmount !== ""],
    hwAttachment: [formField.hwAttachment !== ""],
    remarks: [formField.remarks !== ""],
  };

  const errorMessages = {
    schoolId: ["This field required"],
    totalAmount: ["This field is required"],
    hwAttachment: ["This field is required"],
    remarks: ["This field is required"],
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeFormField = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formField: {
        ...prev.formField,
        [name]: name === "totalAmount" ? Number(value) : value,
      },
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      formField: {
        ...prev.formField,
        [name]: newValue,
      },
    }));
  };

  const handleFileDrop = (name, newFile) => {
    setState((prev) => ({
      ...prev,
      formField: {
        ...prev.formField,
        [name]: newFile,
      },
    }));
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      formField: {
        ...prev.formField,
        [name]: null,
      },
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const getStudentDetailByAuid = async () => {
    setState((prevState) => ({
      ...prevState,
      auidValue: auid,
    }));
    try {
      setLoading(true);
      const res = await axios.get(`/api/student/studentDetailsByAuid/${auid}`);
      if (res.status === 200 || res.status === 201) {
        setState((prevState) => ({
          ...prevState,
          studentDetail: res?.data?.data[0],
        }));
        setLoading(false);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "Unable to find student detail !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const getAcademicYearData = async () => {
    try {
      const res = await axios.get(`api/academic/academic_year`);
      if (res.data.status === 200 || res.data.status === 201) {
        setState((prevState) => ({
          ...prevState,
          academicYearList: res?.data?.data.map((el) => ({
            label: el.ac_year,
            value: el.ac_year_id,
          })),
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "Something went wrong in academic year !!",
      });
      setAlertOpen(true);
    }
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

  const setHwLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      hwLoading: val,
    }));
  };

  const handleFileUpload = async (hostel_waiver_id) => {
    try {
      if (!!hostel_waiver_id) {
        const hostelWaiverFile = new FormData();
        hostelWaiverFile.append("hostel_waiver_id", hostel_waiver_id);
        hostelWaiverFile.append("file", formField.hwAttachment);
        const res = await axios.post(
          "/api/finance/hostelWaiverUploadFile",
          hostelWaiverFile
        );
        if (res.status === 200 || res.status === 201) {
          setHwLoading(false);
          setAlertMessage({
            severity: "success",
            message: `Hostel waiver file uploaded successfully !!`,
          });
        }
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
      setHwLoading(false);
    }
  };

  const actionAfterResponse = (res, methodType) => {
    if (res.data.status === 200 || res.data.status === 201) {
      navigate("/HostelWaiverIndex", { replace: true });
      setAlertMessage({
        severity: "success",
        message: `Hostel waiver ${
          methodType == "update" ? "updated" : "created"
        } successfully !!`,
      });
      if (methodType == "update" && !!formField.hwAttachment) {
        handleFileUpload(res.data.data.hostel_waiver_id);
      } else {
        handleFileUpload(res.data.data.hostel_waiver_id);
      }
    } else {
      setAlertMessage({ severity: "error", message: "Error Occured" });
      setHwLoading(false);
    }
    setAlertOpen(true);
  };

  const handleCreate = async () => {
    try {
      let payload = {
        student_id: studentDetail?.student_id
          ? studentDetail?.student_id
          : location.state.student_id,
        ac_year_id: formField.acYearId,
        total_amount: formField.totalAmount,
        remarks: formField.remarks,
        active: true,
      };
      setHwLoading(true);
      if (!!location.state) {
        payload["hostel_waiver_id"] = location.state?.id;
        const res = await axios.post(
          `/api/finance/updatehostelwaiver/${location.state?.id}`,
          payload
        );
        actionAfterResponse(res, "update");
      } else {
        const res = await axios.post("api/finance/hostelwaiver", payload);
        actionAfterResponse(res, "create");
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
      setHwLoading(false);
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      {!location.state && (
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="auid"
              label="Auid"
              value={auid}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !auid}
              onClick={getStudentDetailByAuid}
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
      )}

      {!!auidValue && (
        <div style={{ marginTop: "20px" }}>
          <StudentDetails id={auidValue} />
        </div>
      )}

      {!!auidValue && (
        <div style={{ marginTop: "20px" }}>
          <FormWrapper>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
              <Grid item xs={12} md={2}>
                <CustomAutocomplete
                  name="acYearId"
                  label="Academic Year"
                  value={formField.acYearId}
                  options={academicYearList}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.acYearId}
                  errors={errorMessages.acYearId}
                  disabled={!!location.state}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <CustomTextField
                  name="totalAmount"
                  label="Total Amount"
                  value={formField.totalAmount}
                  handleChange={handleChangeFormField}
                  checks={checks.totalAmount}
                  errors={errorMessages.totalAmount}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="remarks"
                  label="Remarks"
                  value={formField.remarks}
                  handleChange={handleChangeFormField}
                  checks={checks.remarks}
                  errors={errorMessages.remarks}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomFileInput
                  name="hwAttachment"
                  label="Pdf File Attachment"
                  helperText="PDF - smaller than 2 MB"
                  file={formField.hwAttachment}
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                  required
                />
              </Grid>
              <Grid item xs={12} align="right">
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  disabled={
                    hwLoading ||
                    !requiredFieldsValid() ||
                    (!location.state && !formField.hwAttachment) ||
                    (!!location.state && !location.state?.hw_attachment_path)
                  }
                  onClick={handleCreate}
                >
                  {hwLoading ? (
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
        </div>
      )}
    </Box>
  );
};

export default HostelWaiverForm;
