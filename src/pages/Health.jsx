import { Box, Grid, Paper, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

function Health() {
  return (
    <Box sx={{ margin: { xs: "150px 20px 20px 20px", md: "150px 0 0 0" } }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              backgroundColor: "success.main",
              color: "headerWhite.main",
              padding: 4,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: "6rem" }} />
              <Typography variant="subtitle2" sx={{ fontSize: 20 }}>
                Status is UP !!
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Health;
