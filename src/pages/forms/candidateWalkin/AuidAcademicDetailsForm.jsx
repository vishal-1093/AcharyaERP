import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  styled,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import qualificationList from "../../../utils/QualificationList";
import axios from "../../../services/Api";

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
  const [universityOptions, setUniversityOptions] = useState([]);
  const [count, setCount] = useState(3);

  useEffect(() => {
    getUniversityOptions();
  }, []);

  const getUniversityOptions = async () => {
    axios(`/api/academic/boardUniversity`)
      .then((res) => {
        const temp = {};
        res.data.data.forEach((obj) => {
          if (obj.board_university_type in temp === true) {
            temp[obj.board_university_type].push({
              value: obj.board_university_id,
              label: obj.board_university_name,
            });
          } else {
            const arr = [];
            arr.push({
              value: obj.board_university_id,
              label: obj.board_university_name,
            });
            temp[obj.board_university_type] = arr;
          }
        });

        setUniversityOptions(temp);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAcademic = (e) => {
    const splitName = e.target.name.split("-");

    setValues((prev) => ({
      ...prev,
      education: prev.education.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: e.target.value,
          };
        return obj;
      }),
    }));

    if (splitName[0] === "scoredMarks") {
      calculatepercent(
        e.target.value,
        values.education[splitName[1]].maxMarks,
        splitName[1]
      );
    }

    if (splitName[0] === "maxMarks") {
      calculatepercent(
        values.education[splitName[1]].scoredMarks,
        e.target.value,
        splitName[1]
      );
    }

    // if (isNaN(value) === true || !value) {
    //   value = 0;
    // }

    // if (splitName[0] === "scoredMarks") {
    //   const getMax = parseInt(values.education[splitName[1]].maxMarks);
    //   value = value > getMax ? getMax : value;
    //   calculatepercent(value, getMax, splitName[1]);
    // }

    // if (splitName[0] === "maxMarks") {
    //   let getScored = parseInt(values.education[splitName[1]].scoredMarks);
    //   if (value < getScored) {
    //     getScored = 0;
    //     value = 0;
    //   }

    //   calculatepercent(getScored, value, splitName[1]);
    // }
  };

  const calculatepercent = (scored, total, id) => {
    let scoredMarks = parseInt(scored);
    let maxMarks = parseInt(total);

    if (isNaN(scoredMarks) === false && isNaN(maxMarks) === false) {
      if (scoredMarks > maxMarks) {
        scoredMarks = maxMarks;
      }

      console.log(scoredMarks);
      console.log(maxMarks);

      setValues((prev) => ({
        ...prev,
        education: prev.education.map((obj, i) => {
          if (i === parseInt(id))
            return {
              ...obj,
              ["scoredMarks"]: scoredMarks,
              ["maxMarks"]: maxMarks,
              ["percentage"]: Math.round((scoredMarks / maxMarks) * 100),
            };
          return obj;
        }),
      }));
    }

    // if (isNaN(scored) === true || !scored) {
    //   scored = 0;
    // }
    // if (isNaN(total) === true || !total) {
    //   total = 0;
    // }

    // const percentage = 100;
    // setValues((prev) => ({
    //   ...prev,
    //   education: prev.education.map((obj, i) => {
    //     if (i === parseInt(id))
    //       return {
    //         ...obj,
    //         ["percentage"]: percentage,
    //       };
    //     return obj;
    //   }),
    // }));
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
        percentage: "",
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
        <Grid container rowSpacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Qualification</StyledTableCell>
                    <StyledTableCell>Board / University</StyledTableCell>
                    <StyledTableCell>School / College Studied</StyledTableCell>
                    <StyledTableCell>Passing Year</StyledTableCell>
                    <StyledTableCell>Max Marks</StyledTableCell>
                    <StyledTableCell>Marks Scored</StyledTableCell>
                    <StyledTableCell>Percentage</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.education.map((obj, i) => {
                    return (
                      <TableRow
                        key={i}
                        sx={{
                          borderTopStyle: "hidden",
                          borderBottomStyle: "hidden",
                        }}
                      >
                        <TableCell width="17%">
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
                            options={
                              values.education[i].qualification in
                                universityOptions ===
                              true
                                ? universityOptions[
                                    values.education[i].qualification
                                  ]
                                : []
                            }
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
                        <TableCell width="8%">
                          <CustomTextField
                            name={"passingYear" + "-" + i}
                            label=""
                            value={values.education[i].passingYear}
                            handleChange={handleAcademic}
                            checks={checks["passingYear" + i]}
                            errors={errorMessages["passingYear" + i]}
                          />
                        </TableCell>
                        <TableCell width="8%">
                          <CustomTextField
                            name={"maxMarks" + "-" + i}
                            label=""
                            value={values.education[i].maxMarks}
                            handleChange={handleAcademic}
                            checks={checks["maxMarks" + i]}
                            errors={errorMessages["maxMarks" + i]}
                          />
                        </TableCell>
                        <TableCell width="8%">
                          <CustomTextField
                            name={"scoredMarks" + "-" + i}
                            label=""
                            value={values.education[i].scoredMarks}
                            handleChange={handleAcademic}
                            checks={checks["scoredMarks" + i]}
                            errors={errorMessages["scoredMarks" + i]}
                          />
                        </TableCell>
                        <TableCell width="8%">
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
                  <TableRow sx={{ borderTopStyle: "hidden" }}>
                    <TableCell>
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
                        required
                      />
                    </TableCell>
                    <TableCell>
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
                        required
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AuidAcademicDetailsForm;
