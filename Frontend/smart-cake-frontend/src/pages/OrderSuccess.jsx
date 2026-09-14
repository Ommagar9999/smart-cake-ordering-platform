import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  return (
    <main className="page">

      <div className="empty-state">

        <span
          className="empty-cart-icon"
          style={{ fontSize: "70px" }}
        >
          🎉
        </span>

        <h1>
          Order Placed Successfully!
        </h1>

        <p>
          Thank you for ordering from Smart Cake.
        </p>

        {order && (
          <>
            <p>
              Order ID: <strong>#{order.id}</strong>
            </p>

            <p>
              Delivery Date:{" "}
              <strong>
                {order.deliveryDate}
              </strong>
            </p>

            <p>
              Total Amount:{" "}
              <strong>
                ₹{Number(order.totalAmount || 0).toFixed(2)}
              </strong>
            </p>
          </>
        )}

        <button
          className="primary-button"
          onClick={() => navigate("/cakes")}
        >
          Continue Shopping →
        </button>

      </div>

    </main>
  );
}

export default OrderSuccess;