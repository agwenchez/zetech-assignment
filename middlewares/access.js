const axios = require('axios');
require('dotenv').config();

const access = async (req, res, next) => {

    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    try {

        const request = await axios.get(url, {
            headers: {
                Authorization: `Basic ${process.env.mpesa_token}`
            }
        })
        req.access_token = request.data.access_token;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }

};


module.exports = { access }