const { StatusCodes } = require('http-status-codes');
const path = require('path');

// To upload files from form we use:
// - native HTML capabilities of uploading a file via form;
// - 3rd party package by the name "express-fileupload" (it parses a file
// and attaches it to req.files["form input name"]).
const uploadProductImage = async (req, res) => {
  // here we can get access to uploaded file:
  const productImage = req.files.image;
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
