import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRouter } from "./routers/auth_router.js";
import { productRouter } from "./routers/product_router.js";

const app = express();
const port = process.env.PORT || 8088;
const mongo_uri = process.env.MONGO_URI

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/adverts', authRouter);
app.use('/api/adverts/products', productRouter);

mongoose.connect(mongo_uri)
.then(() => {
    console.log("Database is connected");
    app.listen(port, () => {
        console.log(`Server is live on ${port}`);
    });
})
.catch(() => {
    console.log("Database not connected")
})