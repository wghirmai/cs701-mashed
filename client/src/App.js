import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./Login.js";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to MASHED</h1>
      </header>
      <p className="App-intro">API here</p>
      <Login> </Login>
    </div>
  );
};

export default App;
