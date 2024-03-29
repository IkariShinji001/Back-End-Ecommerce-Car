const Users = require('../Model/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../EmailManagement/emailConfig');
const getMailOptions = require('../EmailManagement/emailOptions');
const emailTemplates = require('../EmailManagement/emailTemplates');
const { v4: uuidv4 } = require('uuid');

const authController = {
  async login(req, res) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const userInDB = await Users.findOne({ username: username });
      if (userInDB) {
        if (!userInDB.isVerified) {
          return res.status(401).json({ error: 'Chưa xác thực email' });
        }
        const isMatchPassword = await bcrypt.compare(password, userInDB.password);
        if (isMatchPassword) {
          const accessToken = jwt.sign({ username, role: userInDB.role, _id: userInDB._id.toString() }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
          });
          const refreshToken = jwt.sign({ id: uuidv4() }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d',
          });
          res.cookie('access_token', accessToken, { httpOnly: true });
          res.cookie('refresh_token', refreshToken, { httpOnly: true });
          return res.status(200).json({ success: true, accessToken });
        } else {
          return res.status(400).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
        }
      } else {
        return res.status(400).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },
  async logout(req, res) {
    try {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi phía server' });
    }
  },
  async verifyTokenMail(req, res) {
    try {
      const verificationToken = req.query.token;
      const user = await Users.findOne({
        verificationToken: verificationToken,
      });
      if (!user) {
        return res.status(404).json({ error: 'Liên kết xác thực không hợp lệ.' });
      }
      user.isVerified = true;
      user.verificationToken = new Date();
      await user.save();
      res.json('Xác thực thành công. Bạn có thể đăng nhập vào ứng dụng.');
    } catch (error) {
      console.log(user);
      return res.status(500).json({ error });
    }
  },

  async forgotPassword(req, res) {
    try {
      const userEmail = req.body.email;
      const user = await Users.findOne({ email: userEmail });
      if (user) {
        const payload = {
          username: user.username,
          resetPassword: true,
        };
        const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY);
        const verifyLink = `http://localhost:3000/api/auth/reset-password?token=${token}`;
        const mailOption = getMailOptions(
          process.env.EMAIL_USERNAME,
          userEmail,
          'Quên mật khẩu',
          emailTemplates.forgotPasswordTemplate(user.username, verifyLink)
        );
        await transporter.sendMail(mailOption);
        return res.status(200).json({ success: token });
      } else {
        return res.status(404).json({ error: 'Không tồn tại email' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  async resetPassword(req, res) {
    const newPassword = req.body.newPassword;
    const token = req.body.token;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!decodedToken.resetPassword) {
        return res.status(400).json({ error: 'Token không hợp lệ' });
      }

      const user = await Users.findOne({ username: decodedToken.username });

      if (!user) {
        return res.status(404).json({ error: 'Không tồn tại người dùng' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ success: 'Đổi mật khẩu thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi server' });
    }
  },
  async verifyRefreshToken(req, res) {
    const refreshToken = req.cookies.refresh_token;
    const oldAccessToken = req.cookies.access_token;
    const decodedToken = jwt.decode(oldAccessToken);
    try {
      if (!refreshToken) {
        return res.status(401).json({ error: 'Không tìm thấy refresh token' });
      }
      const isVerified = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
      if (isVerified) {
        const accessToken = jwt.sign(
          {
            username: decodedToken.username,
            role: decodedToken.role,
            _id: decodedToken._id,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '1h' }
        );
        res.cookie('access_token', accessToken);
        return res.status(201).json({ success: true });
      } else {
        return res.status(401).json({ error: 'Refresh token không hợp lệ' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Server lỗi' });
    }
  },
  async verifyAccessToken(req, res) {
    const accessToken = req.cookies.access_token;
    try {
      const isVerified = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      if (isVerified) {
        return res.status(200).json({ success: true });
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token Expired' });
      } else {
        console.log(error);
        return res.status(500).json({ error: 'Invalid Token' });
      }
    }
  },
};

module.exports = authController;
