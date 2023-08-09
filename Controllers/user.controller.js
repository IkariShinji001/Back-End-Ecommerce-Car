const Users = require('../Model/Users');
const bcrypt = require('bcrypt');
const transporter = require('../EmailManagement/emailConfig');
const uuid = require('uuid');
const getMailOptions = require('../EmailManagement/emailOptions');
const emailTemplates = require('../EmailManagement/emailTemplates');

const UserController = {
  async getAllUsers(req, res) {
    try {
      const users = await Users.find({});
      return res.status(200).json({ success: true, data: users });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server' });
    }
  },

  async getTotalUsers(req, res) {
    try {
      const totalUser = await Users.aggregate([{ $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0, count: 1 } }]);
      return res.status(200).json({ success: true, totalUser: totalUser[0].count });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  },

  async getUserById(req, res) {
    const _id = req.params.id;
    try {
      const user = await Users.findOne({ _id });
      if (user) {
        return res.status(200).json({ success: true, data: user });
      } else {
        return res.status(404).json({ error: 'Không tìm thấy user' });
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async createUser(req, res) {
    try {
      const verificationToken = uuid.v4();
      const registerUserInfor = req.body;
      const userInDB = await Users.findOne({
        username: registerUserInfor.username,
      });
      const hashedPassword = await bcrypt.hash(registerUserInfor.password, 10);
      if (!userInDB) {
        const newUser = new Users({
          username: registerUserInfor.username,
          password: hashedPassword,
          email: registerUserInfor.email,
          firstName: registerUserInfor.firstName,
          lastName: registerUserInfor.lastName,
          phoneNumber: registerUserInfor.phoneNumber,
          verificationToken: verificationToken,
          role: 'user',
        });
        await newUser.save();

        const verificationLink = `http://localhost:3000/api/auth/verify?token=${verificationToken}`;

        const mailOptions = getMailOptions(
          process.env.EMAIL_USERNAME,
          registerUserInfor.email,
          'Xác thực Email đăng ký tài khoản',
          emailTemplates.vefifyTemplateMail(registerUserInfor.username, verificationLink)
        );

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: 'Tạo người dùng thành công' });
      } else {
        return res.status(409).json({ error: 'Existed Account' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi server' });
    }
  },

  async updateUserInforById(req, res) {
    const _id = req.params.id;
    const updatedData = req.body;
    if (updatedData.hasOwnProperty('username') || updatedData.hasOwnProperty('password') || updatedData.hasOwnProperty('role')) {
      return res.status(400).json({
        error: 'Không được phép cập nhật username hoặc password hoặc role',
      });
    }
    try {
      const user = await Users.findById(_id);

      if (!user) {
        return res.status(404).json({ error: 'Không tìm thấy user' });
      }
      // Gộp 2 object lại
      Object.assign(user, updatedData);

      await user.save();

      return res.status(200).json({ success: true, message: 'Thay đổi thông tin thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi server' });
    }
  },

  async deleteUserById(req, res) {
    try {
      const id = req.params.id;
      await Users.deleteOne({ _id: id });
      return res.status(200).json({ success: true, message: 'Xóa người dùng thành công' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async changePasswordById(req, res) {
    const _id = req.params.id;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    try {
      const user = await Users.findById(_id);
      if (!user) {
        return res.status(404).json({ error: 'Không tìm thấy user' });
      }
      const isMatchPassword = await bcrypt.compare(currentPassword, user.password);
      if (isMatchPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ success: true, message: 'Thay đổi mật khẩu thành công' });
      } else {
        console.log('no');
        return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi server' });
    }
  },
};

module.exports = UserController;
