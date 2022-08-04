import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

// name: string
// label: string
// value: any
// items: { value: any, label: string }[]
// handleChange: () => void
// setFormValid?: () => void
// required?: boolean

function CustomRadioButtons({
  name,
  label,
  value,
  items,
  handleChange,
  setFormValid = () => {},
  required = false,
}) {
  return (
    <FormControl fullWidth required={required}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={(e) => {
          handleChange(e);
          setFormValid((prev) => ({ ...prev, [name]: true }));
        }}
        name={name}
      >
        {items.map((obj, index) => (
          <FormControlLabel
            key={index}
            value={obj.value}
            control={
              <Radio
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 19,
                  },
                }}
              />
            }
            label={obj.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default CustomRadioButtons;
