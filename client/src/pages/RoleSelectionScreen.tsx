import customer1 from "../assets/customers/customer-1.jpg";
import customer2 from "../assets/customers/customer-2.jpg";
import customer3 from "../assets/customers/customer-3.jpg";
import customer4 from "../assets/customers/customer-4.jpg";
import customer5 from "../assets/customers/customer-5.jpg";
import customer6 from "../assets/customers/customer-6.jpg";
import hero from "../assets/hero.png";
import Button from "../components/Button";
import { useRole } from "../context/RoleContext";
import { useNavigate } from "react-router";

type Props = {};

const RoleSelectionScreen = (props: Props) => {
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    setRole(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="font-display  bg-section-hero">
      <div className="py-14 h-screen max-w-7xl mx-auto">
        <div className="flex gap-12">
          <div className="flex flex-1 flex-col gap-12 text-start">
            <p className="font-extrabold text-6xl text-black ">
              Order your meal right <br /> at the restaurant, <br /> let's
              enjoy!
            </p>

            <div className="pr-12">
              <p className="text-xl">
                Experience the convenience of ordering your favorite meals right
                at the restaurant without any hassle. Browse the menu, customize
                your order to your taste, and enjoy freshly prepared dishes
                served to you in no time.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                className="px-8 py-4"
                onClick={() => handleRoleSelect("customer")}
              >
                Customer
              </Button>
              <Button
                className="px-8 py-4"
                onClick={() => handleRoleSelect("chef")}
              >
                Chef
              </Button>
              <Button
                className="px-8 py-4"
                onClick={() => handleRoleSelect("manager")}
              >
                Manager
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-8">
              <div className="flex">
                <img
                  className="h-11 w-11 -mr-3 border-amber-50 border-2 rounded-full object-cover"
                  src={customer1}
                  alt="Customer photo"
                />
                <img
                  className="h-11 w-11 -mr-3 border-amber-50 border-2 rounded-full object-cover"
                  src={customer2}
                  alt="Customer photo"
                />
                <img
                  className="h-11 w-11 -mr-3 border-amber-50 border-2  rounded-full object-cover"
                  src={customer3}
                  alt="Customer photo"
                />
                <img
                  className="h-11 w-11 -mr-3 border-amber-50 border-2  rounded-full object-cover"
                  src={customer4}
                  alt="Customer photo"
                />
                <img
                  className="h-11 w-11 -mr-3 border-amber-50 border-2  rounded-full object-cover"
                  src={customer5}
                  alt="Customer photo"
                />
                <img
                  className="h-11 w-11 -mr-3 border-amber-50 border-2  rounded-full object-cover m-0"
                  src={customer6}
                  alt="Customer photo"
                />
              </div>

              <p className="text-md text-gray-600 font-normal">
                <span className="text-orange-600 font-extrabold">10,000+</span>{" "}
                happy customers have enjoyed our meals!
              </p>
            </div>
          </div>

          <div className="hero-img-box text-center flex-1">
            <div className="px-4">
              <img
                src={hero}
                className="w-full hero-img"
                alt="Women enjoying food, meals in storage container, and food bowls on a table"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
