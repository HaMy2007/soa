import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import login from "../assets/login.png";
import logo from "../assets/logo.png";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3003/api/users/login", formData);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/manager/dashboard");
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Đăng nhập thất bại.");
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-title-section-menu">
      <div className="w-4/5 h-4/5 bg-white rounded-md shadow-2xl shadow-blue flex">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-black font-bold text-5xl">Đăng nhập</h1>
          <h2 className="text-black">Đảm bảo tài khoản của bạn được an toàn</h2>
          <img className="w-4/5" src={login} alt="ảnh login" />
        </div>

        <div className="flex-1 flex flex-col gap-4 items-center justify-center">
          <div className="flex flex-col gap-2">
            <img src={logo} className="w-14 h-14" />
            <span className="font-bold">Best Meals</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-3/5">
            <div className="w-full flex flex-col gap-4">
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
              <div className="flex flex-col gap-1 relative">
                <label className="text-black font-semibold">Mật khẩu</label>
                <input
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className="border border-gray-300 rounded-md p-2 w-full pr-10"
                />

                <div
                  className="absolute right-3 top-10 cursor-pointer text-gray-500"
                  onClick={() => setIsShowPassword((prev) => !prev)}
                >
                  {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/resetPassword")}
                className="flex justify-between items-start flex-col gap-4 mb-4"
              >
                <span className="text-black cursor-pointer">
                  Quên mật khẩu?
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="flex justify-between items-start flex-col gap-4 mb-4"
              >
                <span className="text-black cursor-pointer">Đăng ký</span>
              </button>
            </div>

            <button
              type="submit"
              className="bg-menu-title hover:bg-red-300 cursor-pointer text-black rounded-md p-2 w-full"
            >
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
