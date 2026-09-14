
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder } from "../api/checkoutApi";
import { getCart } from "../api/cartApi";

import {
  createPayment,
  verifyPayment,
} from "../api/PaymentApi";

function Checkout() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  // NOW = immediate delivery
  // SCHEDULED = future delivery
  const [deliveryType, setDeliveryType] = useState("NOW");

  const [deliveryDate, setDeliveryDate] = useState("");

  const [deliveryTime, setDeliveryTime] =
    useState("ASAP");

  const [loading, setLoading] = useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {

    const loadCart = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await getCart();

        let items = [];

        if (Array.isArray(response)) {

          items = response;

        } else if (Array.isArray(response?.items)) {

          items = response.items;

        } else if (Array.isArray(response?.data)) {

          items = response.data;

        } else if (
          Array.isArray(response?.data?.items)
        ) {

          items = response.data.items;
        }

        setCart(items);

      } catch (err) {

        console.error(
          "Checkout cart error:",
          err
        );

        setError(
          "Unable to load your cart."
        );

      } finally {

        setLoading(false);

      }
    };

    loadCart();

  }, []);


  // ==========================================
  // TOTAL
  // ==========================================

  const subtotal = cart.reduce(
    (total, item) => {

      return (
        total +
        Number(item?.totalPrice || 0)
      );

    },
    0
  );


  const deliveryCharge =
    subtotal > 0 ? 50 : 0;


  const total =
    subtotal + deliveryCharge;


  // ==========================================
  // GET TODAY
  // ==========================================

  const getToday = () => {

    const date = new Date();

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  // ==========================================
  // GET TOMORROW
  // ==========================================

  const getMinDate = () => {

    const date = new Date();

    date.setDate(
      date.getDate() + 1
    );

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  // ==========================================
  // DELIVERY TYPE CHANGE
  // ==========================================

  const handleDeliveryTypeChange =
    (type) => {

      setDeliveryType(type);

      setError("");

      if (type === "NOW") {

        setDeliveryDate("");

        setDeliveryTime("ASAP");

      }

      if (type === "SCHEDULED") {

        setDeliveryDate(
          getMinDate()
        );

        setDeliveryTime(
          "10:00 AM - 12:00 PM"
        );

      }
    };


  // ==========================================
  // LOAD RAZORPAY SCRIPT
  // ==========================================

  const loadRazorpayScript = () => {

    return new Promise(
      (resolve) => {

        if (window.Razorpay) {

          resolve(true);

          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {

          resolve(true);

        };

        script.onerror = () => {

          resolve(false);

        };

        document.body.appendChild(
          script
        );

      }
    );
  };


  // ==========================================
  // PLACE ORDER + PAYMENT
  // ==========================================

  const handlePlaceOrder =
    async () => {

      // ======================================
      // CART CHECK
      // ======================================

      if (cart.length === 0) {

        alert(
          "Your cart is empty."
        );

        navigate("/cart");

        return;
      }


      let finalDeliveryDate = "";


      // ======================================
      // DELIVER NOW
      // ======================================

      if (
        deliveryType === "NOW"
      ) {

        finalDeliveryDate =
          getToday();

      }


      // ======================================
      // SCHEDULED DELIVERY
      // ======================================

      if (
        deliveryType === "SCHEDULED"
      ) {

        if (!deliveryDate) {

          alert(
            "Please select delivery date."
          );

          return;
        }

        finalDeliveryDate =
          deliveryDate;

      }


      try {

        setPlacingOrder(true);

        setError("");


        // ====================================
        // STEP 1
        // CREATE ORDER
        // ====================================

        const orderData = {

          deliveryDate:
            finalDeliveryDate,

          items: cart.map(
            (item) => ({

              cakeId:
                item.cakeId,

              quantity:
                item.quantity,

              price:
                Number(
                  item.price || 0
                ),

            })
          ),

        };


        console.log(
          "========== ORDER REQUEST =========="
        );

        console.log(
          orderData
        );


        const orderResponse =
          await createOrder(
            orderData
          );


        console.log(
          "========== ORDER RESPONSE =========="
        );

        console.log(
          orderResponse
        );


        // ====================================
        // GET ORDER ID
        // ====================================

        const orderId =
          orderResponse?.id ||
          orderResponse?.orderId;


        if (!orderId) {

          throw new Error(
            "Order ID was not returned by Order Service."
          );

        }


        // ====================================
        // GET USER
        // ====================================

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            ) || "null"
          );


        const userId =
          user?.id ||
          user?.userId;


        if (!userId) {

          throw new Error(
            "User information not found. Please login again."
          );

        }


        // ====================================
        // STEP 2
        // LOAD RAZORPAY
        // ====================================

        const razorpayLoaded =
          await loadRazorpayScript();


        if (!razorpayLoaded) {

          throw new Error(
            "Unable to load Razorpay. Please check your internet connection."
          );

        }


        // ====================================
        // STEP 3
        // CREATE RAZORPAY ORDER
        // ====================================

        console.log(
          "========== CREATING PAYMENT =========="
        );


        const paymentResponse =
          await createPayment({

            orderId:
              orderId,

            userId:
              userId,

            amount:
              total,

          });


        console.log(
          "========== PAYMENT RESPONSE =========="
        );

        console.log(
          paymentResponse
        );


        const razorpayOrderId =
          paymentResponse?.razorpayOrderId;


        if (!razorpayOrderId) {

          throw new Error(
            "Razorpay Order ID was not returned."
          );

        }


        // ====================================
        // CHECK FRONTEND KEY
        // ====================================

        const razorpayKey =
          import.meta.env
            .VITE_RAZORPAY_KEY_ID;


        if (!razorpayKey) {

          throw new Error(
            "Razorpay Key ID is missing. Check your frontend .env file."
          );

        }


        // ====================================
        // STEP 4
        // RAZORPAY CHECKOUT OPTIONS
        // ====================================

        const options = {

          key:
            razorpayKey,

          amount:
            Math.round(
              total * 100
            ),

          currency:
            "INR",

          name:
            "CakeOn",

          description:
            "CakeOn Cake Order",

          order_id:
            razorpayOrderId,


          // ==================================
          // PREFILL USER INFORMATION
          // ==================================

          prefill: {

            name:
              user?.name ||
              "",

            email:
              user?.email ||
              "",

            contact:
              user?.phone ||
              user?.mobile ||
              "",

          },


          theme: {

            color:
              "#c77dff",

          },


          // ==================================
          // PAYMENT SUCCESS
          // ==================================

          handler:
            async function (
              razorpayResponse
            ) {

              try {

                console.log(
                  "========== RAZORPAY RESPONSE =========="
                );

                console.log(
                  razorpayResponse
                );


                // ==============================
                // STEP 5
                // VERIFY PAYMENT
                // ==============================

                console.log(
                  "========== VERIFYING PAYMENT =========="
                );


                const verificationResponse =
                  await verifyPayment({

                    orderId:
                      orderId,

                    razorpayOrderId:
                      razorpayResponse
                        .razorpay_order_id,

                    razorpayPaymentId:
                      razorpayResponse
                        .razorpay_payment_id,

                    razorpaySignature:
                      razorpayResponse
                        .razorpay_signature,

                  });


                console.log(
                  "========== PAYMENT VERIFIED =========="
                );

                console.log(
                  verificationResponse
                );


                // ==============================
                // PAYMENT SUCCESS
                // ==============================

                navigate(
                  "/order-success",
                  {

                    state: {

                      order:
                        orderResponse,

                      payment:
                        verificationResponse,

                      deliveryType:
                        deliveryType,

                      deliveryTime:
                        deliveryTime,

                    },

                  }
                );


              } catch (error) {

                console.error(
                  "Payment verification error:",
                  error
                );


                setError(
                  error?.message ||
                  "Payment verification failed."
                );


                setPlacingOrder(
                  false
                );

              }

            },


          // ==================================
          // MODAL CLOSE
          // ==================================

          modal: {

            ondismiss:
              function () {

                console.log(
                  "Razorpay checkout closed."
                );

                setPlacingOrder(
                  false
                );

              },

          },

        };


        // ====================================
        // CREATE RAZORPAY INSTANCE
        // ====================================

        console.log(
          "========== OPENING RAZORPAY =========="
        );


        const razorpay =
          new window.Razorpay(
            options
          );


        // ====================================
        // PAYMENT FAILED
        // ====================================

        razorpay.on(
          "payment.failed",
          function (response) {

            console.error(
              "Payment failed:",
              response
            );


            setError(
              response?.error?.description ||
              "Payment failed. Please try again."
            );


            setPlacingOrder(
              false
            );

          }
        );


        // ====================================
        // OPEN PAYMENT POPUP
        // ====================================

        razorpay.open();


      } catch (err) {

        console.error(
          "Place order/payment error:",
          err
        );


        setError(
          err?.message ||
          "Unable to process your order."
        );


        setPlacingOrder(
          false
        );

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <main className="page">

        <div className="loading">
          Loading checkout...
        </div>

      </main>

    );

  }


  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {

    return (

      <main className="page">

        <div className="page-heading">

          <span>
            CHECKOUT
          </span>

          <h1>
            Your cart is empty
          </h1>

          <p>
            Add some delicious cakes
            before checkout.
          </p>

        </div>


        <div className="empty-state">

          <span className="empty-cart-icon">
            🛒
          </span>

          <h2>
            Nothing to checkout
          </h2>

          <p>
            Your sweet basket is
            currently empty.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/cakes")
            }
          >
            Explore Cakes →
          </button>

        </div>

      </main>

    );

  }


  // ==========================================
  // CHECKOUT UI
  // ==========================================

  return (

    <main className="page">

      {/* PAGE HEADING */}

      <div className="page-heading">

        <span>
          CHECKOUT
        </span>

        <h1>
          Complete Your Order
        </h1>

        <p>
          Choose how you want your
          cake delivered.
        </p>

      </div>


      <div className="cart-container">


        {/* DELIVERY DETAILS */}

        <div className="cart-items">


          <div className="cart-header">

            <h2>
              Delivery Details
            </h2>

          </div>


          <div
            style={{
              padding: "25px",
            }}
          >

            <p
              style={{
                marginBottom: "18px",
                fontWeight: "600",
              }}
            >
              How would you like your
              cake delivered?
            </p>


            {/* DELIVER NOW */}

            <div
              onClick={() =>
                handleDeliveryTypeChange(
                  "NOW"
                )
              }
              style={{

                border:
                  deliveryType === "NOW"
                    ? "2px solid #c77dff"
                    : "1px solid #ddd",

                borderRadius: "12px",

                padding: "18px",

                marginBottom: "15px",

                cursor: "pointer",

                background:
                  deliveryType === "NOW"
                    ? "#faf5ff"
                    : "#fff",

                transition: "0.2s",

              }}
            >

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  cursor: "pointer",
                }}
              >

                <input
                  type="radio"
                  name="deliveryType"
                  value="NOW"
                  checked={
                    deliveryType === "NOW"
                  }
                  onChange={() =>
                    handleDeliveryTypeChange(
                      "NOW"
                    )
                  }
                  style={{
                    marginTop: "5px",
                  }}
                />


                <div>

                  <strong
                    style={{
                      display: "block",
                      fontSize: "17px",
                      marginBottom: "5px",
                    }}
                  >
                    🚀 Deliver Now
                  </strong>


                  <span
                    style={{
                      color: "#777",
                      fontSize: "14px",
                    }}
                  >
                    Get your cake delivered
                    as soon as possible.
                  </span>


                  {deliveryType === "NOW" && (

                    <p
                      style={{
                        marginTop: "10px",
                        marginBottom: "0",
                        color: "#6a1b9a",
                        fontWeight: "600",
                      }}
                    >
                      ⚡ Estimated delivery:
                      30–60 minutes
                    </p>

                  )}

                </div>

              </label>

            </div>


            {/* SCHEDULE DELIVERY */}

            <div
              onClick={() =>
                handleDeliveryTypeChange(
                  "SCHEDULED"
                )
              }
              style={{

                border:
                  deliveryType === "SCHEDULED"
                    ? "2px solid #c77dff"
                    : "1px solid #ddd",

                borderRadius: "12px",

                padding: "18px",

                cursor: "pointer",

                background:
                  deliveryType === "SCHEDULED"
                    ? "#faf5ff"
                    : "#fff",

                transition: "0.2s",

              }}
            >

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  cursor: "pointer",
                }}
              >

                <input
                  type="radio"
                  name="deliveryType"
                  value="SCHEDULED"
                  checked={
                    deliveryType === "SCHEDULED"
                  }
                  onChange={() =>
                    handleDeliveryTypeChange(
                      "SCHEDULED"
                    )
                  }
                  style={{
                    marginTop: "5px",
                  }}
                />


                <div
                  style={{
                    width: "100%",
                  }}
                >

                  <strong
                    style={{
                      display: "block",
                      fontSize: "17px",
                      marginBottom: "5px",
                    }}
                  >
                    📅 Schedule Delivery
                  </strong>


                  <span
                    style={{
                      color: "#777",
                      fontSize: "14px",
                    }}
                  >
                    Choose a future date
                    and time for delivery.
                  </span>

                </div>

              </label>


              {/* SCHEDULE FIELDS */}

              {deliveryType === "SCHEDULED" && (

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "18px",
                    borderTop: "1px solid #eee",
                  }}
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >

                  {/* DATE */}

                  <label
                    htmlFor="deliveryDate"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Delivery Date
                  </label>


                  <input
                    id="deliveryDate"
                    type="date"
                    min={getMinDate()}
                    value={deliveryDate}
                    onChange={(e) =>
                      setDeliveryDate(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      fontSize: "16px",
                      marginBottom: "18px",
                      boxSizing: "border-box",
                    }}
                  />


                  {/* TIME */}

                  <label
                    htmlFor="deliveryTime"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Delivery Time
                  </label>


                  <select
                    id="deliveryTime"
                    value={deliveryTime}
                    onChange={(e) =>
                      setDeliveryTime(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      fontSize: "16px",
                      boxSizing: "border-box",
                    }}
                  >

                    <option value="10:00 AM - 12:00 PM">
                      10:00 AM - 12:00 PM
                    </option>

                    <option value="12:00 PM - 02:00 PM">
                      12:00 PM - 02:00 PM
                    </option>

                    <option value="02:00 PM - 04:00 PM">
                      02:00 PM - 04:00 PM
                    </option>

                    <option value="04:00 PM - 06:00 PM">
                      04:00 PM - 06:00 PM
                    </option>

                    <option value="06:00 PM - 08:00 PM">
                      06:00 PM - 08:00 PM
                    </option>

                    <option value="08:00 PM - 10:00 PM">
                      08:00 PM - 10:00 PM
                    </option>

                  </select>


                  <p
                    style={{
                      marginTop: "12px",
                      color: "#777",
                    }}
                  >
                    🎂 Perfect for birthdays,
                    anniversaries and
                    special occasions.
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* ORDER ITEMS */}

          <div className="cart-header">

            <h2>
              Order Items
            </h2>

          </div>


          {cart.map(
            (item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* IMAGE */}

                <div className="cart-item-image">

                  {item.imageUrl ? (

                    <img
                      src={
                        item.imageUrl.startsWith(
                          "http"
                        )
                          ? item.imageUrl
                          : `http://localhost:8080${item.imageUrl}`
                      }
                      alt={
                        item.cakeName ||
                        "Cake"
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                  ) : (

                    <span
                      style={{
                        fontSize: "40px",
                      }}
                    >
                      🎂
                    </span>

                  )}

                </div>


                {/* DETAILS */}

                <div className="cart-item-details">

                  <span className="cart-item-label">
                    CAKE #{item.cakeId}
                  </span>

                  <h3>
                    {
                      item.cakeName ||
                      "Delicious Cake"
                    }
                  </h3>

                  <p>
                    Quantity:
                    {" "}
                    {item.quantity}
                  </p>

                  <small className="cart-item-price">

                    ₹
                    {Number(
                      item.price || 0
                    ).toFixed(2)}

                    {" "}
                    per cake

                  </small>

                </div>


                {/* TOTAL */}

                <strong className="cart-item-total">

                  ₹
                  {Number(
                    item.totalPrice ||
                    0
                  ).toFixed(2)}

                </strong>

              </div>

            )
          )}

        </div>


        {/* ORDER SUMMARY */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>


          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {subtotal.toFixed(2)}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong>
              ₹
              {deliveryCharge.toFixed(2)}
            </strong>

          </div>


          <hr />


          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toFixed(2)}
            </strong>

          </div>


          {/* DELIVERY INFORMATION */}

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "10px",
              background: "#faf5ff",
              fontSize: "14px",
            }}
          >

            {deliveryType === "NOW" ? (

              <>

                🚀{" "}
                <strong>
                  Deliver Now
                </strong>

                <br />

                <span
                  style={{
                    color: "#777",
                  }}
                >
                  Estimated delivery:
                  {" "}
                  30–60 minutes
                </span>

              </>

            ) : (

              <>

                📅{" "}
                <strong>
                  Scheduled Delivery
                </strong>

                <br />

                <span
                  style={{
                    color: "#777",
                  }}
                >
                  {deliveryDate}
                  {" • "}
                  {deliveryTime}
                </span>

              </>

            )}

          </div>


          {/* ERROR */}

          {error && (

            <p
              style={{
                color: "red",
                marginTop: "15px",
              }}
            >
              {error}
            </p>

          )}


          {/* PLACE ORDER */}

          <button
            className="large-buy-button"
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >

            {placingOrder
              ? "Opening Payment..."
              : "Place Order →"}

          </button>


          {/* BACK */}

          <button
            className="continue-shopping-button"
            onClick={() =>
              navigate("/cart")
            }
            disabled={placingOrder}
          >

            ← Back to Cart

          </button>

        </div>

      </div>

    </main>

  );

}


export default Checkout;

