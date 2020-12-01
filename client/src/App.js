
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
import Zipcode from "./Zipcode";
import axios from "axios";
import Editor from "./Editor"
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
function App() {
  const [mode, setMode] = useState("view");
  const [user, setUser] = useState("");
  const [artists, setArtists] = useState([]);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [currentZipcodes, setZipcodes] = useState([]);
  const [myzip, setmyZip] = useState("");
  const [tempzip, settempZip] = useState(myzip ? myzip.tempzip : "");
  //const [tempzip, settempZip] = useState("");
  const [logged, setlogged]= useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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
        setZipcodes(data);
        setUser(data.id); //getting spotify user id
        console.log(data.id);
        //setMode("loggedin"); //go to page of users for now will go to page for zipcode
        setlogged(true);
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
  const saveButton = (
    <input
      type="button"
      disabled={tempzip.length !== 5}
      onClick={() => {
        setmyZip(tempzip );
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

 //aplhabetical sort list of artists
 const orderlist = artists.sort();

  const newUser = {
    user_name: user,
    zipcode: parseInt(myzip),
    best1: orderlist[0],
    best2: orderlist[1],
    best3: orderlist[2],
    best4: orderlist[3],
    best5: orderlist[4],
    best6: orderlist[5],
    best7: orderlist[6],
    best8: orderlist[7],
    best9: orderlist[8],
    best10: orderlist[9]
  };
  console.log(newUser);
  console.log(parseInt(myzip));
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

  
  const handleUser = newUser => {
       if (newUser) {
         //edit current user
         if (currentUser) {
           fetch(`/api/users/${currentUser.id}`, {
             method: 'PUT',
             body: JSON.stringify({ ...currentUser, ...newUser }),
             headers: new Headers({ 'Content-type': 'application/json' })
           })
             .then(response => {
               if (!response.ok) {
                 throw new Error(response.status_text);
               }
               return response.json();
             })
             .then(data => {
               setCurrentUser(data);
               //this is where we decide to edit
               const alteredUsers = users.map(user => {
                 if (user.user_name === data.id) {
                   return data;
                 }
                 return user;
               });
              setUsers(alteredUsers);
             })
             .catch(err => console.log(err));
         } else {
           fetch("/api/users", {
             mode: 'no-cors',
             method: 'POST',
             body: JSON.stringify(newUser),
             headers: new Headers({ 'Content-type': 'application/json' })
           })
             .then(response => {
            console.log(response);
               if (!response.ok) {
                 throw new Error(response.status_text);
               }
               return response.json();
             })
             .then(data => {
               const alteredUsers = [...users, data];
               setUsers(alteredUsers);
                console.log("usersss list:"+ users);
               setCurrentUser(data);
             })
             .catch(err => console.log(err));
         }
       }
       setMode('view');
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

        <ScrollToBottom> 
          <Area> {userids}</Area>
          </ScrollToBottom>
          <Zipcode zip={myzip} />

      </div>
    );
  }
//<Area> {newZipcode}     {saveButton} {userids}  
/**/
return (
  <div className="App">
    <h1 className="App-title">Welcome to MASHED</h1>
    {logged ? 
    <Area>
  {newZipcode} {saveButton} {userids}
    <Editor user={currentUser} complete={handleUser}/>
    </Area>
     :
     <Login></Login> }

  </div>
);
}
export default App;
