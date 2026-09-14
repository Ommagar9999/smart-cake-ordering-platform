import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function LoginModal({
  isOpen,
  onClose,
  onRegister,
  onSuccess,
}) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: email.trim(),
        password,
      });

      setEmail("");
      setPassword("");
      setError("");

      onClose();

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    setEmail("");
    setPassword("");
    setError("");

    onClose();

    if (onRegister) {
      onRegister();
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="auth-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* ICON */}
        <div className="auth-modal-icon">
          🍰
        </div>

        {/* TITLE */}
        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Login to continue your sweet journey.
        </p>

        {/* ERROR */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>

          <label htmlFor="login-email">
            Email
          </label>

          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
          />

          <label htmlFor="login-password">
            Password
          </label>

          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* REGISTER */}
        <p className="auth-switch">
          Don't have an account?

          <button
            type="button"
            onClick={handleRegisterClick}
          >
            Create Account
          </button>
        </p>

      </div>
    </div>
  );
}

export default LoginModal;