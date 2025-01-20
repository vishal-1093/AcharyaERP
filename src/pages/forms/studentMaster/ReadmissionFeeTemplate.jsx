import {
  Card,
  CardContent,
  CardHeader,
  Grid,
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
import CustomTextField from "../../../components/Inputs/CustomTextField";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "right",
  },
}));

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function ReadmissionFeeTemplate({
  feeTemplateData,
  feeTemplateSubAmountData,
  values,
  noOfYears,
  handleChange,
}) {
  const renderFeeTemplateRow = (label, value) => {
    return (
      <>
        <Grid item xs={12} md={1.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4.5}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  const renderFeeTemplateRows = (label, value) => {
    return (
      <>
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  const renderTableHeader = () => (
    <TableRow>
      <StyledTableCell>Particulars</StyledTableCell>
      {noOfYears.map((val, i) => {
        return <StyledTableCell key={i}>{val.value}</StyledTableCell>;
      })}
      <StyledTableCell>Total</StyledTableCell>
    </TableRow>
  );

  const renderTotalRow = () => (
    <TableRow>
      <StyledTableCellBody colSpan={1} sx={{ textAlign: "center !important" }}>
        <Typography variant="subtitle2">Total</Typography>
      </StyledTableCellBody>
      {noOfYears.map((totObj, k) => {
        return (
          <StyledTableCellBody key={k}>
            <Typography variant="subtitle2">
              {feeTemplateSubAmountData[0]["fee_year" + totObj.key + "_amt"]}
            </Typography>
          </StyledTableCellBody>
        );
      })}
      <StyledTableCellBody>
        <Typography variant="subtitle2">
          {feeTemplateData.fee_year_total_amount}
        </Typography>
      </StyledTableCellBody>
    </TableRow>
  );

  const renderReadmissionRow = () => (
    <TableRow sx={{ background: "#dbf3dc" }}>
      <StyledTableCellBody sx={{ textAlign: "left !important" }}>
        {values.reAdmissionHead}
      </StyledTableCellBody>
      {noOfYears.map((obj, j) => {
        return (
          <StyledTableCellBody key={j}>
            {/* {obj.key === values.year && roleShortName === "SAA" ? (
              <CustomTextField
                name="reAdmissionAmt"
                value={values.reAdmissionAmt}
                handleChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": {
                    "& input": {
                      textAlign: "right",
                    },
                  },
                }}
              />
            ) : obj.key === values.year && roleShortName !== "SAA" ? (
              values.reAdmissionAmt
            ) : (
              0
            )} */}
            {obj.key === values.year && (
              <CustomTextField
                name="reAdmissionAmt"
                value={values.reAdmissionAmt}
                handleChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": {
                    "& input": {
                      textAlign: "right",
                    },
                  },
                }}
              />
            )}
          </StyledTableCellBody>
        );
      })}
      <StyledTableCellBody>{values.reAdmissionAmt}</StyledTableCellBody>
    </TableRow>
  );

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Fee Template Details"
            titleTypographyProps={{
              variant: "subtitle2",
            }}
            sx={{
              backgroundColor: "rgba(74, 87, 169, 0.1)",
              color: "#46464E",
              textAlign: "center",
              padding: 1,
            }}
          />
          <CardContent>
            <Grid container columnSpacing={2} rowSpacing={1}>
              {renderFeeTemplateRow(
                "Fee Template",
                feeTemplateData.fee_template_name
              )}
              {renderFeeTemplateRows("AC Year", feeTemplateData.ac_year)}
              {renderFeeTemplateRow(
                "Currency",
                feeTemplateData.currency_type_name
              )}
              {renderFeeTemplateRows(
                "Fee Scheme",
                feeTemplateData.program_type_name
              )}
              {renderFeeTemplateRow(
                "Admission Category",
                feeTemplateData.fee_admission_category_short_name
              )}
              {renderFeeTemplateRows(
                "Admission Sub Category",
                feeTemplateData.fee_admission_sub_category_name
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <TableContainer>
          <Table size="small">
            <TableHead>{renderTableHeader()}</TableHead>
            <TableBody>
              {feeTemplateSubAmountData.map((obj, i) => {
                return (
                  <TableRow key={i}>
                    <StyledTableCellBody sx={{ textAlign: "left !important" }}>
                      {obj.voucher_head}
                    </StyledTableCellBody>
                    {noOfYears.map((amtObj, j) => {
                      return (
                        <StyledTableCellBody key={j}>
                          {obj["year" + amtObj.key + "_amt"]}
                        </StyledTableCellBody>
                      );
                    })}
                    <StyledTableCellBody>{obj.total_amt}</StyledTableCellBody>
                  </TableRow>
                );
              })}
              {renderTotalRow()}
              {renderReadmissionRow()}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default ReadmissionFeeTemplate;
