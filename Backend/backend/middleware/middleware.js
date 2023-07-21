const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const jwtKey = process.env.JWT_SECRET_KEY

// Verify JWT Token
async function authorize(req, res, next) {
    try {
        let token = req.headers.authorization
        if (token === 'null' || !token) {
            throw ("");
        }
        let username = jwt.decode(token).username
        if (!username)
            return res.status(401).send({ error: "User not found" })
        jwt.verify(token, jwtKey)
        UserModel.findOne({ username: username }).exec((err, user) => {
            if (err)
                return res.status(500).send({ error: `${err}` })
            if (!user) {
                return res.status(401).send({ error: "User not found" })
            }
            req.user = user;
            next()
        })
    } catch (err) {
        console.log(err);
        return res.status(401).send({ error: "Unauthorize" })
    }
}

module.exports = authorize