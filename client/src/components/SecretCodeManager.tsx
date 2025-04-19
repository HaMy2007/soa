import { useState, useEffect } from "react";
import { useRole } from "../context/RoleContext";
import Swal from "sweetalert2";

const SecretCodeManager = () => {
  const { role } = useRole();
  const [secretCodes, setSecretCodes] = useState<{
    staff: string;
    chef: string;
    manager: string;
  }>({
    staff: "",
    chef: "",
    manager: "",
  });

  useEffect(() => {
    const savedCodes = localStorage.getItem("secretCodes");
    if (savedCodes) {
      setSecretCodes(JSON.parse(savedCodes));
    }
  }, []);

  const generateCode = (role: "staff" | "chef" | "manager") => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    setSecretCodes((prev) => {
      const newCodes = { ...prev, [role]: code };
      localStorage.setItem("secretCodes", JSON.stringify(newCodes));
      return newCodes;
    });

    Swal.fire({
      title: "Code Generated!",
      text: `New ${role} code: ${code}`,
      icon: "success",
      timer: 3000,
      showConfirmButton: false,
    });
  };

  // if (role !== "manager") {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <h1 className="text-2xl font-bold text-red-500">
  //         Access Denied. Manager only.
  //       </h1>
  //     </div>
  //   );
  // }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Secret Code Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Staff Code */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Staff Code</h2>
          <div className="mb-4">
            <p className="text-gray-600">Current Code:</p>
            <p className="text-2xl font-mono bg-gray-100 p-2 rounded">
              {secretCodes.staff || "Not generated"}
            </p>
          </div>
          <button
            onClick={() => generateCode("staff")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate New Code
          </button>
        </div>

        {/* Chef Code */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Chef Code</h2>
          <div className="mb-4">
            <p className="text-gray-600">Current Code:</p>
            <p className="text-2xl font-mono bg-gray-100 p-2 rounded">
              {secretCodes.chef || "Not generated"}
            </p>
          </div>
          <button
            onClick={() => generateCode("chef")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Generate New Code
          </button>
        </div>

        {/* Manager Code */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Manager Code</h2>
          <div className="mb-4">
            <p className="text-gray-600">Current Code:</p>
            <p className="text-2xl font-mono bg-gray-100 p-2 rounded">
              {secretCodes.manager || "Not generated"}
            </p>
          </div>
          <button
            onClick={() => generateCode("manager")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Generate New Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretCodeManager;
