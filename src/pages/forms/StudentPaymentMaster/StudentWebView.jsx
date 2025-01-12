import React from "react";
import { Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // An arrow icon for the FAB

const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function WebView() {
  const encodeAuid = btoa(userName);
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative", // Container is relative for positioning elements inside
        overflow: "hidden",
        borderRadius: "15px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Floating Action Button for Navigation */}
      <Fab
        color="primary"
        aria-label="go back"
        style={{
          position: "absolute", // Position the FAB fixed in the screen
          top: "20px", // 20px from the bottom of the screen
          left: "28px", // 20px from the right of the screen
          zIndex: 1000, // Ensure it floats above iframe
        }}
        onClick={() => navigate("/Dashboard")} // Navigate to another page
      >
        <ArrowBackIcon />
      </Fab>

      {/* Iframe */}
      <iframe
        src={`https://acharyainstitutes.in/index.php?r=admission/acerp-std-due-report/payment1&auid_str=${encodeAuid}`}
        width="100%"
        height="1000px"
        style={{
          border: "none",
          borderRadius: "15px",
          boxShadow: "0px 4px 20px rgba(19, 17, 17, 0.1)",
          transition: "transform 0.3s ease-in-out",
          paddingTop: "30px",
        }}
        title="Student Payment"
      />
    </div>
  );
}

export default WebView;
