const Sales = require("../Model/Sales");
const splitDate = require("../Helpers/splitDate");
const moment = require("moment-timezone");

const salesController = {
    async createSale(req, res){
        const {userId, carId, salePrice, date} = req.body;
        const iosDate =  moment.tz(date, 'YYYY-MM-DD').tz('Asia/Ho_Chi_Minh').format();
        const {day, month, year} = splitDate(date);
        try{
            const newSale = await Sales({
                userId,
                carId,
                salePrice,
                day,
                month,
                year,
                date: iosDate
            });
            await newSale.save();
    
            return res.status(201).json({success: true, data: newSale});
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo mới bản ghi Sale.' });
        }
    },

    async getUserPurchasedCars(req, res){
        const userId = req.params.id;
        try {
          const sales = await Sales.find({ userId }).populate('carId');
      
          const purchasedCars = sales.map(sale => {
            return {
              carId: sale.carId._id,
              brand: sale.carId.brand,
              model: sale.carId.model,
              classification: sale.carId.classification,
              salePrice: sale.price
            };
          });
      
          res.status(200).json({success: true, purchasedCars});
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
        }
      },

      async updateSale(req, res){
        const saleId = req.params.id;
        const updateData = req.body;
        try {
          const sale = await Sales.findOne({_id:saleId });
          if(!sale){
            return res.status(404).json({error: "Không tồn tại bảng ghi sale"});
          }
        
          Object.assign(sale, updateData);
          await sale.save();

          res.status(200).json({success: true, sale});
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật dữ liệu.' });
        }
      },

      async deleteSale(req, res){
        const saleId = req.params.id;
        const updateData = req.body;
        try {
          const sale = await Sales.findOneAndDelete({_id:saleId });
          if(!sale){
            return res.status(404).json({error: "Không tồn tại bảng ghi sale"});
          }
          res.status(200).json({success: true, sale});
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật dữ liệu.' });
        }
      },

      async getProfitByMonth(req, res){
        try {
          const sales = await Sales.aggregate([
            {
              // Join bảng sale với bảng car
              $lookup: {
                from: 'cars',
                localField: 'carId',
                foreignField: '_id',
                as: 'car'
              }
            },
            {
              // tách mảng thành từng element
              $unwind: '$car'
            },
            {
              $group: {
                _id: { month: '$month', year: '$year' },
                totalProfit: { $sum: { $subtract: ['$salePrice', '$car.price'] } }
              }
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 }
            }
          ]);
          const labels = [];
          const data = [];
      
          sales.forEach((sale) => {
            labels.push(`${sale._id.month}/${sale._id.year}`);
            data.push(sale.totalProfit);
          });
      
          res.status(200).json({ labels, data });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
        }
      },

      async getCarsSoldByMonth(req, res) {
        try {
          const sales = await Sales.aggregate([
            {
              $group: {
                _id: { month: '$month', year: '$year' },
                totalCarsSold: { $sum: 1 }
              }
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 }
            }
          ]);
      
          const labels = [];
          const data = [];
      
          sales.forEach((sale) => {
            labels.push(`${sale._id.month}/${sale._id.year}`);
            data.push(sale.totalCarsSold);
          });
      
          res.json({ labels, data });
        } catch (err) {
           res.json(err);
        }
      },
      async getTotalCarsSold(req, res) {
        try {
          const sales = await Sales.aggregate([
            {
              $lookup: {
                from: 'cars',
                localField: 'carId',
                foreignField: '_id',
                as: 'car'
              }
            },
            {
              $group: {
                _id: { name:'$car.name', model: '$car.model'},
                totalCarsSold: { $sum: 1 }
              }
            },
            {
              $sort: { '_id.name': 1 }
            }
          ]);
      
          res.json(sales);
        } catch (err) {
          console.log(err);
          res.json(err);
        }
      }
      
      
}

module.exports = salesController;