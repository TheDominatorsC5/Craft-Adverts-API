import { Router } from "express";
import { identifier } from "../middlewares/identification.js";
import { deleteProduct, getAllProducts, getProductsByCategory, getProductsByPrice, getProductsByTitle, getSingleProduct, getVendorProducts, postImage, postProduct, updateProduct } from "../controllers/product_controller.js";
import { upload } from "../middlewares/uploadImages.js";

export const productRouter = Router();

productRouter.get('/', identifier, getAllProducts);
productRouter.get('/:category', identifier, getProductsByCategory);
productRouter.get('/product/:productId', identifier, getSingleProduct);
productRouter.get('/filter-title/:title', identifier, getProductsByTitle);
productRouter.get('/filter-price/:price', identifier, getProductsByPrice);
productRouter.get('/vendor/:vendorId', identifier, getVendorProducts);
productRouter.post('/add', identifier,  postProduct);
productRouter.post('/image', identifier, upload.array('image', 5),  postImage);
productRouter.patch('/:productId', identifier, updateProduct);
productRouter.delete('/:productId', identifier, deleteProduct);