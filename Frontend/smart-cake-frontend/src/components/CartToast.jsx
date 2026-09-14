import { useEffect } from "react";

function CartToast({ show, onClose, cake }) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="cart-toast">
      <div className="toast-check">✓</div>

      <div className="toast-content">
        <strong>Added to Cart</strong>

        <span>
          {cake?.name || "Cake"} has been added to your cart.
        </span>
      </div>

      <button
        className="toast-close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default CartToast;