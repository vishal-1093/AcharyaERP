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
    zIndex: theme.zIndex.drawer - 1,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",

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
            {crumbs.map((crumb) => {
              if (crumb.link)
                return (
                  <Link
                    key={crumb.name}
                    to={crumb.link}
                    className={classes.link}
                  >
                    {crumb.name}
                  </Link>
                );
              else
                return (
                  <Typography
                    key={crumb.name}
                    color="inherit"
                    fontSize="inherit"
                  >
                    {crumb.name}
                  </Typography>
                );
            })}
          </Breadcrumbs>
        </Box>
      )}
      {children}
    </BreadcrumbsContext.Provider>
  );
}

export default BreadcrumbsContextProvider;
