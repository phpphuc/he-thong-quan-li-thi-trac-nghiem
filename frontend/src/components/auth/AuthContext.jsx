import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [studentCurrentView, setStudentCurrentView] = useState("baithi");
  const [generalCurrentView, setGeneralCurrentView] = useState("dethi");

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        studentCurrentView,
        setStudentCurrentView,
        generalCurrentView,
        setGeneralCurrentView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
