/* eslint-disable no-console */
const http = require("http");

let express = require("express");
let request = require("request");
let querystring = require("querystring");

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[process.env.NODE_ENV || "development"]);
const { Model } = require("objection");
const Users = require("./models/Users");
Model.knex(knex);

let app = express();

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:3001/callback";

app.get("/login", function(req, res) {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: "user-top-read user-read-email",
        redirect_uri
      })
  );
});

app.get("/callback", function(req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64")
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token;
    let uri = process.env.FRONTEND_URI || "http://localhost:3000";
    res.redirect(uri + "?access_token=" + access_token);
  });
});

app.get("/api/users", (request, response, next) => {
  Users.query().then(users => {
    response.send(users);
  }, next); // <- Notice the "next" function as the rejection handler
});

app.post("/api/users", (request, response, next) => {
  const newUser = { ...request.body };
  Users.query()
    .insertAndFetch(newUser)
    .then(users => {
      response.send(users);
    }, next);
});
// db-errors provides a consistent wrapper around database errors
const { wrapError, DBError } = require("db-errors");

app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
  }
  const wrappedError = wrapError(error);
  if (wrappedError instanceof DBError) {
    response.status(400).send(wrappedError.data || wrappedError.message || {});
  } else {
    response
      .status(wrappedError.statusCode || wrappedError.status || 500)
      .send(wrappedError.data || wrappedError.message || {});
  }
});

const server = http.createServer(app).listen(process.env.PORT || 3001);
console.log("Listening on port %d", server.address().port);
