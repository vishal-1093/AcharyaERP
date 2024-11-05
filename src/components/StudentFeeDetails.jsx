import { lazy, useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Box,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import moment from "moment";

const ModalWrapper = lazy(() => import("./ModalWrapper"));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const headerCategories = [
  { label: "Fixed", value: "fixed" },
  { label: "P@B", value: "board" },
  { label: "SCH", value: "sch" },
  { label: "ACERP", value: "acerp" },
  { label: "Paid", value: "paid" },
  { label: "Due", value: "due" },
];

function StudentFeeDetails({ id }) {
  const [data, setData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [total, setTotal] = useState();
  const [voucherData, setVoucherData] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [voucherPaidData, setVoucherPaidData] = useState([]);
  const [receiptHeaders, setReceiptHeaders] = useState([]);
  const [paidTotal, setPaidTotal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState({ label: "", value: "" });
  const [addOnData, setAddOnData] = useState({});
  const [uniformData, setUniformData] = useState({});

  useEffect(() => {
    getFeeData();
  }, [id]);

  const getFeeData = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${id}`
      );
      const {
        fee_template_sub_amount_info: subAmountDetails,
        fee_template_sub_amount_format: subAmount,
        Student_info: studentData,
        scholarship_approval_amount: sch,
        addOnData: acerp,
        fee_receipt_student_pay_his_format: paid,
        dueAmount: due,
        fee_receipt_student_pay_his: paidHistory,
        paidAtBoardData: board,
      } = response.data;

      const {
        program_type: programType,
        number_of_years: noOfYears,
        number_of_semester: noOfSem,
        is_regular: isRegular,
        lat_year_sem: latYearSem,
        fee_template_program_type_name: feeTemp,
        fee_template_id: feeTemplateId,
        school_id: schoolId,
        ac_year_id: acyearId,
        program_id: prorgamId,
        program_specialization_id: specializationId,
      } = studentData[0];

      const totalYearsOrSemesters =
        programType === "Yearly" ? noOfYears * 2 : noOfSem;
      const yearSemesters = [];
      const expands = {};
      const startYear = isRegular ? 1 : latYearSem;
      for (let i = startYear; i <= totalYearsOrSemesters; i++) {
        if (feeTemp === "Semester" || (feeTemp === "Yearly" && i % 2 !== 0)) {
          yearSemesters.push({ key: i, value: `Sem ${i}` });
          expands[`year${i}`] = false;
        }
      }

      const totalAmount = {};
      const voucherAmount = {};
      const schAmount = sch?.[0];
      const receiptHeads = {};
      const paidTempTotal = {};
      const voucherReceiptAmt = {};

      yearSemesters.forEach((obj) => {
        const { key } = obj;
        const field = `year${key}`;
        const subAmountObjectValues = Object.values(subAmount[key]);
        const paidAmountObjectValues = Object.values(paid[key]);
        const dueAmountObjectValues = Object.values(due[key]);
        const boardAmountObjectValues = Object.values(board);
        const fixedTotal =
          subAmountObjectValues.length > 0
            ? subAmountObjectValues.reduce((a, b) => a + b)
            : 0;
        const paidTotal =
          paidAmountObjectValues.length > 0
            ? paidAmountObjectValues.reduce((a, b) => a + b)
            : 0;
        const dueTotal =
          dueAmountObjectValues.length > 0
            ? dueAmountObjectValues.reduce((a, b) => a + b)
            : 0;
        const boardTotal =
          boardAmountObjectValues.length > 0
            ? boardAmountObjectValues.reduce(
                (sum, item) => sum + (item[`${field}_amt`] || 0),
                0
              )
            : 0;

        totalAmount[field] = {
          fixed: fixedTotal,
          board: boardTotal || 0,
          sch: schAmount?.[`${field}_amount`] || 0,
          acerp: acerp[`paidYear${key}`] || 0,
          paid: paidTotal || 0,
          due: dueTotal || 0,
        };

        const receiptTemp = [];
        const filterReceipts = paidHistory.filter(
          (receipt) => receipt.paid_year === key
        );
        filterReceipts.forEach((filReceipt) => {
          const { fee_receipt, created_date } = filReceipt;
          // const receiptSum = filterReceipts
          //   .filter((obj) => obj.fee_receipt === fee_receipt)
          //   .reduce((acc, nextValue) => {
          //     return acc + nextValue.paid_amount;
          //   }, 0);
          const filterReceipt = receiptTemp.filter(
            (item) => item.value === fee_receipt
          );
          if (filterReceipt.length === 0) {
            receiptTemp.push({
              label: `${fee_receipt}/${moment(created_date).format(
                "DD-MM-YYYY"
              )}`,
              value: fee_receipt,
            });
          }
        });
        receiptHeads[field] = receiptTemp;

        subAmountDetails.forEach((item, i) => {
          const { voucher_head_new_id: voucherId } = item;
          voucherAmount[field + voucherId] = {
            fixed: subAmount[key][voucherId],
            board: voucherId in board ? board[voucherId][`${field}_amt`] : 0,
            sch: (i === 0 && schAmount?.[`${field}_amount`]) || 0,
            acerp: (i === 0 && acerp[`paidYear${key}`]) || 0,
            paid: paid[key][voucherId] || 0,
            due: due[key][voucherId] || 0,
          };

          receiptTemp.forEach((pay) => {
            const { value: receiptNo } = pay;
            const filterVoucherReceipt = filterReceipts.filter(
              (receipt) =>
                receipt.voucher_head_new_id === voucherId &&
                receipt.fee_receipt === receiptNo
            );
            const voucherReceiptAmount = filterVoucherReceipt.reduce(
              (sum, current) => sum + current.paid_amount,
              0
            );
            voucherReceiptAmt[field + voucherId + receiptNo] =
              voucherReceiptAmount || 0;
          });

          receiptTemp.forEach((pay) => {
            const { value: receiptNo } = pay;
            const filterYearReceipt = filterReceipts.filter(
              (receipt) =>
                receipt.paid_year === key && receipt.fee_receipt === receiptNo
            );
            const yearReceiptAmount = filterYearReceipt.reduce(
              (sum, current) => sum + current.paid_amount,
              0
            );
            paidTempTotal[field + receiptNo] = yearReceiptAmount || 0;
          });
        });
      });

      const { data: addOnResData } = await axios.get(
        `/api/otherFeeDetails/getOtherFeeDetailsData1?fee_template_id=${feeTemplateId}`
      );
      const sumDynamic = (data, keys) => {
        return keys.reduce((accumulator, key) => {
          accumulator[key] = data.reduce(
            (sum, current) => sum + (current[key] || 0),
            0
          );
          return accumulator;
        }, {});
      };
      const keysToSum = [];
      yearSemesters.forEach((obj) => {
        keysToSum.push(`sem${obj.key}`);
      });
      const addOnTotal = sumDynamic(addOnResData, keysToSum);

      const { data: uniformResData } = await axios.get(
        `api/otherFeeDetails/getOtherFeeDetailsData?schoolId=${schoolId}&acYearId=${acyearId}&programId=${prorgamId}&programSpecializationId=${specializationId}`
      );
      const uniformTotal = sumDynamic(uniformResData, keysToSum);

      setNoOfYears(yearSemesters);
      setData(subAmountDetails);
      setIsExpanded(expands);
      setTotal(totalAmount);
      setVoucherData(voucherAmount);
      setVoucherPaidData(voucherReceiptAmt);
      setReceiptHeaders(receiptHeads);
      setPaidTotal(paidTempTotal);
      setAddOnData(addOnTotal);
      setUniformData(uniformTotal);
    } catch (err) {
      console.error(err);

      setError("Failed to load ledger data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        Please wait ....
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  if (!data) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No data available.
      </Typography>
    );
  }

  const handleExpand = (value) => {
    setIsExpanded((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const handleModal = (year) => {
    setSelectedYear({ label: `Sem - ${year}`, value: `year${year}` });
    setModalOpen(true);
  };

  const DisplayHeaderText = ({ label }) => (
    <Typography variant="subtitle2">{label}</Typography>
  );

  const DisplayBodyText = ({ label }) => (
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
  );

  const renderFeeDetails = (year) =>
    data?.map((obj, i) => (
      <TableRow key={i} sx={{ transition: "1s" }}>
        <StyledTableCellBody>
          <DisplayBodyText label={obj.voucher_head} />
        </StyledTableCellBody>
        {headerCategories.map((category, j) => (
          <StyledTableCellBody key={j} sx={{ textAlign: "right" }}>
            <DisplayBodyText
              label={
                voucherData[`${year}${obj.voucher_head_new_id}`][category.value]
              }
            />
          </StyledTableCellBody>
        ))}
      </TableRow>
    ));

  return (
    <>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={1200}
        title={`${selectedYear.label} Paid History`}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Particulars</StyledTableCell>
                <StyledTableCell>Fixed</StyledTableCell>
                {receiptHeaders[selectedYear?.value]?.map((pay, k) => (
                  <StyledTableCell key={k} sx={{ textAlign: "right" }}>
                    <DisplayHeaderText label={pay.label} />
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.map((obj, i) => (
                <TableRow key={i} sx={{ transition: "1s" }}>
                  <StyledTableCellBody>
                    <DisplayBodyText label={obj.voucher_head} />
                  </StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: "right" }}>
                    <DisplayBodyText
                      label={
                        voucherData[
                          `${selectedYear.value}${obj.voucher_head_new_id}`
                        ]?.["fixed"]
                      }
                    />
                  </StyledTableCellBody>

                  {receiptHeaders[`${selectedYear.value}`]?.map((pay, k) => {
                    return (
                      <StyledTableCellBody key={k} sx={{ textAlign: "right" }}>
                        <DisplayBodyText
                          label={
                            voucherPaidData[
                              `${selectedYear.value}${obj.voucher_head_new_id}${pay.value}`
                            ]
                          }
                        />
                      </StyledTableCellBody>
                    );
                  })}
                </TableRow>
              ))}
              <TableRow>
                <StyledTableCellBody>
                  <DisplayHeaderText label="Total" />
                </StyledTableCellBody>
                <StyledTableCellBody sx={{ textAlign: "right" }}>
                  <DisplayHeaderText
                    label={total[selectedYear?.value]?.["fixed"]}
                  />
                </StyledTableCellBody>
                {receiptHeaders?.[selectedYear?.value]?.map((pay, l) => (
                  <StyledTableCellBody key={l} sx={{ textAlign: "right" }}>
                    <DisplayHeaderText
                      label={paidTotal[selectedYear?.value + pay.value]}
                    />
                  </StyledTableCellBody>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </ModalWrapper>

      <Box>
        {noOfYears.map((obj, i) => {
          const { key, value } = obj;
          const field = `year${obj.key}`;
          return (
            <TableContainer key={i} component={Paper} sx={{ marginBottom: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: "25%" }}>
                      <DisplayHeaderText label={value} />
                    </StyledTableCell>
                    {headerCategories.map((category, j) => (
                      <StyledTableCell
                        key={j}
                        sx={{
                          textAlign: "right",
                          width: "12%",
                        }}
                      >
                        {j === 5 ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 6,
                              justifyContent: "right",
                            }}
                          >
                            <Typography variant="subtitle2">
                              {category.label}
                            </Typography>
                            <IconButton
                              onClick={() => handleExpand(field)}
                              sx={{
                                padding: 0,
                                transition: "1s",
                              }}
                            >
                              {isExpanded[field] ? (
                                <ArrowDropUpIcon />
                              ) : (
                                <ArrowDropDownIcon />
                              )}
                            </IconButton>
                          </Box>
                        ) : (
                          <DisplayHeaderText label={category.label} />
                        )}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isExpanded[field] && renderFeeDetails(field)}
                  <TableRow>
                    <StyledTableCellBody>
                      <DisplayHeaderText label="Total College Fee" />
                    </StyledTableCellBody>
                    {headerCategories.map((categories, k) => (
                      <StyledTableCellBody
                        key={k}
                        sx={{
                          textAlign: "right",
                        }}
                      >
                        {k === 4 ? (
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleModal(key)}
                          >
                            {total[field][categories?.value]}
                          </Typography>
                        ) : (
                          <DisplayHeaderText
                            label={total[field][categories?.value]}
                          />
                        )}
                      </StyledTableCellBody>
                    ))}
                  </TableRow>
                  {addOnData?.[`sem${key}`] > 0 && (
                    <TableRow>
                      <StyledTableCellBody>
                        <DisplayHeaderText label="Add-On Program Fee" />
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        sx={{
                          textAlign: "right",
                        }}
                      >
                        <DisplayHeaderText label={addOnData?.[`sem${key}`]} />
                      </StyledTableCellBody>
                      <StyledTableCellBody colSpan={5} />
                    </TableRow>
                  )}
                  {uniformData?.[`sem${key}`] > 0 && (
                    <TableRow>
                      <StyledTableCellBody>
                        <DisplayHeaderText label="Uniform & Books" />
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        sx={{
                          textAlign: "right",
                        }}
                      >
                        <DisplayHeaderText label={uniformData?.[`sem${key}`]} />
                      </StyledTableCellBody>
                      <StyledTableCellBody colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          );
        })}
      </Box>
    </>
  );
}

export default StudentFeeDetails;
