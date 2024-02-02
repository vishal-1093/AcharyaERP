import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { convertDateToStringFormat } from "../../utils/DateTimeUtils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import TextField from "@mui/material/TextField";

function CustomSelectDateRange({
  name,
  label,
  value,
  handleChange,
  setValues,
  dateName,
  disabled,
}) {
  const [dateValues, setDateValues] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const today = new Date();

  const todayValue =
    convertDateToStringFormat(today) + "," + convertDateToStringFormat(today);

  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const yesterdayValue =
    convertDateToStringFormat(new Date(yesterday)) +
    "," +
    convertDateToStringFormat(new Date(yesterday));

  const sevenDays = new Date().setDate(new Date().getDate() - 6);
  const sevenDaysValue =
    convertDateToStringFormat(new Date(sevenDays)) +
    "," +
    convertDateToStringFormat(today);

  // const thirtyDays = new Date().setDate(new Date().getDate() - 29);
  // const thirtyDaysValue =
  //   todayValue + "," + convertDateToStringFormat(new Date(thirtyDays));

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const monthValue =
    convertDateToStringFormat(firstDay) +
    "," +
    convertDateToStringFormat(lastDay);

  const lastMonthfirstDay = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const lastMonthLastDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1 - 1,
    0
  );
  const lastMonthValue =
    convertDateToStringFormat(lastMonthfirstDay) +
    "," +
    convertDateToStringFormat(lastMonthLastDay);

  // const threeMonthfirstDay = new Date(
  //   today.getFullYear(),
  //   today.getMonth() - 2,
  //   1
  // );
  // const threeMonthLastDay = new Date(
  //   today.getFullYear(),
  //   today.getMonth() + 1,
  //   0
  // );
  // const threeMonthValue =
  //   convertDateToStringFormat(threeMonthfirstDay) +
  //   "," +
  //   convertDateToStringFormat(threeMonthLastDay);

  const yearfirstDay = new Date(today.getFullYear(), 0, 1);
  const yearLastDay = new Date(today.getFullYear(), 12, 0);
  const thisYearValue =
    convertDateToStringFormat(yearfirstDay) +
    "," +
    convertDateToStringFormat(yearLastDay);

  const lastYearfirstDay = new Date(today.getFullYear() - 1, 0, 1);
  const lastYearLastDay = new Date(today.getFullYear() - 1, 12, 0);
  const lastYearValue =
    convertDateToStringFormat(lastYearfirstDay) +
    "," +
    convertDateToStringFormat(lastYearLastDay);

  const handleChangeAdvance = (name, newValue) => {
    setDateValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    if (dateValues.startDate !== null && dateValues.endDate !== null) {
      setValues((prev) => ({
        ...prev,
        [dateName]:
          convertDateToStringFormat(new Date(dateValues.startDate)) +
          "," +
          convertDateToStringFormat(new Date(dateValues.endDate)),
      }));
    }
  }, [dateValues]);

  return (
    <Box>
      <FormControl size="small" fullWidth disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select
          size="small"
          name={name}
          value={value}
          label={label}
          onChange={(e) => {
            handleChange(e);
          }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value={todayValue}>Today</MenuItem>
          <MenuItem value={yesterdayValue}>Yesterday</MenuItem>
          <MenuItem value={sevenDaysValue}>Last 7 Days</MenuItem>
          {/* <MenuItem value={thirtyDaysValue}>Last 30 Days</MenuItem> */}
          <MenuItem value={monthValue}>This Month</MenuItem>
          <MenuItem value={lastMonthValue}>Last Month</MenuItem>
          {/* <MenuItem value={threeMonthValue}>Last 3 Month</MenuItem> */}
          <MenuItem value={thisYearValue}>This Year</MenuItem>
          <MenuItem value={lastYearValue}>Last Year</MenuItem>
          <MenuItem value="custom">Custom Range</MenuItem>
        </Select>
      </FormControl>

      {value === "custom" ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={{ xs: "center", md: "left" }}
          mt={2}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              value={dateValues.startDate}
              label="Start Date"
              inputFormat="DD/MM/YYYY"
              closeOnSelect
              onChange={(val) => {
                handleChangeAdvance("startDate", val);
              }}
              renderInput={(params) => (
                <TextField size="small" fullWidth {...params} />
              )}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              value={dateValues.endDate}
              label="End Date"
              inputFormat="DD/MM/YYYY"
              closeOnSelect
              onChange={(val) => {
                handleChangeAdvance("endDate", val);
              }}
              renderInput={(params) => (
                <TextField size="small" fullWidth {...params} />
              )}
              minDate={dateValues.startDate}
            />
          </LocalizationProvider>
        </Stack>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default CustomSelectDateRange;
