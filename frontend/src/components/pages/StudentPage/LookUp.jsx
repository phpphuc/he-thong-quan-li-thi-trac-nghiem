import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LookUpDetails from "../../StudentCore/LookUpDetails";
import Header from "../../common/Header";
import StudentSidebar from "../../common/StudentSidebar";

const LookUp = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleNavigation = (view) => {
    if (view === "baithi") {
      navigate("/sinhvien");
    } else if (view === "tracuu") {
      navigate("/sinhvien");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        currentView="tracuu"
        onNavigate={handleNavigation}
      />
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
            <LookUpDetails />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookUp;
