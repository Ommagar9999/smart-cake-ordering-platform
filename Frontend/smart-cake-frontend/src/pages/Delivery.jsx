
import { useEffect, useState } from "react";

import {
  getDeliveriesByPerson,
  startDelivery,
  verifyDeliveryOtp,
} from "../api/deliveryApi";

function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [otpDeliveryId, setOtpDeliveryId] = useState(null);
  const [otp, setOtp] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // ==========================================
  // GET DELIVERY PERSON ID
  // ==========================================

  const getDeliveryPersonId = () => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    return user?.id || user?.userId || null;
  };

  // ==========================================
  // LOAD DELIVERIES
  // ==========================================

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const deliveryPersonId = getDeliveryPersonId();

      if (!deliveryPersonId) {
        setError(
          "Delivery person ID not found. Please login again."
        );
        return;
      }

      const response =
        await getDeliveriesByPerson(deliveryPersonId);

      setDeliveries(
        Array.isArray(response) ? response : []
      );
    } catch (err) {
      console.error("Delivery loading error:", err);

      setError(
        err?.message ||
          "Unable to load delivery orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadDeliveries();
  }, []);

  // ==========================================
  // START DELIVERY
  // ==========================================

  const handleStartDelivery = async (deliveryId) => {
    try {
      setProcessingId(deliveryId);

      const updatedDelivery =
        await startDelivery(deliveryId);

      setDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === deliveryId
            ? updatedDelivery
            : delivery
        )
      );

      alert("Delivery started successfully.");
    } catch (err) {
      console.error("Start delivery error:", err);

      alert(
        err?.message ||
          "Unable to start delivery."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp = async (deliveryId) => {
    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      setProcessingId(deliveryId);

      const updatedDelivery =
        await verifyDeliveryOtp(
          deliveryId,
          otp.trim()
        );

      setDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === deliveryId
            ? updatedDelivery
            : delivery
        )
      );

      setOtp("");
      setOtpDeliveryId(null);

      alert(
        "OTP verified. Delivery completed successfully."
      );
    } catch (err) {
      console.error("OTP verification error:", err);

      alert(
        err?.message ||
          "Invalid OTP or unable to complete delivery."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "delivery-status assigned";

      case "OUT_FOR_DELIVERY":
        return "delivery-status out";

      case "DELIVERED":
        return "delivery-status delivered";

      case "CANCELLED":
        return "delivery-status cancelled";

      default:
        return "delivery-status";
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="page">

      {/* ======================================
          PAGE HEADING
      ====================================== */}

      <div className="page-heading">
        <span>DELIVERY</span>

        <h1>
          Delivery Dashboard
        </h1>

        <p>
          Manage your assigned cake deliveries.
        </p>
      </div>

      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="delivery-summary">

        <div className="delivery-summary-card">
          <span>🚚</span>

          <div>
            <small>ASSIGNED</small>

            <h3>
              {
                deliveries.filter(
                  (d) => d.status === "ASSIGNED"
                ).length
              }
            </h3>
          </div>
        </div>

        <div className="delivery-summary-card">
          <span>🛵</span>

          <div>
            <small>OUT FOR DELIVERY</small>

            <h3>
              {
                deliveries.filter(
                  (d) =>
                    d.status ===
                    "OUT_FOR_DELIVERY"
                ).length
              }
            </h3>
          </div>
        </div>

        <div className="delivery-summary-card">
          <span>✅</span>

          <div>
            <small>DELIVERED</small>

            <h3>
              {
                deliveries.filter(
                  (d) =>
                    d.status ===
                    "DELIVERED"
                ).length
              }
            </h3>
          </div>
        </div>

        <div className="delivery-summary-card">
          <span>📦</span>

          <div>
            <small>TOTAL</small>

            <h3>
              {deliveries.length}
            </h3>
          </div>
        </div>

      </div>

      {/* ======================================
          DELIVERY SECTION
      ====================================== */}

      <div className="admin-section">

        <div className="admin-section-header">

          <div>
            <span className="admin-section-label">
              MY DELIVERIES
            </span>

            <h2>
              Assigned Orders
            </h2>
          </div>

          <button
            className="primary-button"
            onClick={loadDeliveries}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="admin-loading">
            Loading delivery orders...
          </div>
        ) : deliveries.length === 0 ? (
          <div className="empty-state">

            <span>🚚</span>

            <h2>
              No Deliveries
            </h2>

            <p>
              You currently have no assigned
              delivery orders.
            </p>

          </div>
        ) : (
          <div className="delivery-list">

            {deliveries.map((delivery) => (

              <div
                className="delivery-card"
                key={delivery.id}
              >

                {/* CARD HEADER */}

                <div className="delivery-card-header">

                  <div>
                    <span className="admin-section-label">
                      DELIVERY #{delivery.id}
                    </span>

                    <h3>
                      Order #{delivery.orderId}
                    </h3>
                  </div>

                  <span
                    className={getStatusClass(
                      delivery.status
                    )}
                  >
                    {delivery.status ||
                      "ASSIGNED"}
                  </span>

                </div>

                {/* DETAILS */}

                <div className="delivery-details">

                  <div className="delivery-detail">

                    <span>📦</span>

                    <div>
                      <small>
                        ORDER ID
                      </small>

                      <strong>
                        #{delivery.orderId}
                      </strong>
                    </div>

                  </div>

                  <div className="delivery-detail">

                    <span>👤</span>

                    <div>
                      <small>
                        DELIVERY PERSON
                      </small>

                      <strong>
                        #{delivery.deliveryPersonId}
                      </strong>
                    </div>

                  </div>

                  <div className="delivery-detail">

                    <span>📍</span>

                    <div>
                      <small>
                        DELIVERY ADDRESS
                      </small>

                      <strong>
                        {delivery.deliveryAddress ||
                          "Address not available"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="delivery-actions">

                  {delivery.status ===
                    "ASSIGNED" && (

                    <button
                      className="primary-button"
                      onClick={() =>
                        handleStartDelivery(
                          delivery.id
                        )
                      }
                      disabled={
                        processingId ===
                        delivery.id
                      }
                    >
                      {processingId ===
                      delivery.id
                        ? "Starting..."
                        : "🚚 Start Delivery"}
                    </button>

                  )}

                  {delivery.status ===
                    "OUT_FOR_DELIVERY" && (

                    <>
                      {otpDeliveryId !==
                        delivery.id ? (

                        <button
                          className="primary-button"
                          onClick={() =>
                            setOtpDeliveryId(
                              delivery.id
                            )
                          }
                        >
                          🔐 Verify OTP
                        </button>

                      ) : (

                        <div className="otp-box">

                          <input
                            type="text"
                            value={otp}
                            onChange={(e) =>
                              setOtp(
                                e.target.value
                              )
                            }
                            placeholder="Enter OTP"
                            maxLength={6}
                            inputMode="numeric"
                          />

                          <button
                            className="primary-button"
                            onClick={() =>
                              handleVerifyOtp(
                                delivery.id
                              )
                            }
                            disabled={
                              processingId ===
                              delivery.id
                            }
                          >
                            {processingId ===
                            delivery.id
                              ? "Verifying..."
                              : "Verify & Complete"}
                          </button>

                          <button
                            className="secondary-button"
                            onClick={() => {
                              setOtp("");
                              setOtpDeliveryId(
                                null
                              );
                            }}
                          >
                            Cancel
                          </button>

                        </div>

                      )}
                    </>
                  )}

                  {delivery.status ===
                    "DELIVERED" && (

                    <div className="delivery-completed">
                      ✓ Delivery Completed
                    </div>

                  )}

                  {delivery.status ===
                    "CANCELLED" && (

                    <div className="delivery-cancelled">
                      Delivery Cancelled
                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  );
}

export default Delivery;

