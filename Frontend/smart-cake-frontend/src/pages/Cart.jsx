import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../api/cartApi";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCart();

      console.log("========== CART RESPONSE ==========");
      console.log(response);

      setCart(response);
    } catch (error) {
      console.error("Cart loading error:", error);
      setError("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ==========================================
  // GET CART ITEMS
  // ==========================================

  const getItems = () => {
    if (!cart) {
      return [];
    }

    if (Array.isArray(cart)) {
      return cart;
    }

    if (Array.isArray(cart.items)) {
      return cart.items;
    }

    if (Array.isArray(cart.data)) {
      return cart.data;
    }

    if (cart.data && Array.isArray(cart.data.items)) {
      return cart.data.items;
    }

    if (cart.cart && Array.isArray(cart.cart.items)) {
      return cart.cart.items;
    }

    return [];
  };

  const items = getItems();

  // ==========================================
  // GET IMAGE URL
  // ==========================================

  const getCakeImage = (item) => {
    console.log("========== CART ITEM ==========");
    console.log(item);

    const image =
      item?.imageUrl ||
      item?.cakeImage ||
      item?.cakeImageUrl ||
      item?.image ||
      item?.cake?.imageUrl ||
      item?.cake?.cakeImage ||
      item?.cake?.image ||
      item?.product?.imageUrl ||
      item?.product?.image ||
      item?.cake?.product?.imageUrl ||
      item?.cake?.product?.image ||
      null;

    console.log("IMAGE FOUND:", image);

    return image;
  };

  // ==========================================
  // FIX IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    // Already full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    // Backend relative path
    if (image.startsWith("/")) {
      return `http://localhost:8080${image}`;
    }

    return `http://localhost:8080/${image}`;
  };

  // ==========================================
  // GET CAKE NAME
  // ==========================================

  const getCakeName = (item) => {
    return (
      item?.cakeName ||
      item?.name ||
      item?.cake?.name ||
      item?.product?.name ||
      "Delicious Cake"
    );
  };

  // ==========================================
  // GET CAKE DESCRIPTION
  // ==========================================

  const getCakeDescription = (item) => {
    return (
      item?.description ||
      item?.cake?.description ||
      item?.product?.description ||
      "Freshly baked delicious cake"
    );
  };

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const changeQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdating(true);

      await updateCartItem(item.id, newQuantity);

      await loadCart();
    } catch (error) {
      console.error("Quantity update error:", error);
      alert("Unable to update quantity.");
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const handleRemove = async (id) => {
    try {
      setUpdating(true);

      await removeCartItem(id);

      await loadCart();
    } catch (error) {
      console.error("Remove cart item error:", error);
      alert("Unable to remove item.");
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const handleClearCart = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmClear) {
      return;
    }

    try {
      setUpdating(true);

      await clearCart();

      setCart(null);
    } catch (error) {
      console.error("Clear cart error:", error);
      alert("Unable to clear cart.");
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  const subtotal = items.reduce((total, item) => {
    return total + Number(item?.totalPrice || 0);
  }, 0);

  const deliveryCharge = subtotal > 0 ? 50 : 0;

  const total = subtotal + deliveryCharge;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="page">
        <div className="loading">
          Loading your cart...
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="page">
        <div className="empty-state">
          <span className="empty-cart-icon">⚠️</span>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            className="primary-button"
            onClick={loadCart}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!cart || items.length === 0) {
    return (
      <main className="page">

        <div className="page-heading">
          <span>YOUR CART</span>

          <h1>Your Sweet Basket</h1>

          <p>
            Your delicious cakes are waiting for you.
          </p>
        </div>

        <div className="empty-state">

          <span className="empty-cart-icon">
            🛒
          </span>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some delicious cakes to your basket.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/cakes")}
          >
            Explore Cakes →
          </button>

        </div>

      </main>
    );
  }

  // ==========================================
  // CART UI
  // ==========================================

  return (
    <main className="page">

      {/* ======================================
          PAGE HEADING
      ====================================== */}

      <div className="page-heading">

        <span>
          YOUR CART
        </span>

        <h1>
          Your Sweet Basket
        </h1>

        <p>
          Review your cakes before checkout.
        </p>

      </div>

      <div className="cart-container">

        {/* ====================================
            CART ITEMS
        ==================================== */}

        <div className="cart-items">

          <div className="cart-header">

            <h2>
              Cart Items
            </h2>

            <button
              className="clear-cart-button"
              onClick={handleClearCart}
              disabled={updating}
            >
              Clear Cart
            </button>

          </div>

          {items.map((item) => {

            const rawCakeImage = getCakeImage(item);

            const cakeImage = getImageUrl(
              rawCakeImage
            );

            const cakeName = getCakeName(item);

            const cakeDescription =
              getCakeDescription(item);

            return (
              <div
                className="cart-item"
                key={item.id}
              >

                {/* =================================
                    CAKE IMAGE
                ================================= */}

                <div className="cart-item-image">

                  {cakeImage ? (

                    <img
                      src={cakeImage}
                      alt={cakeName}

                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}

                      onLoad={() => {
                        console.log(
                          "IMAGE LOADED:",
                          cakeImage
                        );
                      }}

                      onError={(e) => {
                        console.error(
                          "IMAGE FAILED:",
                          cakeImage
                        );

                        e.currentTarget.style.display =
                          "none";

                        const fallback =
                          e.currentTarget.parentElement.querySelector(
                            ".cart-image-fallback"
                          );

                        if (fallback) {
                          fallback.style.display =
                            "flex";
                        }
                      }}
                    />

                  ) : null}

                  <span
                    className="cart-image-fallback"

                    style={{
                      display: cakeImage
                        ? "none"
                        : "flex",

                      width: "100%",
                      height: "100%",

                      alignItems: "center",
                      justifyContent: "center",

                      fontSize: "40px",
                    }}
                  >
                    🎂
                  </span>

                </div>

                {/* =================================
                    CAKE DETAILS
                ================================= */}

                <div className="cart-item-details">

                  <span className="cart-item-label">
                    CAKE #{item.cakeId || item.id}
                  </span>

                  <h3>
                    {cakeName}
                  </h3>

                  <p>
                    {cakeDescription}
                  </p>

                  <small className="cart-item-price">
                    ₹
                    {Number(
                      item.price || 0
                    ).toFixed(2)}
                    {" "}per cake
                  </small>

                </div>

                {/* =================================
                    QUANTITY
                ================================= */}

                <div className="quantity-control">

                  <button
                    type="button"

                    disabled={
                      updating ||
                      item.quantity <= 1
                    }

                    onClick={() =>
                      changeQuantity(
                        item,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    type="button"

                    disabled={updating}

                    onClick={() =>
                      changeQuantity(
                        item,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>

                </div>

                {/* =================================
                    TOTAL
                ================================= */}

                <strong className="cart-item-total">
                  ₹
                  {Number(
                    item.totalPrice || 0
                  ).toFixed(2)}
                </strong>

                {/* =================================
                    REMOVE
                ================================= */}

                <button
                  type="button"

                  className="remove-cart-button"

                  disabled={updating}

                  onClick={() =>
                    handleRemove(item.id)
                  }
                >
                  ×
                </button>

              </div>
            );
          })}

        </div>

        {/* ======================================
            ORDER SUMMARY
        ====================================== */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong>
              ₹{deliveryCharge.toFixed(2)}
            </strong>

          </div>

          <hr />

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{total.toFixed(2)}
            </strong>

          </div>

          <button
            className="large-buy-button"

            onClick={() =>
              navigate("/checkout")
            }
          >
            Proceed to Checkout →
          </button>

          <button
            className="continue-shopping-button"

            onClick={() =>
              navigate("/cakes")
            }
          >
            ← Continue Shopping
          </button>

        </div>

      </div>

    </main>
  );
}

export default Cart;