const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const cloudinary = require("cloudinary").v2;
const auth = require("../middleware/adminAuth");

const adminRoutes = (app, passport) => {
    app.get("/admin", auth, async(req, res) => {
        return res.render("admin/index", { username: req.user.name, email: req.user.email, id: req.user.id, avatar: req.user.avatar });
    });
    app.get("/admin/login", (req, res) => {
        if (req.isAuthenticated())
            return res.redirect("/admin");
        if (req.flash('error'))
            return res.render("admin/login", { msg: req.flash('error') });
        res.render("admin/login");
    });
    app.get("/admin/users", auth, async(req, res) => {
        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        let users;
        try {
            users = await User.paginate({}, { page, limit: 6, sort: { $natural: -1 } })
            res.render("admin/users", { username: req.user.name, email: req.user.email, id: req.user.id, avatar: req.user.avatar, users: users.docs, page: users.page, pages: users.pages })
        } catch (error) {
            res.render("admin/users", { error });
        }
    });
    app.get("/admin/recipes", auth, async(req, res) => {
        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        let recipes;
        try {
            recipes = await Recipe.paginate({}, { page, limit: 5, populate: { path: 'user', select: 'name _id' }, sort: { $natural: -1 } });
            res.render("admin/recipes", { username: req.user.name, email: req.user.email, id: req.user.id, avatar: req.user.avatar, recipes: recipes.docs, page: recipes.page, pages: recipes.pages });
        } catch (error) {
            res.render("admin/recipes", { error });
        }

    });
    app.get("/admin/delete/:id", auth, (req, res) => {
        let { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.redirect('/admin/users');
        }
        User.findOneAndRemove({ _id: id }).then(() => {
            return res.redirect("/admin/users");
        }).catch(error => {
            return res.redirect('/admin/users');
        });
    });

    app.get("/admin/delete/recipe/:id", auth, (req, res) => {
        let { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.redirect('/admin/recipes');
        }
        Recipe.findOneAndRemove({ _id: id }).then(() => {
            return res.redirect("/admin/recipes");
        }).catch(error => {
            return res.redirect('/admin/recipes');
        });
    })

    app.post("/admin/login", passport.authenticate('local', { failureRedirect: "/admin/login", failureFlash: true }), (req, res) => {
        res.redirect("/admin");
    });
};

module.exports = adminRoutes;