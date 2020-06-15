import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import firebase from "./firebase";
import { List, Spin, Space } from "antd";
import "./history.css";
const db = firebase.firestore();

const GET_History = gql`
  query($id: String) {
    search(id: $id) {
      search
      userId
    }
  }
`;

const History: React.FC = (props) => {
  const { loading: histLoad, error, data: histData } = useQuery<any>(
    GET_History,
    {
      //@ts-ignore
      variables: { id: localStorage.getItem("id") || props.location.state.uid },
    }
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singIn, setSignIn] = useState(true);
  let docRef = db.collection("Search");

  useEffect(() => {
    console.log(histData, histLoad, props, "props is here");
    if (!histLoad) {
      setData(histData.search);
      setLoading(false);
    }

    let user: any = firebase.auth().currentUser;
    if (user) {
    } else {
      setSignIn(false);
    }
  }, []);

  if (singIn) {
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
            renderItem={(item: any) => (
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
                    {item.search}
                  </p>
                </Link>
              </List.Item>
            )}
          />
        )}
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
};

export default History;
