// ============================== This file for entry point of app and middlewares =========

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
dotenv.config({ path: '.env' });
const app = express();

// Import routes
import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';
import orderRouter from './routes/order.route.js';
import addressRouter from './routes/address.route.js';
import reviewRouter from './routes/review.route.js';
import paymentRouter from './routes/payment.route.js';
import whishlistRouter from './routes/whishlist.route.js';



app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
// app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false
}))

// Set up routes

app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/category', categoryRouter)
app.use('/order', orderRouter)
app.use('/address', addressRouter)
app.use('/review', reviewRouter)
app.use('/order', orderRouter)
app.use('/payment', paymentRouter)
app.use('/whishlist', whishlistRouter)




export { app };
