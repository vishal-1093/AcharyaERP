import { useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Table,
  Checkbox,
  TableHead,
  TableBody,
  TableContainer,
  Paper,
  Grid,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CustomTextField from "./Inputs/CustomTextField";
import useAlert from "../hooks/useAlert";
import moment from "moment/moment";
import ModalWrapper from "./ModalWrapper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "left",
    fontFamily: "Roboto",
    fontSize: "13px !important",
    // width: "25%",
  },
}));

const StyledTableCellRight = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "right",
    fontFamily: "Roboto",
    fontSize: "13px !important",
    // width: "25%",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
    fontFamily: "Roboto",
    fontSize: "13px !important",
    textAlign: "left",
  },
}));

const StyledTableCellBodyRight = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
    fontFamily: "Roboto",
    fontSize: "13px !important",
    textAlign: "right",
  },
}));

const StyledTableCells = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
  },
}));

function StudentRefundDetails({ id, studentDataResponse }) {
  const [noOfYears, setNoOfYears] = useState([]);
  const [voucherHeadIds, setVoucherHeadIds] = useState([]);
  const [values, setValues] = useState({ remarks: "" });
  const [testData, setTestData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [receiptFormatData, setReceiptFormatData] = useState([]);
  const [studentPaidData, setStudentPaidData] = useState([]);
  const [yearWiseDue, setYearWiseDue] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const [total, setTotal] = useState();
  const [receiptTotal, setReceiptTotal] = useState();
  const [refundFormatData, setRefundFormatData] = useState([]);
  const [refundVouchers, setRefundVouchers] = useState([]);
  const [refundReceiptHeader, setRefundReceiptHeader] = useState([]);
  const [refundReceiptFormatData, setRefundReceiptFormatData] = useState([]);
  const [rowDueTotal, setRowDueTotal] = useState();
  const [cancelAdmissionStatus, setCancelAdmissionStatus] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getRefundData();
  }, [id, studentDataResponse]);

  useEffect(() => {
    const totalPay = checkedData?.reduce(
      (total, sum) => Number(total) + Number(sum.payNow),
      0
    );
    const totalReceipt = checkedData?.reduce(
      (total, sum) => Number(total) + Number(sum.inr_value),
      0
    );
    setTotal(totalPay);
    setReceiptTotal(totalReceipt);
  }, [checkedData]);

  const getRefundData = async () => {
    try {
      const dueResponse = await axios.get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForRefund/${id}`
      );

      if (dueResponse.status === 200 || 201) {
        const Ids = [];
        dueResponse.data.data.fee_template_sub_amount_info.forEach((obj) => {
          Ids.push({
            id: obj.voucher_head_new_id,
            label: obj.voucher_head,
          });
        });

        const startYear = dueResponse.data.data.Student_info[0]
          .old_std_id_readmn
          ? dueResponse.data.data.Student_info[0].semOrYear
          : 1;

        const years = [];
        if (studentDataResponse?.program_type_name.toLowerCase() === "yearly") {
          for (
            let i = startYear;
            i <= studentDataResponse?.number_of_semester;
            i++
          ) {
            years.push({
              label: "Sem" + "-" + i,
              key: i,
              feeDetailsOpen: true,
            });
          }
        } else if (
          studentDataResponse?.program_type_name.toLowerCase() === "semester"
        ) {
          for (
            let i = startYear;
            i <= studentDataResponse?.number_of_semester;
            i++
          ) {
            years.push({
              label: "Sem" + "-" + i,
              key: i,
              feeDetailsOpen: true,
            });
          }
        }

        setCancelAdmissionStatus(dueResponse?.data?.data?.cancelAdmission);

        setStudentPaidData(
          dueResponse?.data?.data?.fee_receipt_student_pay_his
        );

        const readmissionStatus =
          dueResponse.data.data.Student_info[0].old_std_id_readmn;

        const readmissionYear = dueResponse.data.data.Student_info[0].semOrYear;

        setNoOfYears(years);

        // Create a mapping of voucherId to its label from responseTwo
        const voucherMapping = Ids.reduce((acc, { id, label }) => {
          acc[id] = label;
          return acc;
        }, {});

        const formattedData = Object.keys(
          dueResponse.data.data.dueAmount
        ).reduce((acc, key) => {
          const fees = dueResponse.data.data.dueAmount[key];
          const subamount =
            dueResponse.data.data.fee_template_sub_amount_format[key];

          const feeArray = Object.keys(fees).map((feeId) => {
            return {
              voucherId: parseInt(feeId),
              amount: fees[feeId],
              subamount: subamount[feeId],
              payingNow: 0,
              voucherHeadName: voucherMapping[feeId],
            };
          });
          acc[key] = feeArray;
          return acc;
        }, {});

        if (readmissionStatus) {
          formattedData[readmissionYear] = [
            {
              voucherId: dueResponse.data.data.readmissionData.voucherHeadNewId,
              amount: dueResponse.data.data.readmissionData.balance,
              payingNow: 0,
              voucherHeadName:
                dueResponse.data.data.readmissionData.voucherHead,
              subamount: dueResponse.data.data.readmissionData.totalAmount,
            },
          ];
        }

        getTestData(
          years,
          formattedData,
          dueResponse?.data?.data?.cancelAdmission
        );

        const receiptsPaid = [];

        dueResponse?.data?.data?.fee_receipt_student_pay_his?.forEach((obj) => {
          receiptsPaid.push({
            fee_receipt: obj.fee_receipt,
            created_date: moment(obj.created_date).format("DD-MM-YYYY"),
            checked: false,
            voucherId: obj.voucher_head_new_id,
            paidYear: obj.paid_year,
            voucher_head: obj.voucher_head,
            paid_amount: obj.paid_amount,
          });
        });

        const groupedData = {};

        dueResponse?.data?.data?.refundDetails?.forEach((item) => {
          const key = `${item.paid_year}-${item.refund_reference_no}`;
          if (!groupedData[key]) {
            groupedData[key] = [];
          }
          groupedData[key].push(item);
        });

        setRefundVouchers(groupedData);

        const refundformat = {};

        years.forEach((year) => {
          Ids.forEach((voucher) => {
            const key = `${year.key}-${voucher.id}`;
            const match = dueResponse?.data?.data?.refundDetails?.find(
              (item) =>
                item.voucher_head_new_id === voucher.id &&
                item.paid_year === year
            );

            refundformat[key] = [
              {
                amount_paid: match ? match.approver_amount : 0,
                voucher_head_id: voucher.id,
              },
            ];
          });
        });

        setRefundFormatData(refundformat);

        const filterReceipt = Array?.from(
          new Map(
            receiptsPaid?.map((item) => [item.fee_receipt, item])
          ).values()
        );

        setReceiptData(filterReceipt);

        const refundReceipt = [];

        dueResponse?.data?.data?.refundDetails?.forEach((obj) => {
          refundReceipt.push({
            ...obj,
            created_date: moment(obj.created_date).format("DD-MM-YYYY"),
          });
        });

        const filterRefundReceipt = Array?.from(
          new Map(
            refundReceipt?.map((item) => [item.refund_reference_no, item])
          ).values()
        );

        setRefundReceiptHeader(filterRefundReceipt);

        getReceiptFormat(
          Ids,
          years,
          filterReceipt,
          dueResponse.data.data.fee_receipt_student_pay_his
        );

        getYearWiseTotal(
          years,
          formattedData,
          dueResponse?.data?.data?.cancelAdmission
        );

        getRefundReceiptsFormat(
          Ids,
          years,
          filterRefundReceipt,
          dueResponse?.data?.data?.refundDetails
        );

        setVoucherHeadIds(Ids);

        const voucherIds = {};
        const mainFormat = {};
        years.forEach((year) => {
          Ids.forEach((obj) => {
            voucherIds[obj.id] = 0;
            mainFormat[year.key] = voucherIds;
          });
        });
      }
    } catch (error) {
      console.log(error);

      setTestData([]);
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const getYearWiseTotal = (years, formattedData, cancelStatus) => {
    const negativeYearData = {};

    years?.forEach((year) => {
      const yearData = formattedData?.[year.key];
      const totalAmount = yearData?.reduce(
        (total, sum) => Number(total) + Number(sum.amount),
        0
      );

      if (totalAmount < 0) {
        negativeYearData[year.key] = yearData;
      }
    });

    const yearwiseDue = {};

    Object.keys(negativeYearData).forEach((year) => {
      yearwiseDue[year] = negativeYearData[year].reduce(
        (total, sum) => Math.abs(total) + Math.abs(sum.amount),
        0
      );
    });

    // if (cancelStatus) {
    //   Object.keys(formattedData).forEach((year) => {
    //     formattedData[year] = formattedData[year].reduce(
    //       (total, sum) => Number(total) + Number(sum.amount),
    //       0
    //     );
    //   });
    // }

    setYearWiseDue(yearwiseDue);
  };

  const getTestData = (years, formattedData, cancelStatus) => {
    const negativeYearData = {};

    years?.forEach((year) => {
      const yearData = formattedData?.[year.key];
      const totalAmount = yearData?.reduce(
        (total, sum) => Number(total) + Number(sum.amount),
        0
      );

      if (totalAmount < 0) {
        negativeYearData[year.key] = yearData;
      }
    });

    if (cancelStatus) {
      setTestData(formattedData);
    } else {
      setTestData(negativeYearData);
    }
  };

  const getReceiptFormat = (Ids, years, filterReceipt, feeReceiptPaid) => {
    const receiptFormat = {};

    Ids.forEach((voucherId) => {
      years.forEach((year) => {
        filterReceipt.forEach((receiptId) => {
          const key = `${voucherId.id}-${year.key}-${receiptId.fee_receipt}`;

          const existingPayment = feeReceiptPaid.find(
            (payment) =>
              payment.voucher_head_new_id === voucherId.id &&
              payment.paid_year === year.key &&
              payment.fee_receipt === receiptId.fee_receipt
          );

          receiptFormat[key] = existingPayment
            ? [
                {
                  amount_paid: existingPayment.paid_amount,
                  voucher_head_id: voucherId.id,
                },
              ]
            : [{ amount_paid: 0, voucher_head_id: voucherId.id }];
        });
      });
    });

    setReceiptFormatData(receiptFormat);

    return receiptFormat;
  };

  const getRefundReceiptsFormat = (
    Ids,
    years,
    filterReceipt,
    feeReceiptPaid
  ) => {
    const refundReceiptFormat = {};

    Ids.forEach((voucherId) => {
      years.forEach((year) => {
        filterReceipt.forEach((receiptId) => {
          const key = `${voucherId.id}-${year.key}-${receiptId.refund_reference_no}`;

          const existingPayment = feeReceiptPaid.find(
            (payment) =>
              payment.voucher_head_new_id === voucherId.id &&
              payment.paid_year === year.key &&
              payment.refund_reference_no === receiptId.refund_reference_no
          );

          refundReceiptFormat[key] = existingPayment
            ? [
                {
                  amount_paid: existingPayment.approver_amount,
                  voucher_head_id: voucherId.id,
                },
              ]
            : [{ amount_paid: 0, voucher_head_id: voucherId.id }];
        });
      });
    });

    setRefundReceiptFormatData(refundReceiptFormat);

    return refundReceiptFormat;
  };

  const handleOpen = (id) => {
    setNoOfYears((prev) =>
      prev.map((obj, i) => {
        if (obj.key === id) return { ...obj, ["feeDetailsOpen"]: true };
        return obj;
      })
    );
  };

  const handleClose = (id) => {
    setNoOfYears((prev) =>
      prev.map((obj, i) => {
        if (obj.key === id) return { ...obj, ["feeDetailsOpen"]: false };
        return obj;
      })
    );
  };

  const handleChangeOne = (e, year, voucherId) => {
    const splitName = e.target.name.split("-");

    setTestData((prev) => {
      const updatedData = { ...prev };

      const index = updatedData[year].findIndex(
        (item) => item.voucherId === voucherId
      );

      const positiveAmount = Math.abs(updatedData[year][index].amount);

      updatedData[year][index].payingNow =
        Number(e.target.value) > positiveAmount ? 0 : Number(e.target.value);

      return updatedData;
    });

    // disabledFunction(testData, firstData);
  };

  const handleChangeCheckbox = (feeReceipt, year, obj) => {
    const data = studentPaidData
      .filter(
        (obj) =>
          Number(obj.fee_receipt) === Number(feeReceipt) &&
          Number(obj.paid_year) === Number(year)
      )
      .map((ele) => ({ ...ele, payNow: 0 }));

    const dueTotal = testData?.[year]?.reduce(
      (total, sum) => Number(total) + Number(sum.amount),
      0
    );

    const dueForCancelStatus = data.reduce(
      (total, sum) => Number(total) + Number(sum.inr_value),
      0
    );

    if (cancelAdmissionStatus) {
      setRowDueTotal(Math.abs(dueForCancelStatus));
    } else {
      setRowDueTotal(Math.abs(dueTotal));
    }

    setCheckedData(data);
    setModalOpen(true);
  };

  const handleChangePay = (e, index) => {
    setCheckedData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = [];

      checkedData.map((obj) => {
        if (obj.payNow > 0) {
          payload.push({
            cancel_admission_status: cancelAdmissionStatus,
            receipt_no: obj.fee_receipt,
            school_id: studentDataResponse?.school_id,
            student_id: studentDataResponse?.student_id,
            voucher_head_new_id: obj.voucher_head_new_id,
            actual_amount: receiptTotal,
            requested_amount: obj.payNow,
            paid_year: obj.paid_year,
            requested_remarks: values.remarks,
            balance_amount: receiptTotal - total,
            prev_financial_year_id: 4,
            inr_value: obj.payNow,
            refund_status: "Processed",
            created_by: 1,
            modified_by: 2,
            active: true,
            refund_remarks: values.remarks,
          });
        }
      });

      const postResponse = await axios.post(
        `/api/finance/saveRefundRequest`,
        payload
      );

      if (postResponse.status === 200 || postResponse.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Processed Successfully",
        });
        setAlertOpen(true);
        window.location.reload();
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const rendeFeeDetails = (obj1) => {
    return (
      <>
        {testData?.[obj1]?.map((vouchers) => {
          if (vouchers.subamount !== 0)
            return (
              <TableRow>
                <StyledTableCellBody>
                  {vouchers.voucherHeadName}
                </StyledTableCellBody>
                <StyledTableCellBodyRight>
                  {vouchers.subamount ?? 0}
                </StyledTableCellBodyRight>
                <StyledTableCellBodyRight>
                  {vouchers.amount ?? 0}
                </StyledTableCellBodyRight>

                {receiptData
                  ?.filter(
                    (receipt) => Number(receipt.paidYear) === Number(obj1)
                  )
                  ?.map((receipt) => {
                    const key = `${vouchers.voucherId}-${obj1}-${receipt.fee_receipt}`;
                    const amountPaid =
                      receiptFormatData?.[key]?.[0]?.amount_paid ?? "0";

                    return (
                      <StyledTableCellBodyRight key={key}>
                        {amountPaid}
                      </StyledTableCellBodyRight>
                    );
                  })}

                {refundReceiptHeader
                  ?.filter(
                    (receipt) => Number(receipt.paid_year) === Number(obj1)
                  )
                  ?.map((receipt) => {
                    const key = `${vouchers.voucherId}-${obj1}-${receipt.refund_reference_no}`;
                    const amountPaid =
                      refundReceiptFormatData?.[key]?.[0]?.amount_paid ?? "0";

                    return (
                      <StyledTableCellBodyRight key={key}>
                        {amountPaid}
                      </StyledTableCellBodyRight>
                    );
                  })}

                {/* {receiptData?.map((receiptId) => (
                  <StyledTableCellBodyRight>
                    {`${
                      receiptFormatData?.[
                        `${vouchers.voucherId}-${obj1}-${receiptId.fee_receipt}`
                      ]?.[0]?.amount_paid
                    }`}
                  </StyledTableCellBodyRight>
                ))} */}

                {/* {receiptData?.map((receiptId) => {
                  const splitName = Object.keys(receiptFormatData).split("-");
                  if (
                    Number(splitName[0]) === Number(vouchers.voucherId) &&
                    Number(splitName[1]) === Number(obj1) &&
                    Number(splitName[2]) === Number(receiptId.fee_receipt)
                  ) {
                    <StyledTableCellBodyRight>
                      {`${
                        receiptFormatData?.[
                          `${vouchers.voucherId}-${obj1}-${receiptId.fee_receipt}`
                        ]?.[0]?.amount_paid
                      }`}
                    </StyledTableCellBodyRight>;
                  }
                })} */}

                {/* <StyledTableCellBodyRight>
                  <CustomTextField
                    name={`payingNow-${obj1}-${vouchers.voucherId}`}
                    label=""
                    value={vouchers.payingNow}
                    handleChange={(e) =>
                      handleChangeOne(e, obj1, vouchers.voucherId)
                    }
                    InputProps={{
                      sx: { textAlign: "right" },
                      inputProps: {
                        style: { textAlign: "right" }, // fallback for consistent behavior
                      },
                    }}
                    disabled={vouchers.amount === 0 || vouchers.amount > 0}
                  />
                </StyledTableCellBodyRight> */}
              </TableRow>
            );
        })}
      </>
    );
  };

  return (
    <>
      <Grid
        container
        justifyContent={"center"}
        alignItems={"center"}
        rowSpacing={2}
      >
        {Object?.keys(testData)?.length > 0 && receiptData.length > 0 ? (
          Object?.keys(testData)?.map((year) => (
            <Grid item xs={12}>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>{"Sem" + year}</StyledTableCell>
                      <StyledTableCellRight>Fixed</StyledTableCellRight>
                      <StyledTableCellRight>Due</StyledTableCellRight>

                      {receiptData?.map((obj) => {
                        if (Number(obj.paidYear) === Number(year)) {
                          return (
                            <StyledTableCellRight key={obj.fee_receipt}>
                              {/* <div
                            style={{
                              display: "flex",
                              gap: 2,
                            }}
                          > */}
                              {`${obj.fee_receipt}/${obj.created_date}`}
                              <Checkbox
                                checked={obj.checked}
                                onChange={() =>
                                  handleChangeCheckbox(
                                    obj.fee_receipt,
                                    year,
                                    obj
                                  )
                                }
                                disabled={refundReceiptHeader.some(
                                  (item) =>
                                    Number(item.receipt_no) ===
                                    Number(obj.fee_receipt)
                                )}
                                size="small"
                                sx={{
                                  marginBottom: 0.5,
                                }}
                              />

                              {/* </div> */}
                            </StyledTableCellRight>
                          );
                        }
                      })}

                      {refundReceiptHeader?.map((obj) => {
                        if (Number(obj.paid_year) === Number(year)) {
                          return (
                            <StyledTableCellRight>{`R-${obj.refund_reference_no}/${obj.created_date}`}</StyledTableCellRight>
                          );
                        }
                      })}

                      {/* <StyledTableCellRight></StyledTableCellRight> */}
                      {/* <StyledTableCell sx={{ width: "2% !important" }}>
                        <IconButton sx={{ padding: 0, transition: "1s" }}>
                          {obj.feeDetailsOpen ? (
                            <ArrowDropUpIcon
                              onClick={() => handleClose(obj.key)}
                            />
                          ) : (
                            <ArrowDropDownIcon
                              onClick={() => handleOpen(obj.key)}
                            />
                          )}
                        </IconButton>
                      </StyledTableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>{rendeFeeDetails(year)}</TableBody>

                  <TableRow>
                    <StyledTableCell>Total</StyledTableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {testData?.[year]?.reduce(
                        (total, sum) => Number(total) + Number(sum.subamount),
                        0
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {testData?.[year]?.reduce(
                        (total, sum) => Number(total) + Number(sum.amount),
                        0
                      )}
                    </TableCell>
                  </TableRow>
                </Table>
              </TableContainer>
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} align="center" mt={2}>
              <Typography variant="subtitle2" color="red">
                STUDENT HAS NO ANY RECEIPTS
              </Typography>
            </Grid>
          </>
        )}

        <ModalWrapper
          title={`Receipt No. ${checkedData?.[0]?.fee_receipt} `}
          open={modalOpen}
          setOpen={setModalOpen}
          maxWidth={700}
        >
          <Grid
            container
            rowSpacing={2}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item xs={12} md={4} align="right">
              <CustomTextField label="Amount" value={rowDueTotal} />
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCells>Voucher</StyledTableCells>
                      <StyledTableCells>Paid</StyledTableCells>
                      <StyledTableCells>Refund</StyledTableCells>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {checkedData?.map((obj, i) => (
                      <TableRow key={i}>
                        <StyledTableCells>{obj.voucher_head}</StyledTableCells>
                        <StyledTableCells>{obj.paid_amount}</StyledTableCells>
                        <StyledTableCells>
                          <CustomTextField
                            name="payNow"
                            value={obj.payNow}
                            handleChange={(e) => handleChangePay(e, i)}
                          />
                        </StyledTableCells>
                      </TableRow>
                    ))}

                    <TableRow>
                      <StyledTableCells>Total</StyledTableCells>
                      <StyledTableCells></StyledTableCells>
                      <StyledTableCells>{total}</StyledTableCells>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                multiline
                rows={2}
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} align="center">
              {total > rowDueTotal ? (
                <Typography variant="subtitle" color="red">
                  Total amount cannot be greater than amount
                </Typography>
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={12} mt={1} align="right">
              <Button
                disabled={total > rowDueTotal}
                onClick={handleSubmit}
                variant="contained"
              >
                SUBMIT
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>
      </Grid>
    </>
  );
}
export default StudentRefundDetails;
