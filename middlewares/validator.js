import Joi from "joi";

export const signupSchema = Joi.object({
    firstName: Joi.string().required(),

    lastName: Joi.string().required(),

    email: Joi.string()
            .min(6)
            .max(60)
            .required()
            .email({
                tlds: { allow: ['com', 'net'] }
             }),

    password: Joi.string()
                .required()
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$')),

    confirmPassword: Joi.string()
                .required()
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$')),
    
    role: Joi.string().required(),
});

export const signinSchema = Joi.object({
    email: Joi.string()
            .min(6)
            .max(60)
            .required()
            .email({
                tlds: { allow: ['com', 'net'] }
             }),
    password: Joi.string()
                .required()
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$'))
});

export const passwordResetSchema = Joi.object({
    email: Joi.string()
            .min(6)
            .max(60)
            .required()
            .email({
                tlds: { allow: ['com', 'net'] }
             }),

    newPassword: Joi.string()
                .required()
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$')),

    confirmPassword: Joi.string()
                .required()
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$')),
});

export const acceptCodeSchema = Joi.object({
    email: Joi.string()
            .min(6)
            .max(60)
            .required()
            .email({
                tlds: { allow: ['com', 'net'] }
             }),
    verificationCode: Joi.number().required()
});

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  public_id: Joi.string().required()
});

export const productSchema = Joi.object({
    productName: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    images: Joi.array().items(imageSchema).min(1).required()
});

export const updateProductSchema = Joi.object({
    productName: Joi.string(),
    category: Joi.string(),
    price: Joi.number(),
    description: Joi.string(),
    status: Joi.string().valid('available', 'unavailable'),
    images: Joi.array().items(imageSchema).min(1)
});