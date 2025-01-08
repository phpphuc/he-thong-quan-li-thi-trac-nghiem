import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const StudentSidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const { studentCurrentView, setStudentCurrentView } = useAuth();

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
          onClick={() => navigate("/sinhvien")}
        >
          Trắc nghiệm
        </div>
        <nav>
          <button
            onClick={() => {
              setStudentCurrentView("baithi");
              navigate("/sinhvien");
            }}
            className={`block w-full mb-6 ${
              studentCurrentView === "baithi"
                ? "text-blue-500"
                : "text-gray-600"
            }`}
          >
            Bài thi
          </button>
          <button
            onClick={() => {
              setStudentCurrentView("tracuu");
              navigate("/sinhvien");
            }}
            className={`block w-full ${
              studentCurrentView === "tracuu"
                ? "text-blue-500"
                : "text-gray-600"
            }`}
          >
            Tra cứu
          </button>
        </nav>
      </div>
    </div>
  );
};

export default StudentSidebar;
