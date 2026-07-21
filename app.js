import express from "express";

import authRoutes from "./src/modules/auth/route.js";
import userRoutes from "./src/modules/users/route.js";
import productRoutes from "./src/modules/product/route.js";
import cartRoutes from "./src/modules/cart/route.js";
import categoryRoutes from "./src/modules/categories/route.js";
import subcategoryRoutes from "./src/modules/subcategories/route.js";
import sellerRoutes from "./src/modules/sellers/route.js";
import productReviewRoutes from "./src/modules/productReview/route.js";
import sellerReviewRoutes from "./src/modules/sellerReview/route.js";
import orderRoutes from "./src/modules/orders/route.js";

import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [
        "https://flipcart-vbjl.onrender.com",
        "http://localhost:3000"
    ],
    credentials: true
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subcategoryRoutes);
app.use("/api/v1/sellers", sellerRoutes);
app.use("/api/v1/product-reviews", productReviewRoutes);
app.use("/api/v1/seller-reviews", sellerReviewRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use(errorHandler);

export { app };