import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const Dashboard = () => {
  return (
    <div className="font-display bg-section-hero h-screen overflow-hidden">
      <div className="dashboard grid grid-cols-[15%_85%] h-screen gap-3.5">
        <aside className="sticky h-full top-0">
          {/* <StaffCustomerProvider> */}
          <Sidebar />
          {/* </StaffCustomerProvider> */}
        </aside>
        <main className="overflow-y-auto h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
