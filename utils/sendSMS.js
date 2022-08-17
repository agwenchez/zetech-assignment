const options = {
    username: 'Agwera',
    apiKey: 'cbdebf4962e8ebd6ce074257079ab2c2ee587f93cb7c1ba743e4299df05c5050'
};

// initialize africastalking gateway
const africastalking = require('africastalking')(options);
const sms = africastalking.SMS;

const sendMessage = (phone_number, msg) => {


    phone_number.replace(/^0+/, "+254")
    console.log("Phone number replaced==>", phone_number)
    const sending_options = {
        to: phone_number,
        message: msg
    };

    // send sms
    return sms.send(sending_options)
        .then(response => {
            console.log(response);
            return response
        })
        .catch(error => {
            console.log(error);
            return error
        });

}

module.exports = { sendMessage }