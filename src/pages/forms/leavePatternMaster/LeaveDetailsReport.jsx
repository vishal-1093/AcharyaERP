import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the autotable plugin
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import RefreshIcon from "@mui/icons-material/Refresh";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "5px",
    textAlign: "center",
    backgroundColor: theme.palette.tableBg.main,
  },
  td: {
    border: "1px solid #ddd",
    padding: "6px",
    textAlign: "center",
  },
}));

function LeaveDetailsReport({
  year,
  schoolId,
  deptId,
  leaveTypeId,
  leaveTypeShortName,
  schoolName,
  deptName,
}) {
  const [allLeaves, setAllLeaves] = useState();
  const [data, setData] = useState([]);
  const [buttonsClose, setButtonsClose] = useState(true);

  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    getLeaveDetails();
  }, []);

  const getLeaveDetails = async () => {
    let apiUrl;

    if (year && schoolId && deptId && leaveTypeId) {
      apiUrl = `/api/leaveDetails?year=${year}&schoolId=${schoolId}&deptId=${deptId}&leaveId=${leaveTypeId}`;
    } else if (year && schoolId && deptId) {
      apiUrl = `/api/leaveDetails?year=${year}&schoolId=${schoolId}&deptId=${deptId}`;
    } else {
      apiUrl = `/api/leaveDetails?year=${year}&schoolId=${schoolId}`;
    }

    try {
      const response = await axios.get(`${apiUrl}`);
      setData(response.data.data);

      const {
        DOJ,
        departmentName,
        empcode,
        employeeName,
        employmentType,
        jobType,
        ...rest
      } = response.data.data[0];

      if (leaveTypeId) {
        const temp = [];
        temp.push(leaveTypeShortName.short_name);
        setAllLeaves(temp);
      } else {
        const tempOne = [];
        Object.keys(rest).forEach((leaves, i) => {
          response.data.data.forEach((item, j) => {
            if (response.data.data[j][leaves] > 0) {
              tempOne.push(leaves);
            }
          });
        });

        const filterLeave = tempOne.filter(
          (obj) => obj !== "PR" && obj !== "MA"
        );

        const newArray = [...new Set(filterLeave)];
        setAllLeaves(newArray);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrint = () => {
    setButtonsClose(false);

    setTimeout(() => {
      const pdf = new jsPDF("l", "mm", "a4"); // Landscape orientation

      // Prepare columns for the table
      const columns = [
        { title: "SL No.", dataKey: "slNo" },
        { title: "EMP CODE", dataKey: "empcode" },
        { title: "EMP NAME", dataKey: "employeeName" },
        { title: "DOJ", dataKey: "DOJ" },
        { title: "EMP TYPE", dataKey: "employmentType" },
        { title: "JOB TYPE", dataKey: "jobType" },
        ...allLeaves.map((leave) => ({
          title: leave,
          dataKey: leave,
        })),
      ];

      // Prepare rows for the table
      const rows = data.map((row, i) => ({
        slNo: i + 1,
        empcode: row.empcode,
        employeeName: row.employeeName,
        DOJ: row.DOJ,
        employmentType: row.employmentType,
        jobType: row.jobType,
        ...allLeaves.reduce((acc, leave) => {
          acc[leave] = row[leave];
          return acc;
        }, {}),
      }));

      // Final table rendering after measuring
      pdf.autoTable({
        head: [columns.map((col) => col.title)],
        body: rows.map((row) => columns.map((col) => row[col.dataKey])),
        margin: { top: 20, left: 10, right: 10 },
        theme: "grid",
        styles: { fontSize: 8 },
        tableWidth: "auto",
        headStyles: {
          fillColor: [237, 239, 247], // Header background color
          textColor: [0, 0, 0], // Header text color (white)
          halign: "center",
        },
        bodyStyles: {
          fillColor: [255, 255, 255], // Body row background
          textColor: [0, 0, 0], // Body text color (black)
          halign: "center",
        },
      });

      // Save the PDF
      pdf.save("Report.pdf");

      setButtonsClose(true);
    }, 100);
  };

  return (
    <>
      <Container sx={{ maxWidth: "none" }}>
        <Paper
          elevation={1}
          id="table"
          sx={{
            p: 2,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
          >
            {buttonsClose && (
              <>
                <Grid item xs={12} md={9.5} align="right">
                  <Button
                    variant="contained"
                    sx={{ marginRight: "-40px" }}
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                  >
                    PRINT
                  </Button>
                </Grid>
                <Grid item xs={12} md={2} align="right">
                  <Button variant="contained" color="success">
                    EXPORT TO EXCEL
                  </Button>
                </Grid>
                <Grid item xs={12} md={0.5} align="right">
                  <IconButton onClick={() => window.location.reload()}>
                    <RefreshIcon color="primary" />
                  </IconButton>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{
                  backgroundColor: "rgb(28, 43, 138)",
                  color: "white",
                  textAlign: "center",
                  padding: 1,
                }}
              >
                {schoolName?.label} {year ? `- ${year}` : ""}{" "}
                {deptName ? `- ${deptName?.label}` : ""}{" "}
                {leaveTypeShortName
                  ? `- ${leaveTypeShortName?.short_name}`
                  : ""}
              </Typography>

              {data.length > 0 ? (
                <>
                  <table className={classes.table}>
                    <thead>
                      <tr>
                        <th className={classes.th}>SL No.</th>
                        <th className={classes.th}>EMP CODE</th>
                        <th className={classes.th}>EMP NAME</th>
                        <th className={classes.th}>DOJ</th>
                        <th className={classes.th}>EMP TYPE</th>
                        <th className={classes.th}>JOB TYPE</th>
                        {allLeaves?.map((leave, i) => (
                          <th className={classes.th} key={i}>
                            {leave}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={row.slNo}>
                          <td className={classes.td}>{i + 1}</td>
                          <td className={classes.td}>{row.empcode}</td>
                          <td className={classes.td}>{row.employeeName}</td>
                          <td className={classes.td}>{row.DOJ}</td>
                          <td className={classes.td}>{row.employmentType}</td>
                          <td className={classes.td}>{row.jobType}</td>
                          {allLeaves?.map((obj, j) => {
                            return (
                              <td key={j} className={classes.td}>
                                <span
                                  style={{
                                    color: data[i][obj] > 0 ? "blue" : "",
                                    cursor: data[i][obj] > 0 ? "pointer" : "",
                                  }}
                                  onClick={() =>
                                    navigate(`/LeaveDetails/${350}/${obj}`, {
                                      state: {
                                        status: true,
                                      },
                                    })
                                  }
                                >
                                  {data[i][obj]}
                                </span>{" "}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  <Typography sx={{ p: 2 }} align="center" variant="subtitle2">
                    NO RECORDS FOUND
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
export default LeaveDetailsReport;
