const { StatusCodes } = require('http-status-codes');

const uploadProductImage = async (req, res) => {
  res.status(StatusCodes.OK).send('Image uploaded');
};

module.exports = uploadProductImage;
