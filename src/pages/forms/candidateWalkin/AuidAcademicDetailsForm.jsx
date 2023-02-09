import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTextField from "../../../components/Inputs/CustomTextField";

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
        {values.education.map((obj, i) => {
          return (
            <Grid container rowSpacing={3} key={i}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Grid container rowSpacing={4} columnSpacing={4}>
                      <Grid item xs={12} md={12} mt={1}>
                        <Typography variant="subtitle2" color="primary">
                          Qualification
                        </Typography>
                      </Grid>
                      <Grid item xs={12} align="right">
                        <Tooltip title="Add qualification">
                          <IconButton onClick={add}>
                            <AddCircleOutlinedIcon
                              color="success"
                              sx={{ fontSize: 25 }}
                            />
                          </IconButton>
                        </Tooltip>
                        {i > 0 ? (
                          <Tooltip title="Remove qualification">
                            <IconButton onClick={() => remove(i)}>
                              <DeleteIcon color="error" sx={{ fontSize: 25 }} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <></>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name={"qualification" + "-" + i}
                          label="Qualification"
                          value={values.education[i].qualification}
                          handleChange={handleChange}
                          checks={checks["qualification" + i]}
                          errors={errorMessages["qualification" + i]}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
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

                      <Grid item xs={12} md={4}>
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

                      <Grid item xs={12} md={4}>
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

                      <Grid item xs={12} md={4}>
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
                      <Grid item xs={12} md={4}>
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
                      <Grid item xs={12} md={4}>
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
                      <Grid item xs={12} md={4}>
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
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </>
  );
}

export default AuidAcademicDetailsForm;
