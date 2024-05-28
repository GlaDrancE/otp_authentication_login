const mongoose = require("mongoose");
const {Schema} = mongoose;
mongoose.connect('mongodb://localhost:27017/test');

// const dataModel = mongoose.model('user', Schema({ email: String, password: String}));
let OtpVarificationSchema = new Schema({
    otp: {
        type :Number,
        require: true
    },
    sId: String,
    createdAt: Date,
    expiresAt: Date,
}, {timestamps: true})
let userDataSchema = new  Schema({
    email: {
        type: String,
        require: true
    },
    password:{
        type: String, 
        require: true
    }
})


let data = {
    OtpVarification : OtpVarificationSchema,
    userData: userDataSchema
}
module.exports = data;