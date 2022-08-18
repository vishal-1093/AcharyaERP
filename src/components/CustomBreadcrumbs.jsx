import { Typography, Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb");
}

export default function BasicBreadcrumbs() {
  return (
    <div onClick={handleClick} style={{ marginBottom: 30, zIndex: 10 }}>
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
