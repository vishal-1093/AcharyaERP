import { memo, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import qualificationList from "../../../utils/QualificationList";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useAlert from "../../../hooks/useAlert";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
  },
}));

const optionalSubjectList = [
  { label: "Physics-Mathematics-Biology", value: "PMB" },
  { label: "Physics,Mathematics,Chemistry", value: "PMC" },
  { label: "Physics,Mathematics,Electronics", value: "PME" },
  { label: "Physics,Mathematics,Computer Science", value: "PMCs" },
];

const optionList = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const areaList = [
  { label: "Urban", value: "Urban" },
  { label: "Rural", value: "Rural" },
];

const AcademicDetailsForm = memo(
  ({
    academicValues,
    setAcademicValues,
    optionalValues,
    setOptionalValues,
  }) => {
    const [universityOptions, setUniversityOptions] = useState([]);
    const [count, setCount] = useState(3);

    const { setAlertMessage, setAlertOpen } = useAlert();

    useEffect(() => {
      getUniversityOptions();
    }, []);

    useEffect(() => {
      const { optionalMaxMarks, optionalScoredMarks } = optionalValues;
      if (optionalMaxMarks && optionalScoredMarks) {
        const scored = parseInt(optionalScoredMarks) || 0;
        const max = parseInt(optionalMaxMarks) || 0;
        setOptionalValues((prev) => ({
          ...prev,
          ["optionalPercentage"]: Math.round((scored / max) * 100),
          ["optionalScoredMarks"]: scored > max ? max : scored,
        }));
      }
    }, [optionalValues.optionalMaxMarks, optionalValues.optionalScoredMarks]);

    const getUniversityOptions = async () => {
      try {
        const { data: response } = await axios("/api/academic/boardUniversity");
        const responseData = response.data;
        const temp = {};
        qualificationList.forEach((obj) => {
          const filterData = responseData.filter(
            (item) => item.board_university_type === obj.value
          );
          if (filterData.length > 0) {
            const arr = [];
            filterData.forEach((filterItem) => {
              arr.push({
                value: filterItem.board_university_id,
                label: filterItem.board_university_name,
              });
            });
            temp[obj.value] = arr;
          }
        });
        setUniversityOptions(temp);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message:
            err.response?.data?.message || "Failed to fetch universities",
        });
        setAlertOpen(true);
      }
    };

    const handleChangeAdvance = (name, newValue) => {
      const [field, index] = name.split("-");
      setAcademicValues((prev) =>
        prev.map((obj, i) => {
          if (i === parseInt(index)) return { ...obj, [field]: newValue };
          return obj;
        })
      );
    };

    const handleAcademic = (e) => {
      const { name, value } = e.target;
      const [field, index] = name.split("-");
      const parsedIndex = parseInt(index);

      if (
        field !== "collegeName" &&
        field !== "university" &&
        !/^\d*$/.test(value)
      )
        return;

      setAcademicValues((prev) => {
        const updatedValues = prev.map((obj, i) => {
          if (i === parsedIndex) {
            let newValues = { ...obj, [field]: value };

            if (field === "scoredMarks" || field === "maxMarks") {
              const scoredMarks =
                field === "scoredMarks" ? value : newValues.scoredMarks;
              const maxMarks =
                field === "maxMarks" ? value : newValues.maxMarks;

              const calculatedValues = calculatePercent(scoredMarks, maxMarks);
              newValues = { ...newValues, ...calculatedValues };
            }
            return newValues;
          }
          return obj;
        });
        return updatedValues;
      });
    };

    const calculatePercent = (scored, total) => {
      const scoredMarks = parseInt(scored) || 0;
      const maxMarks = parseInt(total) || 0;

      const validScoredMarks = scoredMarks > maxMarks ? maxMarks : scoredMarks;

      return {
        scoredMarks: validScoredMarks,
        maxMarks: maxMarks,
        percentage: Math.round((validScoredMarks / maxMarks) * 100),
      };
    };

    const add = () => {
      setAcademicValues((prev) => [
        ...prev,
        {
          qualification: "",
          passingYear: "",
          university: "",
          collegeName: "",
          subject: "",
          maxMarks: "",
          scoredMarks: "",
          percentage: "",
        },
      ]);
      setCount(count + 1);
    };

    const remove = () => {
      const temp = [...academicValues];
      temp.pop();
      setAcademicValues(temp);
      setCount(count - 1);
    };

    const filteredOptions = (index) =>
      academicValues[index].qualification in universityOptions
        ? universityOptions[academicValues[index].qualification]
        : [];

    const handleChangeOptional = (e) => {
      const { name, value } = e.target;
      setOptionalValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeOptionalAdvance = (name, newValue) => {
      setOptionalValues((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
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
                  <StyledTableCell>Percentage(%)</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {academicValues.map((obj, i) => (
                  <TableRow key={i}>
                    <TableCell width="10%">
                      <CustomAutocomplete
                        name={`qualification-${i}`}
                        label=""
                        value={academicValues[i].qualification}
                        options={qualificationList}
                        handleChangeAdvance={handleChangeAdvance}
                        disabled={obj.disabled}
                      />
                    </TableCell>
                    <TableCell width="25%">
                      <CustomTextField
                        name={`university-${i}`}
                        label=""
                        value={academicValues[i].university}
                        handleChange={handleAcademic}
                      />
                    </TableCell>
                    <TableCell width="25%">
                      <CustomTextField
                        name={`collegeName-${i}`}
                        label=""
                        value={academicValues[i].collegeName}
                        handleChange={handleAcademic}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        name={`passingYear-${i}`}
                        label=""
                        value={academicValues[i].passingYear}
                        handleChange={handleAcademic}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        name={`maxMarks-${i}`}
                        label=""
                        value={academicValues[i].maxMarks}
                        handleChange={handleAcademic}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        name={`scoredMarks-${i}`}
                        label=""
                        value={academicValues[i].scoredMarks}
                        handleChange={handleAcademic}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        name={`percentage-${i}`}
                        label=""
                        value={academicValues[i].percentage}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={add}
            >
              <AddIcon />
            </Button>
            {count > 3 && (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={remove}
              >
                <RemoveIcon />
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Grid container rowSpacing={4} columnSpacing={4}>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="optionalSubject"
                label="Optional Subjects Studied"
                value={optionalValues.optionalSubject}
                options={optionalSubjectList}
                handleChangeAdvance={handleChangeOptionalAdvance}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomTextField
                name="optionalMaxMarks"
                label="Max.Marks or CGPA Prescribed"
                value={optionalValues.optionalMaxMarks}
                handleChange={handleChangeOptional}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomTextField
                name="optionalScoredMarks"
                label="Marks or CGPA Obtained"
                value={optionalValues.optionalScoredMarks}
                handleChange={handleChangeOptional}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomTextField
                name="optionalPercentage"
                label="% of Marks"
                value={optionalValues.optionalPercentage}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomRadioButtons
                name="isEntranceExam"
                label="Entrance Exam Taken?"
                value={optionalValues.isEntranceExam}
                items={optionList}
                handleChange={handleChangeOptional}
              />
            </Grid>

            {optionalValues.isEntranceExam === "Yes" && (
              <>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    name="entranceExamName"
                    label="Entrance Exam Name"
                    value={optionalValues.entranceExamName}
                    handleChange={handleChangeOptional}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <CustomTextField
                    name="rank"
                    label="Rank Obtained"
                    value={optionalValues.rank}
                    handleChange={handleChangeOptional}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} md={3}>
              <CustomRadioButtons
                name="area"
                label="Studied In"
                value={optionalValues.area}
                items={areaList}
                handleChange={handleChangeOptional}
                required
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
);
export default AcademicDetailsForm;
