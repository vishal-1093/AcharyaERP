import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import ModalWrapper from "../../../components/ModalWrapper";
import axios from "../../../services/Api";
import SalaryStructureDetails from "./SalaryStructureDetails";
import useAlert from "../../../hooks/useAlert";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import { useLocation } from "react-router-dom";

const initialValues = {
  salaryStructureId: null,
  salaryHeadId: null,
  formulaName: [],
  slabDetailsId: null,
  fromDate: null,
  percentage: "",
  expression: "",
  convertedPercentage: "",
  salaryCategory: "",
  remarks: "",
  grossLimit: "",
};

const requiredFields = ["salaryStructureId", "salaryHeadId", "salaryCategory"];

function SalaryStructureAssignment() {
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [slabId, setSlabId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [salaryDetails, setSalaryDetails] = useState([]);
  const [salaryStrcutureOptions, setSalaryStructureOptions] = useState([]);
  const [categoryType, setCategoryType] = useState("Earning");
  const [formulaOptions, setFormulaOptions] = useState([]);
  const [salaryHeadOptions, setSalaryHeadOptions] = useState([]);
  const [slabDefinitionOptions, setSlabDefinitionOptions] = useState([]);
  const [printNames, setPrintNames] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();

  useEffect(() => {
    getSalaryStructure();
    getSalaryHeads();
    getSlabDetails();
  }, [pathname]);

  useEffect(() => {
    getFormulaDetails();
    getSalaryCategory();
    getFormulaDetailsOne();
  }, [values.salaryStructureId, values.salaryHeadId]);

  const checks = {};
  const errorMessages = {};

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
  const getSalaryHeads = async () => {
    await axios
      .get(`/api/finance/SalaryStructureHead1`)
      .then((res) => {
        setSalaryHeadOptions(
          res.data.data.map((obj) => ({
            value: obj.salary_structure_head_id,
            label: obj.voucher_head,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getFormulaDetails = async () => {
    if (values.salaryStructureId) {
      await axios
        .get(`/api/finance/SalaryStructureHead1`)
        .then((res) => {
          const printName = {};
          res.data.data.map((obj) => {
            printName[obj.voucher_head_new_id] = obj.print_name;
          });
          setPrintNames(printName);
        })
        .catch((err) => console.error(err));

      await axios
        .get(`/api/finance/SalaryStructureHead2/${values.salaryStructureId}`)
        .then((res) => {
          setFormulaOptions(
            res.data.data.map((obj) => ({
              value: obj.voucher_head_new_id,
              label: obj.voucher_head_names,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getSalaryCategory = async () => {
    if (values.salaryHeadId) {
      await axios
        .get(`/api/finance/SalaryStructureHead/${values.salaryHeadId}`)
        .then((res) => {
          setCategoryType(res.data.data.category_name_type);
        })
        .catch((err) => console.error(err));
    }
  };

  const getFormulaDetailsOne = async () => {
    if (values.salaryStructureId) {
      await axios
        .get(`/api/finance/getFormulaDetails/${values.salaryStructureId}`)
        .then((res) => {
          setSalaryDetails(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChange = (e) => {
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

  const handleSlabDetailsId = async (val) => {
    setWrapperOpen(true);
    await axios
      .get(`/api/getAllValues`)
      .then((res) => {
        const Id = res.data.data.filter(
          (obj) => obj.slab_details_id === val.slab_details_id
        );
        setSlabId(Id);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeFormula = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handlePercentage = (e) => {
    if (e.target.name === "convertedPercentage") {
      const percentageFields = ["convertedPercentage"];
      percentageFields.forEach((obj) => {
        requiredFields.push(obj);
        checks[obj] = [values.obj !== ""];
        errorMessages[obj] = ["This field is required"];
      });
    }
    const percent = e.target.value;
    const newFormula =
      percent +
      "%" +
      "*" +
      "(" +
      values.formulaName.map((obj) => printNames[obj]).join("+") +
      ")";
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      percentage: percent,
      expression: newFormula,
    });
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
      const formulaTemp = values.formulaName.map((obj) => printNames[obj]);
      const temp = {};
      temp.active = true;
      temp.salary_category = values.salaryCategory;
      temp.salary_structure_id = values.salaryStructureId;
      temp.salary_structure_head_id = values.salaryHeadId;
      temp.from_date = values.fromDate;
      temp.formula_name = formulaTemp.toString();
      temp.remarks = values.remarks;
      temp.gross_limit = values.grossLimit;
      temp.percentage = values.percentage;
      temp.testing_expression = values.expression;
      temp.slab_details_id = values.slabDetailsId;

      await axios
        .post(`/api/finance/SalaryStructureDetails`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Salary head assigned successfully !!",
          });
          setAlertOpen(true);
          setValues(initialValues);
          getFormulaDetailsOne();
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
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="salaryStructureId"
              label="Salary Structure"
              value={values.salaryStructureId}
              options={salaryStrcutureOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="salaryHeadId"
              label="Salary Head"
              value={values.salaryHeadId}
              options={salaryHeadOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          {categoryType === "Earning" ? (
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                views={["month", "year"]}
                name="fromDate"
                label="Valid From"
                inputFormat="MM/YYYY"
                helperText="mm/yyyy"
                value={values.fromDate}
                handleChangeAdvance={handleChangeAdvance}
                closeOnSelect
                required
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={12}>
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
          {categoryType === "Deduction" ||
          (categoryType === "Management" &&
            values.salaryCategory === "Formula") ? (
            <Grid item xs={12} md={6}>
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

          {values.salaryCategory === "Lumpsum" ? (
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
              />
            </Grid>
          ) : (
            <></>
          )}
          {values.salaryCategory === "Formula" ? (
            <>
              <Grid item xs={12} md={6}>
                <CustomMultipleAutocomplete
                  name="formulaName"
                  label="Sum of Heads"
                  value={values.formulaName}
                  options={formulaOptions}
                  handleChangeAdvance={handleChangeFormula}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="convertedPercentage"
                  label="Percentage (%)"
                  value={values.convertedPercentage}
                  handleChange={handlePercentage}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="remarks"
                  label="Remarks"
                  value={values.remarks}
                  handleChange={handleChange}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          {values.salaryCategory === "slab" ? (
            <>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="slabDetailsId"
                  label="Slab"
                  value={values.slabDetailsId}
                  options={slabDefinitionOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="remarks"
                  label="Remarks"
                  value={values.remarks}
                  handleChange={handleChange}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          {values.salaryCategory === "GrossPercentage" ? (
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
              />
            </Grid>
          ) : (
            <></>
          )}

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
                  disabled={loading}
                  onClick={handleCreate}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <strong>Create</strong>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            {values.salaryStructureId ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Structure</TableCell>
                      <TableCell> Head</TableCell>
                      <TableCell>Calculation</TableCell>
                      <TableCell>From Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Priority</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salaryDetails.map((val, i) => (
                      <TableRow key={i}>
                        <TableCell>{val.salary_category}</TableCell>
                        <TableCell>{val.salary_structure}</TableCell>
                        <TableCell>{val.voucher_head_short_name}</TableCell>
                        <TableCell>
                          {val.salary_category === "slab" ? (
                            <VisibilityIcon
                              onClick={() => handleSlabDetailsId(val)}
                            />
                          ) : (
                            val.testing_expression
                          )}
                        </TableCell>
                        <TableCell>
                          {val.from_date ? val.from_date.slice(0, 7) : ""}
                        </TableCell>
                        <TableCell>{val.category_name_type} </TableCell>
                        <TableCell>{val.priority}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <></>
            )}
          </Grid>

          <Grid item xs={12} md={12}>
            <ModalWrapper
              open={wrapperOpen}
              maxWidth={1000}
              setOpen={setWrapperOpen}
            >
              {values.salaryStructureId ? (
                <Grid item xs={12} md={12}>
                  <SalaryStructureDetails data={slabId} />
                </Grid>
              ) : (
                <></>
              )}
            </ModalWrapper>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default SalaryStructureAssignment;
