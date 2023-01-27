const cloudinary = require('cloudinary').v2;
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');
const CustomError = require('../errors/index');

// To upload files from form we use:
// - native HTML capabilities of uploading a file via form;
// - 3rd party package by the name "express-fileupload" (it parses a file
// and attaches it to req.files["form input name"]).
// eslint-disable-next-line no-unused-vars
const uploadProductImageLocal = async (req, res) => {
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

// we want to try something different and switch to Cloudinary(which is a cloud for media)
const uploadProductImage = async (req, res) => {
  // we use Cloudinary API
  const result = await cloudinary.uploader.upload(
    // get the filePath which is provided by "express-fileupload" package
    req.files.image.tempFilePath,
    {
      use_filename: true,
      // specify the folder on Cloudinary cloud
      folder: 'file-upload',
    },
  );
  // remove the file from the TMP folder on our server (we don't need the file
  // here anymore because it is hosted now on Cloudinary)
  fs.unlinkSync(req.files.image.tempFilePath);

  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = uploadProductImage;
