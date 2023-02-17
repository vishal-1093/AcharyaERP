import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  tableCellClasses,
  styled,
} from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import qualificationList from "../../../utils/QualificationList";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function AuidAcademicDetailsForm({ values, setValues, checks, errorMessages }) {
  const [universityOptions, setUniversityOptions] = useState([
    {
      value: "sslc",
      label: "SSLC",
    },
    {
      value: "puc",
      label: "PUC",
    },
    {
      value: "ug",
      label: "UG",
    },
    {
      value: "pg",
      label: "PG",
    },
  ]);
  const [count, setCount] = useState(3);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAcademic = (e) => {
    const splitName = e.target.name.split("-");
    let value = e.target.value;

    if (splitName[0] === "scoredMarks") {
      value =
        value > values.education[parseInt(splitName[1])].maxMarks
          ? values.education[parseInt(splitName[1])].maxMarks
          : value;

      calculatepercent(
        value,
        values.education[parseInt(splitName[1])].maxMarks,
        splitName[1]
      );
    }

    if (splitName[0] === "maxMarks") {
      calculatepercent(
        values.education[parseInt(splitName[1])].scoredMarks,
        value,
        splitName[1]
      );
    }

    setValues((prev) => ({
      ...prev,
      education: prev.education.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: value,
          };
        return obj;
      }),
    }));
  };

  const calculatepercent = (scored, total, id) => {
    setValues((prev) => ({
      ...prev,
      education: prev.education.map((obj, i) => {
        if (i === parseInt(id))
          return {
            ...obj,
            ["percentage"]: (
              (parseInt(scored) / parseInt(total)) *
              100
            ).toFixed(),
          };
        return obj;
      }),
    }));
  };
  // const handleChange = (e) => {
  //   const splitName = e.target.name.split("-");
  //   if (splitName[0] === "scoredMarks") {
  //     setValues((prev) => ({
  //       ...prev,
  //       education: prev.education.map((obj, i) => {
  //         if (i === parseInt(splitName[1])) {
  //           return {
  //             ...obj,
  //             ["percentage"]: ((e.target.value / obj.maxMarks) * 100).toFixed(
  //               2
  //             ),
  //           };
  //         }

  //         return obj;
  //       }),
  //     }));
  //   }

  //   if (splitName[0] === "maxMarks") {
  //     setValues((prev) => ({
  //       ...prev,
  //       education: prev.education.map((obj, i) => {
  //         if (i === parseInt(splitName[1])) {
  //           return {
  //             ...obj,
  //             ["percentage"]: (
  //               (obj.scoredMarks / e.target.value) *
  //               100
  //             ).toFixed(2),
  //           };
  //         }

  //         return obj;
  //       }),
  //     }));
  //   }

  //   setValues((prev) => ({
  //     ...prev,
  //     education: prev.education.map((obj, i) => {
  //       if (i === parseInt(splitName[1]))
  //         return { ...obj, [splitName[0]]: e.target.value };
  //       return obj;
  //     }),
  //   }));
  // };

  const handleChangeAdvance = async (name, newValue) => {
    const splitName = name.split("-");

    setValues((prev) => ({
      ...prev,
      education: prev.education.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return { ...obj, [splitName[0]]: newValue };
        return obj;
      }),
    }));
  };

  const add = () => {
    setValues((prev) => ({
      ...prev,
      ["education"]: prev["education"].concat({
        qualification: "",
        passingYear: "",
        university: "",
        collegeName: "",
        subject: "",
        maxMarks: "",
        scoredMarks: "",
        percentage: "0",
      }),
    }));
    setCount(count + 1);
  };

  const remove = (index) => {
    const temp = values.education;
    temp.pop();
    setValues((prev) => ({
      ...prev,
      ["education"]: temp,
    }));
    setCount(count - 1);
  };

  return (
    <>
      <Box mt={1}>
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container rowSpacing={2} columnSpacing={2}>
                  <Grid item xs={12}>
                    <TableContainer component={Paper} elevation={3}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Qualification</StyledTableCell>
                            <StyledTableCell>
                              Board / University
                            </StyledTableCell>
                            <StyledTableCell>College Name</StyledTableCell>
                            <StyledTableCell>Passing Year</StyledTableCell>
                            <StyledTableCell>Max Marks</StyledTableCell>
                            <StyledTableCell>Marks Scored</StyledTableCell>
                            <StyledTableCell>Percentage</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {values.education.map((obj, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell width="13%">
                                  <CustomAutocomplete
                                    name={"qualification" + "-" + i}
                                    label=""
                                    value={values.education[i].qualification}
                                    options={qualificationList}
                                    handleChangeAdvance={handleChangeAdvance}
                                    disabled={obj.disabled}
                                  />
                                </TableCell>
                                <TableCell width="25%">
                                  <CustomAutocomplete
                                    name={"university" + "-" + i}
                                    label=""
                                    value={values.education[i].university}
                                    options={universityOptions}
                                    handleChangeAdvance={handleChangeAdvance}
                                  />
                                </TableCell>
                                <TableCell width="25%">
                                  <CustomTextField
                                    name={"collegeName" + "-" + i}
                                    label=""
                                    value={values.education[i].collegeName}
                                    handleChange={handleAcademic}
                                  />
                                </TableCell>
                                <TableCell width="9%">
                                  <CustomTextField
                                    name={"passingYear" + "-" + i}
                                    label=""
                                    value={values.education[i].passingYear}
                                    handleChange={handleAcademic}
                                  />
                                </TableCell>
                                <TableCell width="9%">
                                  <CustomTextField
                                    name={"maxMarks" + "-" + i}
                                    label=""
                                    value={values.education[i].maxMarks}
                                    handleChange={handleAcademic}
                                  />
                                </TableCell>
                                <TableCell width="9%">
                                  <CustomTextField
                                    name={"scoredMarks" + "-" + i}
                                    label=""
                                    value={values.education[i].scoredMarks}
                                    handleChange={handleAcademic}
                                  />
                                </TableCell>
                                <TableCell width="9%">
                                  <CustomTextField
                                    name={"percentage" + "-" + i}
                                    label=""
                                    value={values.education[i].percentage}
                                    disabled
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell colSpan={7} sx={{ textAlign: "right" }}>
                              <Box display="inline" mr={count > 3 ? 1 : 0}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  onClick={add}
                                >
                                  <AddIcon />
                                </Button>
                              </Box>
                              {count > 3 ? (
                                <Box display="inline">
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={remove}
                                  >
                                    <RemoveIcon />
                                  </Button>
                                </Box>
                              ) : (
                                <></>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <CustomRadioButtons
                      name="studyIn"
                      label="Studied In"
                      value={values.studyIn}
                      items={[
                        {
                          value: "Urban",
                          label: "Urban",
                        },
                        {
                          value: "Rural",
                          label: "Rural",
                        },
                      ]}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <CustomRadioButtons
                      name="studyMedium"
                      label="Study Medium"
                      value={values.studyMedium}
                      items={[
                        {
                          value: "Kannada",
                          label: "Kannada",
                        },
                        {
                          value: "English",
                          label: "English",
                        },
                      ]}
                      handleChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AuidAcademicDetailsForm;
