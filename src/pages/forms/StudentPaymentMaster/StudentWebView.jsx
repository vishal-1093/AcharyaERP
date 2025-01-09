import React from "react";

const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

const WebView = () => {
  const encodeAuid = btoa(userName);

  return (
    <div
      style={{
        overflow: "hidden",
        borderRadius: "15px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <iframe
        src={`https://acharyainstitutes.in/index.php?r=admission/acerp-std-due-report/payment1&auid_str=${encodeAuid}`}
        width="100%"
        height="1000px"
        style={{
          border: "none",
          borderRadius: "15px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out",
        }}
        title="Student Payment"
      />
    </div>
  );
};

export default WebView;
