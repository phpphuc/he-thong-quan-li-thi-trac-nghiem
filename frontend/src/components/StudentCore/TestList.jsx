import { useState, useRef, useEffect } from "react";
import { CiFilter } from "react-icons/ci";
import { FaUndo } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

const TestList = ({ searchQuery }) => {
  const [filterValue, setFilterValue] = useState("default");
  const [typeValue, setTypeValue] = useState("default");
  const [data, setData] = useState([]);
  const filterRef = useRef(null);
  const typeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axiosInstance.get(
          `/students/exams`
        );
        const exam = response.data.exams;
        console.log("Exam data:", exam);
        setData(exam);
      } catch (error) {
        console.error("Error fetching exam:", error);
        alert("Có lỗi xảy ra khi tải bài thi!");
      }
    };

    fetchExamData();
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
    navigate(`/sinhvien/baithi/${testId}`);
  };

  // Filter the data based on the selected filters and search query
  const filteredData = data
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
          item.created_at.includes(searchQuery ? searchQuery : ""));

      const matchesType =
        typeValue === "default" ||
        (typeValue === "thirieng" && item.type === "Thi riêng") ||
        (typeValue === "thitaptrung" && item.type === "Tập trung");

      return matchesSearch && matchesFilter && matchesType;
    })
    .sort((a, b) => {
      if (filterValue === "ngaytao") {
        // Sort by created_at, latest first
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (filterValue === "monhoc" || filterValue === "lophoc") {
        // Sort by subject (for monhoc) or test_name (for lophoc)
        // const field = filterValue === "monhoc" ? "subject.name" : "test_name";
        // return a[field].localeCompare(b[field]);
         // Sort by subject (for monhoc) or test_name (for lophoc)
        const field = filterValue === "monhoc" ? "subject.name" : "test_name";
        const aValue = field.split('.').reduce((o, i) => o[i], a);
        const bValue = field.split('.').reduce((o, i) => o[i], b);
        return aValue && bValue ? aValue.localeCompare(bValue) : 0;

      }
      return 0;
    });

  return (
    <div className="w-full h-full max-w-6xl mx-auto bg-gray-100 lg:px-10 py-5 font-nunito">
      <h1 className="text-2xl font-bold mb-4">
        Danh sách bài thi dành cho tôi
      </h1>

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
              {/* <th className="px-4 py-2">Ngày tạo</th> */}
              {/* <th className="px-4 py-2">Loại</th> */}
              <th className="px-4 py-2">Thời gian bắt đầu</th>
              <th className="px-4 py-2">Thời lượng (phút)</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 text-center">{item.id}</td>
                <td className="px-4 py-2 text-center">{item.test_name}</td>
                <td className="px-4 py-2 text-center">{item.subject.name}</td>
                {/* <td className="px-4 py-2 text-center">{new Date(item.created_at).toLocaleDateString()}</td> */}
                {/* <td className="px-4 py-2 text-center">{item.type}</td> */}
                <td className="px-4 py-2 text-center">{new Date(item.start_time).toLocaleString()}</td>
                <td className="px-4 py-2 text-center">{item.time}</td>
                {/* <td className="px-4 py-2 text-center">
                  <button
                    className={`font-bold py-2 px-4 rounded-lg transition duration-300 ${
                      item.status === 'Taken' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
                    }`}
                    onClick={() => goToCheck(item.id)}
                    disabled={item.status === 'Taken'}
                  >Làm bài</button>
                </td> */}
                <td className="px-4 py-2 text-center">
                  {item.status === 'Not Started' && (
                    <button
                      className="font-bold py-2 px-4 rounded-lg bg-gray-400 cursor-not-allowed"
                      disabled
                    >
                      Chưa bắt đầu
                    </button>
                  )}
                  {item.status === 'Not Taken' && (
                    <button
                      className="font-bold py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-700 text-white transition duration-300"
                      onClick={() => goToCheck(item.id)}
                    >
                      Làm bài
                    </button>
                  )}
                  {item.status === 'Taken' && (
                    <button
                      className="font-bold py-2 px-4 rounded-lg bg-gray-400 cursor-not-allowed"
                      disabled
                    >
                      Đã làm
                    </button>
                  )}
                  {item.status === 'Expired' && (
                    <button
                      className="font-bold py-2 px-4 rounded-lg bg-red-500 cursor-not-allowed"
                      disabled
                    >
                      Hết hạn
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          Hiển thị 1-{filteredData.length} trong số {data.length}
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

export default TestList;