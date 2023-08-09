const cloudinary = require('./Cloudinary');
const fs = require('fs');

const uploadImage = {
  async uploadSingleImageCoudinary(req, res, next) {
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
  },
};

module.exports = uploadImage;
