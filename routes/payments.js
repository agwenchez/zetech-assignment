const express = require('express');
const router = express.Router()
const axios = require("axios")
let unirest = require('unirest');
let req = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
const { access }= require('../middlewares/access');


router.post('/stk', access, (req, res) => {
    let request = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
    .headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.access_token}`
    })
        .send(JSON.stringify({
            "BusinessShortCode": 174379,
            "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjEwNzIxMDkxMzQ2",
            "Timestamp": "20210721091346",
            "TransactionType": "CustomerPayBillOnline",
            "Amount": 1,
            "PartyA": 254792551291,
            "PartyB": 174379,
            "PhoneNumber": 254792551291,
            "CallBackURL": "https://mydomain.com/path",
            "AccountReference": "CompanyXLTD",
            "TransactionDesc": "Payment of X" 
        }))
        .end(response => {
            if (response.error) throw new Error(response.error);
            console.log(response.body);
            return res.status(200).send(response.body)
        });

})

module.exports = router