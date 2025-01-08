import { useState } from "react";
import GeneralSidebar from "../../common/GeneralSidebar";
import Header from "../../common/Header";
import QuestionInfo from "../../GeneralCore/QuestionInfo";

const QuestionDetail = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
          />
          <div className="bg-gray-100 rounded-lg shadow-sm mb-6">
            <QuestionInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
