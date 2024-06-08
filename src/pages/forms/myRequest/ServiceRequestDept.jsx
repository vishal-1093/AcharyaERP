import { Button, CardContent, Grid, Typography } from "@mui/material";
import axios from "../../../services/Api";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

const BoxShadow = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  ...theme.typography.body2,
  backgroundColor: "#f3f6f9",
}));

const StockRegister = () => {
  const [deptOptions, setDeptOptions] = useState([]);

  useEffect(() => {
    getDepartment();
  }, []);

  const getDepartment = async () => {
    await axios
      .get(`/api/getActiveDepartmentAssignmentBasedOnTag`)
      .then((res) => {
        const departMents = res.data.data.filter(
          (obj) => obj.dept_name !== "Transport"
        );
        setDeptOptions(departMents);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Grid container alignItems="flex-start" spacing={3} mt={1}>
      {deptOptions?.map((obj, i) => {
        return (
          <Grid item sm={12} md={6} lg={4} key={i}>
            <Card title={obj.dept_name} id={obj.id} />
            <Paper elevation={3} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StockRegister;

const Card = ({ path, title, description, id }) => {
  const navigate = useNavigate();
  return (
    <BoxShadow elevation={3}>
      <CardContent>
        <Grid container justifyContent="flex-start" rowSpacing={2}>
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: 14,
                color: "auzColor.main",
                cursor: "pointer",
                textAlign: "center",
              }}
              gutterBottom
              variant="h6"
            >
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {title === "Transport" ? (
              <Button
                variant="contained"
                onClick={() => navigate(`/ServiceRequestTransport/${id}`)}
              >
                Request
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate(`/ServiceRequestDeptWise/${id}`)}
              >
                Request
              </Button>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </BoxShadow>
  );
};
