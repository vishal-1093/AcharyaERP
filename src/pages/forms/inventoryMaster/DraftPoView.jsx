import { useState, useEffect, lazy } from "react";
import { Box } from "@mui/material";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import numberToWords from "number-to-words";

import moment from "moment";

function DraftPoView({ temporaryPurchaseOrderId }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [costValue, setCostValue] = useState();
  const [gstValue, setGstValue] = useState();
  const [discValue, setDiscValue] = useState();
  const [schoolName, setSchoolName] = useState("");

  const { id } = useParams();

  useEffect(() => {
    getData();
    getSchoolData();
  }, []);

  useEffect(() => {
    const val = data[0]?.temporaryPurchaseItems?.reduce(
      (a, b) => a + b.totalAmount,
      0
    );
    setTotal(val);

    const costTotal = data[0]?.temporaryPurchaseItems?.reduce(
      (a, b) => Number(a) + Number(b.costTotal),
      0
    );

    setCostValue(costTotal);

    const gstTotal = data[0]?.temporaryPurchaseItems?.reduce(
      (a, b) => Number(a) + Number(b.gstTotal),
      0
    );

    setGstValue(gstTotal);

    const discTotal = data[0]?.temporaryPurchaseItems?.reduce(
      (a, b) => Number(a) + Number(b.discountTotal),
      0
    );

    setDiscValue(discTotal);
  }, [data]);

  const getData = async () => {
    await axios
      .get(
        `/api/purchase/getDraftPurchaseOrderById?id=${
          id ?? temporaryPurchaseOrderId
        }`
      )
      .then((res) => {
        const temp = [];

        temp.push(res.data.data);
        setData(temp);
      })
      .catch((error) => console.error(error));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        res.data.data.filter((obj) => {
          if (obj.school_id === 1) {
            setSchoolName(obj.school_name);
          }
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box>
      <div style={{ border: "1px solid black", width: "100%" }}>
        <div style={{ textAlign: "center", borderBottom: "1px solid black" }}>
          <h4>PURCHASE ORDER - GRN</h4>{" "}
        </div>
        <div style={{ flexDirection: "row", display: "flex" }}>
          <div
            style={{
              width: "50%",
              borderRight: "1px solid black",
              padding: "12px",
            }}
          >
            <p style={{ fontWeight: "bold" }}>Invoice To:</p>
            <p>{schoolName}</p>
            {/* <p>Khojalar neighborhood citizen council,</p>
            <p>Bukhara street karakol district,</p>
            <p>Uzbekistan.</p> */}
          </div>
          <div style={{ width: "50%" }}>
            <div style={{ flexDirection: "row", display: "flex" }}>
              <div
                style={{
                  width: "50%",
                  borderRight: "1px solid black",
                  borderBottom: "1px solid black",
                  padding: "25px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Purchase No. :</p>
                <p>Draft</p>
              </div>
              <div
                style={{
                  width: "50%",
                  borderBottom: "1px solid black",
                  padding: "25px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Date :</p>
                <p>{moment(data[0]?.quotationDate).format("DD-MM-YYYY")}</p>
              </div>
            </div>
            <div style={{ flexDirection: "row", display: "flex" }}>
              <div
                style={{
                  width: "50%",
                  borderRight: "1px solid black",
                  padding: "25px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Quotation No. : </p>
                <p> {data[0]?.quotationNo}</p>
              </div>
              <div
                style={{
                  width: "50%",

                  padding: "25px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Destination : </p>
                <p>{data[0]?.destination}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ flexDirection: "row", display: "flex" }}>
        <div
          style={{
            width: "50%",
            borderRight: "1px solid black",
            borderBottom: "1px solid black",
            borderLeft: "1px solid black",
            padding: "5px",
          }}
        >
          <p style={{ fontWeight: "bold" }}>Supplier :</p>
          <p>{data[0]?.vendor}</p>
          <p>Address : {data[0]?.vendor}</p>
          <p>Country : {data[0]?.countryName}</p>
          <p>State : {data[0]?.stateName}</p>
          <p>City : {data[0]?.cityName} </p>
          <p>{data[0]?.vendorAddress}</p>
          <p>Ph No. : {data[0]?.vendorContactNo}</p>
        </div>
        <div
          style={{
            width: "50%",
            borderRight: "1px solid black",
            borderBottom: "1px solid black",
          }}
        >
          <div style={{ flexDirection: "row", display: "flex" }}>
            <div
              style={{
                width: "50%",
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
                padding: "25px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>Other References : </p>
              <p>{data[0]?.otherReference}</p>
            </div>
            <div
              style={{
                width: "50%",
                borderBottom: "1px solid black",
                padding: "25px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>Request Type : </p>
              <p> {data[0]?.requestType}</p>
            </div>
          </div>
          <div style={{ padding: "20px" }}>
            <p style={{ fontWeight: "bold" }}>Terms and Conditions :</p>
            <div
              dangerouslySetInnerHTML={{
                __html: `<p> ${data[0]?.termsAndConditions.replaceAll(
                  "\n",
                  "<br>"
                )}</p>`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div
        style={{
          borderCollapse: "collapse",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tr>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              Sl No.
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "30%",
              }}
            >
              Goods Description / Service
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "8%",
              }}
            >
              Quantity
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              Rate
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              Cost
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              UOM
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "7%",
              }}
            >
              GST %
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "7%",
              }}
            >
              DISC %
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              Amount
            </th>
          </tr>

          {data[0]?.temporaryPurchaseItems?.map((obj, i) => {
            return (
              <>
                <tr key={i}>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "10%",
                    }}
                  >
                    {i + 1}
                  </td>
                  <td
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2px",
                      border: "1px solid black",
                      width: "30%",
                    }}
                  >
                    {obj?.itemName}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "8%",
                    }}
                  >
                    {obj?.quantity}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "10%",
                    }}
                  >
                    {obj?.rate}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "10%",
                    }}
                  >
                    {obj?.rate * obj?.quantity}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "10%",
                    }}
                  >
                    {obj?.measureName}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "7%",
                    }}
                  >
                    {obj?.gst}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "7%",
                    }}
                  >
                    {obj?.discount}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "10%",
                    }}
                  >
                    {obj?.totalAmount}
                  </td>
                </tr>
              </>
            );
          })}

          <tr>
            <td
              style={{
                textAlign: "left",
                border: "1px solid black",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
                fontWeight: "bold",
              }}
              colspan="7"
            >
              Total
            </td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
              }}
            >
              {costValue}
            </td>
          </tr>
          <tr>
            <td
              style={{
                textAlign: "left",
                border: "1px solid black",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
                fontWeight: "bold",
              }}
              colspan="7"
            >
              Gst Total
            </td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
              }}
            >
              {gstValue}
            </td>
          </tr>

          <tr>
            <td
              style={{
                textAlign: "left",
                border: "1px solid black",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
                fontWeight: "bold",
              }}
              colspan="7"
            >
              Disc Total
            </td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
              }}
            >
              {discValue}
            </td>
          </tr>

          <tr>
            <td
              style={{
                textAlign: "left",
                border: "1px solid black",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
                fontWeight: "bold",
              }}
              colspan="7"
            >
              Grand Total
            </td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
              }}
            >
              {total}
            </td>
          </tr>
        </table>

        <div
          style={{
            width: "100%",
            borderRight: "1px solid black",
            borderBottom: "1px solid black",
            borderLeft: "1px solid black",
            padding: "5px",
          }}
        >
          <div style={{ flexDirection: "row", display: "flex" }}>
            <div
              style={{
                width: "50%",
              }}
            >
              <p style={{ fontWeight: "bold" }}>Amount in Words</p>
              <p>
                {total !== undefined && total !== null
                  ? numberToWords.toWords(Number(total))
                  : ""}
              </p>
              <br></br>
              <p style={{ fontWeight: "bold" }}>Bank Details :</p>
              <p>Account Holder Name : {data[0]?.accountHolderName} </p>
              <p>Bank Name : {data[0]?.bankName}</p>
              <p>Bank branch : {data[0]?.bankBranch}</p>
              <p>Account No. : {data[0]?.accountNo}</p>
              <p>Bank IFSC No. : {data[0]?.bankIfscNo}</p>
              <br />
            </div>
            <div style={{ width: "50%" }}>
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

                <p style={{ fontWeight: "bold" }}>
                  For {schoolName.toUpperCase() ?? ""}{" "}
                </p>
                <br />
                <br />
                <br />

                <p style={{ fontWeight: "bold" }}>Authorized Signatory </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default DraftPoView;
