import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  // Kiểm tra xem localStorage có chứa key "user" hay không
  const user = JSON.parse(localStorage.getItem("user"));

  // Nếu không có user, điều hướng đến trang đăng nhập
  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  // Đã đăng nhập
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
