import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initialValues = {
  isScholarship: "",
};

const Test = () => {
  const [values, setValues] = useState(initialValues);
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <Grid item xs={12} md={4}>
        <CustomRadioButtons
          name="isScholarship"
          label="Type"
          value={values.isScholarship}
          items={[
            {
              value: "reason",
              label: "Exemption reason",
            },
            {
              value: "exemption",
              label: "Exemption Type",
            },
          ]}
          handleChange={handleChange}
          required
        />
      </Grid>
    </>
  );
};

export default Test;
