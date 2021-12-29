const Recipe = require("../models/recipe");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose")
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

const recipeRoutes = (app) => {
    app.get("/recipe", (req, res) => {

        if (!req.isAuthenticated())
            return res.redirect("/login");
        res.render("recipe", { username: req.user.name, email: req.user.email, id: req.user.id, msg: res.locals["flash"].error });
    });

    app.get("/menu", async(req, res) => {
        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        let recipes = await Recipe.paginate({}, { page, limit: 5, populate: { path: 'user', select: 'name _id' }, sort: { $natural: -1 } });

        if (req.user) {
            return res.render("menu", { username: req.user.name, email: req.user.email, id: req.user.id, recipes: recipes.docs, page: recipes.page, pages: recipes.pages });
        }
        res.render("menu", { recipes: recipes.docs, page: recipes.page, pages: recipes.pages });
    });
    app.get("/recipe/:title-:id", async(req, res) => {
        let { id, title } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.render("404");
        }
        let result;
        try {
            result = await Recipe.findOne({ _id: id, title });
        } catch (error) {
            return res.render("404");
        }
        if (!result)
            return res.render("404");
        if (req.user) {
            return res.render("details", { username: req.user.name, email: req.user.email, id: req.user.id, result });
        }
        res.render("details", { result });
    });
    app.get("/recipe/edit/:title-:id", async(req, res) => {
        let { id, title } = req.params;

        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.render("404");
        }
        let result;
        try {
            result = await Recipe.findOne({ _id: id, title });
        } catch (error) {
            return res.render("404");
        }
        if (!result)
            return res.render("404");
        if (result.user.toString() !== req.user.id)
            return res.redirect("/login");

        if (req.user) {
            return res.render("edit", { username: req.user.name, email: req.user.email, id: req.user.id, result });
        }
        res.render("edit", { result });
    });
    app.get("/delete/:id", (req, res) => {
        if (!req.isAuthenticated())
            return res.redirect("/login");
        Recipe.findOneAndRemove({ _id: req.params.id, user: req.user.id }, (err) => {
            if (err) {
                req.flash('error', 'Something went wrong');
                return res.redirect(`/user/${req.user.id}`);
            }
        });
        req.flash('success', "Recipe deleted");
        res.redirect(`/user/${req.user.id}`);
    });
    app.post("/recipe", upload.single('image'), async(req, res) => {
        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }
        let { step, title, description, ingredients } = req.body;
        if (!title) {
            req.flash("error", "Please add the title and the title must more than 6 characters");
            return res.redirect("/recipe");
        }
        if (!req.file) {
            req.flash("error", "Please add an image");
            return res.redirect("/recipe");
        }
        if (!step) {
            req.flash("error", "Please tell us how you do it");
            return res.redirect("/recipe");
        }
        if (!description) {
            req.flash("error", "Please tell add description, description must more than 20 characters");
            return res.redirect("/recipe");
        }
        if (!ingredients) {
            req.flash("error", "Please tell add ingredients, ingredients must more than 20 characters");
            return res.redirect("/recipe");
        }
        let path = await uploadImg(req.file.path);

        try {
            Recipe.create({ step, title, img: path, user: req.user.id, description, ingredients });
        } catch (error) {
            req.flash("error", error);
            return res.redirect("/recipe");
        }
        res.redirect(`/user/${req.user.id}`);

    });
    app.post('/update-recipe', upload.single('image'), async(req, res) => {
        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }
        let { id, title, description, ingredients, step } = req.body;
        console.log(id, title, description, ingredients, step);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.redirect("/edit");
        }
        if (!title) {
            req.flash("error", "Please add the title and the title must more than 6 characters");
            return res.redirect("/edit");
        }
        if (!req.file) {
            req.flash("error", "Please add an image");
            return res.redirect("/edit");
        }
        if (!step) {
            req.flash("error", "Please tell us how you do it");
            return res.redirect("/edit");
        }
        if (!description) {
            req.flash("error", "Please tell add description, description must more than 20 characters");
            return res.redirect("/edit");
        }
        if (!ingredients) {
            req.flash("error", "Please tell add ingredients, ingredients must more than 20 characters");
            return res.redirect("/edit");
        }
        let path = await uploadImg(req.file.path);

        try {
            Recipe.findByIdAndUpdate({ _id: id }, { $set: { step, img: path, title, ingredients, description, user: req.user.id } }, { new: true });
        } catch (error) {
            req.flash("error", error);
            return res.redirect("/edit");
        }
        res.redirect(`/user/${req.user.id}`);

    });
};

module.exports = recipeRoutes;