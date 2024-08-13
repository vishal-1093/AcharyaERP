import { useState, useEffect, lazy } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Table,
  Typography,
  TableCell,
  TableRow,
  ListItemText,
  TableContainer,
  Paper,
  TableBody,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import { useLocation } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import logo1 from "../../../assets/logo1.png";
import { makeStyles } from "@mui/styles";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomRadioButtons = lazy(() => import("../../../components/Inputs/CustomRadioButtons"));

const styles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: 880,
    marginLeft: "120px",
  },
  bor: {
    border: 1,
  },
}));

function ExitFormPDF() {
  const [values, setValues] = useState(initialValues);
  const [questionList, setQuestionList] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const classes = styles();

  useEffect(() => {
    if (pathname.toLowerCase() === "/exitFormmaster/exitform/new") {
      setCrumbs([
        { name: "ExitFormMaster", link: "/ExitFormMaster/ExitForms" },
        { name: "Exit Form" },
      ]);
    }
  }, [pathname]);

  useEffect(() => {
    getQuestionList();
  }, []);

  const getQuestionList = async () => {
    await axios
      .get(`/api/employee/employeeExitFormalityQuestionsActive`)
      .then((res) => {
        setQuestionList(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          marginLeft={30}
          marginBottom={3}
          justifyContent="center"
          alignItems="center"
          xs={8}
        >
          <AppBar position="static">
            <Toolbar>
              <img
                src={logo1}
                style={{ marginLeft: 10, width: "15%", height: "15%" }}
              />
              <ListItemText>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, textAlign: "center" }}
                >
                  JMJ EDUCATION SOCIETY
                </Typography>

                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, textAlign: "center" }}
                >
                  ACHARYA INSTITUTES
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, textAlign: "center" }}
                >
                  Soladevanahalli, Hesarghatta Road, Bengaluru
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, textAlign: "center" }}
                >
                  EXIT INTERVIEW
                </Typography>
              </ListItemText>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid container alignItems="center" justifyContent="center">
          <Grid sx={{ mr: -10 }} xs={8}>
            <Table border={1} size="small">
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>Abcd</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Institute/Department</b>
                </TableCell>
                <TableCell>AGS</TableCell>
                <TableCell>English</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Date Of Relieving</b>
                </TableCell>
                <TableCell>{convertDateToString(new Date())}</TableCell>
              </TableRow>
            </Table>
          </Grid>
        </Grid>

        <Typography sx={{ ml: 30, mt: 5, mb: 1 }}>
          <b>Reason For Leaving</b>
        </Typography>
        <Grid container alignItems="center" justifyContent="center">
          <TableContainer
            component={Paper}
            sx={{ width: "67%", marginLeft: "8%" }}
          >
            <Table>
              <TableBody>
                {questionList.map((obj, i) => {
                  return (
                    <TableRow className={classes.bg}>
                      <TableCell
                        sx={{
                          textAlign: "justify",
                          borderRight: 1,
                          borderColor: "grey.300",
                          width: "300px",
                        }}
                      >
                        {obj.question}
                      </TableCell>
                      <TableCell>
                        <CustomRadioButtons
                          name="attachmentStatus"
                          value={values.attachmentStatus}
                          items={[
                            { value: true, label: "Yes" },
                            { value: false, label: "No" },
                          ]}
                          handleChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong>{"Submit"}</strong>
            )}
          </Button>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ExitFormPDF;
