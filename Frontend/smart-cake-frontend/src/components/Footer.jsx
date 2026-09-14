function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>
            Cake<span>On</span>
          </h2>

          <p>
            Making every celebration
            a little sweeter.
          </p>
        </div>


        {/* EXPLORE */}
        <div className="footer-column">
          <h4>Explore</h4>

          <a href="/cakes">Cakes</a>
          <a href="/categories">Categories</a>
          <a href="/offers">Offers</a>
        </div>


        {/* ACCOUNT */}
        <div className="footer-column">
          <h4>Account</h4>

          <a href="/profile">My Profile</a>
          <a href="/orders">My Orders</a>
          <a href="/cart">Cart</a>
        </div>


        {/* SUPPORT */}
        <div className="footer-column">
          <h4>Support</h4>

          <a href="/contact">Contact Us</a>
          <a href="/help">Help Center</a>
          <a href="/delivery">Delivery</a>
        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          © 2026 CakeOn. All rights reserved.
        </p>

        <span>
          Made with ♥ for every celebration
        </span>
      </div>

    </footer>
  );
}

export default Footer;