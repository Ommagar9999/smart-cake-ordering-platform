
import { useEffect, useState } from "react";

import {
  getAdminUsers,
  deleteUser,
  getAdminCakes,
  createCake,
  updateCake,
  deleteCake,
  getAdminOrders,
  cancelOrder,
  updateOrderStatus,
} from "../api/adminApi";

function Admin() {
  // =====================================================
  // USERS
  // =====================================================

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  // =====================================================
  // CAKES
  // =====================================================

  const [cakes, setCakes] = useState([]);
  const [cakesLoading, setCakesLoading] = useState(true);
  const [cakeError, setCakeError] = useState("");

  const [showCakeForm, setShowCakeForm] = useState(false);
  const [editingCake, setEditingCake] = useState(null);

  const [cakeForm, setCakeForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    available: true,
  });

  const [cakeSaving, setCakeSaving] = useState(false);

  // =====================================================
  // ORDERS
  // =====================================================

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError("");

      const response = await getAdminUsers();

      setUsers(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Admin users error:", error);
      setUsersError(error.message || "Unable to load users.");
    } finally {
      setUsersLoading(false);
    }
  };

  // =====================================================
  // LOAD CAKES
  // =====================================================

  const loadCakes = async () => {
    try {
      setCakesLoading(true);
      setCakeError("");

      const response = await getAdminCakes();

      setCakes(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Admin cakes error:", error);
      setCakeError(error.message || "Unable to load cakes.");
    } finally {
      setCakesLoading(false);
    }
  };

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError("");

      const response = await getAdminOrders();

      setOrders(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Admin orders error:", error);
      setOrdersError(error.message || "Unable to load orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadUsers();
    loadCakes();
    loadOrders();
  }, []);

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteUser(id);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== id)
      );

      alert("User deleted successfully.");
    } catch (error) {
      console.error("Delete user error:", error);
      alert(error.message || "Unable to delete user.");
    }
  };

  // =====================================================
  // CAKE FORM CHANGE
  // =====================================================

  const handleCakeChange = (event) => {
    const { name, value, type, checked } = event.target;

    setCakeForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // OPEN ADD CAKE
  // =====================================================

  const openAddCake = () => {
    setEditingCake(null);

    setCakeForm({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "",
      available: true,
    });

    setShowCakeForm(true);
  };

  // =====================================================
  // OPEN EDIT CAKE
  // =====================================================

  const openEditCake = (cake) => {
    setEditingCake(cake);

    setCakeForm({
      name: cake.name || "",
      description: cake.description || "",
      price: cake.price ?? "",
      imageUrl: cake.imageUrl || "",
      category: cake.category || "",
      available: cake.available ?? true,
    });

    setShowCakeForm(true);
  };

  // =====================================================
  // SAVE CAKE
  // =====================================================

  const handleSaveCake = async (event) => {
    event.preventDefault();

    try {
      setCakeSaving(true);

      const data = {
        name: cakeForm.name.trim(),
        description: cakeForm.description.trim(),
        price: Number(cakeForm.price),
        imageUrl: cakeForm.imageUrl.trim(),
        category: cakeForm.category.trim(),
        available: cakeForm.available,
      };

      if (editingCake) {
        const updatedCake = await updateCake(
          editingCake.id,
          data
        );

        setCakes((currentCakes) =>
          currentCakes.map((cake) =>
            cake.id === editingCake.id
              ? updatedCake
              : cake
          )
        );

        alert("Cake updated successfully.");
      } else {
        const newCake = await createCake(data);

        setCakes((currentCakes) => [
          ...currentCakes,
          newCake,
        ]);

        alert("Cake added successfully.");
      }

      setShowCakeForm(false);
      setEditingCake(null);
    } catch (error) {
      console.error("Save cake error:", error);
      alert(error.message || "Unable to save cake.");
    } finally {
      setCakeSaving(false);
    }
  };

  // =====================================================
  // DELETE CAKE
  // =====================================================

  const handleDeleteCake = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this cake?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteCake(id);

      setCakes((currentCakes) =>
        currentCakes.filter((cake) => cake.id !== id)
      );

      alert("Cake deleted successfully.");
    } catch (error) {
      console.error("Delete cake error:", error);
      alert(error.message || "Unable to delete cake.");
    }
  };

  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const updatedOrder = await cancelOrder(id);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === id ? updatedOrder : order
        )
      );

      alert("Order cancelled successfully.");
    } catch (error) {
      console.error("Cancel order error:", error);
      alert(error.message || "Unable to cancel order.");
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const handleOrderStatusChange = async (id, status) => {
    try {
      const updatedOrder = await updateOrderStatus(
        id,
        status
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === id ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error("Update order status error:", error);

      alert(
        error.message || "Unable to update order status."
      );

      loadOrders();
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="page">

      {/* =====================================================
          PAGE HEADING
      ===================================================== */}

      <div className="page-heading">
        <span>ADMIN</span>

        <h1>CakeOn Dashboard</h1>

        <p>
          Manage cakes, orders and registered users.
        </p>
      </div>

      {/* =====================================================
          DASHBOARD CARDS
      ===================================================== */}

      <div className="admin-grid">

        <div className="admin-card">
          <span>🎂</span>

          <h3>Cakes</h3>

          <p>
            {cakesLoading
              ? "Loading..."
              : `${cakes.length} cakes`}
          </p>
        </div>

        <div className="admin-card">
          <span>📦</span>

          <h3>Orders</h3>

          <p>
            {ordersLoading
              ? "Loading..."
              : `${orders.length} orders`}
          </p>
        </div>

        <div className="admin-card">
          <span>👥</span>

          <h3>Users</h3>

          <p>
            {usersLoading
              ? "Loading..."
              : `${users.length} registered users`}
          </p>
        </div>

        <div className="admin-card">
          <span>📊</span>

          <h3>Analytics</h3>

          <p>
            View sales information.
          </p>
        </div>

      </div>

      {/* =====================================================
          CAKE MANAGEMENT
      ===================================================== */}

      <div className="admin-section">

        <div className="admin-section-header">

          <div>
            <span className="admin-section-label">
              CAKE MANAGEMENT
            </span>

            <h2>Manage Cakes</h2>
          </div>

          <button
            className="primary-button"
            onClick={openAddCake}
          >
            + Add Cake
          </button>

        </div>

        {cakeError && (
          <div className="admin-error">
            {cakeError}
          </div>
        )}

        {/* =====================================================
            CAKE FORM
        ===================================================== */}

        {showCakeForm && (
          <form
            className="cake-form"
            onSubmit={handleSaveCake}
          >

            <div className="cake-form-header">

              <h3>
                {editingCake
                  ? "Update Cake"
                  : "Add New Cake"}
              </h3>

              <button
                type="button"
                className="form-close-button"
                onClick={() => {
                  setShowCakeForm(false);
                  setEditingCake(null);
                }}
              >
                ×
              </button>

            </div>

            <div className="cake-form-grid">

              <div className="form-group">
                <label>Cake Name</label>

                <input
                  type="text"
                  name="name"
                  value={cakeForm.name}
                  onChange={handleCakeChange}
                  placeholder="Chocolate Cake"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  value={cakeForm.category}
                  onChange={handleCakeChange}
                  placeholder="Birthday"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={cakeForm.price}
                  onChange={handleCakeChange}
                  placeholder="599"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>

                <input
                  type="url"
                  name="imageUrl"
                  value={cakeForm.imageUrl}
                  onChange={handleCakeChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>

                <textarea
                  name="description"
                  value={cakeForm.description}
                  onChange={handleCakeChange}
                  placeholder="Delicious freshly baked cake..."
                  rows="3"
                />
              </div>

              <div className="cake-availability">

                <label>
                  <input
                    type="checkbox"
                    name="available"
                    checked={cakeForm.available}
                    onChange={handleCakeChange}
                  />

                  Cake Available
                </label>

              </div>

            </div>

            <div className="cake-form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShowCakeForm(false);
                  setEditingCake(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={cakeSaving}
              >
                {cakeSaving
                  ? "Saving..."
                  : editingCake
                  ? "Update Cake"
                  : "Add Cake"}
              </button>

            </div>

          </form>
        )}

        {/* =====================================================
            CAKES TABLE
        ===================================================== */}

        {cakesLoading ? (
          <div className="admin-loading">
            Loading cakes...
          </div>
        ) : cakes.length === 0 ? (
          <div className="admin-empty">
            No cakes found.
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cake</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {cakes.map((cake) => (

                  <tr key={cake.id}>

                    <td>
                      #{cake.id}
                    </td>

                    <td>

                      <div className="cake-admin-info">

                        {cake.imageUrl && (
                          <img
                            src={cake.imageUrl}
                            alt={cake.name}
                          />
                        )}

                        <strong>
                          {cake.name}
                        </strong>

                      </div>

                    </td>

                    <td>
                      {cake.category}
                    </td>

                    <td>
                      ₹
                      {Number(
                        cake.price || 0
                      ).toFixed(2)}
                    </td>

                    <td>

                      <span
                        className={
                          cake.available
                            ? "admin-status available"
                            : "admin-status unavailable"
                        }
                      >
                        {cake.available
                          ? "Available"
                          : "Unavailable"}
                      </span>

                    </td>

                    <td>

                      <div className="admin-actions">

                        <button
                          className="edit-button"
                          onClick={() =>
                            openEditCake(cake)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-user-button"
                          onClick={() =>
                            handleDeleteCake(
                              cake.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =====================================================
          ORDER MANAGEMENT
      ===================================================== */}

      <div className="admin-section">

        <div className="admin-section-header">

          <div>
            <span className="admin-section-label">
              ORDER MANAGEMENT
            </span>

            <h2>Customer Orders</h2>
          </div>

          <button
            className="primary-button"
            onClick={loadOrders}
            disabled={ordersLoading}
          >
            {ordersLoading
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>

        {ordersError && (
          <div className="admin-error">
            {ordersError}
          </div>
        )}

        {ordersLoading ? (
          <div className="admin-loading">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            No orders found.
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Delivery Date</th>
                  <th>Delivery Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order.id}>

                    <td>
                      #{order.id}
                    </td>

                    <td>
                      {order.userId || "N/A"}
                    </td>

                    <td>
                      ₹
                      {Number(
                        order.totalAmount ||
                        0
                      ).toFixed(2)}
                    </td>

                    <td>
                      {order.deliveryDate || "N/A"}
                    </td>

                    <td>
                      {order.deliveryType || "NOW"}
                    </td>

                    <td>

                      <select
                        className="admin-status-select"
                        value={
                          order.status ||
                          "PENDING"
                        }
                        onChange={(event) =>
                          handleOrderStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                        disabled={
                          order.status ===
                          "CANCELLED"
                        }
                      >

                        <option value="PENDING">
                          Pending
                        </option>

                        <option value="CONFIRMED">
                          Confirmed
                        </option>

                        <option value="PREPARING">
                          Preparing
                        </option>

                        <option value="OUT_FOR_DELIVERY">
                          Out for Delivery
                        </option>

                        <option value="DELIVERED">
                          Delivered
                        </option>

                        <option value="CANCELLED">
                          Cancelled
                        </option>

                      </select>

                    </td>

                    <td>

                      <div className="admin-actions">

                        {order.status !==
                          "CANCELLED" &&
                          order.status !==
                            "DELIVERED" && (

                            <button
                              className="delete-user-button"
                              onClick={() =>
                                handleCancelOrder(
                                  order.id
                                )
                              }
                            >
                              Cancel
                            </button>

                          )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =====================================================
          USER MANAGEMENT
      ===================================================== */}

      <div className="admin-section">

        <div className="admin-section-header">

          <div>

            <span className="admin-section-label">
              USER MANAGEMENT
            </span>

            <h2>Registered Users</h2>

          </div>

          <button
            className="primary-button"
            onClick={loadUsers}
            disabled={usersLoading}
          >
            {usersLoading
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>

        {usersError && (
          <div className="admin-error">
            {usersError}
          </div>
        )}

        {usersLoading ? (
          <div className="admin-loading">
            Loading registered users...
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            No users found.
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>
                      #{user.id}
                    </td>

                    <td>
                      {user.firstname ||
                        user.firstName ||
                        ""}{" "}
                      {user.lastName || ""}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.phoneNumber ||
                        user.number ||
                        "N/A"}
                    </td>

                    <td>

                      <span className="admin-role">
                        {user.role || "USER"}
                      </span>

                    </td>

                    <td>

                      <button
                        className="delete-user-button"
                        onClick={() =>
                          handleDeleteUser(
                            user.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </main>
  );
}

export default Admin;

