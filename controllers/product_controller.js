import { productSchema, updateProductSchema } from "../middlewares/validator.js";
import { Product } from "../models/product_model.js";

export const getVendorProducts = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const allProducts = await Product.find({vendorId});
        
        if (allProducts.length <= 0) {
            return res.status(401).json({ success: false, message: 'no product found' });
        }  
        
        res.status(200).json(allProducts);
        
    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}

export const getSingleProduct = async (req, res) => {
    try {
        const {productId} = req.params;
    
        const foundProduct = await Product.findById(productId);
        if (!foundProduct) {
            return res.status(400).json({success: false, message: 'product not found'});
        }
    
        res.status(200).json({success: true, product: foundProduct});
    } catch (error) {
        return res.status(400).json({success: false, message: 'product not found'});
    }
}

export const postProduct = async (req, res) => {
    try {
        
        const { productName, category, price, description, quantity } = req.body;
    
        const { error, value } = productSchema.validate({ productName, category, price, description, quantity });
    
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }
      

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'no images uploaded.' });
        }

        const uploaded = req.files.map(file => ({
            url: file.path,
            id: file.filename
        }));
    
        const product = new Product({
            vendorId: req.user.userId,
            productName,
            category,
            price,
            quantity,
            description,
            images: uploaded
        })
    
        const newProduct = await product.save();
        res.status(201).json({success: true, message: 'product created', product: newProduct});

    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}

export const postImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No images uploaded.' });
        }

        const uploaded = req.files.map(file => ({
            url: file.path,
            id: file.filename
        }));

        return res.status(200).json({ success: true, images: uploaded });
        
    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const vendorId = req.user.userId

        const { error, value } = updateProductSchema.validate(req.body);

        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }

        const foundProduct = await Product.findById(productId);
        if (!foundProduct) {
            return res.status(401).json({success: false, message: "product not found"});
        }
        
        if(String(foundProduct.vendorId) !== vendorId) {
            res.status(401).json({success: false, message: "unauthorized"});
            return;
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'no images uploaded.' });
        }

        const uploaded = req.files.map(file => ({
            url: file.path,
            id: file.filename
        }));

        const edittedProduct = {
            ...value,
            images: uploaded
        }

        await Product.findByIdAndUpdate(productId, edittedProduct);

        res.status(200).json({success: true, message: 'product updated'});
        
    } catch (error) {
        return res.status(400).json({success:false, message:error.message});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const vendorId = req.user.userId
        
        const foundProduct = await Product.findById(productId);
        if (!foundProduct) {
            return res.status(401).json({success: false, message: "product not found"});
        }

        if(String(foundProduct.vendorId) !== vendorId) {
            res.status(401).json({success: false, message: "unauthorized"});
            return;
        }

        await Product.findByIdAndDelete(productId);

        res.status(200).json({success: true, message: 'product deleted'});
        
    } catch (error) {
        return res.status(400).json({success: false, message:error.message});
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const allProduct = await Product.find();
        res.status(200).json({success: true, products: allProduct});
    } catch (error) {
        return res.status(400).json({success: false, message:error.message});
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const products = await Product.find({category});
        if (products.length <= 0) {
            res.status(400).json({success: false, message: "category not found"});
            return;
        }

        res.status(201).json({'products': products});

    } catch (error) {
        return res.status(400).json({success: false, message:error.message});
    }
}

export const getProductsByTitle = async (req, res) => {
    try {
        const productName = req.params.title;

        const products = await Product.find({productName});
        if (products.length <= 0) {
            res.status(400).json({success: false, message: "product not found"});
            return;
        }

        res.status(201).json({'products': products});

    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const getProductsByPrice = async (req, res) => {
    try {
        const { productName, price, category } = req.query;

        let query = {};

        if (productName) {
            query.productName = productName
        }
        else if (price) {
            query.price = price
        }
        else if (category) {
            query.category = category
        }

        const products = await Product.find(query);
        if (products.length <= 0) {
            res.status(400).json({success: false, message: "product not found"});
            return;
        }

        res.status(201).json({'products': products});

    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}