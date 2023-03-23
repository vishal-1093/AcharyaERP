import { Paper } from "@mui/material";

function FormPaperWrapper({ children }) {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
      }}
      elevation={3}
    >
      {children}
    </Paper>
  );
}

export default FormPaperWrapper;
