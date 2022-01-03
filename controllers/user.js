const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const multer = require("multer");
cloudinary.config({
    api_key: "669723947136336",
    api_secret: "dXk_r0dtD26ZxgypPIkRu74cfl4",
    cloud_name: "dw6uxdli0"
})

const storage = multer.diskStorage({
    destination: "public/photos",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage });

const uploadImg = async(path) => {
    let res;
    try {
        res = await cloudinary.uploader.upload(path);
        return res.secure_url;
    } catch (error) {
        return false;
    }
};


const userRoutes = (app, passport) => {
    app.get("/", async(req, res) => {
        let products = await Recipe.find({}).limit(2).populate({ path: "user", select: "name _id" }).sort({ $natural: -1 }).exec();
        if (req.user) {
            return res.render("index", { username: req.user.name, email: req.user.email, id: req.user.id, products });
        }
        res.render("index", { products });
    });
    app.get("/registration", (req, res) => {
        if (req.isAuthenticated()) {
            return res.redirect("/");
        }
        res.render("register");
    });
    app.get("/login", (req, res) => {
        if (req.isAuthenticated())
            return res.redirect("/");
        if (req.flash('error'))
            return res.render("login", { msg: req.flash('error') });
        if (res.locals['flash'].success)
            return res.render("login", { success: res.locals['flash'].success });
        res.render("login");
    });
    app.get("/logout", (req, res) => {
        req.logOut();
        res.redirect("/");
    });
    app.get("/user/:id", async(req, res) => {

        let { id } = req.params;
        let user;
        let recipes = [];
        let flag = '0';
        if (req.isAuthenticated() && req.user.id === id)
            flag = '1';
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.render("404");
        }
        try {
            user = await User.findOne({ _id: id });
            recipes = await Recipe.find({ user: id });

            if (!user) {
                return res.render("404");
            }

            res.render("userpage", { user, recipes, flag });
        } catch (error) {
            res.render("userpage", { error });
        }

    });
    app.get("/about", (req, res) => {
        if (req.user) {
            return res.render("about", { username: req.user.name, email: req.user.email, id: req.user.id });
        }
        res.render("about");
    })
    app.post("/registration", async(req, res) => {
        if (req.isAuthenticated())
            return res.redirect("/");
        let { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.render("register", { error: "Invalid data" });
        }
        let userFind = await User.findOne({ email });
        if (userFind)
            return res.render("register", { error: "Account already exist" });
        let hash = await bcryptjs.hash(password, 13);
        try {
            User.create({ email, password: hash, name });
        } catch (error) {
            res.render("register", { error });
        }
        req.flash("success", "Account created");
        res.redirect("login");

    });
    app.post("/update", upload.single('image'), async(req, res) => {
        if (!req.isAuthenticated())
            return res.redirect("/login");
        let { password, email } = req.body;
        let path;
        if (req.file) {
            path = await uploadImg(req.file.path);
        }
        if (!password)
            return res.render("userpage", { error });
        let hashed = await bcryptjs.hash(password, 13);
        try {
            await User.findOneAndUpdate({ _id: req.user._id, email }, { password: hashed, avatar: path });
        } catch (error) {
            return res.render("userpage", { error });
        }
        req.flash("success", "Infomation change, please login again");
        req.logOut();
        res.redirect("/login");
    });
    app.post("/login", passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), (req, res) => {
        res.redirect("/");
    });
};

module.exports = userRoutes;