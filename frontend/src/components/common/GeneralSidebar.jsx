import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const GeneralSidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const { generalCurrentView, setGeneralCurrentView } = useAuth();

  return (
    <div
      className={`fixed text-center h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-64"
      }`}
      style={{ width: "16rem" }}
    >
      <div className="p-4">
        <div
          className="text-blue-500 text-xl font-medium mb-12 cursor-pointer"
          onClick={() => navigate("/giangvien")}
        >
          Trắc nghiệm
        </div>
        <nav>
          <button
            onClick={() => {
              setGeneralCurrentView("kythi");
              navigate("/giangvien");
            }}
            className={`block w-full mb-6 ${
              generalCurrentView === "kythi" ? "text-blue-500" : "text-gray-600"
            }`}
          >
            Kỳ thi
          </button>
          <button
            onClick={() => {
              setGeneralCurrentView("dethi");
              navigate("/giangvien");
            }}
            className={`block w-full mb-6 ${
              generalCurrentView === "dethi" ? "text-blue-500" : "text-gray-600"
            }`}
          >
            Đề thi
          </button>
          <button
            onClick={() => {
              setGeneralCurrentView("cauhoi");
              navigate("/giangvien");
            }}
            className={`block w-full mb-6 ${
              generalCurrentView === "cauhoi"
                ? "text-blue-500"
                : "text-gray-600"
            }`}
          >
            Câu hỏi
          </button>
          <button
            onClick={() => {
              setGeneralCurrentView("thongke");
              navigate("/giangvien");
            }}
            className={`block w-full mb-6 ${
              generalCurrentView === "thongke"
                ? "text-blue-500"
                : "text-gray-600"
            }`}
          >
            Thống kê
          </button>
        </nav>
      </div>
    </div>
  );
};

export default GeneralSidebar;
