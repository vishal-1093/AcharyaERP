import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import FeeTemplateView from "../../../components/FeeTemplateView";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";

function ViewFeetemplateSubAmount() {
  const [remarks, setRemarks] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    if (
      pathname.toLowerCase().includes("/viewfeetemplatesubamount/" + id + "/1")
    ) {
      setCrumbs([
        {
          name: "Feetemplate Master ",
          link: "FeetemplateMaster",
        },
        { name: "View Template" },
      ]);
    } else {
      setCrumbs([
        {
          name: "Feetemplate Approval Index",
          link: "FeetemplateApprovalIndex",
        },
        { name: "View Template" },
      ]);
    }
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${id}`)
      .then((res) => {
        setRemarks(res.data.data[0].remarks);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FeeTemplateView type={2} feeTemplateId={id} />
      <Grid container justifyContent="flext-start" alignItems="center">
        <Grid item xs={12} md={12} mt={2}>
          <Typography>Note:{remarks}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewFeetemplateSubAmount;
