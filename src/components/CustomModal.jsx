import {
  IconButton,
  Grid,
  Button,
  Box,
  Modal,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// open: boolean,
// setOpen: () => void,
// title?: string,
// message?: string,
// buttons?: {
//     name: string,
//     color: string,       according to theme context, refer MUI button for more info.
//     func: () => void,
// }[],

const style = {
  position: "absolute",
  top: "42%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: 4,
  width: "90%",
  maxWidth: 450,
  bgcolor: "white",
  boxShadow: 24,
  padding: 3.7,
};

function CustomModal({
  open,
  setOpen,
  title = "",
  message = "",
  buttons = [],
}) {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <IconButton
          style={{ position: "absolute", top: 3, right: 3 }}
          onClick={() => setOpen(false)}
        >
          <CloseRoundedIcon />
        </IconButton>
        {title.length > 0 && (
          <Typography marginRight={3} variant="h6">
            {title}
          </Typography>
        )}
        {message.length > 0 && (
          <Typography marginRight={3}>{message}</Typography>
        )}
        <Grid
          container
          mt={3}
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={1}
          columnSpacing={1}
        >
          {buttons.map((button, i) => (
            <Grid item key={i}>
              <Button
                variant="contained"
                disableElevation
                style={{ borderRadius: 7 }}
                color={button.color}
                onClick={() => {
                  button.func();
                  setOpen(false);
                }}
              >
                <strong>{button.name}</strong>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
}

export default CustomModal;
