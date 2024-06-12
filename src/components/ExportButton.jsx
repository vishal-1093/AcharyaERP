import React, { useState } from "react";
import {
    Box,
    Button,
    Menu,
    MenuItem,
  } from "@mui/material";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    button: {
      borderRadius: 20,
      backgroundColor: theme.palette.primary.main,
      color: "rgba(0, 0, 0, 0.6)",
      padding: "10px",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  }));

const ExportButton = ({ rows }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const generatePDF = () => {
    const doc = new jsPDF("landscape");

    if (rows?.length > 0) {
      const tableColumn = Object.keys(rows[0])?.map((key) =>
        key.replace(/([a-z])([A-Z])/g, "$1 $2")
      );
      const tableRows = rows?.map((row) => Object.values(row).map(String));

      // // Determine the maximum widths of each column
      // const colMaxWidths = tableColumn.map((col, index) => {
      //   const colWidths = tableRows.map((row) => doc.getTextWidth(row[index]));
      //   colWidths.push(doc.getTextWidth(col));
      //   return Math.max(...colWidths);
      // });

      // // Set column styles with maximum widths
      // const columnStyles = colMaxWidths.reduce((styles, width, index) => {
      //   styles[index] = { cellWidth: width + 10 }; // Increase padding for better readability
      //   return styles;
      // }, {});

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        styles: {
          fontSize: 6,
          cellPadding: 2,
          overflow: "linebreak",
          halign: "center",
        },
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: [255, 255, 255],
          fontSize: 8,
        },
        // columnStyles,
        horizontalPageBreak: true,
        horizontalPageBreakBehaviour: "immediately",
        horizontalPageBreakRepeat: "id",
      });
      doc.save("attendance_report.pdf");
    } else {
      doc.text("No data available", 14, 15);
      doc.save("attendance_report.pdf");
    }
  };
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "employee_attendance.xlsx");
  };

  return (
    <>
      <Button
        aria-controls="export-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="large"
        className={classes.button}
        startIcon={<FileDownloadOutlinedIcon />}
      >
        Export
      </Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <CSVLink
            data={rows}
            filename="employee_attendance.csv"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Download CSV
          </CSVLink>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            generatePDF();
          }}
        >
          Download PDF
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            generateExcel();
          }}
        >
          Download Excel
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportButton;
