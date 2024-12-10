import React, { useEffect, useRef } from "react";
import D3Funnel from "d3-funnel";

const FunnelChart = ({ data, options }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef.current && data) {
      const chart = new D3Funnel(chartRef.current);
      chart.draw(data, options);
    }
  }, [data, options]);

  return (
    <div
      ref={chartRef}
    />
  );
};

export default FunnelChart;
