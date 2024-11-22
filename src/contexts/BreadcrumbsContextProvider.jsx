import { createContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography, Breadcrumbs, Box } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

export const BreadcrumbsContext = createContext();

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    position: "relative",
    marginBottom: 10,
    width: "fit-content",
    zIndex: theme.zIndex.drawer - 1,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": { textDecoration: "underline" },
  },
}));

function BreadcrumbsContextProvider({ children }) {
  const [crumbs, setCrumbs] = useState([]);

  const classes = useStyles();

  useEffect(
    () =>
      setCrumbs((prev) =>
        prev.filter((obj) => !(obj === null || obj === {} || obj === undefined))
      ),
    []
  );

  return (
    <BreadcrumbsContext.Provider value={setCrumbs}>
      {crumbs.length > 0 && (
        <Box className={classes.breadcrumbsContainer}>
          <Breadcrumbs
            style={{ fontSize: "1.15rem" }}
            separator={<NavigateNextIcon fontSize="small" />}
          >
            {crumbs?.map((crumb, index) => (
              <span key={index}>
                {typeof crumb.link === "function" ? (
                  <Typography
                    onClick={crumb.link}
                    className={classes.link}
                    key={crumb.name}
                    // color="inherit"
                    fontSize="inherit"
                  >
                    {crumb.name}
                  </Typography>
                ) : crumb.link ? (
                  <Link to={crumb.link} key={crumb.name} className={classes.link}>
                    {crumb.name}
                  </Link>
                ) : (
                  <Typography
                    key={crumb.name}
                    color="inherit"
                    fontSize="inherit"
                  >
                    {crumb.name}
                  </Typography>
                )}
              </span>
            ))}
          </Breadcrumbs>
        </Box>
      )}
      {children}
    </BreadcrumbsContext.Provider>
  );
}

export default BreadcrumbsContextProvider;
