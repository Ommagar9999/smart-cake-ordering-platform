import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../api/cartApi";

function CakeCard({ cake, onLogin }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [showToast, setShowToast] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!showToast) return;

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showToast]);

  const buyNow = () => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }

    navigate(`/checkout?cakeId=${cake.id}`);
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart({
        cakeId: cake.id,
        quantity: 1,
      });

      setShowToast(true);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Unable to add cake to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <>
      <div className="cake-card">

        {/* IMAGE */}
        <div className="cake-card-image">

          {cake.imageUrl ? (
            <img
              src={cake.imageUrl}
              alt={cake.name || "Cake"}
            />
          ) : (
            <span className="cake-placeholder">🎂</span>
          )}

          <button
            className="heart-button"
            type="button"
            aria-label="Add to wishlist"
          >
            ♡
          </button>

        </div>

        {/* CONTENT */}
        <div className="cake-card-content">

          <div className="rating">
            ⭐ {cake.rating || "4.8"}
          </div>

          <h3>
            {cake.name || "Chocolate Cake"}
          </h3>

          <p>
            {cake.description ||
              "Freshly baked delicious cake"}
          </p>

          {/* PRICE + CART */}
          <div className="cake-card-bottom">

            <strong>
              ₹{cake.price || "699"}
            </strong>

            <button
              type="button"
              onClick={handleAddToCart}
              className="add-cart-button"
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

          </div>

          {/* BUY NOW */}
          <button
            type="button"
            onClick={buyNow}
            className="buy-now-button"
          >
            Buy Now
            <span>→</span>
          </button>

        </div>
      </div>

      {/* CART TOAST */}
      {showToast && (
        <div className="cake-toast">

          <div className="cake-toast-icon">
            ✓
          </div>

          <div className="cake-toast-content">
            <strong>
              Added to Cart
            </strong>

            <span>
              {cake.name || "Cake"} added successfully
            </span>
          </div>

          <button
            type="button"
            className="cake-toast-close"
            onClick={() => setShowToast(false)}
            aria-label="Close"
          >
            ×
          </button>

        </div>
      )}
    </>
  );
}

export default CakeCard;