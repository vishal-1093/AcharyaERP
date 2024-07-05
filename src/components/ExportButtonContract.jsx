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

const ExportButtonContract = ({ rows, name }) => {
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
    doc.text(name, 14, 10);
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    if (rows.length > 0) {
      const columnOrder = [
        "empCode",
        "employeeName",
        "institute",
        "department",
        "fromDate",
        "toDate",
        "month",
        "year",
        "payDays",
        "payingAmount",
        "tds",
        "totalAmount",
        "pan",
        "bank",
        "accountNo",
        "ifsc",
      ];

      const columnMappings = {
        empCode: "Emp Code",
        employeeName: "Emp Name",
        institute: "INST",
        department: "Dept",
        fromDate: "From Date",
        toDate: "To Date",
        month: "Month",
        year: "Year",
        payDays: "Pay Days",
        payingAmount: "Monthly Fee",
        tds: "TDS",
        totalAmount: "Net Amount",
        pan: "Pan",
        bank: "Bank",
        accountNo: "Account No",
        ifsc: "Ifsc",
      };

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
        startY: 30,
        theme: "grid",
        styles: {
          fontSize: 6,
          cellPadding: 2,
          overflow: "linebreak",
          halign: "center",
          showHead: "firstPage",
        },
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: [255, 255, 255],
          fontSize: 7,
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

      doc.save(name);
    } else {
      doc.text("No data available", 14, 40);
      doc.save(name);
    }
  };
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const fileName = `${name}.xlsx`;
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
            filename={name}
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

export default ExportButtonContract;
