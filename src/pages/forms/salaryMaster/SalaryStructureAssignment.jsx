import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import SalaryStructureView from "../../../components/SalaryStructureView";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initialValues = {
  salaryStructureId: null,
  salaryHeadId: null,
  formulaName: [],
  slabDetailsId: null,
  fromDate: null,
  percentage: "",
  expression: "",
  salaryCategory: "",
  remarks: "",
  grossLimit: "",
  isPayDay: false,
};

const requiredFields = [
  "salaryStructureId",
  "salaryHeadId",
  "salaryCategory",
  "remarks",
];

function SalaryStructureAssignment() {
  const [values, setValues] = useState(initialValues);
  const [isNew, setIsNew] = useState(true);
  const [salaryStrcutureOptions, setSalaryStructureOptions] = useState([]);
  const [salaryHeadOptions, setSalaryHeadOptions] = useState([]);
  const [salaryCategoryType, setSalaryCategoryType] = useState([]);
  const [printNames, setPrintNames] = useState([]);
  const [formulaOptions, setFormulaOptions] = useState([]);
  const [slabDefinitionOptions, setSlabDefinitionOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(1);
  const [salaryHeads, setSalaryHeads] = useState([]);

  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    salaryStructureId: [values.salaryStructureId !== ""],
    salaryHeadId: [values.salaryHeadId !== ""],
    salaryCategory: [values.salaryCategory !== ""],
    remarks: [values.remarks !== ""],
  };
  const errorMessages = {
    salaryStructureId: ["This field required"],
    salaryHeadId: ["This field required"],
    salaryCategory: ["This field required"],
    remarks: ["This field required"],
  };

  if (values.salaryCategory === "Formula") {
    checks["formulaName"] = [values.formulaName.length > 0];
    checks["percentage"] = [
      values.percentage !== "",
      /^[0-9.]+$/.test(values.percentage),
      parseInt(values.percentage) <= 100,
    ];

    errorMessages["formulaName"] = ["This field required"];
    errorMessages["percentage"] = [
      "This field required",
      "Invalid Percentage",
      "Percentage should be < 100",
    ];
  }

  if (salaryCategoryType[values.salaryHeadId] === "Earning") {
    checks["fromDate"] = [values.fromDate !== null];
    errorMessages["fromDate"] = ["This field required"];
  }

  useEffect(() => {
    getSalaryStructure();
    getSlabDetails();
    if (
      pathname.toLowerCase() === "/salarymaster/salarystructureassignment/new"
    ) {
      setIsNew(true);
      setCrumbs([
        { name: "Salary Master", link: "/SalaryMaster" },
        { name: "Index", link: "/SalaryMaster/Assignment" },
        { name: "Salary Strcuture Assignment" },
        { name: "Create" },
      ]);
    } else {
      getData();
      setIsNew(false);
      setCrumbs([
        { name: "Salary Master", link: "/SalaryMaster" },
        { name: "Index", link: "/SalaryMaster/Assignment" },
        { name: "Salary Strcuture Assignment" },
        { name: "Update" },
      ]);
    }
  }, [pathname]);

  useEffect(() => {
    getSalaryHeads();
  }, [values.salaryStructureId]);

  useEffect(() => {
    getFormulaHeads();
  }, [values.salaryCategory === "Formula"]);

  const getData = async () => {
    await axios
      .get(`/api/finance/SalaryStructureDetails/${id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          salaryStructureId: res.data.data.salary_structure_id,
          salaryHeadId: res.data.data.salary_structure_head_id,
          formulaName: res.data.data.voucher_head_new_ids,
          slabDetailsId: res.data.data.slab_details_id,
          fromDate: res.data.data.from_date,
          percentage: res.data.data.percentage,
          expression: res.data.data.testing_expression,
          salaryCategory: res.data.data.salary_category,
          remarks: res.data.data.remarks,
          grossLimit: res.data.data.gross_limit,
        }));
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getSalaryStructure = async () => {
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

  const getSalaryHeads = async () => {
    if (values.salaryStructureId) {
      await axios
        .get(`/api/finance/getFormulaDetails/${values.salaryStructureId}`)
        .then((res) => {
          const salaryHeadIds = res.data.data.map(
            (obj) => obj.salary_structure_head_id
          );

          axios
            .get(`/api/finance/SalaryStructureHead1`)
            .then((res) => {
              if (isNew === true) {
                const removeDuplicates = res.data.data.filter(
                  (obj) =>
                    salaryHeadIds.includes(obj.salary_structure_head_id) ===
                    false
                );

                setSalaryHeadOptions(
                  removeDuplicates.map((obj) => ({
                    value: obj.salary_structure_head_id,
                    label: obj.voucher_head,
                  }))
                );

                const tempCategoryTypes = {};
                removeDuplicates.forEach((obj) => {
                  tempCategoryTypes[obj.salary_structure_head_id] =
                    obj.category_name_type;
                });

                const printName = {};
                res.data.data.forEach((obj) => {
                  printName[obj.voucher_head_new_id] = obj.print_name;
                });

                setPrintNames(printName);
                setSalaryCategoryType(tempCategoryTypes);
                setSalaryHeads(removeDuplicates);
              } else {
                setSalaryHeadOptions(
                  res.data.data.map((obj) => ({
                    value: obj.salary_structure_head_id,
                    label: obj.voucher_head,
                  }))
                );

                const tempCategoryTypes = {};
                res.data.data.forEach((obj) => {
                  tempCategoryTypes[obj.salary_structure_head_id] =
                    obj.category_name_type;
                });

                const printName = {};
                res.data.data.forEach((obj) => {
                  printName[obj.voucher_head_new_id] = obj.print_name;
                });

                setPrintNames(printName);
                setSalaryCategoryType(tempCategoryTypes);
                setSalaryHeads(res.data.data);
              }
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  };

  const getFormulaHeads = async () => {
    if (values.salaryStructureId) {
      await axios
        .get(`/api/finance/SalaryStructureHead2/${values.salaryStructureId}`)
        .then((res) => {
          if (isNew === true) {
            setFormulaOptions(
              res.data.data.map((obj) => ({
                value: obj.voucher_head_new_id,
                label: obj.voucher_head_names,
              }))
            );
          } else {
            const removeDuplicates = res.data.data.filter(
              (obj) =>
                obj.voucher_head_new_id !==
                parseInt(
                  salaryHeads
                    .filter(
                      (fil) =>
                        fil.salary_structure_head_id ===
                        parseInt(values.salaryHeadId)
                    )
                    .map((obj1) => obj1.voucher_head_new_id)
                    .toString()
                )
            );

            setFormulaOptions(
              removeDuplicates.map((obj) => ({
                value: obj.voucher_head_new_id,
                label: obj.voucher_head_names,
              }))
            );
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const getSlabDetails = async () => {
    await axios
      .get(`/api/finance/SlabDetails`)
      .then((res) => {
        setSlabDefinitionOptions(
          res.data.data.map((obj) => ({
            value: obj.slab_details_id,
            label: obj.slab_details_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = async (e) => {
    if (e.target.name === "salaryCategory" && e.target.value === "Formula") {
      if (requiredFields.includes("percentage") === false) {
        requiredFields.push("percentage");
      }
    }

    if (e.target.name === "salaryCategory" && e.target.value !== "Formula") {
      if (requiredFields.includes("percentage") === true) {
        requiredFields.splice(requiredFields.indexOf("percentage"), 1);
      }
    }
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "salaryHeadId" && salaryCategoryType[newValue] === "Earning") {
      if (requiredFields.includes("fromDate") === false) {
        requiredFields.push("fromDate");
      }
    }

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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
      const temp = {};
      temp.active = true;
      temp.salary_category = values.salaryCategory;
      temp.salary_structure_id = values.salaryStructureId;
      temp.salary_structure_head_id = values.salaryHeadId;
      temp.from_date = values.fromDate;
      temp.formula_name =
        values.formulaName.length > 0
          ? values.formulaName
              .toString()
              .split(",")
              .map((obj) => printNames[obj])
              .toString()
          : "";
      temp.remarks = values.remarks;
      temp.gross_limit = values.grossLimit;
      temp.percentage = values.percentage;
      if (values.salaryCategory === "Formula") {
        temp.testing_expression =
          values.percentage +
          "%" +
          "*" +
          "(" +
          values.formulaName
            .toString()
            .split(",")
            .map((obj) => printNames[obj])
            .join("+") +
          ")";
      }
      temp.slab_details_id = values.slabDetailsId;
      temp.voucher_head_new_ids = values.formulaName.toString();
      temp.isPayDay = values.isPayDay;

      await axios
        .post(`/api/finance/SalaryStructureDetails`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Salary head assigned successfully !!",
            });
            setAlertOpen(true);
            setValues(initialValues);
            setValues((prev) => ({
              ...prev,
              salaryStructureId: temp.salary_structure_id,
            }));

            requiredFields.map(
              (obj) => requiredFields.splice(requiredFields.indexOf(obj)),
              1
            );

            [
              "salaryStructureId",
              "salaryHeadId",
              "salaryCategory",
              "remarks",
            ].forEach((obj) => {
              requiredFields.push(obj);
            });

            setCount(count + 1);
            getSalaryHeads();
          }
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

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = data;

      temp.active = true;
      temp.formula_name =
        values.formulaName.length > 0
          ? values.formulaName
              .toString()
              .split(",")
              .map((obj) => printNames[obj])
              .toString()
          : "";
      temp.from_date = values.fromDate;
      temp.gross_limit = values.grossLimit;
      temp.percentage = values.percentage;
      temp.remarks = values.remarks;
      temp.salary_category = values.salaryCategory;
      temp.salary_structure_head_id = values.salaryHeadId;
      temp.salary_structure_id = values.salaryStructureId;
      temp.slab_details_id = values.slabDetailsId;
      temp.voucher_head_new_ids = values.formulaName.toString();
      if (values.salaryCategory === "Formula") {
        temp.testing_expression =
          values.percentage +
          "%" +
          "*" +
          "(" +
          values.formulaName
            .toString()
            .split(",")
            .map((obj) => printNames[obj])
            .join("+") +
          ")";
      } else {
        temp.testing_expression = "";
      }

      await axios
        .put(
          `/api/finance/SalaryStructureDetails/${temp.salary_structure_details_id}`,
          temp
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Salary head assigned successfully !!",
            });
            setAlertOpen(true);
            navigate("/salarymaster/assignment", { replace: true });
          }
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
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="salaryStructureId"
                label="Salary Structure"
                value={values.salaryStructureId}
                options={salaryStrcutureOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!isNew}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="salaryHeadId"
                label="Salary Head"
                value={values.salaryHeadId}
                options={salaryHeadOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!isNew}
                required
              />
            </Grid>

            {salaryCategoryType[values.salaryHeadId] === "Earning" ? (
              <Grid item xs={12} md={4}>
                <CustomDatePicker
                  views={["month", "year"]}
                  openTo="month"
                  name="fromDate"
                  label="Valid From"
                  inputFormat="MM/YYYY"
                  helperText="mm/yyyy"
                  value={values.fromDate}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.fromDate}
                  errors={errorMessages.fromDate}
                  required
                />
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12} md={4}>
              <CustomSelect
                name="salaryCategory"
                label="Calculation Type"
                value={values.salaryCategory}
                items={[
                  { value: "Lumpsum", label: "Lumpsum" },
                  { value: "Formula", label: "Formula" },
                  { value: "GrossPercentage", label: "Gross Percentage" },
                  { value: "slab", label: "slab" },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>

            {(salaryCategoryType[values.salaryHeadId] === "Deduction" ||
              salaryCategoryType[values.salaryHeadId] === "Management") &&
            values.salaryCategory === "Formula" ? (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="grossLimit"
                  label="Gross Limit"
                  value={values.grossLimit}
                  handleChange={handleChange}
                />
              </Grid>
            ) : (
              <></>
            )}

            {values.salaryCategory === "Formula" ? (
              <>
                <Grid item xs={12} md={4}>
                  <CheckboxAutocomplete
                    name="formulaName"
                    label="Sum of Heads"
                    value={values.formulaName}
                    options={formulaOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    handleSelectAll={handleSelectAll}
                    handleSelectNone={handleSelectNone}
                    checks={checks.formulaName}
                    errors={errorMessages.formulaName}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="percentage"
                    label="Percentage (%)"
                    value={values.percentage}
                    handleChange={handleChange}
                    checks={checks.percentage}
                    errors={errorMessages.percentage}
                    required
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}

            {values.salaryCategory === "slab" ? (
              <>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="slabDetailsId"
                    label="Slab"
                    value={values.slabDetailsId}
                    options={slabDefinitionOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                </Grid>
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
                checks={checks.remarks}
                errors={errorMessages.remarks}
                required
              />
            </Grid>
            <Grid item xs={12} md={4} mt={-1}>
              <CustomRadioButtons
                name="isPayDay"
                label="Calculate on pay days"
                value={values.isPayDay}
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                handleChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
              >
                <Grid item xs={2}>
                  <Button
                    style={{ borderRadius: 7, marginTop: "20px" }}
                    variant="contained"
                    color="primary"
                    disabled={!requiredFieldsValid() || loading}
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
            </Grid>

            <Grid item xs={12} md={12}>
              {values.salaryStructureId ? (
                <SalaryStructureView
                  id={values.salaryStructureId}
                  count={count}
                />
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}

export default SalaryStructureAssignment;
