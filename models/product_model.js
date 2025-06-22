import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose"

const productSchema = new Schema({
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available',
    },
    images: {
        type: [
            {
            url: {
            type: String,
            required: true
            },
            public_id: {
            type: String,
            required: true
            }
            }
        ],
        required: true
    }
});

productSchema.plugin(normalize);

export const Product = model('Product', productSchema);