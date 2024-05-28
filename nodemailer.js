const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service:'hotmail',
    auth:{
        name: "Ayush",
        user: 'ayushr1606@gmail.com',
        pass: 'Ayush123'
    }
});
module.exports = transporter;
