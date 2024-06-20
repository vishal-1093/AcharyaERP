import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { makeStyles } from "@mui/styles";
import moment from "moment";

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

const ExportButton = ({ rows, name }) => {
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
    const printTime = new Date().toLocaleString();
    const printText = `Print: ${moment(printTime).format(
      "D/M/YYYY, h:mm:ss A"
    )}`;
    doc.setFontSize(14);
    const printTextWidth = doc.getTextWidth(printText);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Attendance Report for the Month of ${moment(name.month).format(
        "MMMM YYYY"
      )}`,
      14,
      10
    );
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    if (rows.length > 0) {
      const daysInMonth = moment(name.month).daysInMonth();
      const columnOrder = [
        "empId",
        "empCode",
        "employee_name",
        "designation",
        "institute",
        "date_of_joining",
        "branch",
      ];
      for (let i = 1; i <= daysInMonth; i++) {
        columnOrder.push(`day${i}`);
      }
      columnOrder.push(
        "payday",
        "presentday",
        "leaveTaken",
        "absentday",
        "generalWo"
      );
      const columnMappings = {
        empId: "No",
        empCode: "Emp Code",
        employee_name: "Employee",
        designation: "Designation",
        institute: "INST",
        date_of_joining: "DOJ",
        branch: "Department",
      };
      for (let i = 1; i <= daysInMonth; i++) {
        columnMappings[`day${i}`] = String(i);
      }

      columnMappings.payday = "Pay D";
      columnMappings.presentday = "Prs D";
      columnMappings.leaveTaken = "LVS";
      columnMappings.absentday = "Ab";
      columnMappings.generalWo = "GH/WO";

      const tableColumn = columnOrder.map((key) => columnMappings[key]);

      const tableRows = rows.map((row) => {
        const rowData = {};
        columnOrder.forEach((key) => {
          rowData[key] =
            row[key] !== undefined && row[key] !== null
              ? String(row[key])
              : "0";
        });
        return Object.values(rowData);
      });
      var totalPagesExp = "{total_pages_count_string}";
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 15,
        theme: "grid",
        styles: {
          fontSize: 5,
          cellPadding: 1,
          overflow: "linebreak",
          halign: "left",
          showHead: "firstPage",
        },
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: [255, 255, 255],
          fontSize: 6,
        },
        didDrawPage: function () {
          var str = "Page " + doc.internal.getNumberOfPages();
          if (typeof doc.putTotalPages === "function") {
            str = str + " of " + totalPagesExp;
          }
          doc.setFontSize(10);
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          var printTextX = pageWidth - printTextWidth + 3;
          doc.text(printText, printTextX, 10);
          var pageNumberX = pageWidth - doc.getTextWidth(str) + 10;
          doc.text(str, pageNumberX, pageHeight - 10);
        },
      });
      if (typeof doc.putTotalPages === "function") {
        doc.putTotalPages(totalPagesExp);
      }

      doc.save(
        `Attendance Report for the Month of ${moment(name.month).format(
          "MMMM YYYY"
        )}`
      );
    } else {
      doc.text("No data available", 14, 40);
      doc.save(
        `Attendance Report for the Month of ${moment(name.month).format(
          "MMMM YYYY"
        )}`
      );
    }
  };
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const fileName = `Attendance_Report_for_the_Month_of_${moment(
      name.month
    ).format("MMMM_YYYY")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
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
            filename={`Attendance Report for the Month of ${moment(
              name.month
            ).format("MMMM YYYY")}`}
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
