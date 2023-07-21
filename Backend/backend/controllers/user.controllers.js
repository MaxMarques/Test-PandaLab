const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;


module.exports.register = async (req, res) => {
    const { username, password } = req.body

    if (password.length < 6) {
      return res.status(400).json({ message: "Less than 6 characters" })
    } try {
        await UserModel.create({
            username,
            password: bcrypt.hashSync(password, 10),
        }).then(user =>
            res.status(200).json({
            message: "Created!",
            user,
            })
        )
    } catch (err) {
        res.status(400).json({
            message: "Not successful created",
            error: err.message,
        })
    }
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
          message: "Username or Password not present",
        })
    } try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            let pass = bcrypt.compareSync(password, user.password)
            if (!pass) {
                return res.status(400).json({
                    message: "Login not successful",
                    error: "User not found",
                })
            }
            let token = jwt.sign({ username: user.username }, jwtKey, { algorithm: 'HS256', expiresIn: "10h" });
            res.status(200).json({
                message: "Login successful",
                token,
                user,
            })
        }
    } catch (err) {
        res.status(400).json({
            message: "An error occurred",
            error: err.message,
        })
    }
}