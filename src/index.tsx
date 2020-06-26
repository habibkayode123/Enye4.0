import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./componet/App";

import Search from "./componet/search";
import History from "./componet/history";
import Home from "./componet/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const client = new ApolloClient({
  uri: "https://us-central1-habib-ce35e.cloudfunctions.net/graph/graphql",
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/search/:text" component={Search}></Route>
          <Route exact path="/history" component={History} />
          <Route path="/home" component={Home}></Route>
          <Route path="/" component={App} />
        </Switch>
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
