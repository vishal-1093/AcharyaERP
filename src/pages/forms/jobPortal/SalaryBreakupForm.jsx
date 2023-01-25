import { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import SalaryBreakupReport from "./SalaryBreakupReport";

const initialValues = {
  employeeType: "",
  schoolId: "",
  deptId: "",
  designationId: "",
  jobTypeId: "",
  consultantType: "",
  consolidatedAmount: "",
  fromDate: null,
  toDate: null,
  salaryStructureId: "",
};

const requiredFields = [
  "employeeType",
  "schoolId",
  "deptId",
  "designationId",
  "jobTypeId",
];

function SalaryBreakupForm() {
  const [values, setValues] = useState(initialValues);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeeOptions1, setEmployeeOptions1] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [jobypeOptions, setjobtypeOptions] = useState([]);
  const [salaryStructureOptions, setSalaryStructureOptions] = useState([]);
  const [slabData, setSlabData] = useState([]);
  const [formulaData, setFormulaData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [ctcData, setCtcData] = useState();
  const [headValues, setHeadValues] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id } = useParams();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

  const checks = {
    employeeType: [values.employeeType !== ""],
    schoolId: [values.schoolId !== ""],
    deptId: [values.deptId !== ""],
    designationId: [values.designationId !== ""],
    jobTypeId: [values.jobTypeId !== ""],
  };

  const errorMessages = {
    employeeType: ["This field required"],
    schoolId: ["This field required"],
    deptId: ["This field required"],
    designationId: ["This field required"],
    jobTypeId: ["This field required"],
  };

  if (values.employeeType === "con") {
    checks["consultantType"] = [values.consultantType !== ""];
    checks["fromDate"] = [values.fromDate !== null];
    checks["toDate"] = [values.toDate !== null];
    checks["consolidatedAmount"] = [values.consolidatedAmount !== ""];

    errorMessages["consultantType"] = ["This field is required"];
    errorMessages["fromDate"] = ["This field is required"];
    errorMessages["toDate"] = ["This field is required"];
    errorMessages["consolidatedAmount"] = ["This field is required"];
  }

  if (values.employeeType === "fte") {
    checks["salaryStructureId"] = [values.salaryStructureId !== ""];
    checks["fromDate"] = [values.fromDate !== null];
    checks["toDate"] = [values.toDate !== null];

    errorMessages["salaryStructureId"] = ["This field is required"];
    errorMessages["fromDate"] = ["This field is required"];
    errorMessages["toDate"] = ["This field is required"];
  }

  useEffect(() => {
    getEmployeeDetails();
    getSchoolOptions();
    getDesignationOptions();
    getjobtypeOptions();
    getSalaryStructureOptions();
    getSlabDetails();
    getEmployeeType();
  }, [pathname]);

  useEffect(() => {
    getFormulaData();
    setValues((prev) => ({
      ...prev,
      ctc: "",
      lumpsum: "",
    }));
    setShowDetails(false);
  }, [values.salaryStructureId]);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

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

  const getFormulaData = async () => {
    if (values.salaryStructureId) {
      await axios
        .get(`/api/finance/getFormulaDetails/${values.salaryStructureId}`)
        .then((res) => {
          setFormulaData(res.data.data);
          // res.data.data
          //   .filter((fil) => fil.salary_category === "Lumpsum")
          //   .map((ls) => {
          //     console.log("yes");
          //     setValues((prev) => ({
          //       ...prev,
          //       [ls.salaryStructureHeadPrintName]: 0,
          //     }));
          //     requiredFields.push(ls.salaryStructureHeadPrintName);
          //     checks[ls] = [values.sr !== ""];
          //     errorMessages[ls] = ["This field required"];
          //   });
          const getLumpsum = res.data.data
            .filter((fil) => fil.salary_category === "Lumpsum")
            .map((obj) => obj.salaryStructureHeadPrintName);

          const newFormulaValues = {};
          getLumpsum.forEach((obj) => {
            requiredFields.push(obj);
            newFormulaValues[obj] = "";
          });

          setValues((prev) => ({
            ...prev,
            lumpsum: newFormulaValues,
          }));
        })
        .catch((err) => console.error(err));
    }
  };

  const getEmployeeDetails = async () => {
    await axios
      .get(`/api/employee/getJobProfileNameAndEmail/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Job Portal", link: "/jobportal" },
          { name: "Salary Breakup" },
          { name: res.data.job_id },
          { name: res.data.firstname },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const getEmployeeType = async () => {
    await axios
      .get(`/api/employee/EmployeeType`)
      .then((res) => {
        console.log(res.data.data);
        setEmployeeOptions1(res.data.data);
        setEmployeeOptions(
          res.data.data.map((obj) => ({
            value: obj.empTypeShortName.toLowerCase(),
            label: obj.empType,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSlabDetails = async () => {
    await axios
      .get(`/api/getAllValues`)
      .then((res) => {
        console.log(res.data.data);
        setSlabData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentOptions = async () => {
    if (values.schoolId) {
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          setDepartmentOptions(
            res.data.data.map((obj) => ({
              value: obj.dept_id,
              label: obj.dept_name_short,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getDesignationOptions = async () => {
    await axios
      .get(`/api/employee/Designation`)
      .then((res) => {
        setDesignationOptions(
          res.data.data.map((obj) => ({
            value: obj.designation_id,
            label: obj.designation_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getjobtypeOptions = async () => {
    await axios
      .get(`/api/employee/JobType`)
      .then((res) => {
        setjobtypeOptions(
          res.data.data.map((obj) => ({
            value: obj.job_type_id,
            label: obj.job_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSalaryStructureOptions = async () => {
    await axios
      .get(`/api/finance/SalaryStructure`)
      .then((res) => {
        setSalaryStructureOptions(
          res.data.data.map((obj) => ({
            value: obj.salary_structure_id,
            label: obj.salary_structure,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = async (e) => {
    if (e.target.name === "employeeType" && e.target.value === "con") {
      const consultantRequired = [
        "consultantType",
        "fromDate",
        "toDate",
        "consolidatedAmount",
      ];

      consultantRequired.forEach((cr) => {
        requiredFields.push(cr);
      });
    }

    if (e.target.value === "fte") {
      const fteRequired = ["salaryStructureId", "fromDate", "toDate"];
      fteRequired.forEach((fr) => {
        requiredFields.push(fr);
      });
    }

    if (e.target.value === "prb") {
      const probationaryRequired = ["salaryStructureId"];
      probationaryRequired.forEach((pr) => {
        requiredFields.push(pr);
      });
    }

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

  const generateCtc = (e) => {
    console.log(values);
    return false;
    const tempData = {};
    const tempValues = {};
    const earningData = [];
    const deductionData = [];
    const managementData = [];

    function calculate(catType, name, value, type, priority, head) {
      if (catType === "e") {
        earningData.push({
          headName: name,
          value: value,
          type: type,
          priority: priority,
        });
      } else if (catType === "d") {
        deductionData.push({
          headName: name,
          value: value,
          type: type,
          priority: priority,
        });
      } else if (catType === "m") {
        managementData.push({
          headName: name,
          value: value,
          type: type,
          priority: priority,
        });
      }

      tempValues[head] = value;
    }

    formulaData
      .sort((a, b) => {
        return a.priority - b.priority;
      })
      .map((fil) => {
        if (fil.salary_category === "Lumpsum") {
          calculate(
            "e",
            fil.voucher_head,
            Math.round(values[fil.salaryStructureHeadPrintName]),
            fil.category_name_type,
            fil.priority,
            fil.salaryStructureHeadPrintName
          );
        } else if (fil.salary_category === "Formula") {
          const amt = fil.formula_name
            .split(",")
            .map((val) => tempValues[val])
            .reduce((a, b) => a + b);

          if (fil.category_name_type === "Earning") {
            calculate(
              "e",
              fil.voucher_head,
              Math.round((amt * fil.percentage) / 100),
              fil.category_name_type,
              fil.priority,
              fil.salaryStructureHeadPrintName
            );
          }

          if (fil.category_name_type === "Deduction") {
            switch (fil.salaryStructureHeadPrintName) {
              case "pf":
                amt <= fil.gross_limit
                  ? calculate(
                      "d",
                      fil.voucher_head,
                      Math.round((amt * fil.percentage) / 100),
                      fil.category_name_type,
                      fil.priority,
                      fil.salaryStructureHeadPrintName
                    )
                  : calculate(
                      "d",
                      fil.voucher_head,
                      Math.round((fil.gross_limit * fil.percentage) / 100),
                      fil.category_name_type,
                      fil.priority,
                      fil.salaryStructureHeadPrintName
                    );
                break;
              case "esi":
                if (
                  earningData.map((te) => te.value).reduce((a, b) => a + b) <
                  fil.gross_limit
                ) {
                  calculate(
                    "d",
                    fil.voucher_head,
                    Math.round((amt * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  );
                }
                break;
            }
          }

          if (fil.category_name_type === "Management") {
            switch (fil.salaryStructureHeadPrintName) {
              case "management_pf":
                amt <= fil.gross_limit
                  ? calculate(
                      "m",
                      fil.voucher_head,
                      Math.round((amt * fil.percentage) / 100),
                      fil.category_name_type,
                      fil.priority,
                      fil.salaryStructureHeadPrintName
                    )
                  : calculate(
                      "m",
                      fil.voucher_head,
                      Math.round((fil.gross_limit * fil.percentage) / 100),
                      fil.category_name_type,
                      fil.priority,
                      fil.salaryStructureHeadPrintName
                    );
                break;
              case "esimg":
                if (
                  earningData.map((te) => te.value).reduce((a, b) => a + b) <
                  fil.gross_limit
                ) {
                  calculate(
                    "m",
                    fil.voucher_head,
                    Math.round((amt * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  );
                }

                break;
            }
          }
        } else if (fil.salary_category === "slab") {
          const slots = slabData.filter(
            (sd) => sd.slab_details_id === fil.slab_details_id
          );

          const amt = slots[0]["print_name"]
            .split(",")
            .map((m) => (tempValues[m] ? tempValues[m] : 0))
            .reduce((a, b) => a + b);

          slots.map((rs) => {
            if (amt >= rs.min_value && amt <= rs.max_value) {
              calculate(
                fil.category_name_type[0].toLowerCase(),
                fil.voucher_head,
                rs.head_value,
                fil.category_name_type,
                fil.priority,
                fil.salaryStructureHeadPrintName
              );
            }
          });
        }
      });

    tempData["earnings"] = earningData;
    tempData["deductions"] = deductionData;
    tempData["management"] = managementData;
    tempData["grossEarning"] =
      tempData.earnings.length > 0
        ? tempData.earnings.map((te) => te.value).reduce((a, b) => a + b)
        : 0;
    tempData["totDeduction"] =
      tempData.deductions.length > 0
        ? tempData.deductions.map((te) => te.value).reduce((a, b) => a + b)
        : 0;
    tempData["totManagement"] =
      tempData.management.length > 0
        ? tempData.management.map((te) => te.value).reduce((a, b) => a + b)
        : 0;

    setCtcData(tempData);
    setValues((prev) => ({
      ...prev,
      ctc: Math.round(tempData.grossEarning + tempData.totManagement),
    }));

    tempValues["gross"] = tempData.grossEarning;
    tempValues["net_pay"] = tempData.grossEarning - tempData.totDeduction;
    setHeadValues(tempValues);
  };

  const handleCreate = async (e) => {
    console.log(requiredFields);
    console.log(values);
    return false;
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const columns = [
        "basic",
        "da",
        "hra",
        "ta",
        "spl_1",
        "pf",
        "management_pf",
        "pt",
      ];

      const temp = {};
      temp.ctc_status = 1;
      temp.active = true;
      temp.job_id = id;
      temp.designation_id = values.designationId;
      temp.designation = designationOptions
        .filter((f) => f.value === values.designationId)
        .map((val) => val.label)
        .toString();
      temp.dept_id = values.deptId;
      temp.school_id = values.schoolId;
      temp.job_type_id = values.jobTypeId;
      temp.emp_type_id = employeeOptions1
        .filter((f) => f.empTypeShortName.toLowerCase() === values.employeeType)
        .map((val) => val.empTypeId)
        .toString();
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;
      temp.remarks = values.remarks;

      if (values.employeeType === "con") {
        temp.consolidated_amount = values.consolidatedAmount;
        temp.consultant_emp_type = values.consultantType;
      }
      if (values.employeeType === "fte" || values.employeeType === "prb") {
        columns.map((col) => {
          if (headValues[col]) {
            temp[col] = headValues[col];
          }
        });
        temp.salary_structure_id = values.salaryStructureId;
        temp.salary_structure = salaryStructureOptions
          .filter((f) => f.value === values.salaryStructureId)
          .map((val) => val.label)
          .toString();
        temp.gross = headValues.gross;
        temp.net_pay = headValues.net_pay;
        temp.ctc = values.ctc;
      }

      await axios
        .post(`/api/employee/Offer`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Salary Breakup created successfully",
            });
            navigate("/JobPortal", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="employeeType"
              label="Employee Type"
              value={values.employeeType}
              items={employeeOptions}
              handleChange={handleChange}
              checks={checks.employeeType}
              errors={errorMessages.employeeType}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.schoolId}
              errors={errorMessages.schoolId}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="deptId"
              label="Department"
              value={values.deptId}
              options={departmentOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.deptId}
              errors={errorMessages.deptId}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="designationId"
              label="Designation"
              value={values.designationId}
              options={designationOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.designationId}
              errors={errorMessages.designationId}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="jobTypeId"
              label="Job Type"
              value={values.jobTypeId}
              options={jobypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.jobTypeId}
              errors={errorMessages.jobTypeId}
              required
            />
          </Grid>
          {values.employeeType === "con" ? (
            <>
              <Grid item xs={12} md={4}>
                <CustomSelect
                  name="consultantType"
                  label="Consutant Type"
                  value={values.consultantType}
                  items={[
                    { value: "Regular", label: "Regular" },
                    { value: "Non-Regular", label: "Non-Regular" },
                  ]}
                  handleChange={handleChange}
                  checks={checks.consultantType}
                  errors={errorMessages.consultantType}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomDatePicker
                  name="fromDate"
                  label="From Date"
                  value={values.fromDate}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.fromDate}
                  errors={errorMessages.fromDate}
                  required
                  disablePast
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomDatePicker
                  name="toDate"
                  label="To Date"
                  value={values.toDate}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.toDate}
                  errors={errorMessages.toDate}
                  minDate={values.fromDate}
                  required
                  disablePast
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="consolidatedAmount"
                  label="Consolidated Amount"
                  value={values.consolidatedAmount}
                  handleChange={handleChange}
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  checks={checks.consolidatedAmount}
                  errors={errorMessages.consolidatedAmount}
                  required
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          {values.employeeType === "fte" || values.employeeType === "prb" ? (
            <>
              {values.employeeType === "fte" ? (
                <>
                  <Grid item xs={12} md={4}>
                    <CustomDatePicker
                      name="fromDate"
                      label="From Date"
                      value={values.fromDate}
                      handleChangeAdvance={handleChangeAdvance}
                      errors={["This field required"]}
                      checks={[values.fromDate !== null]}
                      required
                      disablePast
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <CustomDatePicker
                      name="toDate"
                      label="To Date"
                      value={values.toDate}
                      handleChangeAdvance={handleChangeAdvance}
                      errors={["This field required"]}
                      checks={[values.toDate !== null]}
                      required
                      disablePast
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="salaryStructureId"
                  label="Salary Structure"
                  value={values.salaryStructureId}
                  options={salaryStructureOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.salaryStructureId}
                  errors={errorMessages.salaryStructureId}
                  required
                />
              </Grid>

              {formulaData.length > 0 ? (
                formulaData
                  .filter((fil) => fil.salary_category === "Lumpsum")
                  .map((lu, i) => {
                    const voucherHead = lu.salaryStructureHeadPrintName;
                    return (
                      <Grid item xs={12} md={4} key={i}>
                        <CustomTextField
                          name={voucherHead}
                          label={lu.voucher_head}
                          value={values.voucherHead}
                          handleChange={handleChange}
                          type="number"
                          InputProps={{ inputProps: { min: 1 } }}
                          errors={["This field is required"]}
                          checks={[values.voucherHead !== ""]}
                          required
                        />
                      </Grid>
                    );
                  })
              ) : (
                <></>
              )}

              {values.ctc ? (
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name={values.ctc.toString()}
                    label="CTC"
                    value={values.ctc}
                    disabled
                  />
                </Grid>
              ) : (
                <></>
              )}
              {values.salaryStructureId ? (
                <>
                  <Grid item xs={12} md={4}>
                    <CustomTextField
                      name="remarks"
                      label="Remarks"
                      value={values.remarks}
                      handleChange={handleChange}
                      multiline
                      rows={2}
                      errors={["This field is required"]}
                      checks={[values.remarks !== ""]}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      onClick={() => generateCtc()}
                    >
                      Generate CTC
                    </Button>
                  </Grid>
                  {values.ctc ? (
                    <Grid item xs={12} md={2}>
                      <Button
                        style={{ borderRadius: 7 }}
                        variant="contained"
                        color="primary"
                        onClick={() => setShowDetails(true)}
                      >
                        Salary Breakup
                      </Button>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          {showDetails ? (
            <Grid item xs={12} align="center" mt={3}>
              <SalaryBreakupReport data={ctcData} />
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleCreate}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default SalaryBreakupForm;
