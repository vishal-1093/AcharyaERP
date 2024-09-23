import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

function CandidateAcceptanceForm() {
  return (
    <Box sx={{ margin: { xs: "20px 0px 0px 0px", md: "100px 30px 0px 30px" } }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Grid container justifyContent="center" rowSpacing={4}>
                <Grid
                  item
                  xs={12}
                  component={Paper}
                  align="center"
                  sx={{
                    backgroundColor: "success.main",
                    color: "headerWhite.main",
                  }}
                >
                  <IconButton>
                    <CheckCircleOutlineRoundedIcon
                      sx={{
                        fontSize: "8rem",
                        color: "headerWhite.main",
                      }}
                    />
                  </IconButton>
                </Grid>
                <Grid item xs={12} align="center">
                  <Typography variant="h6">Congratulations !!!</Typography>
                  <Typography variant="subtitle2" color="secondary">
                    You have confirmed the acceptance of the offer letter .
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CandidateAcceptanceForm;
