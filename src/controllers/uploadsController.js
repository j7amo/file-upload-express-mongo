const { StatusCodes } = require('http-status-codes');
const path = require('path');
const CustomError = require('../errors/index');

// To upload files from form we use:
// - native HTML capabilities of uploading a file via form;
// - 3rd party package by the name "express-fileupload" (it parses a file
// and attaches it to req.files["form input name"]).
const uploadProductImage = async (req, res) => {
  // we need to make some additional CHECKS before uploading a file:
  // 1) check if we have a file to upload (there is a chance that user did not
  // select the file before submitting the form)
  if (!req.files) {
    throw new CustomError.BadRequestError('No file uploaded');
  }
  // here we can get access to uploaded file:
  const productImage = req.files.image;

  // 2) check if "mimetype" is correct (is user trying to upload an image?)
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload image');
  }

  // 3) check size of image file (so that user cannot upload some very big file
  // and possibly make our app crash)
  if (productImage.size > 1000000) {
    throw new CustomError.BadRequestError(
      'Image size cannot be bigger than 1MB',
    );
  }

  // then we create a path to a PUBLICLY AVAILABLE folder to move uploaded file to
  const uploadedFilePath = path.join(
    __dirname,
    `../../public/uploads/${productImage.name}`,
  );
  // physically move file(uploaded bytes) to folder:
  await productImage.mv(uploadedFilePath);

  res
    .status(StatusCodes.OK)
    // send back object with the structure that is expected by client
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

module.exports = uploadProductImage;
