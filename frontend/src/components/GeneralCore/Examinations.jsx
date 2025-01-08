import { useState, useEffect, useRef } from "react";
import { CiFilter } from "react-icons/ci";
import { FaUndo } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoInformationCircle, IoTrashSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import "../../assets/customCSS/LoadingEffect.css";

const Examinations = ({ searchQuery }) => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [filterValue, setFilterValue] = useState("default");
  const [typeValue, setTypeValue] = useState("default");
  const [isLoading, setIsLoading] = useState(false);

  const filterRef = useRef(null);
  const typeRef = useRef(null);
  const navigate = useNavigate();

  const fetchExams = async () => {
    setIsLoading(true);
    try {
      let id = JSON.parse(localStorage.getItem("user")).id;
      const response = await axiosInstance.get(
        `/teachers/${id}/exams`
      );
      setExams(response.data.exams);
      setFilteredExams(response.data.exams);
    } catch (err) {
      console.log(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    filterExams();
  }, [filterValue, typeValue, searchQuery, exams]);

  const filterExams = () => {
    let filtered = [...exams];

    // Lọc theo tìm kiếm
    if (searchQuery) {
      filtered = filtered.filter(
        (exam) =>
          exam.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo môn học hoặc ngày tạo
    if (filterValue !== "default") {
      if (filterValue === "monhoc") {
        filtered = filtered.sort((a, b) =>
          a.subject.name.localeCompare(b.subject.name)
        );
      } else if (filterValue === "ngaytao") {
        filtered = filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }
    }

    // Lọc theo loại kỳ thi
    if (typeValue !== "default") {
      filtered = filtered.filter((exam) => exam.type === typeValue);
    }

    setFilteredExams(filtered);
  };

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
    setFilteredExams(exams);
  };

  return isLoading ? (
    <div className="loader w-[50px] h-[50px] bg-gray-100 py-5 font-nunito absolute top-1/3 left-1/2 "></div>
  ) : (
    <div className="w-full h-full px-12 mx-auto bg-gray-100 py-5 font-nunito">
      <h1 className="text-2xl font-bold mb-4">Quản lý kỳ thi</h1>

      <div className="flex items-center my-5 justify-between">
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
            <option value="ngaytao">Ngày tạo</option>
          </select>
          <select
            value={typeValue}
            ref={typeRef}
            onChange={handleChangeType}
            className="px-2 py-1 border-2 rounded-lg cursor-pointer"
          >
            <option value="default">-- Loại kỳ thi --</option>
            <option value="Thi riêng">Thi riêng</option>
            <option value="Tập trung">Tập trung</option>
          </select>
          <button
            className="flex items-center justify-center hover:border-red-500 border-2 p-1 rounded-lg"
            onClick={handleReset}
          >
            <FaUndo className="ml-2 text-red-500" />
            <span className="px-2 text-red-500 font-medium">Hoàn tác</span>
          </button>
        </div>
        <div>
          <button
            onClick={() => navigate("/giangvien/chitietkythi")}
            className="w-28 mr-6 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            Tạo mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[470px] bg-white rounded-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-center">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Tên kỳ thi</th>
              <th className="px-4 py-2">Môn học</th>
              <th className="px-4 py-2">Ngày tạo</th>
              <th className="px-4 py-2">Loại</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam.id} className="border-b">
                <td className="px-4 py-2 text-center">{exam.id}</td>
                <td className="px-4 py-2 text-center">{exam.test_name}</td>
                <td className="px-4 py-2 text-center">{exam.subject.name}</td>
                <td className="px-4 py-2 text-center">
                  {new Date(exam.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-center">{exam.type}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    onClick={() => navigate(`/giangvien/chitietkythi/${exam.id}`)}
                  >
                    <IoInformationCircle size={24} />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold ml-2 py-2 px-4 rounded-lg transition duration-300"
                    onClick={() => handleDeleteClick(exam.id)}
                  >
                    <IoTrashSharp size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          Hiển thị {filteredExams.length > 0 ? "1" : "0"}-
          {filteredExams.length} trong số {filteredExams.length}
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

export default Examinations;