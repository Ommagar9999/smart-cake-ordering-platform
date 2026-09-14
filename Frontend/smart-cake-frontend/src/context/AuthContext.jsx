
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../api/authApi";

import {
  getUserByEmail,
} from "../api/userApi";


const AuthContext = createContext(null);


// ==========================================
// NORMALIZE ROLE
// ==========================================

const normalizeRole = (role) => {
  if (!role) {
    return null;
  }

  return role
    .toString()
    .replace("ROLE_", "")
    .trim()
    .toUpperCase();
};


export const AuthProvider = ({ children }) => {

  // ==========================================
  // INITIAL STATE
  // ==========================================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState(
    normalizeRole(
      localStorage.getItem("role")
    )
  );

  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("user")
    ) || null
  );

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      !!localStorage.getItem("token")
    );


  // ==========================================
  // LOAD USER WHEN APP STARTS
  // ==========================================

  useEffect(() => {

    const loadUser = async () => {

      const savedToken =
        localStorage.getItem("token");

      const savedUser =
        localStorage.getItem("user");

      const savedRole =
        localStorage.getItem("role");


      // No token
      if (!savedToken) {
        return;
      }


      // Restore login
      setToken(savedToken);
      setIsLoggedIn(true);


      // Restore role
      if (savedRole) {

        const normalizedRole =
          normalizeRole(savedRole);

        setRole(normalizedRole);

        localStorage.setItem(
          "role",
          normalizedRole
        );
      }


      // ========================================
      // USER ALREADY SAVED
      // ========================================

      if (savedUser) {

        try {

          setUser(
            JSON.parse(savedUser)
          );

        } catch (error) {

          console.error(
            "Invalid saved user:",
            error
          );

          localStorage.removeItem("user");
        }

        return;
      }


      // ========================================
      // USER NOT SAVED
      // GET USER FROM JWT EMAIL
      // ========================================

      try {

        const payload =
          JSON.parse(
            atob(
              savedToken.split(".")[1]
            )
          );


        const email =
          payload.sub ||
          payload.email;


        if (!email) {

          console.error(
            "Email not found in JWT"
          );

          return;
        }


        const userData =
          await getUserByEmail(email);


        setUser(userData);


        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );

      } catch (error) {

        console.error(
          "Failed to load user:",
          error
        );
      }
    };


    loadUser();

  }, []);


  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (data) => {

    const response =
      await loginUser(data);


    // ========================================
    // TOKEN
    // ========================================

    localStorage.setItem(
      "token",
      response.token
    );


    // ========================================
    // NORMALIZE ROLE
    // ========================================

    const userRole =
      normalizeRole(response.role);


    localStorage.setItem(
      "role",
      userRole
    );


    // ========================================
    // UPDATE STATE
    // ========================================

    setToken(response.token);

    setRole(userRole);

    setIsLoggedIn(true);


    // ========================================
    // GET COMPLETE USER DETAILS
    // ========================================

    try {

      const payload =
        JSON.parse(
          atob(
            response.token.split(".")[1]
          )
        );


      const email =
        payload.sub ||
        payload.email;


      if (email) {

        const userData =
          await getUserByEmail(email);


        setUser(userData);


        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );
      }

    } catch (error) {

      console.error(
        "Failed to load user details:",
        error
      );
    }


    return response;
  };


  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (data) => {

    const response =
      await registerUser(data);

    return response;
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("user");


    setToken(null);

    setRole(null);

    setUser(null);

    setIsLoggedIn(false);
  };


  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        isLoggedIn,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// ==========================================
// USE AUTH
// ==========================================

export const useAuth = () => {

  const context =
    useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }


  return context;
};

