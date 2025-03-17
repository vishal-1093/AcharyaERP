import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Grid,
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
import moment from "moment";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import FormPaperWrapper from "../../../components/FormPaperWrapper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const initialValues = {};

function JournalGrnForm({ rowData }) {
  const [values, setValues] = useState(initialValues);

  const DisplayBoldText = ({ label }) => (
    <Typography variant="subtitle2">{label}</Typography>
  );

  const DisplayHeader = ({ label, value }) => (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
      <DisplayBoldText label={label} />
      <Typography variant="subtitle2" color="textSecondary">
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box mt={2}>
      <FormPaperWrapper>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12} md={3}>
            <DisplayHeader
              label="Date :"
              value={moment().format("DD-MM-YYYY")}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DisplayHeader
              label="Vendor Name :"
              value={rowData.env_vendor_name}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DisplayHeader
              label="PO Number :"
              value={rowData.po_po_reference_no}
            />
          </Grid>

          {/* <Grid item xs={12}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Inter School</StyledTableCell>
                    <StyledTableCell>Heads</StyledTableCell>
                    <StyledTableCell>Ledger</StyledTableCell>
                    <StyledTableCell>PO Reference</StyledTableCell>
                    <StyledTableCell>Debit</StyledTableCell>
                    <StyledTableCell>Credit</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {values.voucherData?.map((obj, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <CustomAutocomplete
                          name={`interSchoolId-${i}`}
                          value={values.voucherData[i].interSchoolId}
                          options={handleInterSchoolOptions()}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`headType-${i}`}
                          value={values.voucherData[i].headType}
                          options={headTypeList}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`vendorId-${i}`}
                          value={values.voucherData[i].vendorId}
                          options={filteredVendorOptions(i)}
                          handleChangeAdvance={handleChangeAdvanceVendor}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`poReference-${i}`}
                          value={values.voucherData[i].poReference}
                          options={values.voucherData[i].poOptions || []}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <CustomTextField
                          name={`debit-${i}`}
                          value={values.voucherData[i].debit}
                          inputProps={{
                            style: { textAlign: "right" },
                          }}
                          handleChange={handleChangeVoucher}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <CustomTextField
                          name={`credit-${i}`}
                          value={values.voucherData[i].credit}
                          inputProps={{
                            style: { textAlign: "right" },
                          }}
                          handleChange={handleChangeVoucher}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle2">Total</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle2">{total.debit}</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle2">
                        {total.credit}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid> */}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default JournalGrnForm;
