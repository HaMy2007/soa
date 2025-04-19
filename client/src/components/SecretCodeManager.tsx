import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SecretCodeManager = () => {
  const [secretCode, setSecretCode] = useState("");
  const [shiftCode, setShiftCode] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("latestSecretCode");
    if (saved) {
      const { secretCode, shiftCode } = JSON.parse(saved);
      setSecretCode(secretCode);
      setShiftCode(shiftCode);
    }
  }, []);

  const fetchSecretCode = async () => {
    try {
      const res = await fetch("http://localhost:3003/api/shifts/generate-secret-code", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Không thể tạo mã bí mật");

      const data = await res.json();

      setSecretCode(data.secretCode);
      setShiftCode(data.shiftCode);

      localStorage.setItem("latestSecretCode", JSON.stringify(data));

      Swal.fire({
        title: "Tạo mã thành công!",
        html: `Ca: <b>${data.shiftCode}</b><br>Mã bí mật: <b>${data.secretCode}</b>`,
        icon: "success",
        timer: 4000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        title: "Lỗi!",
        text: error.message || "Lỗi không xác định khi gọi API",
        icon: "error",
      });
    }
  };


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Secret Code Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Staff Code</h2>
          <div className="mb-4">
            <p className="text-gray-600">Shift</p>
            <p className="text-xl font-semibold">{shiftCode || "Chưa có"}</p>
            <p className="text-gray-600 mt-2">Current Code</p>
            <p className="text-2xl font-mono bg-gray-100 p-2 rounded">
              {secretCode || "Not generated"}
            </p>
          </div>
          <button
            onClick={fetchSecretCode}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate New Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretCodeManager;
