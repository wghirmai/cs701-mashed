import React from "react";
import "./Login.css";
import { accessUrl } from "./spotify";
function Login() {
  return (
    <div className="login">
      <a href={accessUrl}> LOGIN WITH SPOTIFY</a>
    </div>
  );
}

export default Login;
