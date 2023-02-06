import { useState } from "react";
import { Fab, Typography } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import ModalWrapper from "./ModalWrapper";

// children: The JSX element which contains the documentation

function HelpModal({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        sx={{ position: "fixed", bottom: 30, right: 30 }}
        onClick={() => setOpen(true)}
      >
        <HelpIcon sx={{ mr: 0.5 }} />
        <Typography component="p" variant="h6">
          Help
        </Typography>
      </Fab>

      <ModalWrapper open={open} setOpen={setOpen} maxWidth={777} title="Help">
        {children}
      </ModalWrapper>
    </>
  );
}

export default HelpModal;
