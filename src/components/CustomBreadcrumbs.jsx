import { Typography, Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    position: "relative",
    marginBottom: 30,
    zIndex: theme.zIndex.drawer - 1,
  },
}));

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb");
}

export default function BasicBreadcrumbs() {
  const classes = useStyles();

  return (
    <div onClick={handleClick} className={classes.breadcrumbsContainer}>
      <Breadcrumbs
        style={{ fontSize: "1.15rem" }}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link underline="hover" color="primary" href="/">
          Index
        </Link>
        <Link underline="hover" color="primary" href="/">
          Core
        </Link>
        <Typography color="inherit" fontSize="inherit">
          Breadcrumbs
        </Typography>
      </Breadcrumbs>
    </div>
  );
}
