import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import file from "../../../assets/invpayfile.csv";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";

const initialValues = {
  month: null,
  type: "",
  empId: null,
  amount: "",
  remarks: "",
  document: "",
  typeAmount: "",
};

const requiredFields = ["month", "type", "typeAmount"];

function ExtraRemuneration() {
  const [values, setValues] = useState(initialValues);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empData, setEmpData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    month: [values.month !== null],
    type: [values.type !== ""],
    empId: [values.empId !== null],
    amount: [values.amount !== "", /^[0-9]+$/.test(values.amount)],
    remarks: [values.remarks !== ""],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".csv"),
      values.document && values.document.size < 2000000,
    ],
    typeAmount: [values.typeAmount !== ""],
  };
  const errorMessages = {
    month: ["This field is required"],
    type: ["This field is required"],
    empId: ["This field is required"],
    amount: ["This field is required", "Invalid Amount"],
    remarks: ["This field is required"],
    document: [
      "This field is required",
      "Please upload a CSV",
      "Maximum size 2 MB",
    ],
    typeAmount: ["This field is required"],
  };

  useEffect(() => {
    getEmpOptions();
    setCrumbs([
      { name: "Index", link: "/ExtraRemunerationIndex" },
      { name: "Extra Remuneration" },
    ]);
  }, []);

  const getEmpOptions = async () => {
    await axios
      .get("api/employee/EmployeeDetails")
      .then((res) => {
        setEmpData(res.data.data);
        setEmployeeOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.employee_name + " - " + obj.empcode,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "type" && e.target.value === "update") {
      ["empId", "amount", "remarks"].forEach((obj) => {
        if (requiredFields.includes(obj) === false) {
          requiredFields.push(obj);
        }
      });

      if (requiredFields.includes("document") === true) {
        const getIndex = requiredFields.indexOf("document");
        requiredFields.splice(getIndex, 1);
      }
    } else if (e.target.name === "type" && e.target.value === "import") {
      ["empId", "amount", "remarks"].forEach((obj) => {
        if (requiredFields.includes(obj) === true) {
          const getIndex = requiredFields.indexOf(obj);
          requiredFields.splice(getIndex, 1);
        }
      });

      if (requiredFields.includes("document") === false) {
        requiredFields.push("document");
      }
    }
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

  const handleCreate = async () => {
    setLoading(true);
    const getMonthYear = values.month.slice(0, 7).split("-");

    if (values.type === "update") {
      const temp = {};

      const emp = empData.filter((obj) => obj.emp_id === values.empId);
      temp.employeeName = emp?.[0]?.employee_name;
      temp.empCode = emp?.[0]?.empcode;
      temp.invPay = values.amount;
      temp.month = parseInt(getMonthYear[1]);
      temp.year = parseInt(getMonthYear[0]);
      temp.remarks = values.remarks;
      temp.type = values.typeAmount;

      await axios
        .post(`/api/employee/saveInvPayDetails`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Created successfully !!",
            });
            setAlertOpen(true);
            navigate("/ExtraRemunerationIndex");
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
            setAlertOpen(true);
          }
          setLoading(false);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (values.type === "import") {
      const dataArray = new FormData();
      dataArray.append("file", values.document);
      dataArray.append("month", parseInt(getMonthYear[1]));
      dataArray.append("year", parseInt(getMonthYear[0]));

      await axios
        .post(`/api/employee/uploadInvPayFile`, dataArray)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Imported successfully !!",
            });
          } else {
            setAlertMessage({ severity: "error", message: res.data.message });
          }
          setAlertOpen(true);
          setLoading(false);
          navigate("/ExtraRemunerationIndex");
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    }
  };

  return (
    <Box>
      <FormWrapper>
        <Grid container columnSpacing={2} rowSpacing={3}>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="month"
              label="Month and Year"
              value={values.month}
              handleChangeAdvance={handleChangeAdvance}
              views={["month", "year"]}
              openTo="month"
              inputFormat="MM/YYYY"
              checks={checks.month}
              errors={errorMessages.month}
              required
            />
          </Grid>

          {values.month ? (
            <>
              <Grid item xs={12} md={4}>
                <CustomSelect
                  name="typeAmount"
                  label="Type"
                  value={values.typeAmount}
                  items={[
                    { label: "Incentives", value: "incentive" },
                    { label: "Add-On Pay", value: "import" },
                  ]}
                  handleChange={handleChange}
                  checks={checks.typeAmount}
                  errors={errorMessages.typeAmount}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomSelect
                  name="type"
                  label="Creation Type"
                  value={values.type}
                  items={[
                    { label: "Instant", value: "update" },
                    { label: "Import", value: "import" },
                  ]}
                  handleChange={handleChange}
                  checks={checks.type}
                  errors={errorMessages.type}
                  required
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          {values.type === "update" ? (
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="empId"
                    label="Employee"
                    value={values.empId}
                    options={employeeOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.empId}
                    errors={errorMessages.empId}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="amount"
                    label="Amount"
                    value={values.amount}
                    handleChange={handleChange}
                    checks={checks.amount}
                    errors={errorMessages.amount}
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
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
          ) : values.type === "import" ? (
            <Grid item xs={12}>
              <Grid container columnSpacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <CustomFileInput
                    name="document"
                    label="Document"
                    helperText="PDF - smaller than 2 MB"
                    file={values.document}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.document}
                    errors={errorMessages.document}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    href={file}
                    download="Document Format"
                  >
                    Download Format
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              disabled={loading || !requiredFieldsValid()}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <Typography variant="subtitle2">Submit</Typography>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ExtraRemuneration;
