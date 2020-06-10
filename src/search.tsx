import React, { useEffect, useState } from "react";
import "./Search.css";
import {
  AutoComplete,
  Input,
  Select,
  Typography,
  Space,
  Spin,
  List,
  Card,
} from "antd";
import { Link } from "react-router-dom";
import firebase from "./firebase";

const db = firebase.firestore();

const { Title } = Typography;
const { Option } = Select;
const Search: React.FC = (props: any) => {
  const [search, setSearch] = useState(props.match.params.text);
  const [loading, setLoading] = useState<boolean>(true);
  const [options, setOptions] = useState([]);
  const [radius, setRadius] = useState(1000);

  const [lat, setLat] = useState(Number(localStorage.getItem("latitude")));

  const [lng, setLng] = useState(Number(localStorage.getItem("longtitude")));
  const [redirect, setRedirect] = useState(false);
  const [searchInput, setSearchInput] = useState<string>(
    props.match.params.text
  );

  const [searchResult, setSearchResult] = useState<
    {
      name: string;
      dist: string;
      phone: string;
      url: string;
      address: string;
      type: string;
    }[]
  >([]);

  const handleChange = (value: number) => {
    setRadius(value);
  };

  useEffect(() => {
    setLoading(true);
    setSearchResult([]);
    console.log(props.location);
    console.log(localStorage.getItem("latitude"), "lat");
    fetch(
      `https://api.tomtom.com/search/2/search/${search}.json?language=en-GB&key=MFpeJjzwQT5GfDDh2FLky3hwjiHGrQwa&radius=${radius}&lat=${lat}&lon=${lng}&limit=50`
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
          type: string;
        }[] = [];
        if (response.results.length !== 0) {
          response.results.forEach((hosp: any) => {
            let name = hosp.poi.name;
            let dist = hosp.dist;
            let address = hosp.address.freeformAddress;
            let url = hosp.poi.url;
            let phone = hosp.poi.phone;
            let type = hosp.poi.classifications[0].code;
            let obj: {
              name: string;
              dist: string;
              phone: string;
              url: string;
              address: string;
              type: string;
            } = { name, dist, address, url, phone, type };
            center.push(obj);
          });

          setSearchResult(center);
        }
        setLoading(false);
      });
  }, [search, radius]);

  useEffect(() => {
    const userRef = db
      .collection("Search")
      .add({
        search: search,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }, [search]);

  const onChange = (data: string) => {
    console.log(data, "change");
    setSearchInput(data);
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
  return (
    <div className="search-container">
      <div className="upperbar">
        <Link to="/">
          <p
            style={{
              fontSize: 50,
              fontWeight: "bolder",
              color: "rgb(102, 0, 153)",
            }}
          >
            <img
              style={{
                width: 100,
              }}
              src={require("./pic/plus.svg")}
              alt=""
            />
            NearBy
          </p>
        </Link>
        <AutoComplete
          autoFocus={true}
          value={searchInput}
          options={options}
          onChange={onChange}
          style={{
            width: 416,
            height: 56,
            color: "#333",
            padding: "0 10",
            fontSize: 16,
            display: "grid",
            alignSelf: "center",
            marginTop: 15,
          }}
        >
          <Input.Search
            size="large"
            onSearch={(e) => {
              setSearch(searchInput);
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
        <Select
          placeholder="Select Search Radius"
          style={{
            width: 200,
            alignSelf: "center",
            marginTop: 12,
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
          dataSource={searchResult}
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
                  borderLeft: "3px solid #609",
                  borderRadius: 30,
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
                <p>
                  Type: <span className="bold">{item.type}</span>
                </p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Search;
