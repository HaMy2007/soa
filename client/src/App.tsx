import { Suspense } from "react";
import { Route, Routes } from "react-router";
import RoleSelectionScreen from "./pages/RoleSelectionScreen";
import Dashboard from "./pages/Dashboard";
import { RoleProvider } from "./context/RoleContext";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import { CartProvider } from "./context/CartContext";
import OrderDetail from "./components/OrderDetail";
import EditOrder from "./components/EditOrder";

function App() {
  return (
    <Suspense fallback={<p>Loading component...</p>}>
      <RoleProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<RoleSelectionScreen />} />
            <Route path=":role/dashboard/*" element={<Dashboard />}>
              <Route index element={<Menu />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="orders/edit-order/:id" element={<EditOrder />} />
              <Route path="reviews" element={<Reviews />} />
            </Route>
          </Routes>
        </CartProvider>
      </RoleProvider>
    </Suspense>
  );
}

export default App;
