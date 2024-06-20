import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import iconsList from "../../utils/MenuIcons";

const getIcon = (iName) => {
  const object = iconsList.filter((obj) => obj.name === iName)[0];
  return object
    ? object.icon
    : iconsList.filter((obj) => obj.name === "Default")[0].icon;
};

const CardNameLists = [
  { name: "STAFF", icon: "PersonOutlineIcon", path: "StaffIdCard" },
  { name: "STUDENT", icon: "PersonOutlineIcon", path: "StudentIdCard" },
];

const IDCardPrint = () => {
  const navigate = useNavigate();

  return (
    <Grid container alignItems="flex-start" spacing={3} mt={1}>
      {CardNameLists?.map((obj, i) => {
        return (
          <Grid item sm={12} md={4} key={i}>
            <Card sx={{ backgroundColor: "#F0F0F0", cursor: "pointer" }}>
              <CardContent onClick={() => navigate(`/${obj.path}`)}>
                <Grid container justifyContent="flex-start" rowSpacing={2}>
                  <Grid item xs={12} align="center">
                    <IconButton color="primary">{getIcon(obj.icon)}</IconButton>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "auzColor.main",
                        textAlign: "center",
                      }}
                      gutterBottom
                      variant="subtitle2"
                    >
                      <p>{obj.name}</p>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default IDCardPrint;
