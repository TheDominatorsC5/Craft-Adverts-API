import { transport } from "../middlewares/sendmail.js";
import { acceptCodeSchema, passwordResetSchema, signinSchema, signupSchema } from "../middlewares/validator.js";
import { User } from "../models/user_model.js";
import { hashPass, hashValidation, hmacProcess } from "../utils/hashing.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, role, shopName, shopAddress, contact } = req.body;

    try {
        const { error, value } = signupSchema.validate({ firstName, lastName, email, password, confirmPassword, role, shopName, shopAddress, contact });

        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (!existingUser.verified) {
                const codeValue = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

                await transport.sendMail({
                    from: process.env.SENDER_EMAIL_ADDRESS,
                    to: email,
                    subject: "Activation Code",
                    html: '<h1>' + codeValue + '</h1>'
                })

                await User.findByIdAndUpdate(existingUser.id, {verificationCode: hashedCodeValue, verificationCodeValidation: Date.now()});
                return res.status(201).json({ success: true, message: "verification code has been sent to your email" });
            }

            return res.status(401).json({ success: false, message: "user already exist" });
        }

        if (password !== confirmPassword) {
            return res.status(401).json({ success: false, message: "passwords do not match" });
        }

        const hashedPassword = await hashPass(password, 12);
        const codeValue = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

        let info = await transport.sendMail({
            from: process.env.SENDER_EMAIL_ADDRESS,
            to: email,
            subject: "Activation Code",
            html: '<h1>' + codeValue + '</h1>'
        })

        if (info.accepted[0] === email) {
            let newUser

            if (role === 'buyer') {
                newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role,
                    verificationCode: hashedCodeValue,
                    verificationCodeValidation: Date.now()
                });
            } else {
                newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role,
                    shopName,
                    shopAddress,
                    contact,
                    verificationCode: hashedCodeValue,
                    verificationCodeValidation: Date.now()
                });
            }

            const result = await newUser.save();
            result.password = undefined;
            result.verificationCode = undefined;
            return res.status(201).json({ success: true, message: "verification code has been sent to your email", result });
        }

        return res.status(400).json({ success: false, message: 'account failed' });

    } catch (error) {
        res.status(400).json({
            success: false, message: error.message,
        });

    }
}

export const verifyUser = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        const { error, value } = acceptCodeSchema.validate({ email, verificationCode });

        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }

        const codeValue = verificationCode.toString();
        const existingUser = await User.findOne({ email }).select("+verificationCode +verificationCodeValidation");

        if (!existingUser) {
            return res
                .status(401)
                .json({ success: false, message: "User does not exists!" });
        }

        if (existingUser.verified) {
            return res.status(400).json({ success: false, message: "you are already verified!" });
        }

        if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
            return res.status(400).json({ success: false, message: "something wrong with the code!" });
        }

        // check if 5 minutes have passed
        if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
            return res
                .status(400)
                .json({ success: false, message: 'code has expired ' })
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)

        if (hashedCodeValue === existingUser.verificationCode) {
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            const verifiedUser = await existingUser.save();

            return res
                .status(200)
                .json({ success: true, message: 'your account has been verified!', verifiedUser });
        }

        return res
            .status(400)
            .json({ success: false, message: 'unexpected occured!' })

    } catch (error) {
        res.status(400).json({
            success: false, message: error.message,
        });
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { error, value } = signinSchema.validate({ email, password });
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email }).select('+password');

        if (!existingUser) {
            return res
                .status(401)
                .json({ success: false, message: "User does not exists!" });
        }

        const result = await hashValidation(password, existingUser.password);
        if (!result) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials!" });
        }

        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified,
                role: existingUser.role
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '8hr'
            }
        );

        res.cookie(
            'Authorization', 'Bearer ' + token,
            {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production'
            }
        )
            .status(201).json({
                success: true,
                token,
                message: 'Logged in successfully'
            })


    } catch (error) {
        res.status(400).json({
            success: false, message: error.message,
        });
    }
}

export const signout = async (req, res) => {
    res
        .clearCookie('Authorization')
        .status(200)
        .json({ success: true, message: 'logged out successfully' });
}

export const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    try {
        const { error, value } = passwordResetSchema.validate({ email, newPassword, confirmPassword });

        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res
                .status(401)
                .json({ success: false, message: "User does not exists!" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(401).json({ success: false, message: "passwords do not match" });
        }

        const hashedPassword = await hashPass(newPassword, 12);
        const codeValue = Math.floor(Math.random() * 1000000).toString();
        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

        let info = await transport.sendMail({
            from: process.env.SENDER_EMAIL_ADDRESS,
            to: email,
            subject: "Activation Code",
            html: '<h1>' + codeValue + '</h1>'
        })

        if (info.accepted[0] === email) {
            existingUser.password = hashedPassword;
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verified = false;
            existingUser.verificationCodeValidation = Date.now();

            const updatedUser = await existingUser.save();

            return res.status(201).json({ success: true, message: "verification code has been sent to your email", updatedUser });
        }

        return res.status(400).json({ success: false, message: 'password reset failed' });

    } catch (error) {
        res.status(400).json({
            success: false, message: error.message,
        });
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { error, value } = signinSchema.validate({ email, password });
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email });
        const existingPassword = await hashValidation(password, existingUser.password);

        if (!existingUser || !existingPassword) {
            return res
                .status(401)
                .json({ success: false, message: "User does not exists!" });
        }

        const deletedUser = await User.findOneAndDelete({email})
        return res.status(200).clearCookie('Authorization').json({ success: true, message: 'account deleted successfully', deletedUser });
        
    } catch (error) {
        res.status(400).json({success: false, message: error.message });
    }
}