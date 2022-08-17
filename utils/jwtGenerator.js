const jwt = require('jsonwebtoken');
require('dotenv').config()


const jwtGenerator = (user_id) =>{
    const payload = {
        user:user_id 
    }

    return jwt.sign( payload, process.env.secret, {expiresIn: "3600s"})

}

module.exports = {jwtGenerator};