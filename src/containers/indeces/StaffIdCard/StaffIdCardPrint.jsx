import React, { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useModalStyles = makeStyles((theme) => ({
  box: {
    position: "fixed",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    maxHeight: "90vh",
    border: "7px solid white",
    width: "100%",
    background: "white",
    boxShadow: 24,
    overflow: "auto",
    outline: "none",
    height: "400px",
  },
  previewBox: {
    position: "fixed",
    top: "8%",
    bottom: "8%",
    left: "50%",
    transform: "translateX(-50%)",
    border: "7px solid white",
    width: "100%",
    background: "white",
    boxShadow: 24,
    overflow: "auto",
    outline: "none",
    height: "80%",
  },
  header: {
    top: 0,
    padding: "30px",
    background: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: 500,
    color: theme.palette.primary.main,
  },
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
      <Box borderRadius={3} maxWidth={600}>
        <Box p={2} pt={0}>
          {!!state && <object
            className={popupclass.objectTag}
            data={state.IdCardPdfPath}
            type="application/pdf"
            height="600"
          >
            <p>
              Your web browser doesn't have a PDF plugin. Instead you can
              download the file directly.
            </p>
          </object>}
        </Box>
      </Box>
    </>
  );
};
