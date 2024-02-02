import { Box, MobileStepper, Paper, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { makeStyles } from "@mui/styles";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

const useStyles = makeStyles((theme) => ({
  nextButton: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
  },
}));

function MobileFormStepper({
  steps,
  activeStep,
  handleNext,
  handleBack,
  message,
}) {
  const theme = useTheme();

  const classes = useStyles();

  return (
    <Box sx={{ width: "100%", flexGrow: 1 }}>
      {activeStep === steps.length ? (
        <>
          <Box textAlign="center">
            <CheckCircleOutlineRoundedIcon
              color="success"
              sx={{ fontSize: "5rem" }}
            />
            <Typography variant="subtitle2" color="success">
              Thank You !!
            </Typography>
            <Typography variant="subtitle2" color="success">
              {/* All steps completed - you&apos;re finished */}
              {message}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Paper
            square
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              pl: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontSize: 13 }}>
              {steps[activeStep].label}
            </Typography>
          </Paper>
          <Box sx={{ width: "100%", p: 2 }}>{steps[activeStep].form}</Box>
          <MobileStepper
            variant="text"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                variant="contained"
                className={classes.nextButton}
                size="small"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </>
      )}
    </Box>
  );
}

export default MobileFormStepper;
