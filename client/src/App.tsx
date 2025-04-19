import { Suspense } from "react";
import { Route, Routes } from "react-router";
import EditOrder from "./components/EditOrder";
import OrderDetail from "./components/OrderDetail";
import PrivateRoute from "./components/PrivateRole";
import SecretCodeManager from "./components/SecretCodeManager";
import { CartProvider } from "./context/CartContext";
import { RoleProvider } from "./context/RoleContext";
import { StaffCustomerProvider } from "./context/StaffCustomerContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import Reviews from "./pages/Reviews";
import RoleSelectionScreen from "./pages/RoleSelectionScreen";

function App() {
  return (
    <Suspense fallback={<p>Loading component...</p>}>
      <RoleProvider>
        <CartProvider>
          <StaffCustomerProvider>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RoleSelectionScreen />} />
              <Route
                path=":role/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              >
                <Route index element={<Menu />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="orders/edit-order/:id" element={<EditOrder />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="secret-codes" element={<SecretCodeManager />} />
              </Route>
            </Routes>
          </StaffCustomerProvider>
        </CartProvider>
      </RoleProvider>
    </Suspense>
  );
}

export default App;
