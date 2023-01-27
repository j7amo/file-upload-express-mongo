const { StatusCodes } = require('http-status-codes');
const Product = require('../models/Product');

const createProduct = async (req, res) => {
  res.status(StatusCodes.OK).send('Product created');
};

const getAllProducts = async (req, res) => {
  res.status(StatusCodes.OK).send('Products');
};

module.exports = {
  createProduct,
  getAllProducts,
};
