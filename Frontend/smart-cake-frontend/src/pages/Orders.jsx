
import { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrders();

        const data =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : [];

        setOrders(data);

      } catch (err) {
        console.error("Orders loading error:", err);

        setError(
          err?.message ||
          "Unable to load your orders."
        );

      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };


  // ==========================================
  // FORMAT DATE + TIME
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) {
      return "Not available";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return date;
    }
  };


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {

    switch (status?.toUpperCase()) {

      case "PENDING":
        return "status-pending";

      case "CONFIRMED":
        return "status-confirmed";

      case "PROCESSING":
        return "status-processing";

      case "OUT_FOR_DELIVERY":
        return "status-delivery";

      case "DELIVERED":
        return "status-delivered";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };


  // ==========================================
  // STATUS TEXT
  // ==========================================

  const getStatusText = (status) => {

    if (!status) {
      return "PENDING";
    }

    return status
      .replaceAll("_", " ")
      .toUpperCase();
  };


  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (imageUrl) => {

    if (!imageUrl) {
      return null;
    }

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    return `http://localhost:8080${imageUrl}`;
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

        <span>
          MY ACCOUNT
        </span>

        <h1>
          My Orders
        </h1>

        <p>
          Track your sweet deliveries.
        </p>

      </div>


      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (

        <div className="loading">
          Loading orders...
        </div>

      )}


      {/* ======================================
          ERROR
      ====================================== */}

      {!loading && error && (

        <div
          className="empty-state"
          style={{
            border: "1px solid #ffd6d6",
            background: "#fff8f8",
          }}
        >

          <span
            style={{
              fontSize: "40px",
            }}
          >
            ⚠️
          </span>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

        </div>

      )}


      {/* ======================================
          EMPTY ORDERS
      ====================================== */}

      {!loading &&
        !error &&
        orders.length === 0 && (

          <div className="empty-state">

            <span
              className="empty-cart-icon"
            >
              📦
            </span>

            <h2>
              No orders yet
            </h2>

            <p>
              Your delicious orders will
              appear here.
            </p>

          </div>

        )}


      {/* ======================================
          ORDERS LIST
      ====================================== */}

      {!loading &&
        !error &&
        orders.length > 0 && (

          <div className="orders-list">

            {orders.map((order) => {

              const status =
                order.status || "PENDING";

              const items =
                Array.isArray(order.items)
                  ? order.items
                  : [];


              return (

                <div
                  className="order-card"
                  key={order.id}
                >

                  {/* ==================================
                      ORDER HEADER
                  ================================== */}

                  <div className="order-card-header">

                    <div>

                      <span className="order-number">
                        ORDER #{order.id}
                      </span>

                      <h3>
                        Cake Order
                      </h3>

                    </div>


                    <div
                      className={`order-status ${getStatusClass(
                        status
                      )}`}
                    >

                      {getStatusText(status)}

                    </div>

                  </div>


                  {/* ==================================
                      DELIVERY DETAILS
                  ================================== */}

                  <div className="order-details">


                    {/* DELIVERY TYPE */}

                    <div className="order-detail">

                      <span className="detail-icon">
                        🚚
                      </span>

                      <div>

                        <small>
                          DELIVERY
                        </small>

                        <strong>

                          {order.deliveryType ===
                          "NOW"
                            ? "Deliver Now"
                            : "Scheduled Delivery"}

                        </strong>

                      </div>

                    </div>


                    {/* DELIVERY DATE */}

                    <div className="order-detail">

                      <span className="detail-icon">
                        📅
                      </span>

                      <div>

                        <small>
                          DELIVERY DATE
                        </small>

                        <strong>
                          {formatDate(
                            order.deliveryDate
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* DELIVERY TIME */}

                    <div className="order-detail">

                      <span className="detail-icon">
                        🕐
                      </span>

                      <div>

                        <small>
                          DELIVERY TIME
                        </small>

                        <strong>

                          {order.deliveryType ===
                          "NOW"

                            ? "30–60 minutes"

                            : order.deliveryTime ||
                              "Scheduled"}

                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* ==================================
                      ORDER ITEMS
                  ================================== */}

                  {items.length > 0 && (

                    <div className="order-items">

                      <div className="order-items-title">
                        ORDER ITEMS
                      </div>


                      {items.map(
                        (item, index) => {

                          const imageUrl =
                            getImageUrl(
                              item.imageUrl
                            );


                          return (

                            <div
                              className="order-item"
                              key={
                                item.id ||
                                `${order.id}-${index}`
                              }
                            >


                              {/* ====================
                                  CAKE IMAGE
                              ==================== */}

                              <div
                                className="order-item-image"
                                style={{
                                  overflow: "hidden",
                                  display: "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  background:
                                    "#faf5ff",
                                  borderRadius:
                                    "12px",
                                }}
                              >

                                {imageUrl ? (

                                  <img
                                    src={imageUrl}
                                    alt={
                                      item.cakeName ||
                                      "Cake"
                                    }
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit:
                                        "cover",
                                      display:
                                        "block",
                                    }}

                                    onError={(e) => {
                                      e.currentTarget.style.display =
                                        "none";
                                    }}
                                  />

                                ) : (

                                  <span
                                    style={{
                                      fontSize:
                                        "38px",
                                    }}
                                  >
                                    🎂
                                  </span>

                                )}

                              </div>


                              {/* ====================
                                  CAKE INFORMATION
                              ==================== */}

                              <div
                                className="order-item-info"
                              >

                                <strong>
                                  {item.cakeName ||
                                    `Cake #${item.cakeId}`}
                                </strong>

                                <span>
                                  Quantity:{" "}
                                  {item.quantity}
                                </span>

                                <span>
                                  ₹
                                  {Number(
                                    item.price || 0
                                  ).toFixed(2)}
                                  {" "}per cake
                                </span>

                              </div>


                              {/* ====================
                                  ITEM TOTAL
                              ==================== */}

                              <strong
                                className="order-item-price"
                              >

                                ₹
                                {(
                                  Number(
                                    item.price || 0
                                  ) *
                                  Number(
                                    item.quantity || 0
                                  )
                                ).toFixed(2)}

                              </strong>

                            </div>

                          );
                        }
                      )}

                    </div>

                  )}


                  {/* ==================================
                      ORDER FOOTER
                  ================================== */}

                  <div
                    className="order-card-footer"
                  >

                    <div>

                      <span>
                        TOTAL AMOUNT
                      </span>

                      <strong>

                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toFixed(2)}

                      </strong>

                    </div>


                    <span
                      className="order-created"
                    >

                      Ordered{" "}
                      {formatDateTime(
                        order.createdAt
                      )}

                    </span>

                  </div>

                </div>

              );

            })}

          </div>

        )}

    </main>
  );
}

export default Orders;
