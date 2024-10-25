import { useState, useEffect, lazy } from "react";
import { styled, Grid, CircularProgress } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import { Button, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { tableCellClasses } from "@mui/material/TableCell";
import axios from "../../../services/Api";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const initialState = {
  externalExamList: [],
  loading: false,
};

const ExternalExamAddMark = () => {
  const [{ externalExamList, loading }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([
      { name: "External Exam Mark", link: "/External-exam-mark" },
      { name: "Add Mark" },
    ]);
    setState((prevState) => ({
      ...prevState,
      externalExamList: location.state.studentList?.filter((li)=>!!li?.student_id)?.map((ele, index) => ({
        id: index + 1,
        ...ele,
      })),
    }));
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === "+" || event.key === "e") {
      event.preventDefault();
    }
  };

  const getScoredMark = (event, i, rowValue) => {
    let { name, value } = event.target;
    const onChangeReqVal = JSON.parse(JSON.stringify(externalExamList));
    onChangeReqVal[i][name] = value;
    onChangeReqVal[i]["percentage"] =
      Number((Number(value) / Number(rowValue?.external_max_marks)) * 100) ||
      "";
    setState((prev) => ({
      ...prev,
      externalExamList: onChangeReqVal,
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleSubmit = async () => {
    try {
      let {
        id,
        course_assignment_id,
        ac_year_id,
        external_max_marks,
        external_min_marks,
        date_of_exam,
        program_specialization_id,
        school_id,
        current_year,
        current_sem,
      } = location.state?.externalMarksDetails;
      setLoading(true);
      let payload = {
        internal_session_id: id,
        course_assignment_id: course_assignment_id,
        current_year_sem: null,
        ac_year_id: ac_year_id,
        external_max_mark: external_max_marks,
        external_min_mark: external_min_marks,
        exam_date: date_of_exam,
        program_specialization_id: program_specialization_id,
        school_id: school_id,
        current_year: current_year,
        current_sem: current_sem,
        studentMarksAssignment: externalExamList?.map((ele) => ({
          student_id: ele.student_id,
          marks_obtained_external: ele.marks_obtained_external,
          percentage: ele.percentage,
        })),
      };
      const res = await axios.post(
        `api/student/createExternalStudentMark`,
        payload
      );
      if ((res.status = 200 || res.status == 201)) {
        actionAfterResponse();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const actionAfterResponse = () => {
    setLoading(false);
    navigate("/external-exam-mark-report", {
      replace: true,
    });
    setAlertMessage({
      severity: "success",
      message: `External exam mark created successfully !!`,
    });
    setAlertOpen(true);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>SL.No.</StyledTableCell>
              <StyledTableCell sx={{ padding: "16px 16px 16px 5px" }}>
                Auid
              </StyledTableCell>
              <StyledTableCell sx={{ padding: "16px 16px 16px 5px" }}>
                USN
              </StyledTableCell>
              <StyledTableCell sx={{ padding: "16px 16px 16px 5px" }}>
                Name
              </StyledTableCell>
              {/* <StyledTableCell sx={{ padding: "16px 16px 16px 5px" }}>
                Section
              </StyledTableCell> */}
              <StyledTableCell sx={{ padding: "16px 16px 16px 5px" }}>
                Maximum
              </StyledTableCell>
              <StyledTableCell sx={{ padding: "16px 16px 16px 5px" }}>
                Minimum
              </StyledTableCell>
              <StyledTableCell sx={{ padding: "16px 16px 16px 5px" }}>
                Marks Scored
              </StyledTableCell>
              <StyledTableCell sx={{ padding: "16px 16px 16px 5px",textAlign:"center" }}>
                Percentage
              </StyledTableCell>
              {/* <StyledTableCell sx={{ padding: "16px 16px 16px 5px" }}>
                Marks Enter By
              </StyledTableCell>
              <StyledTableCell sx={{ padding: "16px 16px 16px 5px" }}>
                Marks Enter Date
              </StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {externalExamList.map((row, index) => (
              <StyledTableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell sx={{ padding: "5px 0px 5px 20px" }}>
                  {row.id}
                </StyledTableCell>
                <StyledTableCell
                  sx={{ padding: "5px" }}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.auid}
                </StyledTableCell>
                <StyledTableCell
                  sx={{ padding: "5px" }}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.usn}
                </StyledTableCell>
                <StyledTableCell
                  sx={{ padding: "5px" }}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.student_name?.toUpperCase()}
                </StyledTableCell>
                {/* <StyledTableCell sx={{ padding: "5px" }}>
                  {row.section_name}
                </StyledTableCell> */}
                <StyledTableCell sx={{ padding: "5px" }}>
                  {row.external_max_marks}
                </StyledTableCell>
                <StyledTableCell sx={{ padding: "5px" }}>
                  {row.external_min_marks}
                </StyledTableCell>
                <StyledTableCell width={100} sx={{ padding: "5px" }}>
                  <CustomTextField
                    name="marks_obtained_external"
                    label=""
                    value={row?.marks_obtained_external || ""}
                    type="number"
                    onKeyDown={handleKeyDown}
                    handleChange={(e) => getScoredMark(e, index, row)}
                  />
                </StyledTableCell>
                <StyledTableCell sx={{ padding: "5px",textAlign:"center" }}>
                  {!row.percentage ? "" : `${row.percentage} %`}
                </StyledTableCell>
                {/* <StyledTableCell sx={{ padding: "5px" }}>
                  {row.created_username}
                </StyledTableCell>
                <StyledTableCell sx={{ padding: "5px" }}>
                  {moment(row.created_date).format("DD-MM-YYYY")}
                </StyledTableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {externalExamList.length > 0 && (
        <Grid
          container
          mt={2}
          mb={2}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Grid xs={12} md={2} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Submit"
              )}
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ExternalExamAddMark;
