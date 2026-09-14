import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home({ onLogin }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleOrder = () => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }

    navigate("/cakes");
  };

  return (
    <main>

      <section className="hero">

        <div className="hero-content">

          <span className="eyebrow">
            FRESHLY BAKED • DELIVERED WITH LOVE
          </span>

          <h1>
            Every Moment
            <br />
            Deserves a
            <span> Cake.</span>
          </h1>

          <p>
            Discover freshly baked cakes made
            for birthdays, anniversaries,
            celebrations and every sweet moment.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={handleOrder}
            >
              Order Your Cake
              <span>→</span>
            </button>

            <button
              className="outline-button"
              onClick={() =>
                navigate("/cakes")
              }
            >
              Explore Cakes
            </button>

          </div>

          <div className="hero-stats">

            <div>
              <strong>500+</strong>
              <span>Cakes</span>
            </div>

            <div>
              <strong>4.8★</strong>
              <span>Rating</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Ordering</span>
            </div>

          </div>

        </div>

        <div className="hero-visual">

 <div className="hero-circle">
  <div className="cake-sticker">
    🎂
  </div>
</div>

          <div className="floating-card">
            ⭐ 4.9
            <small>Happy Customers</small>
          </div>

        </div>

      </section>

      <section
        className="categories-section"
        id="categories"
      >

        <div className="section-title">
          <span>EXPLORE</span>
          <h2>Find Your Perfect Cake</h2>
          <p>
            Made for every celebration.
          </p>
        </div>

        <div className="category-grid">

          <div className="category-item">
            <span>🎂</span>
            <h3>Birthday</h3>
            <p>Make birthdays unforgettable</p>
          </div>

          <div className="category-item">
            <span>💝</span>
            <h3>Anniversary</h3>
            <p>Celebrate your love</p>
          </div>

          <div className="category-item">
            <span>🍫</span>
            <h3>Chocolate</h3>
            <p>For chocolate lovers</p>
          </div>

          <div className="category-item">
            <span>🍓</span>
            <h3>Fresh Cream</h3>
            <p>Light and delicious</p>
          </div>

        </div>

      </section>

      <section className="promise-section">

        <div>
          <span>CAKEON PROMISE</span>

          <h2>
            Fresh Cakes.
            <br />
            Happy Moments.
          </h2>

          <p>
            From choosing your cake to
            getting it delivered at the
            perfect time, CakeOn keeps
            everything simple.
          </p>
        </div>

        <div className="promise-grid">

          <div>
            <span>01</span>
            <h3>Freshly Baked</h3>
            <p>
              Prepared fresh for your order.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>Scheduled Delivery</h3>
            <p>
              Choose when your cake arrives.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>Easy Ordering</h3>
            <p>
              Simple and secure checkout.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;