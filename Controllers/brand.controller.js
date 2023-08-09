const Brands = require('../Model/Brand');
const cloudinary = require('../Middleware/Cloudinary');
const Cars = require('../Model/Cars');
const { escapeRegExp } = require('../Helpers/escapeRegExp');
const getImageIdFromSecureUrl = require('../Helpers/getImageIdFromSecureUrl');
const { deleteCloudinaryImage } = require('../Helpers/deleteCloudinaryImage');
const brandController = {
  async getBrands(req, res) {
    const query = req.query.brand || null;
    const limit = req.query.limit || null;
    const page = req.query.page || null;
    let filterQuery = {};
    if (query) {
      const escapedFilter = escapeRegExp(query);
      const filterPattern = new RegExp(`^${escapedFilter}`, 'i');
      filterQuery = { brand: { $regex: filterPattern } };
    }
    try {
      const brands = await Brands.find(filterQuery)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ brand: -1 });
      return res.status(200).json({ success: true, brands });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi xảy ra trong quá trình xử lý' });
    }
  },

  async getTotalBrands(req, res) {
    try {
      const totalBrand = await Brands.aggregate([{ $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0, count: 1 } }]);
      return res.status(200).json(totalBrand);
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi xảy ra trong quá trình xử lý' });
    }
  },

  async createBrand(req, res) {
    const { brand, country } = req.body;
    try {
      const existedBrand = await Brands.findOne({ brand });
      if (existedBrand) {
        await cloudinary.uploader.destroy(getImageIdFromSecureUrl(req.cloudinary_secure_url));
        return res.status(409).json({ error: 'Đã tồn tại hãng xe này' });
      }
      const newBrand = new Brands({
        brand,
        country,
        image: req.cloudinary_secure_url,
      });
      await newBrand.save();
      return res.status(201).json({ success: true, newBrand });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi xảy ra trong quá trình xử lý' });
    }
  },

  async createColorsBrand(req, res) {
    const _id = req.params.id;
    const { newColorName } = req.body;

    try {
      const Brand = await Brands.findById(_id);

      if (!Brand) {
        await cloudinary.uploader.destroy(getImageIdFromSecureUrl(req.cloudinary_secure_url));
        return res.status(404).json({ error: 'Không tồn tại hãng xe này' });
      }

      Brand.colors = [...Brand.colors, { name: newColorName, color: req.cloudinary_secure_url }];

      await Brand.save();

      return res.status(200).json({ success: true, newColor: { name: newColorName, color: req.cloudinary_secure_url } });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi xảy ra trong quá trình xử lý' });
    }
  },

  async deleteBrandById(req, res) {
    const _id = req.params.id;
    try {
      // Xóa bảng màu trên cloud
      const brand = await Brands.findByIdAndDelete(_id);
      for (let i = 0; i < brand.colors.length; i++) {
        await deleteCloudinaryImage(brand.colors[i].color);
      }
      // Xóa logo trên cloud
      await deleteCloudinaryImage(brand.image);

      const cars = await Cars.find({ brand: brand.brand });
      await Cars.updateMany({ brand: brand.brand }, { $set: { isInBussiness: false } });
      return res.status(204).json({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi xảy ra trong quá trình xử lý' });
    }
  },

  async deleteColorBrand(req, res) {
    const brandId = req.params.id;
    const urlCloudinary = req.body.urlCloudinary;
    try {
      const brand = await Brands.findById(brandId);
      if (!brand) {
        return res.status(404).json({ error: 'Không tồn tại hãng xe' });
      }
      await deleteCloudinaryImage(urlCloudinary);
      brand.colors = brand.colors.filter((brandColor) => brandColor.color !== urlCloudinary);

      await Cars.updateMany({ brand: brand.brand }, { $pull: { 'description.color': { color: urlCloudinary } } });

      console.log(res);
      await brand.save();
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi xảy ra trong quá trình xử lý' });
    }
  },
};

module.exports = brandController;
