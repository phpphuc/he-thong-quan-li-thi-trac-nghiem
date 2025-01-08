import { useState, useCallback } from "react";
import { FaCaretDown, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({
  isSidebarOpen,
  setSidebarOpen,
  onSearch,
  searchPlaceholder = "Tìm kiếm",
}) => {
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).attributes.name
    : null;
  const type = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).type
    : null;

  const handleSearch = useCallback(
    (e) => {
      if (onSearch) {
        onSearch(e.target.value);
      }
    },
    [onSearch]
  );

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4 bg-white">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 ml-4 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex-1 mx-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:border-blue-500"
              placeholder={searchPlaceholder}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4 cursor-pointer">
            {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span> */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div className="flex items-center justify-center relative">
            <div className="mr-2">
              <img
                src="https://i.pinimg.com/736x/74/f4/f5/74f4f548392fbdafbe8a5d9764c83eaf.jpg"
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div className="mr-4">
              <p className="font-nunito font-bold">{username}</p>
              <p className="font-nunito font-light">{type}</p>
            </div>
            <div
              className="mr-4 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaCaretDown
                size={24}
                className={`transform transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-4 top-full z-50 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out ${
                isDropdownOpen
                  ? "transform opacity-100 scale-100"
                  : "transform opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="py-1">
                <button className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors">
                  <FaUserEdit className="text-gray-500" />
                  <span>Cập nhật thông tin</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <FaSignOutAlt className="text-red-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
