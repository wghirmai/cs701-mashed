
import React, { useEffect, useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Card,
  CardTitle,
  CardText,
  CardSubtitle,
  Button
} from "reactstrap";
import queryString from "query-string";
import "./App.css";
import Login from "./Login.js";
import styled from "styled-components";
import ScrollToBottom from "react-scroll-to-bottom";

//import OtherUsers from "./OtherUsers.js";
//import { getTokenFromResponse } from "./spotify";
//import SpotifyWebApi from "spotify-web-api-js";
//const spotify = new SpotifyWebApi;
//<img src={logo} className="App-logo" alt="logo" />

const UserItem = styled(ListGroupItem)`
  font-weight: bold;
  padding: 0.4rem;
`;
const Area = styled.div`
  height: 5000px;
`;
const App = () => {
  const [mode, setMode] = useState("view");
  const [user, setUser] = useState("");
  const [artists, setArtists] = useState([]);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    setToken(accessToken);
    if (!accessToken) return;
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then(data => {
        setUser(data.id); //getting spotify user id
        console.log(data.id);
        setMode("loggedin"); //go to page of users for now will go to page for zipcode
      });

    //fetching database if users
    fetch("/api/users")
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(data => {
        setUsers(data); //list of users(username, zip, best..)
        console.log(data);
      })

      .catch(err => console.error(err)); // eslint-disable-line no-console
    //(FETCHING USERS ZIPCODE THEN GO TO MAIN PAGE OF USERS)
    //fetching user's top 10 artists
    fetch("https://api.spotify.com/v1/me/top/artists?limit=10", {
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then(data => {
        setArtists(data.items.map(item => item.name));
        console.log(data.items.map(item => item.name));
      })

      .catch(err => console.error(err)); // eslint-disable-line no-console

    //user has spotify user id
    //artists has top 10 spotify artists
  }, [token]);

  const newUser = {
    user_name: user,
    zipcode: "22193",
    best1: artists[0],
    best2: artists[1],
    best3: artists[2],
    best4: artists[3],
    best5: artists[4],
    best6: artists[5],
    best7: artists[6],
    best8: artists[7],
    best9: artists[8],
    best10: artists[9]
  };
  console.log(newUser);
  //show the common artists and distance
  //explain why we chose 10
  //console.log(user, users, artists);
  //takes users database/array of user objects and maps to card with each info
  const userids = users.map(user => (
    <Card style={{ width: "100rem" }} key={user.user_name}>
      <CardTitle> {user.user_name}</CardTitle>
      <CardSubtitle> {user.zipcode}</CardSubtitle>
      <CardText> {user.best1}</CardText>
      <CardText> {user.best2}</CardText>
      <CardText> {user.best3}</CardText>
      <CardText> {user.best4}</CardText>
      <CardText> {user.best5}</CardText>
      <CardText> {user.best6}</CardText>
      <CardText> {user.best7}</CardText>
      <CardText> {user.best8}</CardText>
      <CardText> {user.best9}</CardText>
      <CardText> {user.best10}</CardText>
    </Card>
  ));

  const handleUser = () => {
    // //updating and fetching database with new user
    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json"
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(fetchedUser => {
        // Append the new user to the users array
        const modifiedUsers = [...users, fetchedUser];
        setUsers(modifiedUsers);
        console.log(users);
      })
      .catch(err => console.error(err)); // eslint-disable-line no-console
  };

  const startButton = (
    <Button
      justify-self="center"
      size="lg"
      onClick={() => {
        handleUser();
      }}
    >
      Add yourself!
    </Button>
  );

  if (mode === "loggedin") {
    return (
      <div className="App">
        <h1 className="App-title">Welcome to MASHED</h1>
        {startButton}
        <ScrollToBottom>
          <Area> {userids}</Area>
        </ScrollToBottom>

      </div>
    );
  }

  return (
    <div className="App">
      <h1 className="App-title">Welcome to MASHED</h1>
      <Login></Login>

    </div>
  );
};
export default App;
