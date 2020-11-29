import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Zipcode from "./Zipcode";

const App = () => {
  // eslint-disable-next-line
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

  const saveButton = (
    <input
      type="button"
      disabled={tempzip.length !== 5}
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
    </div>
  );
};
export default App;
