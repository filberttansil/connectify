const express = require("express");
const app = express();
const port = 3000;
const session = require('express-session')

const router = require("./routers/router");
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'rahasia dong', //harus ada
  resave: false,
  saveUninitialized: false,
  coockie: {
      secure: false,
      sameSite: true //untuk security dari csrf attack
      }
}))

app.use(router);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
