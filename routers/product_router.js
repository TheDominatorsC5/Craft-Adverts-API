import { Router } from "express";
import { identifier } from "../middlewares/identification.js";
import { deleteProduct, getAllProducts, getProductsByCategory, getProductsByPrice, getProductsByTitle, getSingleProduct, getVendorProducts, postImage, postProduct, updateProduct } from "../controllers/product_controller.js";
import { upload } from "../middlewares/uploadImages.js";

export const productRouter = Router();

productRouter.get('/', getAllProducts);
// productRouter.get('/:category', identifier, getProductsByCategory);
productRouter.get('/product/:productId', getSingleProduct);
// productRouter.get('/filter-title/:title', identifier, getProductsByTitle);
productRouter.get('/search', getProductsByPrice);
productRouter.get('/vendor/:vendorId', identifier, getVendorProducts);
productRouter.post('/create', identifier, upload.array('image', 5),  postProduct);
productRouter.patch('/edit/:productId', identifier, upload.array('image', 5), updateProduct);
productRouter.delete('/:productId', identifier, deleteProduct);