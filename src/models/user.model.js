import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: null
    },
    email_verify: {
        type: Boolean,
        required: false
    },
    last_login_date: {
        type: Date,
        required: false,
        
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
   
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'address'
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'cartProduct'
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'order'
        }
    ],

    forgot_password_token: {
        type: String,
        default: null
    },

    forgot_password_expiry: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: "USER"
    },

     verification_link:{
     type: String,
    },
    verification_token:{
        type: String
    },
    verification_token_expiry:{
        type: String
    },
    access_token: {
        type: String,
    },
    refresh_token: {
        type: String,
    },
   

}, { timestamps: true });


export const User = mongoose.model('User', userSchema);
