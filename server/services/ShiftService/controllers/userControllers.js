const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
      const { name, email, username, password } = req.body;
  
      if (!name || !email || !username || !password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
      }
  
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(409).json({ error: 'Email hoặc tên đăng nhập đã tồn tại.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        username,
        password: hashedPassword,
        role: 'manager', 
      });
  
      await newUser.save();
      res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi server khi đăng ký' });
    }
};

exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Kiểm tra đầu vào
      if (!username || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' });
      }
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'Người dùng không tồn tại.' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Sai mật khẩu.' });
      }
  
      // Tạo JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        'your_jwt_secret_key', // => hãy để vào biến môi trường .env nếu cần
        { expiresIn: '1h' }
      );
  
      res.status(200).json({
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi server khi đăng nhập.' });
    }
};
