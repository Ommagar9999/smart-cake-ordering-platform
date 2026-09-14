import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function RegisterModal({
  isOpen,
  onClose,
  onLogin,
}) {
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.phoneNumber.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber.trim(),
      });

      setSuccess(
        "Registration successful! Please login."
      );

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
      });

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setError("");
    setSuccess("");

    onClose();

    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="auth-modal register-modal"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
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
          🎂
        </div>

        {/* TITLE */}
        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Join CakeOn and make every occasion sweeter.
        </p>

        {/* ERROR */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        {/* REGISTER FORM */}
        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div>
              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />
            </div>

            <div>
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />
            </div>

          </div>

          <label htmlFor="register-email">
            Email
          </label>

          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <label htmlFor="phoneNumber">
            Phone Number
          </label>

          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            placeholder="Enter phone number"
            value={form.phoneNumber}
            onChange={handleChange}
            autoComplete="tel"
          />

          <label htmlFor="register-password">
            Password
          </label>

          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* LOGIN */}
        <p className="auth-switch">
          Already have an account?

          <button
            type="button"
            onClick={switchToLogin}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default RegisterModal;