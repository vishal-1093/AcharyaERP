import { useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const voucherList = [
  { label: "Journal Voucher", link: "/journal-voucher" },
  { label: "Payment Voucher", link: "" },
  { label: "Fund Transfer", link: "" },
  { label: "Contra Voucher", link: "" },
  { label: "Salary Voucher", link: "" },
];

function AccountVoucherMaster() {
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs([]);

  useEffect(() => {
    setCrumbs([]);
  }, []);

  return (
    <Box
      sx={{
        margin: { xs: "20px", md: "150px 40px 40px 40px", lg: "150px" },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        flex: 1,
      }}
    >
      {voucherList.map((obj, i) => (
        <Card
          elevation={4}
          key={i}
          onClick={() => navigate(obj.link)}
          sx={{
            flex: 1,
            backgroundColor: "primary.main",
            color: "headerWhite.main",
            cursor: "pointer",
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
              {obj.label}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default AccountVoucherMaster;
