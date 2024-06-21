import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { CircularProgress, Grid } from "@mui/material";

function Pojspdf() {
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/purchase/getPurchaseOrderById?id=${1}`)
      .then((res) => {
        const data = res.data.data?.purchaseOrder?.purchaseItems;
        const tableRows = data.map((obj, i) => {
          const rows = [];
          const { itemName, quantity, uom, rate, gst, discount, totalAmount } =
            obj;

          rows.push(
            i + 1,
            itemName,
            quantity,
            uom,
            rate * quantity,
            rate,
            gst,
            discount,
            totalAmount
          );
          return rows;
        });

        setTableRows(tableRows);
      })
      .catch((error) => console.error(error));
  };

  console.log(tableRows);
  return <></>;
}

export default Pojspdf;
