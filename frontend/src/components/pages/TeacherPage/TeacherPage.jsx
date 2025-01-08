import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import GeneralSidebar from "../../common/GeneralSidebar";
import Examinations from "../../GeneralCore/Examinations";
import TestBank from "../../GeneralCore/TestBank";
import QuestionBank from "../../GeneralCore/QuestionBank";
import Statistics from "../../GeneralCore/Statistics";
import Header from "../../common/Header";

const TeacherPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { generalCurrentView } = useAuth();

  // Map các component
  const componentMap = {
    kythi: <Examinations searchQuery={searchQuery} />,
    dethi: <TestBank searchQuery={searchQuery} />,
    cauhoi: <QuestionBank searchQuery={searchQuery} />,
    thongke: <Statistics searchQuery={searchQuery} />,
  };

  // Map các placeholder
  const searchPlaceholders = {
    kythi: "Tìm kiếm kỳ thi...",
    dethi: "Tìm kiếm đề thi...",
    cauhoi: "Tìm kiếm câu hỏi...",
    thongke: "Tìm kiếm thống kê...",
  };

  // Lấy placeholder dựa trên view hiện tại
  const currentPlaceholder =
    searchPlaceholders[generalCurrentView] || "Tìm kiếm...";

  return (
    <div className="flex h-screen bg-gray-50">
      <GeneralSidebar isSidebarOpen={isSidebarOpen} />
      <div
        className={`flex-1 bg-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div>
          <Header
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onSearch={setSearchQuery}
            searchPlaceholder={currentPlaceholder}
          />
          <div className="bg-gray-100 rounded-lg shadow-sm mb-6 h-[100vh] relative">
            {componentMap[generalCurrentView] || <div>View not found</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
