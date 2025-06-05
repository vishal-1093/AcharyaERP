import React, { useState, useEffect } from "react";
import {
  Grid,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  styled,
  tableCellClasses,
  IconButton,
} from "@mui/material";
import axios from "../services/Api";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import StudentFeeDetails from "./StudentFeeDetails";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { Download } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StudentDetailsViewAccounts = ({ state, applicantData }) => {
  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  const id = applicantData.student_id;
  const [feeDetails, setFeeDetails] = useState([]);
  const [feeReceiptDetails, setFeeReceiptDetails] = useState([]);
  const [subTab, setSubTab] = useState("Student Ledger");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    if (state) {
      setCrumbs([
        {
          name: "Student Master",
          link: "/student-master",
        },
        { name: applicantData?.candidate_name + "-" + applicantData?.auid },
      ]);
    } else {
      setCrumbs([
        {
          name: "Student Master",
        },
        { name: applicantData?.candidate_name + "-" + applicantData?.auid },
      ]);
    }
  }, []);

  useEffect(() => {
    getReceiptData();
  }, [subTab]);

  const getData = async () => {
    try {
      const response = await axios.get(`api/student/getStudentDues/${id}`);
      setFeeDetails(response.data.data || {});
    } catch (error) {
      console.error("error", error);
    }
  };
  const getReceiptData = async () => {
    if (subTab === "Fee Receipt") {
      await axios
        .get(`/api/student/getStudentDueDetails?student_id=${id}`)
        .then((res) => {
          setFeeReceiptDetails(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={subTab}
            onChange={handleSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="Student Ledger" label="Student Ledger" />
            <CustomTab value="Fee Details" label="Fee Details" />
            <CustomTab value="Fee Receipt" label="Fee Receipt" />
          </CustomTabs>
        </Grid>
        <Grid item xs={8} md={10}>
          {subTab === "Student Ledger" && (
            <>
              <Card>
                <CardHeader
                  title="Legder"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <StudentFeeDetails id={id} />
                </CardContent>
              </Card>
            </>
          )}

          {subTab === "Fee Details" && (
            <>
              <Card>
                <CardHeader
                  title="Fee Details"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "rgba(74, 87, 169, 0.1)",
                          color: "#46464E",
                        }}
                      >
                        <TableCell>Year</TableCell>
                        <TableCell>Fixed</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Due</TableCell>
                        {/* <TableCell>scholarship</TableCell>
                        <TableCell>waiver</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(feeDetails) && feeDetails?.length > 0 ? (
                        feeDetails.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.year || "-"}</TableCell>
                            <TableCell>{row.fixed || "-"}</TableCell>
                            <TableCell>{row.paid || "-"}</TableCell>
                            <TableCell>{row.due || "-"}</TableCell>
                            {/* <TableCell>{row.scholarship || "-"}</TableCell>
                            <TableCell>{row.waiver || "-"}</TableCell> */}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6}>
                            No fee details available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {subTab === "Fee Receipt" && (
            <>
              <Card>
                <CardHeader
                  title="Fee Details"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "rgba(74, 87, 169, 0.1)",
                          color: "#46464E",
                        }}
                      >
                        <StyledTableCell>Receipt No</StyledTableCell>
                        <StyledTableCell>Receipt Date</StyledTableCell>
                        <StyledTableCell>Transaction Amount</StyledTableCell>
                        <StyledTableCell>Transaction Date</StyledTableCell>
                        <StyledTableCell>Print</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feeReceiptDetails?.length > 0 ? (
                        feeReceiptDetails.map((row, index) => (
                          <TableRow key={index}>
                            <StyledTableCell>
                              {row?.feeReceiptNo}
                            </StyledTableCell>
                            <StyledTableCell>
                              {row?.receiptDate
                                ? moment(row?.receiptDate).format("DD-MM-YYYY")
                                : row?.receiptDate}
                            </StyledTableCell>
                            <StyledTableCell>
                              {row?.transactionAmount}
                            </StyledTableCell>
                            <StyledTableCell>
                              {row?.transactionDate
                                ? row?.transactionDate.replace(/\//g, "-")
                                : "--"}
                            </StyledTableCell>
                            <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                              {/* {(row.receiptType?.toLowerCase() === "bulk" ||
                                row.receiptType?.toLowerCase() === "bulk fee") &&
                                row.studentId !== null ? (
                                <IconButton
                                  onClick={() =>
                                    navigate("/BulkFeeReceiptPdfV1", {
                                      state: {
                                        studentId: row?.student_id,
                                        feeReceiptId: row.fee_receipt_id,
                                        transactionType: row.transaction_type,
                                        financialYearId: row.financial_year_id,
                                        studentStatus: true,
                                      },
                                    })
                                  }
                                  sx={{ cursor: "pointer" }}
                                  color="primary"
                                >
                                  <Download fontSize="small" />
                                </IconButton>
                              ) : (row.receiptType?.toLowerCase() === "bulk" ||
                                row.receiptType?.toLowerCase() === "bulk fee") &&
                                row.student_id === null ? (
                                <IconButton
                                  onClick={() =>
                                    navigate("/BulkFeeReceiptPdfV1", {
                                      state: {
                                        studentId: row.student_id,
                                        feeReceiptId: row.fee_receipt_id,
                                        transactionType: row.transaction_type,
                                        financialYearId: row.financial_year_id,
                                        studentStatus: true,
                                      },
                                    })
                                  }
                                  sx={{ cursor: "pointer" }}
                                  color="primary"
                                >
                                  <Download fontSize="small" />
                                </IconButton>
                              ) : row.receiptType?.toLowerCase() === "hostel fee" ? (
                                <IconButton
                                  onClick={() =>
                                    navigate("/HostelFeePdfV1", {
                                      state: {
                                        feeReceiptId: row.fee_receipt_id,
                                        studentStatus: true,
                                      },
                                    })
                                  }
                                  sx={{ cursor: "pointer" }}
                                  color="primary"
                                >
                                  <Download fontSize="small" />
                                </IconButton>
                              ) : row.receiptType?.toLowerCase() === "exam" ||
                                row.receiptType?.toLowerCase() === "exam fee" ? (
                                <IconButton
                                  onClick={() =>
                                    navigate("/ExamReceiptPdfV1", {
                                      state: {
                                        feeReceiptId: row.fee_receipt_id,
                                        studentStatus: true,
                                      },
                                    })
                                  }
                                  sx={{ cursor: "pointer" }}
                                  color="primary"
                                >
                                  <Download fontSize="small" />
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={() =>
                                    navigate("/FeeReceiptDetailsPDFV1", {
                                      state: {
                                        auid: row?.auid,
                                        studentId: row?.student_id,
                                        feeReceipt: Number(row.receiptNo),
                                        transactionType: row.transaction_type,
                                        feeReceiptId: row.fee_receipt_id,
                                        financialYearId: row.financial_year_id,
                                        studentStatus: true,
                                      },
                                    })
                                  }
                                  sx={{ cursor: "pointer" }}
                                  color="primary"
                                >
                                  <Download fontSize="small" />
                                </IconButton>
                              )} */}
                            </StyledTableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <StyledTableCell colSpan={6}>
                            No fee receipt details available
                          </StyledTableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default StudentDetailsViewAccounts;
