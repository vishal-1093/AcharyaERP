import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button } from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import moment from "moment";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import FormWrapper from "../../../components/FormWrapper";
import CustomModal from "../../../components/CustomModal";

const SalaryBreakupReport = lazy(() => import("./SalaryBreakupReport"));
const SalaryBreakupViewByOfferId = lazy(() =>
  import("../../../components/SalaryBreakupViewByOfferId")
);

const initialValues = {
  employeeType: "",
  schoolId: "",
  deptId: "",
  designationId: "",
  jobTypeId: "",
  consultantType: "Non-Regular",
  consolidatedAmount: "",
  fromDate: null,
  toDate: null,
  salaryStructureId: "",
  remarks: "",
  isPf: "true",
  isPt: "true",
};

const requiredFields = new Set([
  "employeeType",
  "schoolId",
  "deptId",
  "designationId",
  "jobTypeId",
  "remarks",
]);

const columns = [
  "basic",
  "da",
  "hra",
  "ta",
  "spl_1",
  "pf",
  "management_pf",
  "pt",
  "cca",
  "esi",
  "esic",
];

function SalaryBreakupForm() {
  const [values, setValues] = useState(initialValues);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [jobypeOptions, setjobtypeOptions] = useState([]);
  const [salaryStructureOptions, setSalaryStructureOptions] = useState([]);
  const [slabData, setSlabData] = useState([]);
  const [formulaData, setFormulaData] = useState([]);
  const [ctcData, setCtcData] = useState();
  const [headValues, setHeadValues] = useState();
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [offerData, setOfferData] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [showDetailsUpdate, setShowDetailsUpdate] = useState(false);
  const [lumpsumData, setLumpsumData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id, offerId, type } = useParams();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

  const checks = {
    employeeType: [values.employeeType !== ""],
    schoolId: [values.schoolId !== ""],
    deptId: [values.deptId !== ""],
    designationId: [values.designationId !== ""],
    jobTypeId: [values.jobTypeId !== ""],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    employeeType: ["This field required"],
    schoolId: ["This field required"],
    deptId: ["This field required"],
    designationId: ["This field required"],
    jobTypeId: ["This field required"],
    remarks: ["This field required"],
  };

  if (values.employeeType === "con") {
    checks["consultantType"] = [values.consultantType !== ""];
    checks["fromDate"] = [values.fromDate !== null];
    checks["toDate"] = [values.toDate !== null];
    checks["consolidatedAmount"] = [
      values.consolidatedAmount !== "",
      /^[0-9]+$/.test(values.consolidatedAmount),
    ];

    errorMessages["consultantType"] = ["This field is required"];
    errorMessages["fromDate"] = ["This field is required"];
    errorMessages["toDate"] = ["This field is required"];
    errorMessages["consolidatedAmount"] = [
      "This field is required",
      "Invalid amount",
    ];
  }

  if (values.employeeType === "fte" || values.employeeType === "orr") {
    checks["salaryStructureId"] = [values.salaryStructureId !== ""];
    errorMessages["salaryStructureId"] = ["This field is required"];

    formulaData
      .filter((fil) => fil.salary_category === "Lumpsum")
      .forEach((obj) => {
        checks[obj.salaryStructureHeadPrintName] = [
          values.lumpsum[obj.salaryStructureHeadPrintName] !== "",
          /^[0-9.]*$/.test(values.lumpsum[obj.salaryStructureHeadPrintName]),
        ];
        errorMessages[obj.salaryStructureHeadPrintName] = [
          "This field is required",
          "Please enter the amount",
        ];
      });
  }

  if (values.employeeType === "fte") {
    checks["fromDate"] = [values.fromDate !== null];
    checks["toDate"] = [values.toDate !== null];

    errorMessages["fromDate"] = ["This field is required"];
    errorMessages["toDate"] = ["This field is required"];
  }

  useEffect(() => {
    getDetails();
    const basePath = `/salarybreakupform/new/${id}`;
    const fullPath = `${basePath}/${offerId}/${type}`.toLowerCase();
    if (
      pathname.toLowerCase() === basePath ||
      pathname.toLowerCase() === fullPath
    ) {
      setIsNew(true);
    } else {
      setIsNew(false);
      getData();
    }
  }, [pathname]);

  useEffect(() => {
    getFormulaData();
  }, [values.salaryStructureId]);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  useEffect(() => {
    handleRequiedFields();
  }, [values.employeeType]);

  const getDetails = async () => {
    try {
      const [
        { data: jobResponse },
        { data: schoolResponse },
        { data: designationResponse },
        { data: jobTypeResponse },
        { data: salaryResponse },
        { data: slabResponse },
        { data: empResponse },
      ] = await Promise.all([
        axios.get(`/api/employee/getJobProfileNameAndEmail/${id}`),
        axios.get("/api/institute/school"),
        axios.get("/api/employee/Designation"),
        axios.get("/api/employee/JobType"),
        axios.get("/api/finance/SalaryStructure"),
        axios.get("/api/getAllValues"),
        axios.get("/api/employee/EmployeeType"),
      ]);

      const schoolOptionData = [];
      schoolResponse?.data?.forEach((obj) => {
        schoolOptionData.push({
          value: obj.school_id,
          label: obj.school_name,
        });
      });

      const designationOptionData = [];
      designationResponse?.data?.forEach((obj) => {
        designationOptionData.push({
          value: obj.designation_id,
          label: obj.designation_name,
        });
      });

      const jobTypeOptionData = [];
      jobTypeResponse?.data?.forEach((obj) => {
        jobTypeOptionData.push({
          value: obj.job_type_id,
          label: obj.job_type,
        });
      });

      const salaryOptionData = [];
      salaryResponse?.data?.forEach((obj) => {
        salaryOptionData.push({
          value: obj.salary_structure_id,
          label: obj.salary_structure,
        });
      });

      const empOptionData = [];
      empResponse?.data?.forEach((obj) => {
        empOptionData.push({
          value: obj.empTypeShortName.toLowerCase(),
          label: obj.empType,
          empTypeId: obj.empTypeId,
        });
      });

      setSchoolOptions(schoolOptionData);
      setDesignationOptions(designationOptionData);
      setjobtypeOptions(jobTypeOptionData);
      setSalaryStructureOptions(salaryOptionData);
      setSlabData(slabResponse?.data);
      setEmployeeOptions(empOptionData);

      setCrumbs([
        {
          name: type === "change" ? "Employee Relieving" : "Job Portal",
          link: type === "change" ? "/employeeresignationindex" : "/jobportal",
        },
        { name: jobResponse.firstname },
        { name: "Salary Breakup" },
      ]);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    }
  };

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/employee/Offer/${offerId}`
      );
      const responseData = response.data;

      setValues((prev) => ({
        ...prev,
        employeeType: responseData.employee_type.toLowerCase(),
        schoolId: responseData.school_id,
        deptId: responseData.dept_id,
        designationId: responseData.designation_id,
        jobTypeId: responseData.job_type_id,
        fromDate: moment(responseData.from_date, "DD-MM-YYYY"),
        toDate: moment(responseData.to_date, "DD-MM-YYYY"),
        salaryStructureId: responseData.salary_structure_id,
        remarks: responseData.remarks,
        consolidatedAmount: responseData.consolidated_amount,
        consultantType: responseData.consultant_emp_type ?? "Non-Regular",
        isPf: responseData.is_pf ? "true" : "false",
        isPt: responseData.is_pt ? "true" : "false",
      }));
      const empShortName = responseData.employee_type.toLowerCase();
      setShowDetailsUpdate(empShortName === "fte" || empShortName === "orr");
      setOfferData(responseData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    }
  };

  const getFormulaData = async () => {
    const { salaryStructureId, employeeType } = values;
    try {
      if (
        salaryStructureId &&
        (employeeType === "fte" || employeeType === "orr")
      ) {
        const { data: response } = await axios.get(
          `/api/finance/getFormulaDetails/${values.salaryStructureId}`
        );
        const responseData = response.data;
        // filtering lumspsum data
        const getLumpsum = [];
        const filterLumpsum = responseData?.filter(
          (obj) => obj.salary_category === "Lumpsum"
        );
        filterLumpsum?.forEach((obj) => {
          getLumpsum.push(obj.salaryStructureHeadPrintName);
        });
        const newFormulaValues = {};
        const checkOfferData = Object.keys(offerData);
        getLumpsum.forEach((obj) => {
          if (checkOfferData.length > 0) {
            newFormulaValues[obj] = offerData[obj];
          } else {
            newFormulaValues[obj] = "";
          }
        });
        setValues((prev) => ({
          ...prev,
          lumpsum: newFormulaValues,
          ctc: checkOfferData.length > 0 ? offerData["ctc"] : "",
        }));

        if (!isNew) {
          const headsTemp = {};
          responseData.forEach((obj) => {
            headsTemp[obj.salaryStructureHeadPrintName] =
              offerData[obj.salaryStructureHeadPrintName];
          });
          setHeadValues(headsTemp);
        }
        setFormulaData(responseData);
        setLumpsumData(filterLumpsum);
      }
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the formula data !!",
      });
      setAlertOpen(true);
    }
  };

  const getDepartmentOptions = async () => {
    const { schoolId } = values;
    if (!schoolId) {
      return;
    }
    try {
      const { data: response } = await axios.get(`/api/fetchdept1/${schoolId}`);
      const optionData = [];
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.dept_id,
          label: obj.dept_name,
        });
      });
      setDepartmentOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to load the department data !!",
      });
      setAlertOpen(true);
    }
  };

  const addMultipleElements = (elements) => {
    elements.forEach((element) => requiredFields.add(element));
  };

  const removeMultipleElements = (elements) => {
    elements.forEach((element) => requiredFields.delete(element));
  };

  const handleRequiedFields = () => {
    const { employeeType, lumpsum } = values;
    const consultantRequired = ["consultantType", "consolidatedAmount"];
    const fteRequired = ["salaryStructureId", "fromDate", "toDate", "ctc"];
    const salaryColumns = ["salaryStructureId", "ctc"];
    const orrRemoveFields = [
      "consultantType",
      "fromDate",
      "toDate",
      "consolidatedAmount",
    ];
    const existingValues = [];
    if (lumpsum) {
      Object.keys(lumpsum).forEach((obj) => {
        existingValues.push(obj);
      });
    }
    const newValues = [];
    lumpsumData.forEach((obj) => {
      newValues.push(obj.salaryStructureHeadPrintName);
    });
    const combineValues = [...existingValues, ...newValues];
    const repeatedCounts = combineValues.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    const nonRepeatedValues = combineValues.filter(
      (val) => repeatedCounts[val] === 1
    );
    removeMultipleElements(nonRepeatedValues);

    if (employeeType === "con") {
      addMultipleElements(consultantRequired);
      removeMultipleElements([...existingValues, ...salaryColumns]);
    }

    if (employeeType === "fte") {
      addMultipleElements(fteRequired);
      removeMultipleElements(consultantRequired);
    }

    if (employeeType === "orr") {
      addMultipleElements(salaryColumns);
      removeMultipleElements(orrRemoveFields);
    }
    setShowDetailsUpdate(employeeType !== "con");
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const splitName = name.split("-");

    if (splitName[1] === "lumpsum") {
      setValues((prev) => ({
        ...prev,
        lumpsum: { ...prev.lumpsum, [splitName[0]]: value },
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const generateCtc = () => {
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

    let filterFormulaData = formulaData;
    if (values.isPf === "false") {
      filterFormulaData = filterFormulaData.filter(
        (obj) =>
          obj.salaryStructureHeadPrintName !== "pf" &&
          obj.salaryStructureHeadPrintName !== "management_pf"
      );
    }

    if (values.isPt === "false") {
      filterFormulaData = filterFormulaData.filter(
        (obj) => obj.salaryStructureHeadPrintName !== "pt"
      );
    }

    filterFormulaData
      .sort((a, b) => {
        return a.priority - b.priority;
      })
      .forEach((fil) => {
        if (fil.salary_category === "Lumpsum") {
          calculate(
            "e",
            fil.voucher_head,
            Math.round(values.lumpsum[fil.salaryStructureHeadPrintName]),
            fil.category_name_type,
            fil.priority,
            fil.salaryStructureHeadPrintName
          );
        } else if (fil.salary_category === "Formula") {
          const formulas = fil.formula_name.split(",");
          const formulaAmt = [];
          formulas.forEach((val) => {
            formulaAmt.push(tempValues[val]);
          });
          const amt = formulaAmt.reduce((a, b) => a + b);

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
            const esiEarnings = [];
            earningData.forEach((te) => {
              esiEarnings.push(te.value);
            });
            const esiEarningAmt = esiEarnings.reduce((a, b) => a + b);

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
                if (esiEarningAmt < fil.gross_limit) {
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
            const esicEarnings = [];
            earningData.forEach((te) => {
              esicEarnings.push(te.value);
            });
            const esicEarningAmt = esicEarnings.reduce((a, b) => a + b);

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
              case "esic":
                if (esicEarningAmt < fil.gross_limit) {
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

          const slotPrintNames = slots[0]["print_name"].split(",");
          const slotAmt = [];
          slotPrintNames.forEach((m) => {
            slotAmt.push(tempValues[m] ? tempValues[m] : 0);
          });
          const amt = slotAmt.reduce((a, b) => a + b);

          slots.forEach((rs) => {
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
    let grossEarningAmt = 0;
    let totDeductionAmt = 0;
    let totManagementAmt = 0;

    if (tempData.earnings.length > 0) {
      const temp = [];
      tempData.earnings.forEach((te) => {
        temp.push(te.value);
      });
      grossEarningAmt = temp.reduce((a, b) => a + b);
    }

    if (tempData.deductions.length > 0) {
      const temp = [];
      tempData.deductions.forEach((te) => {
        temp.push(te.value);
      });
      totDeductionAmt = temp.reduce((a, b) => a + b);
    }

    if (tempData.management.length > 0) {
      const temp = [];
      tempData.management.forEach((te) => {
        temp.push(te.value);
      });
      totManagementAmt = temp.reduce((a, b) => a + b);
    }

    tempData["grossEarning"] = grossEarningAmt;
    tempData["totDeduction"] = totDeductionAmt;
    tempData["totManagement"] = totManagementAmt;

    setCtcData(tempData);
    setValues((prev) => ({
      ...prev,
      ctc: Math.round(tempData.grossEarning + tempData.totManagement),
    }));

    tempValues["gross"] = tempData.grossEarning;
    tempValues["net_pay"] = tempData.grossEarning - tempData.totDeduction;
    setHeadValues(tempValues);
    setShowDetailsUpdate(false);
  };

  const requiredFieldsValid = () => {
    const extractRequiredFields = [...requiredFields];
    for (let i = 0; i < extractRequiredFields.length; i++) {
      const field = extractRequiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    const {
      employeeType,
      designationId,
      deptId,
      schoolId,
      jobTypeId,
      fromDate,
      toDate,
      remarks,
      consolidatedAmount,
      consultantType,
      salaryStructureId,
      ctc,
      isPf,
      isPt,
    } = values;

    const navigatePath =
      type === "change" ? "/employeeresignationindex" : "/jobportal";
    try {
      setLoading(true);
      let putData = {};
      if (!isNew) {
        putData = { ...offerData };
      }

      const designation = designationOptions.find(
        (obj) => obj.value === designationId
      )?.label;
      const empTypeId = employeeOptions.find(
        (obj) => obj.value === employeeType
      )?.empTypeId;
      const salaryStructureName = salaryStructureOptions.find(
        (obj) => obj.value === salaryStructureId
      )?.label;
      putData.ctc_status = employeeType === "con" ? 2 : 1;
      putData.active = true;
      putData.job_id = id;
      putData.designation_id = designationId;
      putData.designation = designation;
      putData.dept_id = deptId;
      putData.school_id = schoolId;
      putData.job_type_id = jobTypeId;
      putData.emp_type_id = empTypeId;
      putData.remarks = remarks;
      putData.is_pf = isPf === "true";
      putData.is_pt = isPt === "true";

      if (employeeType === "con") {
        putData.consolidated_amount = consolidatedAmount;
        putData.consultant_emp_type = consultantType;
      }
      if (employeeType === "fte") {
        putData.from_date = moment(fromDate).format("DD-MM-YYYY");
        putData.to_date = moment(toDate).format("DD-MM-YYYY");
      }
      if (employeeType === "fte" || employeeType === "orr") {
        columns.forEach((col) => {
          putData[col] = headValues[col];
        });
        putData.salary_structure_id = salaryStructureId;
        putData.salary_structure = salaryStructureName;
        putData.gross = headValues.gross;
        putData.net_pay = headValues.net_pay;
        putData.ctc = ctc;
      }

      const [historyResponse, offerResponse] = await Promise.all([
        axios.post("/api/employee/offerHistory", putData),
        !isNew
          ? axios.put(`/api/employee/Offer/${offerId}`, putData)
          : axios.post(`/api/employee/Offer`, putData),
      ]);
      if (offerResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Offer created successfully !!",
        });
        setAlertOpen(true);
        navigate(navigatePath, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to create the offer !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setConfirmContent({
      title: "",
      message: "Would you like to confirm?",
      buttons: [
        {
          name: "Yes",
          color: "primary",
          func: handleCreate,
        },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  const validateAmount = () => {
    const { lumpsum } = values;
    if (!lumpsum) {
      return;
    }
    const amount = Object.values(lumpsum).reduce(
      (acc, next) => Number(acc) || 0 + Number(next) || 0
    );
    return amount > 0;
  };

  const consultantColumns = () => {
    return (
      <>
        <Grid item xs={12} md={4}>
          <CustomSelect
            name="consultantType"
            label="Consultant Type"
            value={values.consultantType}
            items={[
              { value: "Regular", label: "Regular" },
              { value: "Non-Regular", label: "Non-Regular" },
            ]}
            handleChange={handleChange}
            checks={checks.consultantType}
            errors={errorMessages.consultantType}
            disabled
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="consolidatedAmount"
            label="Consolidated Amount"
            value={values.consolidatedAmount}
            handleChange={handleChange}
            checks={checks.consolidatedAmount}
            errors={errorMessages.consolidatedAmount}
            required
          />
        </Grid>
      </>
    );
  };

  const fteColumns = () => {
    return (
      <>
        <Grid item xs={12} md={4}>
          <CustomDatePicker
            name="fromDate"
            label="From Date"
            value={values.fromDate}
            handleChangeAdvance={handleChangeAdvance}
            disablePast
            checks={checks.fromDate}
            errors={errorMessages.fromDate}
            required
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
            minDate={convertUTCtoTimeZone(
              moment(values.fromDate).add(6, "month")
            )}
            disablePast
            required
          />
        </Grid>
      </>
    );
  };

  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

      <Box
        sx={{ margin: { xs: "20px 0px 0px 0px", md: "15px 15px 0px 15px" } }}
      >
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

            {values.employeeType === "con" && consultantColumns()}

            {(values.employeeType === "fte" ||
              values.employeeType === "orr") && (
              <>
                {values.employeeType === "fte" && fteColumns()}
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

                {lumpsumData?.map((obj, i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <CustomTextField
                      name={`${obj.salaryStructureHeadPrintName}-lumpsum`}
                      label={obj.voucher_head}
                      value={values.lumpsum[obj.salaryStructureHeadPrintName]}
                      handleChange={handleChange}
                      checks={checks[obj.salaryStructureHeadPrintName]}
                      errors={errorMessages[obj.salaryStructureHeadPrintName]}
                      required
                    />
                  </Grid>
                ))}

                {validateAmount() && (
                  <>
                    {values.ctc && (
                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name={values.ctc.toString()}
                          label="CTC"
                          value={values.ctc}
                          disabled
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={2}>
                      <CustomRadioButtons
                        name="isPf"
                        label="Is PF"
                        value={values.isPf}
                        items={[
                          { label: "Yes", value: "true" },
                          { label: "No", value: "false" },
                        ]}
                        handleChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <CustomRadioButtons
                        name="isPt"
                        label="Is PT"
                        value={values.isPt}
                        items={[
                          { label: "Yes", value: true },
                          { label: "No", value: false },
                        ]}
                        handleChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={generateCtc}
                      >
                        Generate CTC
                      </Button>
                    </Grid>
                  </>
                )}
              </>
            )}

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="remarks"
                label="Remarks / Job Description"
                value={values.remarks}
                handleChange={handleChange}
                checks={checks.remarks}
                errors={errorMessages.remarks}
                multiline
                required
              />
            </Grid>

            {values.ctc && values.employeeType !== "con" && (
              <Grid item xs={12}>
                {showDetailsUpdate ? (
                  <Grid container justifyContent="center">
                    <Grid item xs={12} md={4} align="center">
                      <SalaryBreakupViewByOfferId id={offerId} />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid item xs={12} align="center">
                    <SalaryBreakupReport data={ctcData} />
                  </Grid>
                )}
              </Grid>
            )}

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || !requiredFieldsValid()}
              >
                {isNew ? "Submit" : "Update"}
              </Button>
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}

export default SalaryBreakupForm;
