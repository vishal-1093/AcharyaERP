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
  const handleChange = (e) => {
    const splitName = e.target.name.split("-");
    if (splitName[0] === "scoredMarks") {
      setValues((prev) => ({
        ...prev,
        education: prev.education.map((obj, i) => {
          if (i === parseInt(splitName[1])) {
            return {
              ...obj,
              ["percentage"]: ((e.target.value / obj.maxMarks) * 100).toFixed(
                2
              ),
            };
          }

          return obj;
        }),
      }));
    }

    if (splitName[0] === "maxMarks") {
      setValues((prev) => ({
        ...prev,
        education: prev.education.map((obj, i) => {
          if (i === parseInt(splitName[1])) {
            return {
              ...obj,
              ["percentage"]: (
                (obj.scoredMarks / e.target.value) *
                100
              ).toFixed(2),
            };
          }

          return obj;
        }),
      }));
    }

    setValues((prev) => ({
      ...prev,
      education: prev.education.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return { ...obj, [splitName[0]]: e.target.value };
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
  };

  const remove = (index) => {
    let temp = values.education;
    temp.splice(index, 1);
    setValues((prev) => ({
      ...prev,
      ["education"]: temp,
    }));
  };

  return (
    <>
      <Box mt={1}>
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container rowSpacing={2} columnSpacing={2}>
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
                  <Grid item xs={12}>
                    <TableContainer component={Paper} elevation={3}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Qualification</StyledTableCell>
                            <StyledTableCell>
                              Board / University
                            </StyledTableCell>
                            <StyledTableCell>college Name</StyledTableCell>
                            <StyledTableCell>Passing Year</StyledTableCell>
                            <StyledTableCell>Max Marks</StyledTableCell>
                            <StyledTableCell>Marks Scored</StyledTableCell>
                            <StyledTableCell>Percentage</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <CustomTextField
                                name={"qualification"}
                                label=""
                                value="ok"
                                handleChange={handleChange}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name={"qualification"}
                                label=""
                                value="ok"
                                handleChange={handleChange}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name={"qualification"}
                                label=""
                                value="ok"
                                handleChange={handleChange}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name={"qualification"}
                                label=""
                                value="ok"
                                handleChange={handleChange}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name={"qualification"}
                                label=""
                                value="ok"
                                handleChange={handleChange}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name={"qualification"}
                                label=""
                                value="ok"
                                handleChange={handleChange}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name={"qualification"}
                                label=""
                                value="ok"
                                handleChange={handleChange}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="primary">
                      Qualification
                    </Typography>
                  </Grid>
                  {values.education.map((obj, i) => {
                    return (
                      <>
                        {i > 0 ? (
                          <Grid item xs={12} align="right">
                            <Tooltip title="Add qualification">
                              <IconButton onClick={add}>
                                <AddCircleOutlinedIcon
                                  color="success"
                                  sx={{ fontSize: 25 }}
                                />
                              </IconButton>
                            </Tooltip>
                            {i > 1 ? (
                              <Tooltip title="Remove qualification">
                                <IconButton onClick={() => remove(i)}>
                                  <DeleteIcon
                                    color="error"
                                    sx={{ fontSize: 25 }}
                                  />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <></>
                            )}
                          </Grid>
                        ) : (
                          <></>
                        )}

                        <Grid item xs={12}>
                          <Grid container rowSpacing={2} columnSpacing={2}>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                name={"qualification" + "-" + i}
                                label="Qualification"
                                value={
                                  i > 1
                                    ? values.education[i].qualification
                                    : obj.label
                                }
                                handleChange={handleChange}
                                checks={checks["qualification" + i]}
                                errors={errorMessages["qualification" + i]}
                                disabled={i < 2}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                name={"university" + "-" + i}
                                label="Name of Board / University"
                                value={values.education[i].university}
                                handleChange={handleChange}
                                checks={checks["university" + i]}
                                errors={errorMessages["university" + i]}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                name={"collegeName" + "-" + i}
                                label="College Name"
                                value={values.education[i].collegeName}
                                handleChange={handleChange}
                                checks={checks["collegeName" + i]}
                                errors={errorMessages["collegeName" + i]}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                name={"subject" + "-" + i}
                                label="Subject studied"
                                value={values.education[i].subject}
                                handleChange={handleChange}
                                checks={checks["subject" + i]}
                                errors={errorMessages["subject" + i]}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                name={"passingYear" + "-" + i}
                                label="Passing Year"
                                value={values.education[i].passingYear}
                                handleChange={handleChange}
                                checks={checks["passingYear" + i]}
                                errors={errorMessages["passingYear" + i]}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                name={"maxMarks" + "-" + i}
                                label="Max Marks"
                                value={values.education[i].maxMarks}
                                handleChange={handleChange}
                                checks={checks["maxMarks" + i]}
                                errors={errorMessages["maxMarks" + i]}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                name={"scoredMarks" + "-" + i}
                                label="Marks Scored"
                                value={values.education[i].scoredMarks}
                                handleChange={handleChange}
                                checks={checks["scoredMarks" + i]}
                                errors={errorMessages["scoredMarks" + i]}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                name={"percentage" + "-" + i}
                                label="Percentage"
                                value={values.education[i].percentage}
                                handleChange={handleChange}
                                checks={checks["percentage" + i]}
                                errors={errorMessages["percentage" + i]}
                                disabled
                                required
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                      </>
                    );
                  })}
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
