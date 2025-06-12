import React, {useEffect } from "react";
import {
  Button,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

const BoxShadow = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  ...theme.typography.body2,
  backgroundColor: "#f3f6f9",
}));

const ChartsDashboard = () => {
  const setCrumbs = useBreadcrumbs();
    useEffect(() => {
      setCrumbs([]);
    }, []);

  return (
    <Grid container alignItems="flex-start" spacing={3}>
      <Grid item sm={12} md={6} lg={4}>
        <Card
          path="/charts-dashboard/hrm"
          title="HRM"
          description="Access a centralized platform for university insights, spanning workforce metrics, recruitment, engagement, compliance, etc."
        />
        <Paper elevation={3} />
      </Grid>
      <Grid item sm={12} md={6} lg={4}>
        <Card
          path="/charts-dashboard/finance"
          title="Finance"
          description="Get insights into the complete reports of financial aspects of the University showcasing key metrics related to revenue, expenses, adherence, cash flow, and financial performance."
        />
      </Grid>
      <Grid item sm={12} md={6} lg={4}>
        <Card
          path="/charts-dashboard/admission"
          title="Admissions"
          description="Get detailed information on the admissions overview, reports on students admitted, admissions status, demographics, programme specifics, etc."
        />
      </Grid>
      <Grid item sm={12} md={6} lg={4}>
        <Card
          path="/charts-dashboard/hrm"
          title="Academics"
          description="Have a comprehensive overview of academic performance, enrollment trends, course progress, curriculum management, and student engagement. "
        />
      </Grid>
      <Grid item sm={12} md={6} lg={4}>
        <Card
          path="/charts-dashboard/hrm"
          title="Inventory"
          description="Stay informed on the availability and status of inventory, vital metrics encompassing stock levels, products, order fulfillment, and inventory valuation."
        />
      </Grid>
    </Grid>
  );
};

export default ChartsDashboard;

const Card = ({ path, title, description }) => {
  const navigate = useNavigate();
  return (
    <BoxShadow elevation={3}>
      <CardContent>
        <Typography
          sx={{ fontSize: 14, color: "auzColor.main" }}
          gutterBottom
          variant="h6"
        >
          {title}
        </Typography>
        <Typography variant="body2" textAlign="justify">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="medium" onClick={() => navigate(path)}>
          Learn More
        </Button>
      </CardActions>
    </BoxShadow>
  );
};
