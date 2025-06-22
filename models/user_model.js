import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose"

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
        enum: ['buyer', 'vendor']
    },
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
});

userSchema.plugin(normalize);

export const User = model('User', userSchema);