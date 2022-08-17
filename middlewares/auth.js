const jwt = require('jsonwebtoken');
require('dotenv').config()

const authorization = async (req, res, next) => {

    try {

        const jwtToken = req.header("token")
        if (!jwtToken) {
            return res.status(403).send("Not authorized")
        }

        const payload = jwt.verify(jwtToken, process.env.secret)
        req.user = payload.user;
    } catch (error) {

        console.error(error)
        return res.status(403).send("Not authorized error")
    }

    next()
}

const authRoles = (permissions) => {

    return (req, res, next) => {
        const { roles } = req.body;
        if (permissions.includes(roles)) {
            next()
        } else {
            return res.status(401).json("You are not authorized to access this route")
        }

    }
}

module.exports = { authorization, authRoles }