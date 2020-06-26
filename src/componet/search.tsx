import React, { useEffect, useState } from "react";
import "../styles/search.css";
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
import { Link, Redirect } from "react-router-dom";
import firebase from "../helper/firebase";
import "firebase/auth";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const Add_Search = gql`
  mutation($userId: String, $search: String) {
    addSearch(userId: $userId, search: $search) {
      search
    }
  }
`;

const db = firebase.firestore();
const { Title } = Typography;
const { Option } = Select;
const Search: React.FC = (props: any) => {
  const [addSearch, { data }] = useMutation(Add_Search);

  const [search, setSearch] = useState(props.match.params.text);
  const [loading, setLoading] = useState<boolean>(true);
  const [options, setOptions] = useState([]);
  const [radius, setRadius] = useState(1000);
  const [singIn, setSignIn] = useState(true);
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
    let user = firebase.auth().currentUser;
    if (user) {
      console.log(user, "1234");
      setLoading(true);
      setSearchResult([]);
      fetch(
        `https://api.tomtom.com/search/2/search/${search}.json?language=en-GB&key=MFpeJjzwQT5GfDDh2FLky3hwjiHGrQwa&radius=${radius}&lat=${lat}&lon=${lng}&limit=50`
      )
        .then((data) => data.json())
        .then((response) => {
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
    } else {
      setSignIn(false);
    }
  }, [search, radius]);

  useEffect(() => {
    db.collection("Search")
      .add({
        search: search,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }, [search]);

  const onChange = (data: string) => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (singIn) {
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
                src={require("../pic/plus.svg")}
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
                //@ts-ignore
                let uid = firebase.auth().currentUser.uid;
                setSearch(searchInput);
                addSearch({
                  variables: {
                    userId: uid,
                    search: search,
                  },
                });
                console.log(data, "ididim");
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
          <Link
            to={{
              pathname: "/history",
              //@ts-ignore
              state: { uid: firebase.auth().currentUser.uid },
            }}
          >
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
  } else {
    return <Redirect to="/" />;
  }
};

export default Search;
