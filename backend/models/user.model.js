import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Full Name is Required!"],
    },
    username: {
        type: String,
        required: [true, "User Name is Required!"],
    },
    email: {
        type: String,
        required: [true, " Email is Required!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
        minlength: [6, "Password length should be greater than 6 character"],
        select: true,
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    age:{
        type: Number
    },
    dateOfBirth: {
         type: Date 
    },
    gender:{
        type: String
    },
    description:{
        type: String
    },
    friends:{
        type: Array
        
    },
}, { timestamps: true })

const UserModel = mongoose.model('users', UserSchema)
export default UserModel

//upload lại