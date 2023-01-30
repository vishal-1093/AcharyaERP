import { Box, Grid, Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

function VendorDetails({ data }) {
  const classes = useStyles();
  return (
    <Box sx={{ mt: 3 }}>
      <Grid container rowSpacing={1.5}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.bg}>
            Vendor Details
          </Typography>
        </Grid>
        <Grid item xs={12} component={Paper} elevation={3} mt={1} p={2}>
          <Grid container rowSpacing={1}>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Name</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.vendor_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Email</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.vendor_email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Phone</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.vendor_contact_no}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Address</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.street_name + ","}
                {data.area + ","}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">GST No.</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.vendor_gst_no}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">PAN No.</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.pan_number}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Account No.</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.account_no}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Bank Name</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.vendor_bank_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Bank Branch</Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.bank_branch}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">IFSC Code </Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.vendor_bank_ifsc_code}
              </Typography>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Typography variant="subtitle2">Vendor Type </Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Typography variant="body2" color="textSecondary">
                {data.vendor_type}
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2">Nature of Business </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="textSecondary">
                {data.nature_of_business}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default VendorDetails;
