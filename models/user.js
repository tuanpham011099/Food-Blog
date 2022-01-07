const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const userModel = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    avatar: { type: String, default: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png" },
    is_admin: { type: Boolean, default: false },
    is_master: { type: Boolean, default: false }
}, {
    timestamps: true
});
userModel.plugin(mongoosePaginate);

const User = mongoose.model("User", userModel);

module.exports = User;