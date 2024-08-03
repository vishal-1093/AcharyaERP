import { useEffect, useRef, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  empId: null,
  relievingDate: null,
  comments: "",
  document: "",
};

const requiredFields = ["empId", "relievingDate", "comments", "document"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

function EmpDirectRelieveForm({
  setAlertMessage,
  setAlertOpen,
  setRelieveModalOpen,
  getData,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [noDueSubmitted, setNoDueSubmitted] = useState(false);

  const totalCharacters = 200;
  const remainingCharacter = useRef(200);

  const checks = {
    relievingDate: [values.comments !== null],
    comments: [values.comments !== ""],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    relievingDate: ["This field is required"],
    comments: ["This field is required"],
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getEmployeesOptions();
  }, []);

  useEffect(() => {
    if (values.empId) {
      validateAppiled();
      getNodue();
    }
  }, [values.empId]);

  useEffect(() => {
    validateNodue();
  }, [values.nodue]);

  const getEmployeesOptions = async () => {
    await axios
      .get(`/api/employee/getAllActiveEmployeeDetailsWithUserId`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.emp_id,
            label:
              obj.employee_name +
              " - " +
              obj.empcode +
              " - " +
              obj.dept_name_short,
          });
        });

        setEmployeeOptions(data);
        setEmpData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const validateAppiled = async () => {
    await axios
      .get(`/api/employee/checkEmpIdIsAlreadyPresentOrNot/${values.empId}`)
      .then(() => {})
      .catch(() => {
        setAlertMessage({
          severity: "error",
          message: "Resignation is already applied for this employee !!",
        });
        setAlertOpen(true);
        setRelieveModalOpen(false);
        getData();
      });
  };

  const validateNodue = () => {
    if (values.nodue) {
      const temp = [];
      values.nodue.forEach((obj) => {
        temp.push(obj.submittedStatus);
      });
      const status = temp.includes(false) === true ? true : false;
      setNoDueSubmitted(status);
    }
  };

  const getNodue = async () => {
    setValues((prev) => ({
      ...prev,
      ["nodue"]: [],
    }));
    const leaveApprover = empData.find((obj) => obj.emp_id === values.empId);

    // Get all HOD admins from various department
    const getHodAdmins = await axios
      .get("/api/getDepartmentBasedOnHodId")
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const hodIds = [];
    const HodList = [];
    getHodAdmins?.forEach((obj) => {
      hodIds.push({ [obj.id]: obj.hod_id });
      HodList.push({
        id: obj.hod_id,
        name: obj.hodUserName,
        dept: obj.dept_name,
        submittedStatus: false,
      });
    });

    if (
      getHodAdmins.length === 0 ||
      leaveApprover.LeaveApproverdept_id in hodIds === false ||
      hodIds[leaveApprover.LeaveApproverdept_id] !==
        leaveApprover.approvers_user_id
    ) {
      HodList.unshift({
        id: leaveApprover.approvers_user_id,
        name: leaveApprover.leaveApproverName,
        dept: leaveApprover.LeaveApproverdept_name,
        submittedStatus: false,
      });
    }

    setValues((prev) => ({
      ...prev,
      nodue: HodList,
    }));
  };

  const handleChange = (e) => {
    if (e.target.value.length > totalCharacters) return;

    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    remainingCharacter.current = totalCharacters - e.target.value.length;
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

  const handleChangeNodue = (e) => {
    const splitName = e.target.name.split("-");

    setValues((prev) => ({
      ...prev,
      nodue: prev.nodue.map((obj, i) => {
        if (obj.id === Number(splitName[1])) {
          return { ...obj, submittedStatus: e.target.checked };
        }

        return obj;
      }),
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
    const temp = {};

    temp.active = true;
    temp.emp_id = values.empId;
    temp.comments =
      "<p style='margin-bottom: 15px;'>Dear Sir/Madam,</p><p style='margin-bottom: 8px;'>It is with regret that I tender my resignation as &nbsp;&nbsp;<b>" +
      empData?.designation_name +
      "</b></p><p style='margin-bottom: 15px;text-align:justify'>May I take this opportunity to thank you for all of the invaluable help, advice and encouragement that you have given me during my service in your esteemed organisation. I have thoroughly enjoyed my time here but I feel the moment is now right for me to take up new responsibilities and challenges.</p><p>Yours sincerely</p>";
    temp.nodues_approve_status = 0;
    temp.status = 1;
    temp.requested_relieving_date = values.relievingDate;
    temp.relieving_date = values.relievingDate;

    setLoading(true);

    const getEmpData = empData.find((obj) => obj.emp_id === values.empId);

    //   deactivate user
    await axios
      .delete(`/api/UserAuthentication/${getEmpData.id}`)
      .then((res) => {})
      .catch((err) => console.error(err));

    await axios
      .post(`/api/employee/resignation`, temp)
      .then((res) => {
        if (res.data.success === true) {
          // Inserting data into no due assignment table
          const nodueTemp = [];

          values.nodue.forEach((obj) => {
            nodueTemp.push({
              active: true,
              department_id: getEmpData.dept_id,
              employee_Id: values.empId,
              resignation_id: res.data.data.resignation_id,
              approver_id: obj.id,
              no_due_status: obj.submittedStatus,
              approver_date: moment(),
            });
          });

          axios
            .post("/api/employee/noDuesAssignment", nodueTemp)
            .then((nodueRes) => {})
            .catch((err) => console.error(err));

          axios
            .delete(`/api/employee/deactivateEmployeeDetails/${values.empId}`)
            .then((resEmp) => {})
            .catch((errEmp) => console.error(errEmp));

          const dataArray = new FormData();
          dataArray.append("rad[" + 0 + "].file", values.document);
          dataArray.append("resignation_id", res.data.data.resignation_id);
          dataArray.append("active", true);
          dataArray.append("emp_id", values.empId);

          axios
            .post("/api/employee/uploadFileResignationAttachment", dataArray)
            .then((docuRes) => {})
            .catch((err) => console.error(err));

          setAlertMessage({
            severity: "success",
            message: "Relieved successfully !!",
          });
          setAlertOpen(true);
          setLoading(false);
          setRelieveModalOpen(false);
          getData();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box p={2}>
      <Card elevation={4}>
        <CardHeader
          title="Relieve Employee"
          titleTypographyProps={{ variant: "subtitle2" }}
          sx={{
            backgroundColor: "primary.main",
            color: "headerWhite.main",
            textAlign: "center",
            padding: 1,
          }}
        />
        <CardContent sx={{ padding: 3 }}>
          <Grid container rowSpacing={4} columnSpacing={4}>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="empId"
                label="Employee"
                value={values.empId}
                options={employeeOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomDatePicker
                name="relievingDate"
                label="Relieving Date"
                value={values.relievingDate}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.relievingDate}
                errors={errorMessages.relievingDate}
                disableFuture
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <CustomTextField
                    name="comments"
                    label="Comments"
                    value={values.comments}
                    handleChange={handleChange}
                    checks={checks.comments}
                    errors={errorMessages.comments}
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12} align="right">
                  <Typography variant="body2">
                    Characters Remaining {remainingCharacter.current}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              {values?.nodue?.length > 0 ? (
                <TableContainer elevation={2}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sl No</StyledTableCell>
                        <StyledTableCell>HOD</StyledTableCell>
                        <StyledTableCell>Department</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {values.nodue.map((obj, i) => {
                        return (
                          <TableRow key={i}>
                            <StyledTableCellBody>{i + 1}</StyledTableCellBody>
                            <StyledTableCellBody>
                              {obj.name}
                            </StyledTableCellBody>
                            <StyledTableCellBody>
                              {obj.dept}
                            </StyledTableCellBody>
                            <StyledTableCellBody sx={{ textAlign: "center" }}>
                              <Checkbox
                                name={"submittedStatus-" + obj.id}
                                onChange={handleChangeNodue}
                                sx={{
                                  color: "auzColor.main",
                                  "&.Mui-checked": {
                                    color: "auzColor.main",
                                  },
                                  padding: 0,
                                }}
                              />
                            </StyledTableCellBody>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <></>
              )}
            </Grid>

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
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="error"
                onClick={handleCreate}
                disabled={loading || !requiredFieldsValid() || noDueSubmitted}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Relieve"
                )}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EmpDirectRelieveForm;
