require('dotenv').config();
require('express-async-errors');
const path = require('path');
const express = require('express');
// use cloudinary v2
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const fileUpload = require('express-fileupload');

const app = express();

// database
const connectDB = require('./db/connect');
const productRouter = require('./routes/productRoutes');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.json());
// we add options object with "useTempFiles" set to "true" in order to
// store all uploaded files in TMP folder
app.use(fileUpload({ useTempFiles: true }));
app.use('/api/v1/products', productRouter);

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
