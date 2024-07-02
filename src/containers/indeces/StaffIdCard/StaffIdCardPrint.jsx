import React from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useModalStyles = makeStyles((theme) => ({
  objectTag: {
    width: "100%",
    position: "relative",
    textAlign: "center",
  },
}));

export const StaffIdCardPrint = ({ state }) => {
  const popupclass = useModalStyles();

  return (
    <>
      <Box borderRadius={3} maxWidth={800} maxHeight={400}>
        {!!state && (
          <object
            className={popupclass.objectTag}
            data={state.IdCardPdfPath}
            type="application/pdf"
            height="600"
          >
            <p>
              Your web browser doesn't have a PDF plugin. Instead you can
              download the file directly.
            </p>
          </object>
        )}
      </Box>
    </>
  );
};
