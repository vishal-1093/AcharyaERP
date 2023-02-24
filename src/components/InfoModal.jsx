import { useState } from "react";
import { IconButton } from "@mui/material";
import ModalWrapper from "./ModalWrapper";
import InfoIcon from "@mui/icons-material/Info";

function InfoModal({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <InfoIcon color="primary" />
      </IconButton>
      <ModalWrapper open={open} setOpen={setOpen} maxWidth={600} title="">
        {children}
      </ModalWrapper>
    </>
  );
}

export default InfoModal;
