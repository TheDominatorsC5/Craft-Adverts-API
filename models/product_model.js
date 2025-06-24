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
        enum: ['Arts & Paintings', 'Accessories', 'Home Deco', 'Pottery', 'Textiles', 'Wooden Pieces'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
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
            
        ],
       
    }
});

productSchema.plugin(normalize);

export const Product = model('Product', productSchema);