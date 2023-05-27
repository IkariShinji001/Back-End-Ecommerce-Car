const Deposit = require("../Model/Deposit");


const transactionController = {
    async getAllDeposit(req, res){
        const allDeposit = await Deposit.find({})
                                        .populate('userId')
                                        .populate('carId');
        return res.json(allDeposit);
    }
}

module.exports = transactionController;