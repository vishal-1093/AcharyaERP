import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button } from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import moment from "moment";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomSelect = lazy(() =>
  import("../../../components/Inputs/CustomSelect")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomModal = lazy(() => import("../../../components/CustomModal"));
const SalaryBreakupReport = lazy(() => import("./SalaryBreakupReport"));
const SalaryBreakupView = lazy(() =>
  import("../../../components/SalaryBreakupView")
);

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
  remarks: "",
  isPf: "true",
  isPt: "true",
};

const requiredFields = [
  "employeeType",
  "schoolId",
  "deptId",
  "designationId",
  "jobTypeId",
  "remarks",
];

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
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [offerData, setOfferData] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [showDetailsUpdate, setShowDetailsUpdate] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id, offerId } = useParams();
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

  if (values.employeeType === "fte" || values.employeeType === "prb") {
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
    getEmployeeDetails();
    getSchoolOptions();
    getDesignationOptions();
    getjobtypeOptions();
    getSalaryStructureOptions();
    getSlabDetails();
    getEmployeeType();

    if (pathname.toLowerCase() === "/salarybreakupform/new/" + id) {
      setIsNew(true);
    } else {
      setIsNew(false);
      getData();
    }
  }, [pathname]);

  useEffect(() => {
    getFormulaData();
    setShowDetails(false);
  }, [values.salaryStructureId]);

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      deptId: "",
    }));
    getDepartmentOptions();
  }, [values.schoolId]);

  const getData = async () => {
    await axios
      .get(`/api/employee/Offer/${offerId}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          employeeType: res.data.data.employee_type.toLowerCase(),
          schoolId: res.data.data.school_id,
          deptId: res.data.data.dept_id,
          designationId: res.data.data.designation_id,
          jobTypeId: res.data.data.job_type_id,
          fromDate: res.data.data.from_date,
          toDate: res.data.data.to_date,
          salaryStructureId: res.data.data.salary_structure_id,
          remarks: res.data.data.remarks,
          consolidatedAmount: res.data.data.consolidated_amount,
          consultantType: res.data.data.consultant_emp_type,
        }));
        setOfferData(res.data.data);
        if (
          res.data.data.employee_type.toLowerCase() === "fte" ||
          res.data.data.employee_type.toLowerCase() === "prb"
        ) {
          setShowDetailsUpdate(true);
        }
      })
      .catch((err) => console.error(err));
  };

  const getFormulaData = async () => {
    if (
      values.salaryStructureId &&
      (values.employeeType === "fte" || values.employeeType === "prb")
    ) {
      await axios
        .get(`/api/finance/getFormulaDetails/${values.salaryStructureId}`)
        .then((res) => {
          setFormulaData(res.data.data);

          // filtering lumspsum data
          const getLumpsum = [];
          res.data.data
            .filter((fil) => fil.salary_category === "Lumpsum")
            .forEach((obj) => {
              getLumpsum.push(obj.salaryStructureHeadPrintName);
            });

          const newFormulaValues = {};

          // validation: removing required fileds based on salary structure
          if ("lumpsum" in values === true) {
            Object.keys(values.lumpsum).forEach((obj) => {
              if (requiredFields.includes(obj) === true) {
                const getIndex = requiredFields.indexOf(obj);
                requiredFields.splice(getIndex, 1);
              }
            });
          }

          getLumpsum.forEach((obj) => {
            if (requiredFields.includes(obj) === false) {
              requiredFields.push(obj);
            }

            if (Object.keys(offerData).length > 0) {
              newFormulaValues[obj] = offerData[obj];
            } else {
              newFormulaValues[obj] = "";
            }
          });

          setValues((prev) => ({
            ...prev,
            lumpsum: newFormulaValues,
            ctc: Object.keys(offerData).length > 0 ? offerData["ctc"] : "",
          }));

          if (!isNew) {
            const headsTemp = {};
            res.data.data.forEach((obj) => {
              headsTemp[obj.salaryStructureHeadPrintName] =
                offerData[obj.salaryStructureHeadPrintName];
            });
            setHeadValues(headsTemp);
          }
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
          { name: res.data.firstname },
          { name: "Salary Breakup" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const getEmployeeType = async () => {
    await axios
      .get(`/api/employee/EmployeeType`)
      .then((res) => {
        setEmployeeOptions1(res.data.data);
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.empTypeShortName.toLowerCase(),
            label: obj.empType,
          });
        });
        setEmployeeOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getSlabDetails = async () => {
    await axios
      .get(`/api/getAllValues`)
      .then((res) => {
        setSlabData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentOptions = async () => {
    if (values.schoolId) {
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          const optionData = [];
          res.data.data.forEach((obj) => {
            optionData.push({
              value: obj.dept_id,
              label: obj.dept_name,
            });
          });
          setDepartmentOptions(optionData);
        })
        .catch((err) => console.error(err));
    }
  };

  const getDesignationOptions = async () => {
    await axios
      .get(`/api/employee/Designation`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.designation_id,
            label: obj.designation_name,
          });
        });
        setDesignationOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getjobtypeOptions = async () => {
    await axios
      .get(`/api/employee/JobType`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.job_type_id,
            label: obj.job_type,
          });
        });
        setjobtypeOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getSalaryStructureOptions = async () => {
    await axios
      .get(`/api/finance/SalaryStructure`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.salary_structure_id,
            label: obj.salary_structure,
          });
        });
        setSalaryStructureOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = async (e) => {
    if (e.target.name === "employeeType") {
      if (e.target.value === "con") {
        formulaData
          .filter((fil) => fil.salary_category === "Lumpsum")
          .forEach((obj) => {
            if (
              requiredFields.includes(obj.salaryStructureHeadPrintName) === true
            ) {
              const getIndex = requiredFields.indexOf(
                obj.salaryStructureHeadPrintName
              );
              requiredFields.splice(getIndex, 1);
            }
          });

        ["salaryStructureId", "ctc"].forEach((obj) => {
          if (requiredFields.includes(obj) === true) {
            requiredFields.splice(requiredFields.indexOf(obj), 1);
          }
        });

        const consultantRequired = [
          "consultantType",
          "fromDate",
          "toDate",
          "consolidatedAmount",
        ];

        consultantRequired.forEach((cr) => {
          if (requiredFields.includes(cr) === false) {
            requiredFields.push(cr);
          }
        });
      }
    }

    if (e.target.value === "fte") {
      ["consultantType", "consolidatedAmount"].forEach((obj) => {
        if (requiredFields.includes(obj) === true) {
          requiredFields.splice(requiredFields.indexOf(obj), 1);
        }
      });

      const fteRequired = ["salaryStructureId", "fromDate", "toDate", "ctc"];
      fteRequired.forEach((fr) => {
        if (requiredFields.includes(fr) === false) {
          requiredFields.push(fr);
        }
      });
    }

    if (e.target.value === "prb") {
      ["consultantType", "fromDate", "toDate", "consolidatedAmount"].forEach(
        (obj) => {
          if (requiredFields.includes(obj) === true)
            requiredFields.splice(requiredFields.indexOf(obj), 1);
        }
      );

      ["salaryStructureId", "ctc"].forEach((obj) => {
        if (requiredFields.includes(obj) === false) {
          requiredFields.push(obj);
        }
      });
    }

    const splitName = e.target.name.split("-");

    if (splitName[1] === "lumpsum") {
      const checkValues = values.lumpsum;
      checkValues[splitName[0]] = e.target.value;
      setValues((prev) => ({
        ...prev,
        lumpsum: checkValues,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
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
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const createSalarybreakup = async () => {
        const temp = {};
        temp.ctc_status = values.employeeType === "con" ? 2 : 1;
        temp.active = true;
        temp.job_id = id;
        temp.designation_id = values.designationId;
        const designationFilter = designationOptions.filter(
          (f) => f.value === values.designationId
        );
        temp.designation = designationFilter[0].label;
        temp.dept_id = values.deptId;
        temp.school_id = values.schoolId;
        temp.job_type_id = values.jobTypeId;
        const empTypeFilter = employeeOptions1.filter(
          (f) => f.empTypeShortName.toLowerCase() === values.employeeType
        );
        temp.emp_type_id = empTypeFilter[0].empTypeId;
        temp.from_date = moment(values.fromDate).format("DD-MM-YYYY");
        temp.to_date = moment(values.toDate).format("DD-MM-YYYY");
        temp.remarks = values.remarks;
        temp.isPf = values.isPf === "true" ? true : false;
        temp.isPt = values.isPt === "true" ? true : false;

        if (values.employeeType === "con") {
          temp.consolidated_amount = values.consolidatedAmount;
          temp.consultant_emp_type = values.consultantType;
        }
        if (values.employeeType === "fte" || values.employeeType === "prb") {
          columns.forEach((col) => {
            temp[col] = headValues[col];
          });
          temp.salary_structure_id = values.salaryStructureId;
          const salaryStructureFilter = salaryStructureOptions.filter(
            (f) => f.value === values.salaryStructureId
          );
          temp.salary_structure = salaryStructureFilter[0].label;
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
      };
      setConfirmContent({
        title: "",
        message: "Do you want to submit?",
        buttons: [
          { name: "Yes", color: "primary", func: createSalarybreakup },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setConfirmOpen(true);
    }
  };
  console.log("checks", checks);
  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const updateSalarybreakup = async () => {
        const temp = offerData;
        temp.ctc_status = values.employeeType === "con" ? 2 : 1;
        temp.designation_id = values.designationId;
        const designationFilter = designationOptions.filter(
          (f) => f.value === values.designationId
        );
        temp.designation = designationFilter[0].label;
        temp.dept_id = values.deptId;
        temp.school_id = values.schoolId;
        temp.job_type_id = values.jobTypeId;
        const empTypeFilter = employeeOptions1.filter(
          (f) => f.empTypeShortName.toLowerCase() === values.employeeType
        );
        temp.emp_type_id = empTypeFilter[0].empTypeId;
        temp.from_date = moment(values.fromDate).format("DD-MM-YYYY");
        temp.to_date = moment(values.toDate).format("DD-MM-YYYY");
        temp.remarks = values.remarks;

        if (values.employeeType === "con") {
          temp.consolidated_amount = values.consolidatedAmount;
          temp.consultant_emp_type = values.consultantType;
        }
        if (values.employeeType === "fte" || values.employeeType === "prb") {
          columns.forEach((col) => {
            temp[col] = headValues[col];
          });
          temp.salary_structure_id = values.salaryStructureId;
          const salaryStructureFilter = salaryStructureOptions.filter(
            (f) => f.value === values.salaryStructureId
          );
          temp.salary_structure = salaryStructureFilter[0].label;
          temp.gross = headValues.gross;
          temp.net_pay = headValues.net_pay;
          temp.ctc = values.ctc;
        }

        await axios
          .put(`/api/employee/Offer/${offerId}`, temp)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({
                severity: "success",
                message: "Salary Breakup updated successfully",
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
      };
      setConfirmContent({
        title: "",
        message: "Do you want to update?",
        buttons: [
          { name: "Yes", color: "primary", func: updateSalarybreakup },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setConfirmOpen(true);
    }
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
                      return (
                        <Grid item xs={12} md={4} key={i}>
                          <CustomTextField
                            name={
                              lu.salaryStructureHeadPrintName + "-" + "lumpsum"
                            }
                            label={lu.voucher_head}
                            value={
                              values.lumpsum[lu.salaryStructureHeadPrintName]
                            }
                            handleChange={handleChange}
                            checks={checks[lu.salaryStructureHeadPrintName]}
                            errors={
                              errorMessages[lu.salaryStructureHeadPrintName]
                            }
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
                {"lumpsum" in values === true &&
                Object.keys(values.lumpsum).length > 0 &&
                Object.keys(values.lumpsum)
                  .map((obj) =>
                    parseInt(values.lumpsum[obj]) >= 0 ? true : false
                  )
                  .includes(false) === false ? (
                  <>
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

                    <Grid item xs={12} md={2}>
                      <Button
                        style={{ borderRadius: 7 }}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={generateCtc}
                      >
                        Generate CTC
                      </Button>
                    </Grid>

                    {values.ctc && showDetailsUpdate === false ? (
                      <Grid item xs={12} md={2}>
                        <Button
                          style={{ borderRadius: 7 }}
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => setShowDetails(true)}
                        >
                          Salary Breakup
                        </Button>
                      </Grid>
                    ) : (
                      <></>
                    )}

                    {values.ctc && showDetailsUpdate ? (
                      <Grid item xs={12} md={2}>
                        <Button
                          style={{ borderRadius: 7 }}
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => setShowDetailsUpdate(true)}
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

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
                multiline
                rows={2}
                checks={checks.remarks}
                errors={errorMessages.remarks}
                required
              />
            </Grid>

            {showDetails ? (
              <Grid item xs={12} align="center" mt={3}>
                <SalaryBreakupReport data={ctcData} />
              </Grid>
            ) : (
              <></>
            )}

            {showDetailsUpdate ? (
              <>
                <Grid item xs={12}>
                  <Grid container justifyContent="center">
                    <Grid item xs={12} md={6}>
                      <SalaryBreakupView id={offerId} />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              <></>
            )}

            <Grid item xs={12} align="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                onClick={isNew ? handleCreate : handleUpdate}
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
