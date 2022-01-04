const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const env = require("dotenv");
const flash = require("req-flash");
const session = require("express-session");
const passport = require('passport');

app.use(express.json());
env.config();
app.use(express.urlencoded({ extended: true }))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(session({ secret: "asdasd", resave: false, saveUninitialized: true }))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash({ locals: "flash" }));

const userRoutes = require("./controllers/user");
const recipeRoutes = require("./controllers/recipe");
const passportConfig = require("./middleware/passport");
const adminRoutes = require("./controllers/admin");
passportConfig(passport);
userRoutes(app, passport);
recipeRoutes(app);
adminRoutes(app, passport);

app.use((req, res) => {
    res.status(404).render('404');
})

mongoose.connect('mongodb://localhost:27017/recipe', {}).then(() => console.log('Connected'))

app.listen(5000, () => {
    console.log("running");
});