function Register() {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Create Account</h1>

        <p>Join CakeOn today</p>

        <form>

          <input
            type="text"
            placeholder="First Name"
          />

          <input
            type="text"
            placeholder="Last Name"
          />

          <input
            type="email"
            placeholder="Email"
          />

          <input
            type="text"
            placeholder="Phone Number"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button type="submit" className="primary-btn">
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;