function Login() {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p>Login to your CakeOn account</p>

        <form>

          <input
            type="email"
            placeholder="Email"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button type="submit" className="primary-btn">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;