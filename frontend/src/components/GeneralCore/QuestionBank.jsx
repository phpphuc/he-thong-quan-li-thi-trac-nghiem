import { useState, useEffect, useRef, useCallback } from "react";
import { CiFilter } from "react-icons/ci";
import { FaUndo } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import {
  IoInformationCircle,
  IoTrashSharp,
  IoCheckmarkDone,
} from "react-icons/io5";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../common/DeleteModal";
import Notification from "../common/Notification";
import "../../assets/customCSS/LoadingEffect.css";
import axiosInstance from "../../utils/axiosConfig";

const QuestionBank = ({ searchQuery }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [filterValue, setFilterValue] = useState("default");
  const [typeValue, setTypeValue] = useState("default");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
  });

  const filterRef = useRef(null);
  const typeRef = useRef(null);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/questions"
      );
      setQuestions(response.data);
      setFilteredQuestions(response.data);
    } catch (err) {
      console.log(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filterQuestions = useCallback(() => {
    let filtered = [...questions];

    // Lọc theo tìm kiếm
    if (searchQuery) {
      filtered = filtered.filter((question) =>
        question.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo môn học hoặc ngày tạo
    if (filterValue !== "default") {
      if (filterValue === "monhoc") {
        filtered = filtered.sort((a, b) =>
          a.subject_name.localeCompare(b.subject_name)
        );
      } else if (filterValue === "ngaytao") {
        filtered = filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }
    }

    // Lọc theo độ khó
    if (typeValue !== "default") {
      filtered = filtered.filter((question) => question.level === typeValue);
    }

    setFilteredQuestions(filtered);
  }, [filterValue, questions, searchQuery, typeValue]);

  useEffect(() => {
    filterQuestions();
  }, [filterValue, typeValue, searchQuery, questions, filterQuestions]);

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
    setFilteredQuestions(questions);
  };

  const handleDeleteClick = (questionId) => {
    setSelectedQuestionId(questionId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (questionId) => {
    try {
      await axiosInstance.delete(
        `/questions/${questionId}`
      );
      await fetchQuestions();
      setNotification({
        isVisible: true,
        message: "Xóa câu hỏi thành công!",
        bgColor: "green",
        icon: <IoCheckmarkDone />,
      });
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.log(err.message || "Error deleting question");
      setNotification({
        isVisible: true,
        message: "Đã xảy ra lỗi khi xóa câu hỏi! Hãy thử lại sau.",
        bgColor: "red",
        icon: <ShieldX />,
      });
      setIsDeleteModalOpen(false);
    }
  };

  return isLoading ? (
    <div className="loader w-[50px] h-[50px] bg-gray-100 py-5 font-nunito absolute top-1/3 left-1/2 "></div>
  ) : (
    <div className="w-full h-full px-12 mx-auto bg-gray-100 py-5 font-nunito">
      <h1 className="text-2xl font-bold mb-4">Ngân hàng câu hỏi</h1>

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
            <option value="default">-- Độ khó --</option>
            <option value="Nhận biết">Nhận biết</option>
            <option value="Thông hiểu">Thông hiểu</option>
            <option value="Vận dụng">Vận dụng</option>
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
            onClick={() => navigate("/giangvien/taomoicauhoi")}
            className="w-28 mr-6 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            Tạo mới
          </button>
        </div>
      </div>

      <Notification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        bgColor={notification.bgColor}
        icon={notification.icon}
      />

      <div className="overflow-x-auto max-h-[470px] bg-white rounded-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-center">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Tên câu hỏi</th>
              <th className="px-4 py-2">Môn học</th>
              <th className="px-4 py-2">Ngày tạo</th>
              <th className="px-4 py-2">Độ khó</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 text-center">{item.id}</td>
                <td className="px-4 py-2 text-center">{item.question}</td>
                <td className="px-4 py-2 text-center">{item.subject_name}</td>
                <td className="px-4 py-2 text-center">{item.created_at}</td>
                <td className="px-4 py-2 text-center">{item.level}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    onClick={() => navigate(`/giangvien/cauhoi/${item.id}`)}
                  >
                    <IoInformationCircle size={24} />
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-2 py-2 px-4 rounded-lg transition duration-300"
                    onClick={() => handleDeleteClick(item.id)}
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
          Hiển thị {filteredQuestions.length > 0 ? "1" : "0"}-
          {filteredQuestions.length} trong số {filteredQuestions.length}
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

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        questionId={selectedQuestionId}
      />
    </div>
  );
};

export default QuestionBank;
