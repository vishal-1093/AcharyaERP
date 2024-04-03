import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function ResultReport({ data, jobData }) {
  const { setAlertMessage, setAlertOpen } = useAlert();

  const downloadFile = async () => {
    await axios
      .get(
        `/api/employee/HrFeedbackFileviews?fileName=${jobData.hr_feedback_attachment}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });
  };
  return (
    <Box sx={{ mt: 3, padding: 2 }}>
      <Grid container rowSpacing={3} columnSpacing={3}>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader
              title="Result"
              titleTypographyProps={{ variant: "subtitle2" }}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                padding: 1,
              }}
            />
            <CardContent>
              <Grid container rowSpacing={1}>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Applicant Name</Typography>
                </Grid>
                <Grid item xs={12} md={10.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data[0].firstname}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Email</Typography>
                </Grid>
                <Grid item xs={12} md={10.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data[0].email}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Interview Date</Typography>
                </Grid>
                <Grid item xs={12} md={10.5}>
                  <Typography variant="body2" color="textSecondary">
                    {moment(data[0].frontend_use_datetime).format("DD-MM-YYYY")}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Status</Typography>
                </Grid>
                <Grid item xs={12} md={10.5}>
                  {data[0].approve === true ? (
                    <Typography variant="subtitle2" color="success.main">
                      Selected
                    </Typography>
                  ) : (
                    <Typography variant="subtitle2" color="error.main">
                      Rejected
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ width: "15%" }}>
                    HR / Interviewer
                  </StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Comments</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <StyledTableRow>
                  <StyledTableCellBody>HR</StyledTableCellBody>
                  <StyledTableCellBody>{data[0].hr_name}</StyledTableCellBody>
                  <StyledTableCellBody></StyledTableCellBody>
                  <StyledTableCellBody>
                    {data[0].hr_remarks}
                  </StyledTableCellBody>
                </StyledTableRow>

                {data.map((obj, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCellBody>Interviewer</StyledTableCellBody>
                      <StyledTableCellBody>
                        {obj.interviewer_name}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{obj.email}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {obj.interviewer_comments}
                      </StyledTableCellBody>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {jobData.marks_scored ? (
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Feeback"
                titleTypographyProps={{ variant: "subtitle2" }}
                sx={{
                  backgroundColor: "primary.main",
                  color: "headerWhite.main",
                  padding: 1,
                }}
              />
              <CardContent>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={downloadFile}
                    >
                      View Document
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      display="inline"
                    >
                      Total Marks Scored :&nbsp;
                    </Typography>
                    <Typography variant="subtitle2" display="inline">
                      {jobData.marks_scored} / 60
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </Box>
  );
}

export default ResultReport;
