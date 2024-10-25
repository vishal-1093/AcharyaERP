import React, { useState, useEffect, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  TableBody,
  CircularProgress,
} from "@mui/material";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { convertDateFormat } from "../../../utils/Utils";
import useAlert from "../../../hooks/useAlert";
const CustomModal = lazy(() => import("../../../components/CustomModal"));
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);

const initialValues = {
  department: "",
  employeeName: "",
  designation: "",
  dateofJoining: "",
  month: "",
  institute: "AUZ",
  proposedBasic: "",
  proposedSplPay: "",
  proposedGrosspay: "",
  proposedCtc: "",
  grossDifference: "",
  ctcDifference: "",
  remarks: "",
  proposedDesignation: "",
  proposedDepartment: "",
  proposedSalaryStructure: "",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: 15,
  },
}));
function SalaryBudgetCreate() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    dept_id: "",
    fromDate: "",
    toDate: "",
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const setCrumbs = useBreadcrumbs();
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [salStructureOptions, setSalStructureOptions] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [values, setValues] = useState(initialValues);
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const rowData = location?.state?.row;
  const [formulaData, setFormulaData] = useState([]);
  const [headValues, setHeadValues] = useState();
  const [offerData, setOfferData] = useState([]);
  const [ctcData, setCtcData] = useState();

  useEffect(() => {
    getData();
    getDepartmentOptions();
    getDesignationOptions();
    getSalaryStructureOptions();
    setCrumbs([
      { name: "Employee Details", link: "/SalaryIncrementEmpList" },
      { name: "Budget" },
      { name: "Create" },
    ]);
  }, [rowData?.empId]);

  useEffect(() => {
    getFormulaData(values.proposedSalaryStructure);
  }, [values.proposedSalaryStructure]);

  useEffect(() => {
    generateCtc();
  }, [values.month]);

  const getFormulaData = async (id) => {
    if (id) {
      await axios
        .get(`/api/finance/getFormulaDetails/${id}`)
        .then((res) => {
          setFormulaData(res.data.data);

          // filtering lumspsum data
          const getLumpsum = res.data.data
            .filter((fil) => fil.salary_category === "Lumpsum")
            .map((obj) => obj.salaryStructureHeadPrintName);

          const newFormulaValues = {};
          getLumpsum.forEach((obj) => {
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

          const headsTemp = {};
          res.data.data.forEach((obj) => {
            headsTemp[obj.salaryStructureHeadPrintName] =
              offerData[obj.salaryStructureHeadPrintName];
          });
          setHeadValues(headsTemp);
        })
        .catch((err) => console.error(err));
    }
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
          value: value || 0,
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
            Math.round(values.lumpsum[fil.salaryStructureHeadPrintName]),
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
              case "pt":
                calculate(
                  "d",
                  fil.voucher_head,
                  Math.round((amt * fil.percentage) / 100),
                  fil.category_name_type,
                  fil.priority,
                  fil.salaryStructureHeadPrintName
                );
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
              case "esic":
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
      ctc: Math.round(tempData?.grossEarning + tempData?.totManagement),
    }));

    tempValues["gross"] = tempData.grossEarning;
    tempValues["net_pay"] = tempData.grossEarning - tempData.totDeduction;
    setHeadValues(tempValues);
  };

  const getData = async () => {
    await axios
      .get(
        `/api/incrementCreation/getEmployeeDetailForIncrementCreation?empId=${rowData?.empId}`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = async () => {
    const selectedDepartment = departmentOptions.find(
      (option) => option.value === values.proposedDepartment
    );
    const selectedDesignation = designationOptions.find(
      (option) => option.value === values.proposedDesignation
    );
    const selectedSalaryStructure = salStructureOptions.find(
      (option) => option.value === values.proposedSalaryStructure
    );

    if (values.proposedDepartment) {
      setLoading(true);
      const getMonthYear = values.month.slice(0, 7).split("-");
      const temp = {};
      temp.empId = rows?.empId;
      temp.proposedDepartment = selectedDepartment.label;
      temp.proposedDepartmentId = values.proposedDepartment;
      temp.previousDepartment = rows?.previousDepartment;
      temp.previousDepartmentId = rows?.previousDepartmentId;

      temp.proposedDesignation = selectedDesignation.label;
      temp.proposedDesignationId = values?.proposedDesignation;
      temp.previousDesignation = rows?.previousDesignation;
      temp.previousDesignationId = rows?.previousDesignationId;

      temp.proposedBasic = values?.lumpsum?.basic;
      temp.previousBasic = rows?.previousBasic;

      temp.proposedCtc = values?.ctc;
      temp.previousCtc = rows?.previousCtc;

      temp.proposedSalaryStructure = selectedSalaryStructure.label;
      temp.proposedSalaryStructureId = values.proposedSalaryStructure;
      temp.previousSalaryStructure = rows?.previousSalaryStructure;
      temp.previousSalaryStructureId = rows?.previousSalaryStructureId;

      temp.previousSplPay = rows?.previousSplPay;
      temp.proposedSplPay = values?.lumpsum?.spl;

      temp.previousGrosspay = rows?.previousGrosspay;
      temp.proposedGrosspay = headValues?.gross;

      temp.grossDifference = headValues?.gross - rows?.previousGrosspay;
      temp.ctcDifference = values?.ctc - rows?.previousCtc;
      temp.year = parseInt(getMonthYear[0]);
      temp.month = parseInt(getMonthYear[1]);
      temp.remarks = values.remarks;
      temp.createdBy = empId;
      await axios
        .post(`/api/incrementCreation/saveIncrementCreationDetails`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({ severity: "success", message: "Data Saved" });
            navigate(`/BudgetCreatedIndex`);
          } else {
            setAlertMessage({ severity: "error", message: "Error Occured" });
          }
          setAlertOpen(true);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    } else {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = async (e) => {
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

  const getDepartmentOptions = async () => {
    await axios
      .get(`/api/incrementCreation/getDepartments`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.departmentId,
            label: obj.departmentName,
          });
        });
        setDepartmentOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getDesignationOptions = async () => {
    await axios
      .get(`/api/incrementCreation/getDesignations`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.designationId,
            label: obj.designationName,
          });
        });
        setDesignationOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getSalaryStructureOptions = async () => {
    await axios
      .get(`/api/incrementCreation/getsalaryStructures`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.salaryStructureId,
            label: obj.salaryStructureName,
          });
        });
        setSalStructureOptions(data);
      })
      .catch((err) => console.error(err));
  };
  const currentDate = new Date();

  const firstDayOfPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <FormWrapper>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />
          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Employee Name"
              defaultValue={rowData?.employeeName}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Employee Code"
              defaultValue={rowData?.empCode}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Date Of Joining"
              defaultValue={rowData?.dateofJoining}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              label="Experience"
              defaultValue={rowData?.experience}
              disabled
            />
          </Grid>
        </Grid>
      </FormWrapper>
      <>
        <TableContainer elevation={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell width={"50%"}>Existing Salary</StyledTableCell>
                <StyledTableCell width={"50%"}>Proposed Salary</StyledTableCell>
              </TableRow>
            </TableHead>

            {rows?.empId ? (
              <TableBody>
                {/* Row 1 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Designation"
                      value={rows?.previousDesignation}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomAutocomplete
                      name="proposedDesignation"
                      label="Designation"
                      value={values.proposedDesignation}
                      options={designationOptions}
                      handleChangeAdvance={handleChangeAdvance}
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 2 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Department"
                      defaultValue={rows?.previousDepartment}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomAutocomplete
                      name="proposedDepartment"
                      label="Departmnet"
                      value={values.proposedDepartment}
                      options={departmentOptions}
                      handleChangeAdvance={handleChangeAdvance}
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 3 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Salary Structure"
                      defaultValue={rows?.previousSalaryStructure}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomAutocomplete
                      name="proposedSalaryStructure"
                      label="Salary Structure"
                      value={values.proposedSalaryStructure}
                      options={salStructureOptions}
                      handleChangeAdvance={handleChangeAdvance}
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 4 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Basic"
                      defaultValue={rows?.previousBasic}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {formulaData.length > 0 ? (
                      formulaData
                        .filter(
                          (fil) =>
                            fil.salary_category === "Lumpsum" &&
                            fil.salaryStructureHeadPrintName === "basic"
                        )
                        .map((lu, i) => {
                          return (
                            <Grid item xs={12} md={4} key={i}>
                              <CustomTextField
                                name={
                                  lu.salaryStructureHeadPrintName +
                                  "-" +
                                  "lumpsum"
                                }
                                label={lu.voucher_head}
                                value={
                                  values.lumpsum[
                                    lu.salaryStructureHeadPrintName
                                  ]
                                }
                                handleChange={handleChange}
                                required
                              />
                            </Grid>
                          );
                        })
                    ) : (
                      <>
                        {" "}
                        <Typography variant="body2" color="red">
                          Note: Please select Salary Structure
                        </Typography>
                      </>
                    )}
                  </StyledTableCell>
                </TableRow>

                {/* Row 5 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="SplPay"
                      defaultValue={rows?.previousSplPay}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {formulaData.length > 0 ? (
                      formulaData
                        .filter(
                          (fil) =>
                            fil.salary_category === "Lumpsum" &&
                            fil.salaryStructureHeadPrintName === "spl_1" 
                        )
                        .map((lu, i) => {
                          return (
                            <Grid item xs={12} md={4} key={i}>
                              <CustomTextField
                                name={
                                  lu.salaryStructureHeadPrintName +
                                  "-" +
                                  "lumpsum"
                                }
                                label={lu.voucher_head}
                                value={
                                  values.lumpsum[
                                    lu.salaryStructureHeadPrintName
                                  ]
                                }
                                handleChange={handleChange}
                                required
                              />
                            </Grid>
                          );
                        })
                    ) : (
                      <>
                        {" "}
                        <Typography variant="body2" color="red">
                          Note: Please select Salary Structure
                        </Typography>
                      </>
                    )}
                  </StyledTableCell>
                </TableRow>

                {/* Row 6 */}
                {formulaData
                  .filter(
                    (fil) =>
                      fil.salary_category === "Lumpsum" &&
                      fil.salaryStructureHeadPrintName === "md"
                  )
                  .map((lu, i) => (
                    <React.Fragment key={i}>
                      <TableRow>
                        <StyledTableCell>
                          <CustomTextField
                            label="Medical Reimbursement"
                            defaultValue={rows?.reimbursement}
                            disabled
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Grid item xs={12} md={4} key={i}>
                            <CustomTextField
                              name={
                                lu.salaryStructureHeadPrintName +
                                "-" +
                                "lumpsum"
                              }
                              label={lu.voucher_head}
                              value={
                                values.lumpsum[lu.salaryStructureHeadPrintName]
                              }
                              handleChange={handleChange}
                              required
                            />
                          </Grid>
                        </StyledTableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}

                {/* Row 7 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Gross"
                      defaultValue={rows?.previousGrosspay}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomTextField
                      label="Gross"
                      value={headValues.gross}
                      name="proposedGrosspay"
                      handleChange={handleChange}
                      disabled
                    />
                    <Typography variant="body2" color="red">
                      Note: Please select month to get gross and CTC
                    </Typography>
                  </StyledTableCell>
                </TableRow>

                {/* Row 8 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="CTC"
                      defaultValue={rows?.previousCtc}
                      disabled
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomTextField
                      label="CTC"
                      value={values.ctc}
                      name="proposedCtc"
                      handleChange={handleChange}
                      disabled
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 9 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomDatePicker
                      name="month"
                      label="From Month"
                      value={values.month}
                      handleChangeAdvance={handleChangeAdvance}
                      views={["month", "year"]}
                      openTo="month"
                      inputFormat="MM/YYYY"
                      required
                      minDate={firstDayOfPreviousMonth}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomTextField
                      label="Gross Difference"
                      value={
                        headValues.gross
                          ? headValues.gross - rows?.previousGrosspay
                          : ""
                      }
                      name="grossDifference"
                      handleChange={handleChange}
                      disabled
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Row 10 */}
                <TableRow>
                  <StyledTableCell>
                    <CustomTextField
                      label="Remarks"
                      value={values.remarks}
                      name="remarks"
                      handleChange={handleChange}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomTextField
                      label="CTC Difference"
                      value={values.ctc ? values.ctc - rows?.previousCtc : ""}
                      name="ctcDifference"
                      handleChange={handleChange}
                      disabled
                    />
                  </StyledTableCell>
                </TableRow>

                {/* Add more rows as needed */}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </>
      <Grid item sx={12} align="center" padding={5}>
        <Button
          style={{ borderRadius: 7 }}
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <CircularProgress
              size={25}
              color="blue"
              style={{ margin: "2px 13px" }}
            />
          ) : (
            <strong>{"Generate"}</strong>
          )}
        </Button>
      </Grid>
    </Box>
  );
}

export default SalaryBudgetCreate;
