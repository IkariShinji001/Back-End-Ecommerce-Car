const Brands = require("../Model/Brand");
const cloudinary = require("../Middleware/Cloudinary");
const Cars = require("../Model/Cars");
const fs = require("fs");

const brandController = {
    async getAllBrand(req, res){
        try {
            const brands = await Brands.find({});
            return res.status(200).json({success: true, brands});
        } catch (error) {
            return res.status(500).json({error: "Server error"})
        }
    },

    async getBrandByName(req, res){
        const brandName = req.params.brand;
        try {
            const brand = await Brands.findOne({brand: brandName});
            if(!brand){
                return res.status(404).json({error: "Không tồn tại hãng xe này"});
            }

            return res.status(200).json({success: true, brand});
        } catch (error) {   
            return res.status(500).json({error: "Server error"})
        }
    },

    async createBrand(req, res){
        const {brand} = req.body;
        const brandImage = req.file;
        try{
            const existedBrand = await Brands.findOne({brand});
            if(existedBrand){
               return res.status(409).json({error: "Đã tồn tại hãng xe này"}); 
            }
            const {path} = brandImage;
            const resultBrandImageUpload = await cloudinary.uploader.upload(path);

            const newBrand = new Brands({
                brand,
                image: resultBrandImageUpload.secure_url,
            })

            await newBrand.save();
            fs.unlinkSync(path);

            return res.status(201).json({success:true, newBrand});

        }catch(error){
            console.log(error);
            return res.status(500).json({error: "Server error"});
        }
    
    },

    async updateBrand(req ,res){
        const _id = req.params.id;
        const {newBrand} = req.body;
        const updateImg = req.file;
        
        try {
            const oldBrand = await Brands.findById(_id);
            
            if(!oldBrand){
                return res.status(404).json({error: "Không tồn tại hãng xe này"});
            }

            const existedBrand = await Brands.findOne({brand: newBrand});

            if(existedBrand){
                return res.status(409).json({error: `Đã tồn tại hãng xe ${newBrand}` })
            }
         
            await Cars.updateMany({brand: oldBrand.brand }, {brand: newBrand});

            if(!updateImg){
                oldBrand.brand = newBrand;
                await oldBrand.save();
                return res.status(200).json({success: true, oldBrand});
            }else{
                const resultNewBrandImageUpload = await cloudinary.uploader.upload(updateImg.path);
                oldBrand.brand = newBrand;
                oldBrand.image = resultNewBrandImageUpload.secure_url;
                await oldBrand.save();
                fs.unlinkSync(updateImg.path);
                return res.status(200).json({success: true, oldBrand});

            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({error: "Server error"});
        }
    }

}


module.exports = brandController;