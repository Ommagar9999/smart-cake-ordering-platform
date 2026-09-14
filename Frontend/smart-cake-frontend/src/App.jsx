import { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OrderSuccess from "./pages/OrderSuccess";
import Home from "./pages/Home";
import Cakes from "./pages/Cakes";
import CakeDetails from "./pages/CakeDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Delivery from "./pages/Delivery";
import Admin from "./pages/Admin";

import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";

function App() {
  const navigate = useNavigate();

  // ================================
  // AUTH MODAL STATES
  // ================================

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // ================================
  // OPEN LOGIN
  // ================================

  const openLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  // ================================
  // OPEN REGISTER
  // ================================

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  // ================================
  // CLOSE BOTH MODALS
  // ================================

  const closeAll = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  // ================================
  // LOGIN SUCCESS
  // ================================

  const handleLoginSuccess = () => {
    closeAll();
    navigate("/");
  };

  return (
    <div className="app">

      {/* =================================
          NAVBAR
      ================================= */}

      <Navbar
        onLogin={openLogin}
        onRegister={openRegister}
      />

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <main>
        <Routes>

          {/* ==============================
              HOME
          ============================== */}

          <Route
            path="/"
            element={
              <Home
                onLogin={openLogin}
              />
            }
          />

          {/* ==============================
              CAKES
          ============================== */}

          <Route
            path="/cakes"
            element={
              <Cakes
                onLogin={openLogin}
              />
            }
          />


                

                <Route
  path="/checkout"
  element={<Checkout />}
/>

<Route
  path="/order-success"
  element={<OrderSuccess />}
/>



          {/* ==============================
              CAKE DETAILS
          ============================== */}

          <Route
            path="/cakes/:id"
            element={
              <CakeDetails
                onLogin={openLogin}
              />
            }
          />

          {/* ==============================
              CART
          ============================== */}

          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* ==============================
              CHECKOUT
          ============================== */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* ==============================
              ORDERS
          ============================== */}

          <Route
            path="/orders"
            element={<Orders />}
          />

          {/* ==============================
              PROFILE
          ============================== */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* ==============================
              DELIVERY
          ============================== */}

          <Route
            path="/delivery"
            element={<Delivery />}
          />

          {/* ==============================
              ADMIN
          ============================== */}

          <Route
            path="/admin"
            element={<Admin />}
          />

        </Routes>
      </main>

      {/* =================================
          FOOTER
      ================================= */}

      <Footer />

      {/* =================================
          LOGIN MODAL
      ================================= */}

      <LoginModal
        isOpen={loginOpen}
        onClose={closeAll}
        onRegister={openRegister}
        onSuccess={handleLoginSuccess}
      />

      {/* =================================
          REGISTER MODAL
      ================================= */}

      <RegisterModal
        isOpen={registerOpen}
        onClose={closeAll}
        onLogin={openLogin}
      />

    </div>
  );
}

export default App;