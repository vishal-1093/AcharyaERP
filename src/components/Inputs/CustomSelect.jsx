import {
  Select,
  FormControl,
  MenuItem,
  Box,
  InputLabel,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles((theme) => ({
  errorText: {
    fontSize: 12,
    margin: "2px 10px",
    color: theme.palette.error.main,
  },
}));

function CustomSelect({
  name,
  label,
  value,
  items,
  handleChange,
  error,
  required = false,
}) {
  const classes = useStyles();

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl size="small" required={required} error={!!error} fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          size="small"
          name={name}
          value={value}
          label={label}
          onChange={handleChange}
        >
          {items.map((obj, index) => (
            <MenuItem key={index} value={obj.value}>
              {obj.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && <p className={classes.errorText}>{error}</p>}
    </Box>
  );
}

export default CustomSelect;
