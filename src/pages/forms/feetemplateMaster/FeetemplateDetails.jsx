import { Box, Grid, Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

function FeetemplateDetails({ data }) {
  const classes = useStyles();

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container rowSpacing={1.5}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.bg}>
            Template Details
          </Typography>
        </Grid>
        <Grid item xs={12} component={Paper} elevation={3} mt={1} p={2}>
          <Grid container rowSpacing={1}>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Template</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.fee_template_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">AC Year</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.ac_year}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Category</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.fee_admission_category_short_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Sub Category</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.fee_admission_sub_category_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Fee Scheme</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.program_type_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Nationality</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.nationality}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Currency Type</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.currency_type_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">School</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.school_name_short}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Program</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.program_short_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Specialization</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.program_specialization}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Paid At Board</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.is_paid_at_board ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">IS SAARC</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.is_saarc ? "Yes" : "No"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FeetemplateDetails;
