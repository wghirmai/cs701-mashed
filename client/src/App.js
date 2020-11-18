import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import styled from "styled-components";

import "./App.css";
import Login from "./Login.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import Zipcode from "./Zipcode";

const Title = styled.h1`
  text-align: center;
`;
const Button = styled.button``;

const App = () => {
  const [currentZipcode, setZipcode] = useState(" ");
  const [currentZipcodes, setZipcodes] = useState([]);
  const [myzip, setmyZip] = useState("");
  const [tempzip, settempZip] = useState(myzip ? myzip.tempzip : "");
  const [mode, setMode] = useState("view");

  useEffect(() => {
    fetch("/")
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then(data => {
        setZipcodes(data);
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }, []);

  //Zipcode Function here
  const handleZipcodeReturn = newZipcode => {};

  const saveButton = (
    <input
      type="button"
      disabled={tempzip.length != 5}
      onClick={() => {
        setmyZip({ tempzip });
        setMode("edit");
      }}
      value="Save"
    />
  );

  const newZipcode = (
    <input
      type="text"
      size="45"
      value={tempzip}
      placeholder="Zipcode must be set"
      onChange={event => settempZip(event.target.value)}
    ></input>
  );

  if (mode === "edit") {
    return (
      <div>
        <Zipcode zip={tempzip} />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to MASHED</h1>
      </header>
      {newZipcode}
      {saveButton}

      <Login> </Login>
    </div>
  );
};

export default App;
