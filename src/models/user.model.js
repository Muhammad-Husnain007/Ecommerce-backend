import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true
    },
    email_verify: {
        type: Boolean,
        required: false
    },
    last_login_date: {
        type: Boolean,
        required: false
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

    forgot_password_otp: {
        type: String,
        default: null
    },

    forgot_password_expiry: {
        type: Date,
        default: ""
    },

    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: "USER"
    },


    accessToken: {
        type: String,
    },

}, { timestamps: true });


export const User = mongoose.model('User', userSchema);
