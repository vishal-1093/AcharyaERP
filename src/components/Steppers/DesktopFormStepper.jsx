import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

const useStyles = makeStyles((theme) => ({
  stepperContainer: {
    padding: "10px 30px",
  },
  nextButton: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
  },
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: "grey",
    borderRadius: 5,
    transition: "all 0.2s linear",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      backgroundColor: theme.palette.success.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      backgroundColor: theme.palette.success.main,
    },
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  zIndex: 1,
  color: theme.palette.primary.main,
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.2s ease",
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    boxShadow: "0 5px 10px 2px rgba(0,0,0,.2)",
    transform: "scale(1.15)",
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.success.main,
    color: "#fff",
  }),
}));

function DesktopStepper({
  steps,
  activeStep,
  handleNext,
  handleBack,
  message,
  icons,
  loading,
}) {
  const classes = useStyles();

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        activeStep={activeStep}
        className={classes.stepperContainer}
        connector={<ColorlibConnector />}
      >
        {steps.map((obj, index) => {
          return (
            <Step key={index}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {obj.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <>
          <Box textAlign="center">
            {/* <CheckCircleOutlineRoundedIcon
              color="success"
              sx={{ fontSize: "8rem" }}
            />
            <Typography
              variant="subtitle2"
              sx={{ fontSize: 15 }}
              color="success"
            >
              Thank You !!
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: 15 }}
              color="success"
            > */}
            {/* All steps completed - you&apos;re finished */}
            {/* {message} */}
            {/* </Typography> */}
            {message}
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%", p: 2 }}>{steps[activeStep].form}</Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              className={classes.nextButton}
              variant="contained"
              onClick={handleNext}
              // disabled={activeStep === steps.length - 1}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : activeStep === steps.length - 1 ? (
                <Typography variant="subtitle2">Finish</Typography>
              ) : (
                <Typography variant="subtitle2">Save & Continue</Typography>
              )}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default DesktopStepper;
