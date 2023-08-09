const cloudinary = require('./Cloudinary');
const fs = require('fs');

const uploadSingleImageCoudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.json({ error: 'Không tồn tại file' });
    }
    const { path } = req.file;
    const resultImageUpload = await cloudinary.uploader.upload(path);
    fs.unlinkSync(path);
    req.cloudinary_secure_url = resultImageUpload.secure_url;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ error: 'Lỗi xảy ra trong quá trình upload' });
  }
};

const uploadBrandImageCloudinary = async (req, res, next) => {
  try {
    if (!req.file && !req.files) {
      return res.json({ error: 'Không tồn tại file' });
    }

    // Upload ảnh logo của hãng
    const { path } = req.files['logoBrand'][0];
    const resultLogoImageUpload = await cloudinary.uploader.upload(path);
    req.logoBrandImage = resultLogoImageUpload.secure_url;
    fs.unlinkSync(path);

    // Upload ảnh các màu của hãng
    const colors = req.files['colors'];
    const colorsUploaded = [];
    for (let i = 0; i < colors.length; i++) {
      const resultColorImageUpload = await cloudinary.uploader.upload(colors[i].path);
      colorsUploaded.push(resultColorImageUpload.secure_url);
      fs.unlinkSync(colors[i].path);
    }
    req.colorsImage = colorsUploaded;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ error: 'Lỗi xảy ra trong quá trình upload' });
  }
};

module.exports = {
  uploadSingleImageCoudinary,
  uploadBrandImageCloudinary,
};
