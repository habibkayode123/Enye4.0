import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Search from "./search";
import History from "./history";
import Home from "./home";
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
