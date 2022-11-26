import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import AirportShuttleRoundedIcon from "@mui/icons-material/AirportShuttleRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BlurOnIcon from "@mui/icons-material/BlurOn";

const iconsList = [
  { name: "Home", icon: <HomeIcon sx={{ fontSize: 23 }} /> },
  { name: "Favorite", icon: <FavoriteIcon sx={{ fontSize: 23 }} /> },
  { name: "Star", icon: <StarRoundedIcon sx={{ fontSize: 23 }} /> },
  {
    name: "Time",
    icon: <AccessTimeFilledRoundedIcon sx={{ fontSize: 23 }} />,
  },
  {
    name: "User",
    icon: <AccountCircleRoundedIcon sx={{ fontSize: 23 }} />,
  },
  { name: "AC", icon: <AcUnitRoundedIcon sx={{ fontSize: 23 }} /> },
  {
    name: "Access",
    icon: <AccessibilityNewRoundedIcon sx={{ fontSize: 23 }} />,
  },
  {
    name: "Truck",
    icon: <AirportShuttleRoundedIcon sx={{ fontSize: 23 }} />,
  },
  {
    name: "Stars",
    icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 23 }} />,
  },
  {
    name: "Rupee",
    icon: <CurrencyRupeeIcon sx={{ fontSize: 23 }} />,
  },
  {
    name: "Default",
    icon: <BlurOnIcon sx={{ fontSize: 23 }} />,
  },
];

export default iconsList;
