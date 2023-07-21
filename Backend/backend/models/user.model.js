const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            minlength: 6,
            required: true,
        },
    },
);

module.exports = mongoose.model("user", UserSchema);