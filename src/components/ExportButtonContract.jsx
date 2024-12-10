import React, { useState } from "react";
import { Box, Button, Grid, Menu, MenuItem } from "@mui/material";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import ModalWrapper from "./ModalWrapper";

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

const ExportButtonContract = ({ rows, name, sclName }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  function formatMonthYear(month, year) {
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}-${formattedYear}`;
  }
  const handleModalClose = () => {
    setModalOpen(false);
    URL.revokeObjectURL(pdfUrl);
    setPdfUrl("");
  };

  const generatePDF = () => {
    const doc = new jsPDF("landscape");
    const printTime = new Date().toLocaleString();
    const printText = `Print: ${moment(printTime).format("D/M/YYYY, h:mm:ss A")}`;

    doc.setFontSize(14);
    const pageWidth = doc.internal.pageSize.getWidth();
    const sclNameWidth = doc.getTextWidth(sclName);
    const nameWidth = doc.getTextWidth(name);
    const sclNameX = (pageWidth - sclNameWidth) / 2;
    const nameX = (pageWidth - nameWidth) / 2;

    doc.setTextColor(0, 0, 0);
    doc.text(sclName, sclNameX, 13);
    doc.text(name, nameX, 20);
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);

    if (rows.length > 0) {
      const columnOrder = [
        "si_no",
        "empCode",
        "employeeName",
        "institute",
        "department",
        "fromDate",
        "toDate",
        "payDays",
        "payingAmount",
        "tds",
        "netPay",
        "pan",
        "bank",
        "accountNo",
        "ifsc",
        "monthYear",
      ];

      const columnMappings = {
        si_no: "SI No",
        empCode: "Code",
        employeeName: "Consultant",
        institute: "INST",
        department: "Dept",
        fromDate: "From Date",
        toDate: "To Date",
        payDays: "Pay Days",
        payingAmount: "Monthly Fee",
        tds: "TDS",
        netPay: "Net Pay",
        pan: "Pan",
        bank: "Bank",
        accountNo: "Account No",
        ifsc: "IFSC",
        monthYear: "MM-YY",
      };

      const tableColumn = columnOrder.map((key) => columnMappings[key]);
      const tableRows = rows.map((row, index) => {
        const formattedRow = columnOrder.map((key) => {
          if (key === "si_no") return index + 1;
          if (key === "monthYear") return formatMonthYear(row.month, row.year);
          return row[key] !== undefined && row[key] !== null ? String(row[key]) : "0";
        });
        return formattedRow;
      });

      const totalMonthlyFee = rows.reduce((sum, row) => sum + parseFloat(row.payingAmount || 0), 0);
      const totalTDS = rows.reduce((sum, row) => sum + parseFloat(row.tds || 0), 0);
      const totalNetPay = rows.reduce((sum, row) => sum + parseFloat(row.netPay || 0), 0);

      const totalRow = Array(columnOrder.length).fill("");
      totalRow[7] = "Total";
      totalRow[8] = totalMonthlyFee.toFixed(2);
      totalRow[9] = totalTDS.toFixed(2);
      totalRow[10] = totalNetPay.toFixed(2);
      tableRows.push(totalRow);

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
          halign: "left",
          showHead: "firstPage",
        },
        headStyles: {
          fillColor: [52, 73, 94], // Header background color
          textColor: [255, 255, 255], // Header text color
          fontSize: 7,
          halign: "center", // Center-align header text
        },
        didDrawPage: function (data) {
          // Add print date text to the bottom left
          const printText = `Print: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
          doc.text(printText, data.settings.margin.left, doc.internal.pageSize.height - 10, { align: 'left' });

          // Add page number text to the bottom right
          const pageText = `Page ${doc.internal.getNumberOfPages()}`;
          doc.text(pageText, doc.internal.pageSize.width - data.settings.margin.right, doc.internal.pageSize.height - 10, { align: 'right' });
        },
        didParseCell: function (data) {
          // Apply header styles to the last row (totals row)
          if (data.row.index === tableRows.length - 1) {
            data.cell.styles.fillColor = [52, 73, 94]; // Same color as header background
            data.cell.styles.textColor = [255, 255, 255]; // Same color as header text
            data.cell.styles.fontStyle = "bold"; // Bold font for emphasis
          }

          // Apply alignment to specific columns in the body section
          const endAlignedColumns = [0, 7, 8, 9, 10]; // Columns you want to align to the end
          if (data.section === "body" && endAlignedColumns.includes(data.column.index)) {
            data.cell.styles.halign = "right"; // Right-align the text
          }
        },
      });

      if (typeof doc.putTotalPages === "function") {
        doc.putTotalPages(totalPagesExp);
      }

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } else {
      doc.text("No data available", 14, 40);
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    }
  };

  const handleModalOpen = () => {
    generatePDF();
    setModalOpen(true);
  };

  const generateExcel = () => {
    const processedRows = rows.map((row) => ({
      ...row,
      monthYear: `${row.month}-${row.year}`,
    }));

    // Calculate totals
    const totalMonthlyFee = rows.reduce(
      (sum, row) => sum + parseFloat(row.payingAmount || 0),
      0
    );
    const totalTDS = rows.reduce((sum, row) => sum + parseFloat(row.tds || 0), 0);
    const totalNetPay = rows.reduce(
      (sum, row) => sum + parseFloat(row.netPay || 0),
      0
    );

    // Add totals to the last row
    const totalRow = {
      empCode: "",
      employeeName: "",
      institute: "",
      department: "",
      fromDate: "",
      toDate: "",
      payDays: "Total",
      payingAmount: totalMonthlyFee.toFixed(2),
      tds: totalTDS.toFixed(2),
      netPay: totalNetPay.toFixed(2),
      pan: "",
      bank: "",
      accountNo: "",
      ifsc: "",
      monthYear: "",
    };
    processedRows.push(totalRow);

    const worksheet = XLSX.utils.json_to_sheet(processedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const fileName = `${name}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const generateCSV = () => {
    const processedRows = rows.map((row) => ({
      ...row,
      monthYear: `${row.month}-${row.year}`,
    }));

    // Calculate totals
    const totalMonthlyFee = rows.reduce(
      (sum, row) => sum + parseFloat(row.payingAmount || 0),
      0
    );
    const totalTDS = rows.reduce((sum, row) => sum + parseFloat(row.tds || 0), 0);
    const totalNetPay = rows.reduce(
      (sum, row) => sum + parseFloat(row.netPay || 0),
      0
    );

    // Add totals to the last row
    const totalRow = {
      empCode: "",
      employeeName: "",
      institute: "",
      department: "",
      fromDate: "",
      toDate: "",
      payDays: "Total",
      payingAmount: totalMonthlyFee.toFixed(2),
      tds: totalTDS.toFixed(2),
      netPay: totalNetPay.toFixed(2),
      pan: "",
      bank: "",
      accountNo: "",
      ifsc: "",
      monthYear: "",
    };
    processedRows.push(totalRow);

    return processedRows;
  };

  return (
    <>
      <Button
        variant="contained"
        aria-controls="export-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<FileDownloadOutlinedIcon />}
        disabled={rows?.length == 0}
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
            data={generateCSV()}
            filename={name}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Download CSV
          </CSVLink>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            handleModalOpen();
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
      <ModalWrapper open={modalOpen} setOpen={handleModalClose} maxWidth={1200}>
        <Grid
          item
          xs={12}
          style={{
            height: "80vh",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100% - 50px)",
              width: "100%",
            }}
          >
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ position: "absolute", right: 40, bottom: 5, borderRadius: 2 }}
            className={classes.downloadButton}
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.download = `${name}.pdf`;
              link.click();
            }}
          >
            Download PDF
          </Button>
        </Grid>
      </ModalWrapper>
    </>
  );
};

export default ExportButtonContract;
