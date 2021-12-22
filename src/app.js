const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");
const register = require("./models/registers");
 
const port = process.env.PORT || 2000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);


app.get("*", (req, res) => {
  res.status(400).send("page not found".toUpperCase());
});
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password === confirmPassword) {
      const registerEmployee = new register({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        gender : req.body.gender,
        phone : req.body.phone,
        age : req.body.Age,
        password : password,
        confirmPassword : confirmPassword
      });

      const registered = await registerEmployee.save();
      res.status(201).render('index');
    } else {
      res.send("password is not correct");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//login check

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await register.findOne({email: email });

    if (userEmail.password === password) {
      res.status(201).render("index");
    } else {
      res.send("password is not correct");
    }
    
  } catch (e) {
    res.status(400).send("invalid login details")
  }
});

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});