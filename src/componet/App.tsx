import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Form, Input, Button, Modal } from "antd";
import firebase from "../helper/firebase";

import "../styles/app.css";

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const App: React.FC = () => {
  const [singIn, setSingIn] = useState(false);
  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    //create new User
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((saved) => {});
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  //displapy modal
  const showModal = () => {
    setVisible(true);
  };
  //hide modal
  const handleOk = (e: any) => {
    setVisible(false);
  };

  const handleCancel = (e: any) => {
    setVisible(false);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //@ts-ignore
        localStorage.setItem("id", firebase.auth().currentUser.uid);

        setSingIn(true);
      } else {
        // No user is signed in.
      }
    });
  }, []);

  return (
    <div className="sing-in">
      {singIn ? (
        <Redirect to="/home" />
      ) : (
        <div style={{ width: "100%", height: "100vh", display: "flex" }}>
          <img
            style={{ width: "50%", height: "100%", display: "grid" }}
            src={require("../pic/doc.jpg")}
            alt=""
          />
          <div
            style={{
              width: "50%",
              backgroundColor: "#F5F5F1",
            }}
          >
            <p
              className="name"
              style={{
                textAlign: "center",
                marginTop: 50,
                marginBottom: 200,
                fontSize: 50,
                fontWeight: "bolder",
                color: "rgb(102, 0, 153)",
              }}
            >
              <img
                style={{ width: 100, marginRight: 7 }}
                src={require("../pic/plus.svg")}
                alt=""
              />
              HOSPITAL NEARBY
            </p>

            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
            <Button
              style={{
                margin: "0 auto",
                padding: "8px 16px",
                width: 218,
                display: "grid",
              }}
              type="primary"
              onClick={showModal}
            >
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "14px",
                  verticalAlign: "middle",
                }}
              >
                Sign Up with email
              </p>
            </Button>
            <Modal
              title="Sign Up"
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Form
                {...layout}
                name="signup"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input  correct Email",
                      type: "email",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input at least six charater password!",
                      min: 6,
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
