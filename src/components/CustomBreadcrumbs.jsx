import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography, Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    position: "relative",
    marginBottom: 30,
    zIndex: theme.zIndex.drawer - 1,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",

    "&:hover": { textDecoration: "underline" },
  },
}));

function CustomBreadcrumbs({ pathname }) {
  const [crumbs, setCrumbs] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    setCrumbs(pathname.split("/").filter((str) => str !== ""));
  }, [pathname]);

  return (
    <div className={classes.breadcrumbsContainer}>
      <Breadcrumbs
        style={{ fontSize: "1.15rem", textTransform: "capitalize" }}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {crumbs.map((crumb, i) => {
          if (i === 0 && i !== crumbs.length - 1)
            return (
              <Link key={i} to={`/${crumb}`} className={classes.link}>
                {crumb}
              </Link>
            );
          else
            return (
              <Typography key={i} color="inherit" fontSize="inherit">
                {crumb}
              </Typography>
            );
        })}
      </Breadcrumbs>
    </div>
  );
}

export default CustomBreadcrumbs;
