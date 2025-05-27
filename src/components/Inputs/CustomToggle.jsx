import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const CustomToggle = ({ isVisible, onToggle, label = "Filters" }) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={isVisible}
          onChange={onToggle}
          color="primary"
        />
      }
      label={
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isVisible ? `Hide ${label}` : `Show ${label}`}
        </span>
      }
      sx={{ mb: 2 }}
    />
  );
};

export default CustomToggle;

