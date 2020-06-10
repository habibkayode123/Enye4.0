import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";

import firebase from "./firebase";
import { Typography, Select, List, Spin, Space } from "antd";
import "./history.css";
const db = firebase.firestore();
const { Title } = Typography;
const { Option } = Select;

const History: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let docRef = db.collection("Search");
  useEffect(() => {
    docRef
      .get()
      .then(function (querySnapshot) {
        let result: any = [];
        querySnapshot.forEach(function (doc) {
          //@ts-ignore
          result.push(doc.data().search);
        });
        setLoading(false);
        setData(result);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, []);
  return (
    <div className="history-container">
      <Link to="/">
        <p
          style={{
            fontSize: 25,
            fontWeight: "bolder",
            color: "rgb(102, 0, 153)",
            textDecoration: "underline",
          }}
        >
          <img
            style={{
              width: 70,
            }}
            src={require("./pic/plus.svg")}
            alt=""
          />
          NearBy
        </p>
      </Link>

      <p
        style={{
          position: "relative",
          top: -70,
          left: "40vw",
          fontSize: 50,
          fontWeight: "bolder",
          display: "inline-grid",
          color: "rgb(102, 0, 153)",
          textDecoration: "underline",
        }}
      >
        Past Search
      </p>
      {loading ? (
        <Space
          style={{ marginLeft: "auto", marginRight: "auto" }}
          size="middle"
        >
          <Spin size="small" />
          <Spin tip="Loading..." />
          <Spin size="large" />
        </Space>
      ) : (
        <List
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/search/${item}`}>
                <p
                  style={{
                    fontSize: 25,
                    fontWeight: "bolder",
                    color: "rgb(102, 0, 153)",
                    alignSelf: "center",
                    marginTop: 15,
                    textDecoration: "underline",
                  }}
                >
                  {item}
                </p>
              </Link>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default History;
