import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  styled,
  tableCellClasses,
  Paper,
} from "@mui/material";
import axios from "../../../services/Api";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import { makeStyles } from "@mui/styles";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const requiredFields = ["courseId"];

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

function SessionMarksEntry() {
  const [isNew, setIsNew] = useState(false);
  const [values, setValues] = useState([]);

  const [academicYearOptions, setAcademicYearOptions] = useState(null);

  const [schoolOptions, setSchoolOptions] = useState(null);
  const [programSpeOptions, setProgramSpeOptions] = useState(null);
  const [programOptions, setProgramOptions] = useState(null);
  const [search, setSearch] = useState("");
  const [checking, setChecking] = useState([]);
  const [schoolIds, setSchoolIds] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    test();
  }, []);

  const test = async () => {
    await axios.get(`/api/institute/school`).then((res) => {
      const temp = [];
      const tempOne = [];
      const ids = [];
      res.data.data.forEach((obj) => {
        ids.push(obj.school_id);
      });
      setSchoolIds(ids);
      res.data.data.forEach((obj) => {
        tempOne.push(obj);
        temp.push({ marksEntry: 0, id: obj.school_id, percentage: 0 });
      });
      setChecking(tempOne);
      setValues((prev) => ({ ...prev, ["mainData"]: temp }));
    });
  };

  const handleChange = (e, index) => {
    const splitName = e.target.name.split("-");
    const keyName = splitName[0];
    if (keyName === "marksEntry") {
      setValues((prev) => ({
        ...prev,
        mainData: prev.mainData.map((obj, i) => {
          if (index === i)
            return {
              ...obj,
              ["percentage"]: Math.round((e.target.value / 100) * 100),
            };
          return obj;
        }),
      }));
    }
    setValues((prev) => ({
      ...prev,
      mainData: prev.mainData.map((obj, i) => {
        if (index === i) return { ...obj, [keyName]: e.target.value };
        return obj;
      }),
    }));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCreate = async (e) => {
    const tt = [];
    console.log(values.mainData);
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormPaperWrapper>
        <Grid container rowSpacing={2.5} columnSpacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              {values.internalName}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2}>
              <Grid
                container
                alignItems="center"
                rowSpacing={1.5}
                pl={2}
                pr={2}
                pb={2}
              >
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Internal</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {academicYearOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Ac Year</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {academicYearOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">School</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {schoolOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Program</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {programOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Specialization</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {programSpeOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Year/Sem</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {values.yearsemId}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Section</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {academicYearOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Course</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {values.remarks}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end">
          <Grid item xs={12} md={2.5} mt={2} textAlign="right">
            <CustomTextField
              label="Search"
              value={search}
              handleChange={handleSearch}
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={12} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: 100 }}>
                      SL No.
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100 }}>AUID</StyledTableCell>
                    <StyledTableCell sx={{ width: 100 }}>Name</StyledTableCell>
                    <StyledTableCell sx={{ width: 100 }}>USN</StyledTableCell>
                    <StyledTableCell sx={{ width: 100 }}>
                      Min Marks
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100 }}>
                      Max Marks
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center", width: 100 }}>
                      Marks
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center", width: 100 }}>
                      Percentage
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {checking.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledTableCell>{i + 1}</StyledTableCell>
                        <StyledTableCell>AUID</StyledTableCell>
                        <StyledTableCell>dgd</StyledTableCell>
                        <StyledTableCell>dddddddf</StyledTableCell>
                        <StyledTableCell>25</StyledTableCell>
                        <StyledTableCell>100</StyledTableCell>
                        <StyledTableCell>
                          <CustomTextField
                            name={"marksEntry" + "-" + i}
                            label=""
                            value={values.mainData[i].marksEntry}
                            handleChange={(e) => handleChange(e, i)}
                            inputProps={{
                              style: {
                                height: 10,
                              },
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <CustomTextField
                            name={"percentage" + "-" + i}
                            value={values.mainData[i].percentage}
                            handleChange={(e, i) => handleChange(e, i)}
                            disabled
                            inputProps={{
                              style: {
                                height: 10,
                              },
                            }}
                          />
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} textAlign="right" mt={2}>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleCreate}
            >
              SUBMIT
            </Button>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default SessionMarksEntry;
