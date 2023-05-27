const Users = require("../Model/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../EmailManagement/emailConfig")
const uuid = require('uuid');
const getMailOptions = require('../EmailManagement/mailOptions');
const emailTemplates = require("../EmailManagement/emailTemplates");



const UserController = {
    async getAllUsers(req, res){
        try{
            const users = await Users.find({});
            return res.json(users);
        }catch(error){
            return res.json({error});
        }
       
    },

    async createUser(req, res){
        try {
            const verificationToken = uuid.v4();
            const registerUserInfor = req.body;
            const userInDB = await Users.findOne({username: registerUserInfor.username});
            const hashedPassword = await bcrypt.hash(registerUserInfor.password, 10);
            if(!userInDB){
                const newUser = new Users({
                    username: registerUserInfor.username,
                    password: hashedPassword,
                    email: registerUserInfor.email,
                    firstName: registerUserInfor.firstName,
                    lastName: registerUserInfor.lastName,
                    phoneNumber: registerUserInfor.phoneNumber,
                    verificationToken: verificationToken,
                    role: "user"
                })
                const result = await newUser.save();
                
                const verificationLink = `http://localhost:3000/api/user/verify?token=${verificationToken}`;

                const mailOptions = getMailOptions(process.env.EMAIL_USERNAME, registerUserInfor.email, 
                'Xác thực Email đăng ký tài khoản', emailTemplates.vefifyTemplateMail(registerUserInfor.username ,verificationLink)
                );

                await transporter.sendMail(mailOptions);
                
                res.status(201).json("Created");
            }else{
                return res.json("Existed Account");
            }
        } catch (error) {
            return res.json({error});
        }
    },
    
    async deleteUser(req, res){
        try {
            const username = req.body.username;
            await Users.deleteOne({username: username})
            return res.json("Deleted");
        } catch (error) {
            console.log(error);
        }
    },

    async login(req, res, next){
        try{
            const username = req.body.username;
            const password = req.body.password;
            const userInDB = await Users.findOne({username: username});
            if(userInDB){
                if(!userInDB.isVerified){
                    return res.json({error: "Chưa xác thực email"});
                }
                const isMatchPassword = await bcrypt.compare(password, userInDB.password);
                if(isMatchPassword){
                    const token = jwt.sign({username, password, role: userInDB.role}, process.env.JWT_SECRET_KEY, {expiresIn: "3h"});
                    return res.status(200).json({token});
                }else{
                    return res.status(401).json({error:"Wrong password"});
                }
            }else{
                return res.status(401).json({error: "Wrong username or password"});
            }
        }catch(error){
             return res.json({error});
        }
     
    },

    async verify(req, res){
        try{
            const verificationToken = req.query.token;
            const user = await Users.findOne({ verificationToken: verificationToken })
            if (!user) {
                return res.status(404).json({error: 'Liên kết xác thực không hợp lệ.'});
            }
            user.isVerified = true;
            user.verificationToken = new Date();
            await user.save();
            res.json('Xác thực thành công. Bạn có thể đăng nhập vào ứng dụng.');
        }catch(error){
            return res.status(500).json({error});
        }  
    }
}


module.exports = UserController;