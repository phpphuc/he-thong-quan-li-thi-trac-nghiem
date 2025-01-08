import { useState, useRef, useEffect } from "react";
import { CiFilter } from "react-icons/ci";
import { FaUndo } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

const TestHistory = ({ searchQuery }) => {
  const [filterValue, setFilterValue] = useState("default");
  const [typeValue, setTypeValue] = useState("default");
  const [completedExams, setCompletedExams] = useState([]);
  const filterRef = useRef(null);
  const typeRef = useRef(null);
  const navigate = useNavigate();

  const data = [
    {
      id: "00001",
      test_name: "OOP Exam 1",
      subject: "OOP",
      create_at: "2023-11-01",
      type: "Tập trung",
    },
    {
      id: "00002",
      test_name: "OOP Exam 2",
      subject: "OOP",
      create_at: "2023-12-01",
      type: "Thi riêng",
    },
    {
      id: "00003",
      test_name: "Data Structures Quiz",
      subject: "Data Structures",
      create_at: "2024-01-15",
      type: "Tập trung",
    },
    {
      id: "00004",
      test_name: "Algorithms Final",
      subject: "Algorithms",
      create_at: "2024-02-10",
      type: "Thi riêng",
    },
  ];

  useEffect(() => {
    const fetchCompletedExams = async () => {
      try {
        const response = await axiosInstance.get(`/students/completed-exams`);
        const data = await response.data;
        setCompletedExams(data.completed_exams);
      } catch (error) {
        console.error("Error fetching completed exams:", error);
        alert("Có lỗi xảy ra khi tải bài thi!");
      }
    };
    fetchCompletedExams();
  }, []);

  const handleChangeFilter = (e) => {
    setFilterValue(e.target.value);
    filterRef.current.blur();
  };

  const handleChangeType = (e) => {
    setTypeValue(e.target.value);
    typeRef.current.blur();
  };

  const handleReset = () => {
    setFilterValue("default");
    setTypeValue("default");
  };

  const goToCheck = (testId) => {
    navigate(`/sinhvien/tracuu/${testId}`);
  };

  // Filter the data based on the selected filters and search query
   const filteredData = completedExams
    .filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterValue === "default" ||
        (filterValue === "monhoc" &&
          item.subject.name
            .toLowerCase()
            .includes(searchQuery ? searchQuery.toLowerCase() : "")) ||
        (filterValue === "lophoc" &&
          item.test_name
            .toLowerCase()
            .includes(searchQuery ? searchQuery.toLowerCase() : "")) ||
        (filterValue === "ngaytao" &&
          item.exam_date.includes(searchQuery ? searchQuery : ""));

      const matchesType =
        typeValue === "default" ||
        (typeValue === "thirieng" && item.type === "Thi riêng") ||
        (typeValue === "thitaptrung" && item.type === "Tập trung");

      return matchesSearch && matchesFilter && matchesType;
    })
    .sort((a, b) => {
      if (filterValue === "ngaytao") {
        // Sort by exam_date, latest first
        return new Date(b.exam_date) - new Date(a.exam_date);
      } else if (filterValue === "monhoc" || filterValue === "lophoc") {
        // Sort by subject (for monhoc) or test_name (for lophoc)
        const field = filterValue === "monhoc" ? "subject.name" : "test_name";
        const aValue = field.split('.').reduce((o, i) => o[i], a);
        const bValue = field.split('.').reduce((o, i) => o[i], b);
        return aValue && bValue ? aValue.localeCompare(bValue) : 0;
      }
      return 0;
    });

  return (
    <div className="w-full h-full max-w-6xl mx-auto bg-gray-100 px-10 py-5 font-nunito">
      <h1 className="text-2xl font-bold mb-4">Lịch sử bài thi đã làm</h1>

      <div className="flex items-center my-5">
        <div className="flex items-center space-x-4">
          <CiFilter size={24} />
          <span className="font-medium">Lọc theo</span>
          <select
            value={filterValue}
            ref={filterRef}
            onChange={handleChangeFilter}
            className="px-2 py-1 border-2 rounded-lg cursor-pointer"
          >
            <option value="default">-- Tất cả --</option>
            <option value="monhoc">Môn học</option>
            <option value="lophoc">Tên bài thi</option>
            <option value="ngaytao">Ngày tạo</option>
          </select>
          <select
            value={typeValue}
            ref={typeRef}
            onChange={handleChangeType}
            className="px-2 py-1 border-2 rounded-lg cursor-pointer"
          >
            <option value="default">-- Loại kỳ thi --</option>
            <option value="thirieng">Thi riêng</option>
            <option value="thitaptrung">Thi tập trung</option>
          </select>
          <button
            className="flex items-center justify-center hover:border-red-500 border-2 p-1 rounded-lg"
            onClick={handleReset}
          >
            <FaUndo className="ml-2 text-red-500" />
            <span className="px-2 text-red-500 font-medium">Hoàn tác</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[470px] bg-white rounded-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-center">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Tên bài thi</th>
              <th className="px-4 py-2">Môn học</th>
              <th className="px-4 py-2">Ngày thi</th>
              <th className="px-4 py-2">Loại</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 text-center">{item.id}</td>
                <td className="px-4 py-2 text-center">{item.test_name}</td>
                <td className="px-4 py-2 text-center">{item.subject.name}</td>
                <td className="px-4 py-2 text-center">
                  {new Date(item.submission_time).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">{item.type}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    onClick={() => goToCheck(item.id)}
                  >
                    Tra cứu
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          Hiển thị 1-{filteredData.length} trong số {completedExams.length}
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 rounded hover:bg-gray-200 transition duration-300">
            <MdKeyboardArrowLeft />
          </button>
          <button className="px-3 py-2 rounded hover:bg-gray-200 transition duration-300">
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestHistory;
