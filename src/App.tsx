import React, { useEffect, useState } from "react";
import {
  AutoComplete,
  Input,
  Card,
  List,
  Typography,
  Select,
  Space,
  Spin,
  Alert,
} from "antd";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import "./App.css";
import "antd/dist/antd.css";
import firebase from "./firebase";

const db = firebase.firestore();
const { Title } = Typography;
const { Option } = Select;
const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [radius, setRadius] = useState(1000);
  const [lat, setLat] = useState(2);
  const [lng, setLng] = useState(2);
  const [redirect, setRedirect] = useState(false);

  const [hospital, setHospital] = useState<
    {
      name: string;
      dist: string;
      phone: string;
      url: string;
      address: string;
    }[]
  >([]);
  const [gps, setGps] = useState(true);

  const onChange = (data: string) => {
    console.log(data, "change");
    setSearch(data);
    fetch(
      `https://api.tomtom.com/search/2/search/${data}.json?language=en-GB&key=MFpeJjzwQT5GfDDh2FLky3hwjiHGrQwa&radius=${radius}&lat=${lat}&lon=${lng}&limit=50`
    )
      .then((data) => data.json())
      .then((response) => {
        let results: any = [];

        if (response.results.length !== 0) {
          response.results.forEach((result: any) => {
            let name = result.poi.name;
            let address = result.address.freeformAddress;

            let obj: any = { value: `${name} at ${address}` };
            results.push(obj);
          });
        }

        setOptions(results);
        console.log("change");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (value: number) => {
    setRadius(value);
  };
  useEffect(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          localStorage.setItem("latitude", position.coords.latitude.toString());
          localStorage.setItem(
            "longtitude",
            position.coords.longitude.toString()
          );
          console.log(
            localStorage.getItem("latitude"),
            "home",
            typeof localStorage.getItem("latitude")
          );
          fetch(
            `https://api.tomtom.com/search/2/categorySearch/hospital,medical.JSON?key=MFpeJjzwQT5GfDDh2FLky3hwjiHGrQwa&radius=${radius}&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          )
            .then((data) => data.json())
            .then((response) => {
              let center: {
                name: string;
                dist: string;
                phone: string;
                url: string;
                address: string;
              }[] = [];
              if (response.results.length !== 0) {
                response.results.forEach((hosp: any) => {
                  let name = hosp.poi.name;
                  let dist = hosp.dist;
                  let address = hosp.address.freeformAddress;
                  let url = hosp.poi.url;
                  let phone = hosp.poi.phone;
                  let obj: {
                    name: string;
                    dist: string;
                    phone: string;
                    url: string;
                    address: string;
                  } = { name, dist, address, url, phone };
                  center.push(obj);
                });
                setLoading(false);
                setHospital(center);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        () => {
          console.log("i was here");
          setGps(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000,
        }
      );
    } else {
      setGps(false);
    }
  }, [radius]);
  const onSearch = () => {};

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: `/search/${search}`,
          state: { lat: lat, lng: lng },
        }}
      />
    );
  } else {
    return (
      <div className="container">
        <div className="empty"></div>
        <p
          className="name"
          style={{
            textAlign: "center",

            marginBottom: 35,
            fontSize: 50,
            fontWeight: "bolder",
            color: "rgb(102, 0, 153)",
          }}
        >
          <img
            style={{ width: 100, marginRight: 7 }}
            src={require("./pic/plus.svg")}
            alt=""
          />
          HOSPITAL NEARBY
        </p>

        {!gps ? (
          <Alert
            message="Error"
            description="We are unable to get your location,on your decive location try to change your devices or reload and grant location permission"
            type="error"
            showIcon
          />
        ) : (
          ""
        )}

        <AutoComplete
          autoFocus={true}
          value={search}
          options={options}
          onSearch={onSearch}
          onChange={onChange}
          style={{
            width: 416,
            height: 56,
            color: "#333",
            padding: "0 10",
            marginLeft: "auto",
            marginRight: "auto",
            fontSize: 16,
          }}
        >
          <Input.Search
            size="large"
            onSearch={(e) => {
              const userRef = db
                .collection("Search")
                .add({
                  search: search,
                })
                .then((response) => console.log(response))
                .catch((error) => console.log(error));
              console.log("i was search", e);

              setRedirect(true);
            }}
            placeholder="input here"
            enterButton
            style={{
              width: 416,
              height: 56,
              color: "#333",
              padding: "0 10",

              fontSize: 16,
            }}
          />
        </AutoComplete>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Select
            placeholder="Select Search Radius"
            style={{
              width: 200,
              marginTop: 15,
              marginBottom: "20px",
            }}
            onChange={handleChange}
          >
            <Option value={1000}>1KM</Option>
            <Option value={3000}>3KM</Option>
            <Option value={5000}>5KM</Option>
            <Option value={7000}>7KM</Option>
            <Option value={10000}>10KM</Option>
            <Option value={15000}>15KM</Option>
            <Option value={20000}>20KM</Option>
            <Option value={30000}>30KM</Option>
            <Option value={60000}>60KM</Option>
          </Select>

          <Link to="/history">
            <p
              style={{
                fontSize: 25,
                fontWeight: "bolder",
                display: "inline-grid",
                color: "rgb(102, 0, 153)",
                alignSelf: "center",
                marginTop: 15,
                textDecoration: "underline",
              }}
            >
              Past Search
            </p>
          </Link>
        </div>

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
            itemLayout="horizontal"
            dataSource={hospital}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  title={
                    <Title ellipsis={true} style={{ color: "#609" }} level={3}>
                      {item.name}
                    </Title>
                  }
                  bordered={false}
                  style={{
                    width: "95%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    maxWidth: 800,
                    fontSize: 20,
                    lineHeight: 1.3,
                  }}
                >
                  <p>
                    Distance:{" "}
                    <span className="bold">{parseInt(item.dist)}M</span>
                  </p>
                  <p>
                    Address: <span className="bold">{item.address}</span>{" "}
                  </p>
                  <p>
                    Phone No: <span className="bold">{item.phone}</span>{" "}
                  </p>
                  <p>
                    Website: <span className="bold">{item.url}</span>
                  </p>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
};

export default App;
