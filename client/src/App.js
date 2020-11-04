import React, { useEffect, useState } from "react";

import "./App.css";
import Login from "./Login.js";
import { getTokenFromResponse } from "./spotify";
//<img src={logo} className="App-logo" alt="logo" />
const App = () => {
  //Run code based on a condition
  const [token, setToken] = useState("");
  useEffect(() => {
    const hash = getTokenFromResponse();
    setToken(hash.access_token);
    //window.location.hash="";
    console.log("My Access Token:", token);
  }, [token]);

  return (
    <div className="App">
      <h1 className="App-title">Welcome to MASHED</h1>

      {token ? <h1 className="App-title">Logged in</h1> : <Login />}
    </div>
  );
};

export default App;
