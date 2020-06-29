//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

//console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

// use mongoose to connect to mongoDB
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

// schema setting
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//secret string to encrypt the database

// Add mongoose encrypt as a plugin
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

// model setting
const User = new mongoose.model("User", userSchema);



// render home page
app.get("/", function(req, res){
  res.render("home");
});

// render login page
app.get("/login", function(req, res){
  res.render("login");
});

// render register page
app.get("/register", function(req, res){
  res.render("register");
});

// registration process
app.post("/register", function(req, res) {
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err) {
      console.log(err);
    } else {
      if(foundUser){
        if(foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
