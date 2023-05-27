const Cars = require("../Model/Cars");
const cloudinary = require("../Middleware/Cloudinary");
const fs = require("fs"); 

const carController = {
    async getAllCar(req, res){
        const cars = await Cars.find({});
        return res.status(200).json(cars);
    },

    async getOneCar(req, res){
      const _id = req.params.id;
      console.log(_id);
      try{
        const car = await Cars.findOne({_id});
        return res.json(car);
      }
      catch(err){
        return res.json({error: "Wrong id or " + err});
      }
       
    },
    async  createCar(req, res) {
      const carInfo = req.body;
      const imgs = req.files;
      const imgsUploadedCloudinary = [];
      try{
        // Tải lên ảnh lên Cloudinary và chờ cho tất cả hoàn thành
        await Promise.all(
          imgs.map(async (img) => {
            const cloudinaryUploadResult = await cloudinary.uploader.upload(img.path);
            imgsUploadedCloudinary.push(cloudinaryUploadResult);
          })
        );
        const secure_urlImg = [];
        imgsUploadedCloudinary.forEach(img => {
          secure_urlImg.push(img.secure_url);
        })
    
        const newCar = new Cars({
          make: carInfo.make,
          model: carInfo.model,
          year: carInfo.year,
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
          images: secure_urlImg
        });
    
        await newCar.save();
        for(const img of imgs){
          fs.unlinkSync(img.path);
        }
        return res.json(newCar);
      } catch (err) {
        for(const img of imgs){
          fs.unlinkSync(img.path);
        }
        for(const img of imgsUploadedCloudinary){
          cloudinary.uploader.destroy(img.public_id, function(error, result) {
            if (error) {
              console.log('Lỗi xảy ra:', error);
            } else {
              console.log('Kết quả:', result);
            }
          });
        }
        return res.json({ err: err });
      }
    },
    async deleteCar(req, res){
      const _id = req.params.id;
      try{
        const deletedCar = await Cars.findByIdAndDelete(_id);
        for(const urlImgs of deletedCar.images){
          const publicId = urlImgs.substring(urlImgs.lastIndexOf('/') + 1, urlImgs.lastIndexOf('.'));
          await cloudinary.uploader.destroy(publicId);
        }
        return res.status(200).json(deletedCar);
      }catch(error){
        return res.json({error});
      }
    }
}

module.exports = carController;