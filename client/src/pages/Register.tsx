import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import registerImage from "../assets/register2.jpg"; // Hình ảnh cho trang đăng ký

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", // Thêm trường name
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Kiểm tra xem các trường có để trống không
    if (
      !formData.name ||
      !formData.email ||
      !formData.username ||
      !formData.password
    ) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Giả lập đăng ký thành công cho vai trò manager
    alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
    navigate("/login"); // Chuyển hướng đến trang đăng nhập
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-title-section-menu">
      <div className="w-4/5 h-4/5 bg-white rounded-md shadow-2xl shadow-blue flex">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-8">
          <h1 className="text-black font-bold text-5xl">Đăng ký</h1>
          <h2 className="text-black">Tạo tài khoản mới của bạn</h2>
          <img
            className="w-full overflow-hidden"
            src={registerImage}
            alt="ảnh đăng ký"
          />
        </div>

        <div className="flex-1 flex flex-col gap-4 items-center justify-center">
          <div className="flex flex-col gap-2">
            <img src={logo} className="w-14 h-14" />
            <span className="font-bold">BEST MEALS</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-3/5">
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-black font-semibold">Tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên của bạn"
                  className="rounded-md p-2 w-full border border-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-black font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  className="rounded-md p-2 w-full border border-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-black font-semibold">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  className="rounded-md p-2 w-full border border-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-black font-semibold">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className="rounded-md p-2 w-full border border-gray-300"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-menu-title hover:bg-red-300 cursor-pointer text-black rounded-md p-2 w-full"
            >
              ĐĂNG KÝ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
