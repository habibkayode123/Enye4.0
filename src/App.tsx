import React, { useRef, SyntheticEvent, useEffect, useState } from "react";
import {
  AutoComplete,
  Input,
  Card,
  List,
  Avatar,
  Typography,
  Select,
  Space,
  Spin,
  Alert,
} from "antd";
import "./App.css";
import "antd/dist/antd.css";
import { promises } from "dns";
import { isArray } from "util";

const { Title } = Typography;
const { Option } = Select;
const App: React.FC = () => {
  let x: string;
  let y: string;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [radius, setRadius] = useState(1000);
  const [lat, setLat] = useState(2);
  const [lng, setLng] = useState(2);
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
    setSearch(data);
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
          fetch(
            `https://api.tomtom.com/search/2/categorySearch/hospital,medical.JSON?key=MFpeJjzwQT5GfDDh2FLky3hwjiHGrQwa&radius=${radius}&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          )
            .then((data) => data.json())
            .then((response) => {
              console.log(response);
              let center: {
                name: string;
                dist: string;
                phone: string;
                url: string;
                address: string;
              }[] = [];
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
              console.log(hospital);
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
  const onSearch = () => {
    fetch(
      `https://api.tomtom.com/search/2/search/${search}.json?language=en-GB&key=MFpeJjzwQT5GfDDh2FLky3hwjiHGrQwa&radius=${radius}&lat=${lat}&lon=${lng}`
    )
      .then((data) => data.json())
      .then((response) => {
        let results: any = [];

        response.results.forEach((result: any) => {
          let name = result.poi.name;
          let address = result.address.freeformAddress;

          let obj: any = { value: `${name} at ${address}` };
          results.push(obj);
        });
        setOptions(!results ? [] : results);
        console.log(results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      <p
        className="name"
        style={{
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: 35,
          fontSize: 50,
          fontWeight: "bolder",
        }}
      >
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
          placeholder="input here"
          enterButton
          style={{
            width: 416,
            height: 56,
            color: "#333",
            padding: "0 10",
            marginLeft: "auto",
            marginRight: "auto",

            fontSize: 16,
          }}
        />
      </AutoComplete>
      <Select
        placeholder="Select Search Radius"
        style={{ width: 200, marginLeft: "auto", marginBottom: "20" }}
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
                  width: "90%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxWidth: 800,
                  fontSize: 20,
                  lineHeight: 1.3,
                }}
              >
                <p>
                  Distance: <span className="bold">{parseInt(item.dist)}M</span>
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
};

export default App;
