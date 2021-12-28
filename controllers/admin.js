const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const cloudinary = require("cloudinary").v2;
const Auth = require("../middleware/adminAuth");

const adminRoutes = (app, passport) => {
    app.get("/admin", Auth, async(req, res) => {
        return res.render("admin/index", { username: req.user.name, email: req.user.email, id: req.user.id, products });
    });
    app.get("/admin/login", (req, res) => {
        if (req.isAuthenticated())
            return res.redirect("/admin");
        if (req.flash('error'))
            return res.render("admin/login", { msg: req.flash('error') });
        res.render("admin/login");
    });
    app.get("/logout", (req, res) => {
        req.logOut();
        res.redirect("/");
    });
    app.get("/admin/users", Auth, async(req, res) => {
        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        let users;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.render("404");
        }
        try {
            users = await User.paginate({}, { page, limit: 5, sort: { $natural: -1 } })
            res.render("admin/index", { users });
        } catch (error) {
            res.render("admin/index", { error });
        }

    });
    app.get("/admin/recipes", Auth, (req, res) => {

    })
    app.post("/admin/update", Auth, async(req, res) => {
        let { password, email } = req.body;
        if (!password)
            return res.render("userpage", { error });
        let hashed = await bcryptjs.hash(password, 13);
        try {
            await User.findOneAndUpdate({ _id: req.user._id, email }, { password: hashed });
        } catch (error) {
            return res.render("admin/index", { error });
        }
        req.flash("success", "Password change, please login again");
        req.logOut();
        res.redirect("/admin/login");
    });
    app.post("/admin/login", passport.authenticate('local', { failureRedirect: "/admin/login", failureFlash: true }), (req, res) => {
        res.redirect("/admin");
    });
};

module.exports = adminRoutes;