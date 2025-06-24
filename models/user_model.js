import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose"

// shopName, shopAddress, contact

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: [true, "Email must be unique!"],
        minLength: [5, "Email must have at least 5 characters!"],
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
    },
    shopName: String,
    shopAddress: String,
    contact: String,
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        select: false
    },
    verificationCodeValidation: {
        type: Number,
        select: false
    },
}, {timestamps: true});

userSchema.plugin(normalize);

export const User = model('User', userSchema);