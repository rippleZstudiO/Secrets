//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();


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

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User ({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err){
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
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
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
