import { lazy, useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Box,
  Divider,
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

function StudentFeeDetails({ id, allExpand={}, setAllExpand=()=>{} }) {
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
  const [readmissionData, setReadmissionData] = useState({});
  const [hostelData, setHostelData] = useState([]);

  useEffect(() => {
    getFeeData();
  }, [id]);

  useEffect(()=>{
    const expandData = Object.keys(allExpand)
    if(allExpand[expandData[0]])
    setIsExpanded(allExpand)
  },[allExpand])

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
        acerpAmountData: acerp,
        fee_receipt_student_pay_his_format: paid,
        dueAmount: due,
        fee_receipt_student_pay_his: paidHistory,
        paidAtBoardData: board,
        uniformAndStationaryData: uniform,
        readmissionData: readmission,
        addOnFeeData: addOn,
      } = response.data;

      const {
        program_assignment_program_type_name: programType,
        number_of_years: noOfYears,
        number_of_semester: noOfSem,
        is_regular: isRegular,
        lat_year_sem: latYearSem,
        fee_template_program_type_name: feeTemp,
        fee_template_id: feeTemplateId,
        old_std_id_readmn: isReadmission,
        semOrYear,
      } = studentData[0];

      const programAssignmentType = programType.toLowerCase();
      const feeTemplateProgramType = feeTemp.toLowerCase();
      const totalYearsOrSemesters =
        programAssignmentType === "yearly" ? noOfYears * 2 : noOfSem;
      const yearSemesters = [];
      const expands = {};
      const startYear = isReadmission ? semOrYear : isRegular ? 1 : latYearSem;
      for (let i = startYear; i <= totalYearsOrSemesters; i++) {
        if (
          feeTemplateProgramType === "semester" ||
          (feeTemplateProgramType === "yearly" && i % 2 !== 0)
        ) {
          yearSemesters.push({ key: i, value: `Sem ${i}` });
          expands[`year${i}`] = false;
        }
      }

      const schAmount = sch?.reduce((acc, obj) => {
        Object.keys(obj).forEach((key) => {
          // If the key doesn't exist in the accumulator, initialize it
          if (!(key in acc)) {
            acc[key] = obj[key];
          } else {
            // If the existing value is a number, add it up; otherwise, keep the latest non-null value
            if (typeof acc[key] === "number" && typeof obj[key] === "number") {
              acc[key] += obj[key];
            } else if (obj[key] !== null && obj[key] !== undefined) {
              acc[key] = obj[key];
            }
          }
        });
        return acc;
      }, {});

      const totalAmount = {};
      const voucherAmount = {};
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

      const hostelResponse = await axios.get(
        `/api/hostel/getHostelDetailsForLedger/${id}`
      );
      setAllExpand(expands)
      setNoOfYears(yearSemesters);
      setData(subAmountDetails);
      setIsExpanded(expands);
      setTotal(totalAmount);
      setVoucherData(voucherAmount);
      setVoucherPaidData(voucherReceiptAmt);
      setReceiptHeaders(receiptHeads);
      setPaidTotal(paidTempTotal);
      setAddOnData(addOn);
      setUniformData(uniform);
      setReadmissionData(readmission);
      setHostelData(hostelResponse.data.data);
    } catch (err) {
      console.error(err);

      setError("Failed to load ledger data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
        Loading ....
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
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

  const TableHeaderText = ({ label }) => (
    <StyledTableCellBody
      sx={{
        textAlign: "right",
      }}
    >
      <DisplayHeaderText label={label} />
    </StyledTableCellBody>
  );

  const TableBodyText = ({ label }) => (
    <StyledTableCellBody
      sx={{
        textAlign: "right",
      }}
    >
      <DisplayBodyText label={label} />
    </StyledTableCellBody>
  );

  const renderFeeDetails = (year, key) => {
    const { semOrYear, voucherHead, totalAmount, paidAmount, dueAmount } =
      readmissionData;
    if (key === semOrYear) {
      return (
        <TableRow sx={{ transition: "1s" }}>
          <StyledTableCellBody>
            <DisplayBodyText label={voucherHead} />
          </StyledTableCellBody>
          <TableBodyText label={totalAmount} />
          <TableBodyText label="0" />
          <TableBodyText label="0" />
          <TableBodyText label={total[`year${key}`]["acerp"]} />
          <TableBodyText label={paidAmount} />
          <TableBodyText label={dueAmount} />
        </TableRow>
      );
    } else {
      return data
        ?.filter(
          (item) =>
            voucherData[`${year}${item.voucher_head_new_id}`]["fixed"] !== 0
        )
        .map((obj, i) => (
          <TableRow key={i} sx={{ transition: "1s" }}>
            <StyledTableCellBody>
              <DisplayBodyText label={obj.voucher_head} />
            </StyledTableCellBody>
            {headerCategories.map((category, j) => (
              <StyledTableCellBody key={j} sx={{ textAlign: "right" }}>
                <DisplayBodyText
                  label={
                    voucherData[`${year}${obj.voucher_head_new_id}`][
                      category.value
                    ]
                  }
                />
              </StyledTableCellBody>
            ))}
          </TableRow>
        ));
    }
  };

  const hasValidValue = (value) =>
    value !== null && value !== undefined && value !== 0 && value !== "";

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
         const totalCollageFeeDue = total[field]?.due

           return  totalCollageFeeDue ? (
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
                  {isExpanded[field] && renderFeeDetails(field, key)}
                  <TableRow>
                    <StyledTableCellBody>
                      <DisplayHeaderText label="Total College Fee" />
                    </StyledTableCellBody>
                    {headerCategories.map((categories, k) => {
                      const totalValue = total[field][categories?.value];
                      return (
                        <StyledTableCellBody
                          key={k}
                          sx={{
                            textAlign: "right",
                          }}
                        >
                          {k === 4 && totalValue !== 0 ? (
                            <Typography
                              variant="subtitle2"
                              color="primary"
                              sx={{ cursor: "pointer" }}
                              onClick={() => handleModal(key)}
                            >
                              {totalValue}
                            </Typography>
                          ) : (
                            <DisplayHeaderText
                              label={
                                key === readmissionData.semOrYear &&
                                categories?.value === "fixed"
                                  ? readmissionData.totalAmount
                                  : key === readmissionData.semOrYear &&
                                    categories?.value === "due"
                                  ? readmissionData.dueAmount
                                  : totalValue
                              }
                            />
                          )}
                        </StyledTableCellBody>
                      );
                    })}
                  </TableRow>
                  {(hasValidValue(addOnData?.addOnFeeData?.[`sem${key}`]) ||
                    hasValidValue(
                      addOnData?.addOnFeeSemWisePaidAmount?.[`sem${key}`]
                    ) ||
                    hasValidValue(
                      addOnData?.addOnFeeSemWiseDueAmount?.[`sem${key}due`]
                    )) && (
                    <TableRow>
                      <StyledTableCellBody>
                        <DisplayHeaderText label="Add-On Program Fee" />
                      </StyledTableCellBody>
                      <TableHeaderText
                        label={addOnData?.addOnFeeData?.[`sem${key}`] || 0}
                      />
                      <TableHeaderText label="0" />
                      <TableHeaderText label="0" />
                      <TableHeaderText label="0" />
                      <TableHeaderText
                        label={
                          addOnData?.addOnFeeSemWisePaidAmount?.[`sem${key}`] ||
                          0
                        }
                      />
                      <TableHeaderText
                        label={
                          addOnData?.addOnFeeSemWiseDueAmount?.[
                            `sem${key}due`
                          ] || 0
                        }
                      />
                    </TableRow>
                  )}
                  {(hasValidValue(
                    uniformData?.otherFeeDetailsData?.[`sem${key}`]
                  ) ||
                    hasValidValue(
                      uniformData?.semWisePaidAmount?.[`sem${key}paid`]
                    ) ||
                    hasValidValue(
                      uniformData?.semWiseDueAmount?.[`sem${key}due`]
                    )) && (
                    <TableRow>
                      <StyledTableCellBody>
                        <DisplayHeaderText label="Uniform & Books" />
                      </StyledTableCellBody>
                      <TableHeaderText
                        label={
                          uniformData?.otherFeeDetailsData?.[`sem${key}`] || 0
                        }
                      />
                      <TableHeaderText label="0" />
                      <TableHeaderText label="0" />
                      <TableHeaderText label="0" />
                      <TableHeaderText
                        label={
                          uniformData?.semWisePaidAmount?.[`sem${key}paid`] || 0
                        }
                      />
                      <TableHeaderText
                        label={
                          uniformData?.semWiseDueAmount?.[`sem${key}due`] || 0
                        }
                      />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            ):(<></>)
        })}

        {hostelData.length > 0 && (
          <>
            <Divider>
              <Typography
                variant="subtitle2"
                sx={{ color: "tableBg.textColor" }}
              >
                Hostel Details
              </Typography>
            </Divider>
            <TableContainer sx={{ marginTop: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Block</StyledTableCell>
                    <StyledTableCell>Academic Year</StyledTableCell>
                    <StyledTableCell>DOR</StyledTableCell>
                    <StyledTableCell>Bed No.</StyledTableCell>
                    <StyledTableCell>Template</StyledTableCell>
                    <StyledTableCell>Fixed Amount</StyledTableCell>
                    <StyledTableCell>Waiver</StyledTableCell>
                    <StyledTableCell>Paid</StyledTableCell>
                    <StyledTableCell>Balance</StyledTableCell>
                    <StyledTableCell>Food Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hostelData.map((obj, i) => (
                    <TableRow key={i}>
                      <StyledTableCellBody>
                        <DisplayBodyText label={obj.blockName} />
                      </StyledTableCellBody>
                      <StyledTableCellBody sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          {obj.acYear}
                        </Typography>
                      </StyledTableCellBody>
                      <StyledTableCellBody sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          {obj.fromDate?.split("-").reverse().join("-")}
                        </Typography>
                      </StyledTableCellBody>
                      <StyledTableCellBody sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          {obj.bedName}
                        </Typography>
                      </StyledTableCellBody>
                      <StyledTableCellBody sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          {obj.hostelTemplateName}
                        </Typography>
                      </StyledTableCellBody>
                      <TableBodyText label={obj.totalAmount} />
                      <TableBodyText label={obj.waiverAmount} />
                      <TableBodyText label={obj.paidAmount} />
                      <TableBodyText label={obj.dueAmount} />
                      <StyledTableCellBody sx={{ textAlign: "center" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color:
                              obj.foodStatus === "VEG"
                                ? "success.main"
                                : "error.main",
                          }}
                        >
                          {obj.foodStatus}
                        </Typography>
                      </StyledTableCellBody>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </>
  );
}

export default StudentFeeDetails;
