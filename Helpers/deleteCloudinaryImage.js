const getImageIdFromSecureUrl = require('./getImageIdFromSecureUrl');
const cloudinary = require('../Middleware/Cloudinary');

const deleteCloudinaryImage = async (url) => {
  const publicId = getImageIdFromSecureUrl(url);
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  deleteCloudinaryImage,
};
