const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const recipeModel = new mongoose.Schema({
    step: { type: String, require: true },
    img: { type: String },
    title: { type: String, require: true },
    ingredients: { type: String, require: true },
    description: { type: String, require: true },
    user: { type: mongoose.Types.ObjectId, ref: "User" }
}, {
    timestamps: true
});

recipeModel.plugin(mongoosePaginate)

const Recipe = mongoose.model("Recipe", recipeModel);
module.exports = Recipe;