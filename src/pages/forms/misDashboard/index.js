import React, {useEffect, useState } from "react";
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
import axios from "../../../services/Api";

const BoxShadow = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  ...theme.typography.body2,
  backgroundColor: "#f3f6f9",
}));

const MISDashboard = () => {
    const [loading, setLoading] = useState(false)
    const [currAcYear, setCurrAcYear] = useState()
  const setCrumbs = useBreadcrumbs();
    useEffect(() => {
      setCrumbs([]);
      getAcademicYearData()
    }, []);

    const getAcademicYearData = async()=>{
      //api/academic/academicYearGT
        await axios.get(`api/academic/academicYearGT`)
                  .then((response) => {
                      const { data } = response?.data
                      const currAcYearId = data[0]?.ac_year_id
                      setCurrAcYear(currAcYearId || "")
                      setLoading(false)
                  })
                  .catch((err) =>{
                      console.error(err)
                      setLoading(false)
          });
    }

  return (
   <Grid container alignItems="flex-start" spacing={3}>
  <Grid item sm={12} md={6} lg={4}>
    <Card
      path="/mis-dashboard/joining-relieve-report"
      title="HRM Reports"
      description="Gain insights into employee lifecycle, including joining, relieving, and workforce trends."
    />
  </Grid>
  <Grid item sm={12} md={6} lg={4}>
    <Card
      path="/mis-dashboard/finance-report"
      title="Finance & Bank Reports"
      description="Access comprehensive financial and banking reports, showcasing transactions and financial health."
    />
  </Grid>
  <Grid item sm={12} md={6} lg={4}>
    <Card
      path="/mis-dashboard/admission-report"
      title="Admissions Reports"
      description="Explore academic year-wise and date-wise admission analytics, trends, and categories."
      currAcYear={currAcYear}
    />
  </Grid>
  <Grid item sm={12} md={6} lg={4}>
    <Card
      path="/mis-dashboard/academic-overview"
      title="Academic Overview"
      description="Get a complete view of academic performance, course progress, and student engagement."
    />
  </Grid>
</Grid>
  );
};

export default MISDashboard;

const Card = ({ path, title, description, currAcYear="" }) => {
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
        <Button size="medium" onClick={() => path = "/mis-dashboard/admission-report" ? navigate(path,{state:currAcYear}) : navigate(path)}>
          Learn More
        </Button>
      </CardActions>
    </BoxShadow>
  );
};
