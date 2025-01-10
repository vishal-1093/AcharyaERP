import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import moment from "moment";

function DraftPoView({ id }) {
  const [data, setData] = useState([]);

  const { maintainenceId } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let viewId = maintainenceId || id
    await axios
      .get(`/api/getTransportMaintenance/${viewId}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div
      container
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <div
        style={{
          border: "2px solid black",
          width: "70%",
        }}
      >
        <div style={{ textAlign: "center", borderBottom: "1px solid black" }}>
          <h4>VEHICLE INDENT</h4>
        </div>
        <div style={{ flexDirection: "row", display: "flex" }}>
          <div style={{ border: "1px solid black", width: "40%" }}>
            <div style={{ textAlign: "center" }}>
              <h5>Institute</h5>
              <h5>{data?.type_of_vehicle}</h5>
            </div>
          </div>
          <div style={{ border: "1px solid black", width: "20%" }}>
            <div style={{ textAlign: "center" }}>
              <h5>Dept</h5>
              <h5>ERP</h5>
            </div>
          </div>
          <div style={{ border: "1px solid black", width: "40%" }}>
            <div style={{ textAlign: "center" }}>
              <h5>Applied Date</h5>
              <h5>{moment(data?.created_date).format("DD-MM-YYYY hh:mm a")}</h5>
            </div>
          </div>
        </div>

        {/* Data */}

        <div style={{ flexDirection: "row", display: "flex" }}>
          <div
            style={{ border: "1px solid black", width: "20%", height: "10vw" }}
          >
            <div style={{ textAlign: "center" }}>
              <h5>Type of vehicle</h5>
              <br />
              <br />
              <p style={{ fontWeight: "bold" }}>{data?.type_of_vehicle}</p>
            </div>
          </div>
          <div style={{ border: "1px solid black", width: "20%" }}>
            <div style={{ textAlign: "center" }}>
              <h5>Pick up date and time</h5>
              <br />
              <p style={{ fontWeight: "bold" }}>
                {moment(data?.requesting_from_datetime).format("DD-MM-YYYY")}
              </p>
              <br />
              <p style={{ fontWeight: "bold" }}>
                {moment(data?.requesting_from_datetime).format("hh:mm a")}
              </p>
            </div>
          </div>
          <div style={{ border: "1px solid black", width: "20%" }}>
            <div style={{ textAlign: "center" }}>
              <h5>Reporting place</h5>
              <br />
              <br />
              <p style={{ fontWeight: "bold" }}>{data?.reporting_place}</p>
            </div>
          </div>
          <div style={{ border: "1px solid black", width: "20%" }}>
            <div style={{ textAlign: "center" }}>
              <h5>Reporting Person </h5>
              <h5> (With contact number)</h5>
              <br />
              <p style={{ fontWeight: "bold" }}>{data?.report_to_person}</p>
              <br />
              <p style={{ fontWeight: "bold" }}>
                {data?.report_to_person_number}
              </p>
            </div>
          </div>
          <div style={{ border: "1px solid black", width: "20%" }}>
            <div style={{ textAlign: "center" }}>
              <h5>Closing date and time</h5>
              <br />
              <p style={{ fontWeight: "bold" }}>
                {moment(data?.requesting_to_datetime).format("DD-MM-YYYY")}{" "}
                {moment(data?.requesting_to_datetime).format("hh:mm a")}
              </p>
              <br />
              <p style={{ fontWeight: "bold" }}>Duration</p>
              <p style={{ fontWeight: "bold" }}>{data?.duration}</p>
            </div>
          </div>
        </div>

        <div style={{ flexDirection: "row", display: "flex" }}>
          <div style={{ border: "1px solid black", width: "40%" }}>
            <div style={{ justifyContent: "flex-start", padding: 10 }}>
              <h5>Place of visit : {data?.reporting_place}</h5>
            </div>
          </div>

          <div style={{ border: "1px solid black", width: "60%" }}>
            <div style={{ justifyContent: "flex-start", padding: 10 }}>
              <h5>Purpose : {data?.reporting_place}</h5>
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid black" }}>
          <div style={{ justifyContent: "flex-start", padding: 5 }}>
            <h4>***Note</h4>
          </div>
          <div>
            <ul style={{ margin: 0, paddingInlineStart: "20px" }}>
              <li style={{ color: "red" }}>
                <h4 style={{ color: "red" }}> TRANSPORT CANCELLATION </h4>
              </li>
            </ul>
            <h4 style={{ color: "red", margin: 0, paddingInlineStart: "20px" }}>
              Please request Transport Dept (1025) to cancel the trip request
            </h4>
            <ul style={{ margin: 0, paddingInlineStart: "20px" }}>
              <li style={{ color: "red" }}>
                <h4 style={{ color: "red" }}> TRIP RESCHEDULE/POSTPONE</h4>
              </li>
            </ul>
            <h4 style={{ color: "red", margin: 0, paddingInlineStart: "20px" }}>
              Please request Transport Dept (1025) to cancel the trip request
              and place a "FRESH REQUEST"
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DraftPoView;
