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
                .min(8)
                .max(50),

    confirmPassword: Joi.string()
                .required()
                .min(8)
                .max(50),
    
    shopName: Joi.string().when('role', {
        is: 'vendor',
        then: Joi.required(),
        otherwise: Joi.optional()
    }),

    shopAddress: Joi.string().when('role', {
        is: 'vendor',
        then: Joi.required(),
        otherwise: Joi.optional()
    }),

    contact: Joi.string().min(10).max(15).when('role', {
        is: 'vendor',
        then: Joi.required(),
        otherwise: Joi.optional()
    })
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
                .min(8)
                .max(50),
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
                .min(8)
                .max(50),

    confirmPassword: Joi.string()
                .required()
                .min(8)
                .max(50),
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
    category: Joi.string().required().valid('Arts & Paintings', 'Accessories', 'Home Deco', 'Pottery', 'Textiles', 'Wooden Pieces'),
    price: Joi.number().required(),
    quantity: Joi.number(),
    description: Joi.string().required(),
    images: Joi.array().min(1)
});

export const updateProductSchema = Joi.object({
    productName: Joi.string(),
    category: Joi.string().valid('Arts & Paintings', 'Accessories', 'Home Deco', 'Pottery', 'Textiles', 'Wooden Pieces'),
    price: Joi.number(),
    quantity: Joi.number(),
    description: Joi.string(),
    // images: Joi.array().items(imageSchema).min(1)
});