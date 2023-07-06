const Cars = require("../Model/Cars");
const Brands = require("../Model/Brand");
const cloudinary = require("../Middleware/Cloudinary");
const fs = require("fs"); 
const getImageIdFromSecureUrl = require("../Helpers/getImageIdFromSecureUrl");
const mongoose = require("mongoose");
const {escapeRegExp} = require("../Helpers/escapeRegExp")

const carController = {
    async getCars(req, res){
      const page = req.query.page || null;
      const limit = req.query.limit || null;
      const filter = req.query.filter || null;
      let filterQuery = {};
      if (filter) {
        const escapedFilter = escapeRegExp(filter);
        const filterPattern = new RegExp(`^${escapedFilter}`, 'i');
        filterQuery = { name: { $regex: filterPattern } };
      } 
      try{     
          const cars = await Cars.find(filterQuery).limit(limit).skip(limit*(page-1)).sort({name: 1});
          return res.status(200).json({success: true, data: cars}); 
      }catch(error){
        console.error(error);
        return res.status(500).json({error: "Lỗi phía server"});
      }
    },
    async getTotalCar(req, res){
      try {
        const totalCar = await Cars.aggregate([
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0, count: 1 } }
        ]);
        return res.status(200).json({success: true, totalCar});
      } catch (error) {
        return res.status(500).json({error: "Server error"});
      }
    },
    

    async getCarById(req, res){
      const _id = req.params.id;      
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: "Không tồn tại car ID" });
      }
      try{
        const car = await Cars.findOne({_id});
        return res.json(car);
      }
      catch(error){
        console.error(error);
        return res.json({error: " Lỗi server"});
      }
    },
    
    async getCarsByBrand(req, res){
      const brand = req.params.brand;
      try {    
        const cars = await Cars.find({ brand });
        return res.status(200).json(cars);
      } catch (error) {
        error
        return res.status(500).json({ error: "Lỗi phía server" });
      }
    },

    async getCarsByName(req, res) {
      try {
        const name = req.params.name;
        const cars = await Cars.find({ name });
        res.status(200).json({ success: true, cars });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
      }
    },

    async createCar(req, res) {
      const carInfo = req.body;
      try{
        const brand = await Brands.findOne({brand: carInfo.brand});

        if(!brand){
          return res.status(404).json({error: "Không tồn tại hãng xe này"})
        }
        
        const newCar = new Cars({
          brand: carInfo.brand,
          classification: carInfo.classification,
          name: carInfo.name,
          model: carInfo.model,
          year: carInfo.year,
          discount: carInfo.discount,
          price: carInfo.price,
          description: {
            engine: carInfo.engine,
            transmission: carInfo.transmission,
            fuelType: carInfo.fuelType,
            color: carInfo.color,
            seats: carInfo.seats,
            dimensions:{
              length: carInfo.length,
              width: carInfo.width,
              height: carInfo.height
            },
            wheelbase: carInfo.wheelbase,
            engineSpecs:{
              engineType: carInfo.engineType,
              displacement: carInfo.displacement,
              maxPower: carInfo.maxPower,
              maxTorque: carInfo.maxTorque
            },
            driveType: carInfo.driveType,
            acceleration: carInfo.acceleration,
            topSpeed: carInfo.topSpeed
          },
          quantity: carInfo.quantity
        });
    
        await newCar.save();

        return res.json(newCar);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Lỗi phía server" });
      }
    },

    async updateCar(req, res) {
      const carId = req.params.id;
      const updateData = req.body;
      console.log(carId);
    
      try {
        const car = await Cars.findById(carId);
        if (!car) {
          return res.status(404).json({ error: 'Xe không tồn tại' });
        }
    
        Object.assign(car, updateData);

        await car.save();
    
        res.status(200).json({ success: 'Thông tin xe đã được cập nhật' });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Lỗi trong quá trình cập nhật thông tin xe' });
      }
    },    

    async uploadCarImages(req, res){
      const _id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: "Không tồn tại car ID" });
      }
      try {
        const car = await Cars.findById(_id);

        const uploadCarImgs = req.files;
        const imgsUploadedCloudinary = [];
        for (const img of uploadCarImgs) {
          const cloudinaryUploadResult = await cloudinary.uploader.upload(img.path);
          fs.unlinkSync(img.path);
          imgsUploadedCloudinary.push(cloudinaryUploadResult.secure_url);
        }

        const mergedImages = car.images.concat(imgsUploadedCloudinary);

        await car.updateOne({images:mergedImages });

        return res.status(200).json({success: "Thêm ảnh thành công"});

      }catch(error){
          console.error(error);
          return res.status(500).json({error: "Lỗi server"});
      }
    },

    async deleteCarById(req, res){
      const _id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: "Không tồn tại car ID" });
      }
      try{
        const deletedCar = await Cars.findByIdAndDelete(_id);
        for(const urlImgs of deletedCar.images){
          const publicId = getImageIdFromSecureUrl(urlImgs);
          await cloudinary.uploader.destroy(publicId);
        }

        // Cập nhật carId trong các bảng tham chiếu đến bảng Car

        return res.status(200).json({success: deletedCar});
      }catch(error){
        return res.status(500).json({error: "Lỗi trong quá trình xử lí phía server"});
      }
    },

    async deleteCarImage(req, res){
      const carId = req.params.id;
      const imageId = req.params.imageId;
      console.log(carId, imageId)
      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({ error: "carID không hợp lệ" });
      }
      try {
        const car = await Cars.findById(carId);

        if(!car){
          return res.status(404).json({error: "Không tồn tại xe này"});
        }

        for(const imageUrl of car.images){
          const publicId = getImageIdFromSecureUrl(imageUrl);
          if(imageId === publicId){
            await cloudinary.uploader.destroy(publicId);
          }
        }

        // Xóa ảnh trong DB
        car.images = car.images.filter(imageUrl => {
          const publicId = getImageIdFromSecureUrl(imageUrl);
          return publicId !== imageId;
        });
        await car.save();
        
        return res.status(200).json({success: true, message: "Xóa ảnh thành công"});
      } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Lỗi server"});
      }
    },
}

module.exports = carController;