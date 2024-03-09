import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Box,
  Grid,
  Typography,
  Paper,
  FormGroup,
  Card,
  CardContent,
  IconButton,
  styled,
  Tabs,
  Tab,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  tableCellClasses,
  TableBody,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { convertToDMY } from "../utils/DateTimeUtils";
import SalaryBreakupView from "./SalaryBreakupView";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useParams } from "react-router-dom";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import CustomModal from "./CustomModal";
import useAlert from "../hooks/useAlert";
import moment from "moment";
import { Check, HighlightOff } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTextField from "./Inputs/CustomTextField";
import CustomSelect from "./Inputs/CustomSelect";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

const CustomTabsHorizontal = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "row",
  },
});

const CustomTabHorizontal = styled(Tab)(({ theme }) => ({
  height: "55px",
  fontSize: "14px",
  width: "195px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: theme.palette.blue.main,
    color: theme.palette.headerWhite.main,
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
}));

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const initialFamilyValues = {
  name: "",
  relationship: "",
  contactDetails: "",
  age: "",
  familyUniqueId: null,
};

const roleName = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.roleName;

function EmployeeDetailsView() {
  const [values, setValues] = useState({
    showPersonal: true,
    showEmployment: false,
    showBreakup: false,
  });
  const [data, setData] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const types = [
    {
      value: "showPersonal",
      label: "Personal Details",
    },
    {
      value: "showEmployment",
      label: "Employment Details",
    },
    {
      value: "showBreakup",
      label: "Salary Breakup",
    },
  ];
  const [tab, setTab] = useState("Personal");
  const [subTab, setSubTab] = useState("Family");
  const [familyData, setFamilyData] = useState([initialFamilyValues]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [editPersonalDetails, setEditPersonalDetails] = useState(false);

  const { userId, offerId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const empId = userId || localStorage.getItem("empId");

  const classes = useStyles();

  useEffect(() => {
    getData();
    getFamilyData();
  }, []);

  useEffect(() => {
    userId &&
      setCrumbs([
        { name: "Employee Index", link: "/EmployeeIndex" },
        { name: data.employee_name + " - " + data.empcode },
      ]);
  }, [data]);

  const getData = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails/${empId}`)
      .then((res) => {
        axios
          .get(
            `/api/employee/getAllApplicantDetails/${res.data.data[0].job_id}`
          )
          .then((res) => {
            setJobDetails(res.data);
          })
          .catch((err) => console.error(err));
        setData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const getFamilyData = async () => {
    await axios
      .get(`/api/employee/getFamilyStructureDetailsData/${empId}`)
      .then((res) => {
        const allFamilyData = [];
        if (res.data.data.length > 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            allFamilyData.push({
              active: res.data.data[i].active,
              name: res.data.data[i].name,
              relationship: res.data.data[i].relationship,
              contactDetails: res.data.data[i].contact_number,
              age: res.data.data[i].age,
              familyUniqueId: res.data.data[i].id,
            });
          }
          setFamilyData(allFamilyData);
        }
        setFamilyHistory(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (value, name) => {
    setValues((prev) => ({
      ...prev,
      [name]: !value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  const handleFamilyChange = (e, index) => {
    setFamilyData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleAddfamilydetailsBox = () => {
    setFamilyData((prev) => [...prev, initialFamilyValues]);
  };

  const handleRemovefamilydetailsBox = () => {
    const filterUser = [...familyData];
    filterUser.pop();
    setFamilyData(filterUser);
  };

  const handleActiveFamily = async (obj) => {
    const id = obj.id;

    setModalOpen(true);
    const handleToggle = async () => {
      if (obj.active === true) {
        await axios
          .delete(`/api/employee/familystructure/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getFamilyData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/employee/activatefamilystructure/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getFamilyData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    obj.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleCreateFamilyData = async () => {
    const postData = [];
    const putData = [];
    const allIds = [];

    familyData.forEach((obj, i) => {
      allIds.push(obj.familyUniqueId);
      if (obj.familyUniqueId === null) {
        postData.push({
          active: true,
          name: obj.name,
          emp_id: empId,
          relationship: obj.relationship,
          age: obj.age,
          contact_number: obj.contactDetails,
        });
      } else {
        putData.push({
          active: true,
          name: obj.name,
          emp_id: empId,
          family_structure_id: obj.familyUniqueId,
          relationship: obj.relationship,
          age: obj.age,
          contact_number: obj.contactDetails,
        });
      }
    });

    if (postData.length > 0) {
      await axios
        .post(`/api/employee/familystructure`, postData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Family details created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getFamilyData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
    if (putData.length > 0) {
      await axios
        .put(
          `/api/employee/updateFamilystructure/${allIds.toString()}`,
          putData
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Family details updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getFamilyData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
  };

  const handleEditPersonalDetails = async () => {
    const temp = {};
    temp.employeeId = empId;
    temp.personal_medical_history = values.personalMedicalHistory;
    temp.family_medical_history = values.familyMedicalHistory;

    await axios
      .put(`/api/employee/EmployeeMedicalHistory/${empId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Medical details updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
        }
        setAlertOpen(true);
        getData();
        setEditPersonalDetails(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <CustomTabsHorizontal
            value={tab}
            onChange={handleTabChange}
            orientation="horizontal"
            variant="scrollable"
            className="CustomTabsHorizontal"
          >
            <CustomTabHorizontal value="Personal" label="Personal" />
          </CustomTabsHorizontal>
        </Grid>

        {tab === "Personal" && (
          <Grid
            container
            spacing={2}
            columnSpacing={4}
            sx={{ marginTop: "1px" }}
          >
            <Grid item xs={4} md={2}>
              <CustomTabs
                value={subTab}
                onChange={handleSubTabChange}
                orientation="vertical"
                variant="scrollable"
                className="customTabs"
              >
                <CustomTab value="Family" label="Family" />
              </CustomTabs>
            </Grid>

            <Grid item xs={8} md={10}>
              {subTab === "Family" && (
                <>
                  <Grid item xs={12}>
                    <CustomModal
                      open={modalOpen}
                      setOpen={setModalOpen}
                      title={modalContent.title}
                      message={modalContent.message}
                      buttons={modalContent.buttons}
                    />

                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        padding: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Family Details
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleAddfamilydetailsBox}
                        align="right"
                        sx={{ borderRadius: 2 }}
                      >
                        Add
                      </Button>
                    </Typography>
                  </Grid>

                  {familyHistory.length > 0 ? (
                    <Grid item xs={12} mt={2}>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Name</StyledTableCell>
                              <StyledTableCell>Relationship</StyledTableCell>
                              <StyledTableCell>Contact</StyledTableCell>
                              <StyledTableCell>Age</StyledTableCell>
                              <StyledTableCell>Created By</StyledTableCell>
                              <StyledTableCell>Created Date</StyledTableCell>
                              {roleName === "Admin" ||
                              roleName === "HR ROLE" ||
                              roleName === "Super Admin" ? (
                                <StyledTableCell>Active</StyledTableCell>
                              ) : (
                                <></>
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {familyHistory.map((obj, i) => {
                              return (
                                <TableRow key={i}>
                                  <StyledTableCell>{obj.name}</StyledTableCell>
                                  <StyledTableCell>
                                    {obj.relationship}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {obj.contact_number}
                                  </StyledTableCell>
                                  <StyledTableCell>{obj.age}</StyledTableCell>
                                  <StyledTableCell>
                                    {obj.created_username}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {moment(obj.created_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </StyledTableCell>

                                  {(roleName === "Admin" ||
                                    roleName === "HR ROLE" ||
                                    roleName === "Super Admin") &&
                                  obj.active === true ? (
                                    <StyledTableCell>
                                      <IconButton
                                        label="Result"
                                        style={{ color: "green" }}
                                        onClick={() => handleActiveFamily(obj)}
                                      >
                                        <Check fontSize="small" />
                                      </IconButton>
                                    </StyledTableCell>
                                  ) : (roleName === "Admin" ||
                                      roleName === "HR ROLE" ||
                                      roleName === "Super Admin") &&
                                    obj.active === false ? (
                                    <StyledTableCell>
                                      <IconButton
                                        label="Result"
                                        style={{ color: "red" }}
                                        onClick={() => handleActiveFamily(obj)}
                                      >
                                        <HighlightOff fontSize="small" />
                                      </IconButton>
                                    </StyledTableCell>
                                  ) : (
                                    <></>
                                  )}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  ) : (
                    <></>
                  )}

                  {familyData.map((obj, i) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        component={Paper}
                        rowSpacing={2}
                        elevation={3}
                        p={2}
                        marginTop={2}
                        key={i}
                      >
                        <>
                          <Grid container rowSpacing={1.5} columnSpacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6">
                                Fill the details
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6} align="right">
                              <IconButton
                                color="error"
                                onClick={handleRemovefamilydetailsBox}
                                disabled={
                                  familyData.length === 1 ||
                                  obj.name !== "" ||
                                  obj.relationship !== ""
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Grid>
                            <Grid item xs={12} md={1.5}>
                              <Typography variant="subtitle2">Name</Typography>
                            </Grid>
                            <Grid item xs={12} md={4.5}>
                              <CustomTextField
                                name="name"
                                label="Name"
                                value={obj.name}
                                handleChange={(e) => handleFamilyChange(e, i)}
                              />
                            </Grid>
                            <Grid item xs={12} md={1.5}>
                              <Typography variant="subtitle2">
                                Relationship
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4.5}>
                              <CustomSelect
                                name="relationship"
                                label="Relationship"
                                value={obj.relationship}
                                items={[
                                  {
                                    value: "Spouse",
                                    label: "Spouse",
                                  },
                                  {
                                    value: "Father",
                                    label: "Father",
                                  },
                                  {
                                    value: "Mother",
                                    label: "Mother",
                                  },
                                  {
                                    value: "Brother",
                                    label: "Brother",
                                  },
                                  {
                                    value: "Son",
                                    label: "Son",
                                  },
                                  {
                                    value: "Daughter",
                                    label: "Daughter",
                                  },
                                ]}
                                handleChange={(e) => handleFamilyChange(e, i)}
                              />
                            </Grid>
                            <Grid item xs={12} md={1.5}>
                              <Typography variant="subtitle2">
                                Contact Details
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4.5}>
                              <CustomTextField
                                name="contactDetails"
                                label="contact Details"
                                value={obj.contactDetails}
                                handleChange={(e) => handleFamilyChange(e, i)}
                              />
                            </Grid>
                            <Grid item xs={12} md={1.5}>
                              <Typography variant="subtitle2">Age</Typography>
                            </Grid>
                            <Grid item xs={12} md={4.5}>
                              <CustomTextField
                                name="age"
                                label="Age"
                                value={obj.age}
                                handleChange={(e) => handleFamilyChange(e, i)}
                              />
                            </Grid>
                          </Grid>
                        </>
                      </Grid>
                    );
                  })}

                  <Grid item xs={12} mt={2} align="right">
                    <Button
                      sx={{ borderRadius: 2 }}
                      variant="contained"
                      color="success"
                      onClick={handleCreateFamilyData}
                    >
                      Save
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default EmployeeDetailsView;
