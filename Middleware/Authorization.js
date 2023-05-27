
const authorization = (req, res, next) =>{
    if(req.user.role === "admin"){
        next();
    }else{
        res.json("Unauthorization");
    }
}


module.exports = authorization;