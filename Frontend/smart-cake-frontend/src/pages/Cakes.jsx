import { useEffect, useState } from "react";
import { getAllCakes } from "../api/cakeApi";
import CakeCard from "../components/CakeCard";

function Cakes({ onLogin }) {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCakes = async () => {
      try {
        const response = await getAllCakes();

        const data =
          Array.isArray(response)
            ? response
            : response?.data || [];

        setCakes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCakes();
  }, []);

  return (
    <main className="page">

      <div className="page-heading">
        <span>OUR COLLECTION</span>

        <h1>
          Choose Your Cake
        </h1>

        <p>
          Freshly baked cakes for every occasion.
        </p>
      </div>

      {loading && (
        <div className="loading">
          Loading cakes...
        </div>
      )}

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="cake-grid">

          {cakes.length > 0 ? (
            cakes.map((cake) => (
              <CakeCard
                key={cake.id}
                cake={cake}
                onLogin={onLogin}
              />
            ))
          ) : (
            <div className="empty-state">
              <span>🎂</span>
              <h2>No cakes found</h2>
              <p>
                Cakes will appear here once
                Cake Service is running.
              </p>
            </div>
          )}

        </div>
      )}

    </main>
  );
}

export default Cakes;