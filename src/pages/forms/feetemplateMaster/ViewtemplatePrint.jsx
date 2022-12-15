import { useState, useEffect } from "react";
import { Page, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";

function ViewtemplatePrint() {
  const [feetemplateSubamountData, setFeetemplateSubamountData] = useState([]);
  const [year, setYear] = useState([]);
  const [feetemplateDetails, setFeetemplateDetails] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    getFeetemplateDetail();
  }, []);

  const getFeetemplateDetail = async () => {
    await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${id}`)
      .then((res) => {
        const test = res.data.data[0];

        setFeetemplateDetails(res.data.data[0]);

        axios
          .get(
            `/api/academic/FetchAcademicProgram/${res.data.data[0].ac_year_id}/${res.data.data[0].program_id}/${res.data.data[0].school_id}`
          )
          .then((res) => {
            const years = [];

            if (test.program_type_name.toLowerCase() === "yearly") {
              setYear(res.data.data[0].number_of_years);
              for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
                years.push({ key: i, value: "Year" + i });
              }
            } else if (test.program_type_name.toLowerCase() === "semester") {
              setYear(res.data.data[0].number_of_semester);
              for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
                years.push({ key: i, value: "Sem" + i });
              }
            }
            setNoOfYears(years);
          });
      })
      .catch((err) => console.error(err));

    //Fee template Subamount data

    await axios
      .get(`/api/finance/FetchFeeTemplateSubAmountDetail/${id}`)
      .then((res) => {
        setFeetemplateSubamountData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const html = `
  <style>
  table{
    width : 50%;
    }
    table {
    border:1px solid black;
    font-size: 10px;
    }
    td {
    border:1px solid black;
    padding:2px
    }
    th {
    border:1px solid black;
    padding: 3px;
    text-align:center;
   }
   
   
  </style>
  <body>
    <div>
  
  
  
  <table>
    <tr>
      <th >Particulars</th>
      <th>Board</th>
      <th>Alias</th>
    ${noOfYears
      .map((obj) => {
        return `<th>${obj.value}</th>`;
      })
      .join("")}
      <th>Total</th>
    </tr>
    ${feetemplateSubamountData
      .map((obj, i) => {
        return `<tr>
        <td style='text-align:center' >${obj.voucher_head}</td>
        <td style='text-align:center' >${
          obj.board_unique_name ? obj.board_unique_name : ""
        }</td>
        <td style='text-align:center' >${obj.alias_name}</td>
        ${noOfYears
          .map((val, i) => {
            let key = i + 1;
            return `<td style='text-align:center'>${
              obj["year" + key + "_amt"]
            }</td>`;
          })
          .join("")}
          <td style='text-align:center'>${obj.total_amt}</td>
        </tr>`;
      })
      .join("")}
      <tr>
      <th colspan='3'>Total</th>
      ${noOfYears
        .map((obj, i) => {
          let key = i + 1;
          return `<th>${
            feetemplateSubamountData.length > 0
              ? feetemplateSubamountData[0]["fee_year" + key + "_amt"]
              : ""
          }</th>`;
        })
        .join("")}
      </tr>
   
  </table>
  
 
  </div>
  </body>`;

  const styles = StyleSheet.create({
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  });

  const MyDocument = () => (
    <Document title="Template">
      <Page size="A4">
        <Html>{html}</Html>
      </Page>
    </Document>
  );

  return (
    <PDFViewer style={styles.viewer}>
      <MyDocument />
    </PDFViewer>
  );
}

export default ViewtemplatePrint;
