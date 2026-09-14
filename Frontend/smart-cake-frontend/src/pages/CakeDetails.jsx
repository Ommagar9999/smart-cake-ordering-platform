import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCakeById } from "../api/cakeApi";
import { useAuth } from "../context/AuthContext";

function CakeDetails({ onLogin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);

  const [deliveryType, setDeliveryType] =
    useState("now");

  const [date, setDate] = useState("");

  useEffect(() => {
    const loadCake = async () => {
      try {
        const response =
          await getCakeById(id);

        setCake(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCake();
  }, [id]);

  const buyNow = () => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }

    navigate(`/checkout?cakeId=${id}`);
  };

  if (loading) {
    return (
      <div className="loading">
        Loading cake...
      </div>
    );
  }

  return (
    <main className="product-page">

      <div className="product-image">

        {cake?.imageUrl ? (
          <img
            src={cake.imageUrl}
            alt={cake.name}
          />
        ) : (
          <span>🎂</span>
        )}

      </div>

      <div className="product-info">

        <span className="eyebrow">
          CAKEON COLLECTION
        </span>

        <h1>
          {cake?.name ||
            "Chocolate Celebration Cake"}
        </h1>

        <div className="product-rating">
          ⭐ 4.8
          <span>
            120+ reviews
          </span>
        </div>

        <p className="product-description">
          {cake?.description ||
            "A delicious freshly baked cake made for your special moments."}
        </p>

        <h2 className="product-price">
          ₹{cake?.price || "699"}
        </h2>

        <div className="option-section">

          <label>
            Delivery
          </label>

          <div className="delivery-options">

            <button
              className={
                deliveryType === "now"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setDeliveryType("now")
              }
            >
              Deliver Now
            </button>

            <button
              className={
                deliveryType === "scheduled"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setDeliveryType("scheduled")
              }
            >
              Schedule Delivery
            </button>

          </div>

        </div>

        {deliveryType === "scheduled" && (

          <div className="schedule-box">

            <label>
              Delivery Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          </div>

        )}

        <button
          className="large-buy-button"
          onClick={buyNow}
        >
          Buy Now →
        </button>

      </div>

    </main>
  );
}

export default CakeDetails;