import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";

import {
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
//import axios from "axios";
import Editor from "./Editor";
import { ConstraintViolationError } from "objection";

const Area = styled.div`
  height: 5000px;
`;
function App() {
  const [mode, setMode] = useState("view");
  const [user, setUser] = useState("");
  const [artists, setArtists] = useState([]);
  const [ourArtists, setOurArtists] = useState([]);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  //const [currentZipcodes, setZipcodes] = useState([]);
  const [myzip, setmyZip] = useState("");
  const [tempzip, settempZip] = useState(myzip ? myzip.tempzip : "");
  const [zipcodes, setZipcodes] = useState(null);
  //const [tempzip, settempZip] = useState("");
  const [logged, setlogged] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [deleted, setDeleted] = useState(0);

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
        //setZipcodes(data);
        setUser(data.id); //getting spotify user id
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
        setmyZip(tempzip);
        const orderlist = artists;
        setNewUser({
          user_name: user,
          zipcode: tempzip,
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
        });
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

  //console.log([users[0].best1,users.best2,users.best3,users.best4,users.best5,users.best6,users.best7,users.best8,users.best9,users.best10]);
  //show the common artists and distance
  //explain why we chose 10
  //console.log(user, users, artists);
  //takes users database/array of user objects and maps to card with each info
  //
    function getArraysIntersection(a1,a2){
     return  a1.filter(function(n) {return a2.indexOf(n) !== -1;});
  }
  //console.log(ourArtists.map(person=>getArraysIntersection(person,artists)));
  console.log(zipcodes);

  const userids = users
    .filter(person => zipcodes !== null && zipcodes.includes(person.zipcode))
    //.filter(person=> person.zipcode==="05753" || person.zipcode==="05740" || person.zipcode==="91755")
    //.filter(user=> getArraysIntersection(users.map(user=>{return user.best1,user.best2,user.best3,user.best4,user.best5,user.best6,user.best7,user.best8,user.best9,user.best10}),artists)!==[])
    .map(user => {
      {
        if (
          artists.includes(user.best1) ||
          artists.includes(user.best2) ||
          artists.includes(user.best3) ||
          artists.includes(user.best4) ||
          artists.includes(user.best5) ||
          artists.includes(user.best6) ||
          artists.includes(user.best7) ||
          artists.includes(user.best8) ||
          artists.includes(user.best9) ||
          artists.includes(user.best10)
        ) 
        
 //       if (getArraysIntersection([user.best1,user.best2,user.best3,user.best4,user.best5,user.best6,user.best7,user.best8,user.best9,user.best10], artists).length !==0)  
        {
          return (
            <Card style={{ width: "100rem" }} key={user.user_name}>
              <CardTitle>
                {" "}
                <a href={`https://open.spotify.com/user/${user.user_name}`}>
                  {" "}
                  {user.user_name}{" "}
                </a>
              </CardTitle>
              <CardSubtitle> {user.zipcode}</CardSubtitle>
              <CardSubtitle> { (getArraysIntersection([user.best1,user.best2,user.best3,user.best4,user.best5,user.best6,user.best7,user.best8,user.best9,user.best10], artists).length/10 )*100 +"%" }</CardSubtitle>
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
          );
        }
      }
    });


  const handleUser = () => {
    if (newUser) {
      //edit current user
      if (currentUser) {
        fetch(`/api/users/${deleted}`, {
          method: "PUT",
          body: JSON.stringify({ ...currentUser, ...newUser }),
          headers: new Headers({ "Content-type": "application/json" })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(response.status_text);
            }
            return response.json();
          })
          .then(data => {
            setCurrentUser(data);
            setDeleted(data.id);
           //this is where we decide to edit
           const alteredUsers = users.map(user => {
                return user.user_name === data.user_name
                     ? data
                      : user;
           });
          setUsers(alteredUsers);
         })
          .catch(err => console.log(err));
      } else {
        fetch("/api/users", {
          //mode: 'no-cors',
          method: "POST",
          body: JSON.stringify(newUser),
          headers: new Headers({ "Content-Type": "application/json" })
        })
          .then(response => {
            //console.log(response);
            if (!response.ok) {
              throw new Error(response.status_text);
            }
            return response.json();
          })
          .then(data => {
            const alteredUsers = [...users, data];
            setUsers(alteredUsers);
            setCurrentUser(newUser);
            setDeleted(data.id);
          })
          .catch(err => console.log(err));
      }
    }

    setMode("view");
  };

  console.log(ourArtists);

  const deleteID = (
    <input
      type="text"
      size="45"
      value={deleted}
      placeholder="Which ID you'd like to delete"
      onChange={event => setDeleted(event.target.value)}
    ></input>
  );

  const handleDelete = () => {
    fetch(`/api/users/${deleted}`, { method: "DELETE" })
      .then(response => {
        if (response.ok) {
          const alteredUsers = users.filter(user => user.id !== deleted);
          setUsers(alteredUsers);
        }
      })
      .catch(err => console.error(err)); // eslint-disable-line no-console
  };
  const handleZipcode = () => {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://www.zipcodeapi.com/rest/y0UDK9tMgkCOtTDLhNGJstEk9PVLAIaf3wF0jtx1qey0Nke2ZfytzxiL2VxT2xhW/radius.json/" +
        tempzip +
        "/5/mile"
    )
      .then(response => response.json())
      .then(data => {
        setZipcodes(data.zip_codes.map(item => item.zip_code));
        //setZipcodes(zipcodes.push(tempzip));
      })
      .catch(err => console.error(err)); // eslint-disable-line no-console
  };

  const startButton = (
    <Button
      justify-self="center"
      size="lg"
      onClick={() => {
        handleUser();
        handleZipcode();
      }}
    >
      Add yourself!
    </Button>
  );

  const deleteButton = (
    <Button
      justify-self="center"
      size="lg"
      onClick={() => {
        handleDelete();
      }}
    >
      Delete
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
      {logged ? (
        <Area>
          {newZipcode} {saveButton} {startButton} {deleteID} {deleteButton}{" "}
          {userids}
         
        </Area>
      ) : (
        <Login></Login>
      )}
    </div>
  );
}
export default App;
