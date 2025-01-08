import { useState, useEffect, useRef } from "react";
import { CiFilter } from "react-icons/ci";
import { FaUndo } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import {
  IoInformationCircle,
  IoTrashSharp,
  IoCheckmarkDone,
  IoArrowBackCircleOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../common/DeleteModal";
import Notification from "../../common/Notification";
import axios from "axios";
import "../../../assets/customCSS/LoadingEffect.css";

const ExamCreation = ({ searchQuery }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [filterValue, setFilterValue] = useState("default");
  const [typeValue, setTypeValue] = useState("default");
  const [subjects, setSubjects] = useState([]);
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

  // const fetchQuestions = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(
  //       "http://127.0.0.1:8000/api/v1/questions"
  //     );
  //     setQuestions(response.data);
  //     setFilteredQuestions(response.data);
  //   } catch (err) {
  //     console.log(err.message || "Something went wrong");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchSubjects = async () => {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:8000/api/v1/subjects");
  //     setSubjects(response.data);
  //   } catch (err) {
  //     console.log(err.message || "Error fetching subjects");
  //   }
  // };

  // useEffect(() => {
  //   fetchQuestions();
  //   // fetchSubjects();
  // }, []);

  useEffect(() => {
    filterQuestions();
  }, [filterValue, typeValue, searchQuery, questions]);

  const filterQuestions = () => {
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
          a.subject_id.localeCompare(b.subject_id)
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
    setFilteredQuestions(questions);
  };

  // const handleDeleteClick = (questionId) => {
  //   setSelectedQuestionId(questionId);
  //   setIsDeleteModalOpen(true);
  // };

  // const handleDeleteConfirm = async (questionId) => {
  //   try {
  //     await axios.delete(
  //       `http://127.0.0.1:8000/api/v1/questions/${questionId}`
  //     );
  //     await fetchQuestions();
  //     setNotification({
  //       isVisible: true,
  //       message: "Xóa câu hỏi thành công!",
  //       bgColor: "green",
  //       icon: <IoCheckmarkDone />,
  //     });
  //     setIsDeleteModalOpen(false);
  //   } catch (err) {
  //     console.log(err.message || "Error deleting question");
  //     setNotification({
  //       isVisible: true,
  //       message: "Đã xảy ra lỗi khi xóa câu hỏi! Hãy thử lại sau.",
  //       bgColor: "red",
  //       icon: <ShieldX />,
  //     });
  //     setIsDeleteModalOpen(false);
  //   }
  // };

  return isLoading ? (
    <div className="loader w-[50px] h-[50px] bg-gray-100 py-5 font-nunito absolute top-1/3 left-1/2 "></div>
  ) : (
    <div className="w-full h-full px-12 mx-auto bg-gray-100 py-5 font-nunito">
      <h1 className="text-2xl font-bold mb-4">Chọn đề cho kỳ thi</h1>

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
            <option value="default">-- Môn học --</option>
            <option value="monhoc">OOP</option>
            <option value="ngaytao">OOAD</option>
          </select>
          <select
            value={typeValue}
            ref={typeRef}
            onChange={handleChangeType}
            className="px-2 py-1 border-2 rounded-lg cursor-pointer"
          >
            <option value="default">-- Loại --</option>
            <option value="EASY">Thi tập trung</option>
            <option value="NORMAL">Thi riêng</option>

          </select>
          <button
            className="flex items-center justify-center hover:border-red-500 border-2 p-1 rounded-lg"
            onClick={handleReset}
          >
            <FaUndo className="ml-2 text-red-500" />
            <span className="px-2 text-red-500 font-medium">Hoàn tác</span>
          </button>
          </div>
          <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            <div className="flex items-center justify-center">
              <IoArrowBackOutline size={20} className="mr-1" />
              Quay lại
            </div>
          </button>
          <button
            // onClick={() => navigate("/giangvien/taomoicauhoi")}
            className="w-28 mr-6 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            Thêm vào
          </button>
          </div>

      </div>

      {/* <Notification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        bgColor={notification.bgColor}
        icon={notification.icon}
      /> */}

      <div className="overflow-x-auto max-h-[470px] bg-white rounded-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-center">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Tên bộ đề</th>
              <th className="px-4 py-2">Môn học</th>
              <th className="px-4 py-2">Ngày tạo</th>
              <th className="px-4 py-2">Cấu trúc</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
             {/* {filteredQuestions.map((item) => (
              <tr key={item.id} className="border-b"> */}
                {/* <td className="px-4 py-2 text-center">{item.id}</td>
                <td className="px-4 py-2 text-center">{item.question}</td>
                <td className="px-4 py-2 text-center">{item.subject_id}</td>
                <td className="px-4 py-2 text-center">{item.created_at}</td>
                <td className="px-4 py-2 text-center">{item.level}</td> */}
                <td className="px-4 py-2 text-center">1</td>
                <td className="px-4 py-2 text-center">Đề OOP</td>
                <td className="px-4 py-2 text-center">OOP</td>
                <td className="px-4 py-2 text-center">01 December 2024</td>
                <td className="px-4 py-2 text-center">Thi cuối kỳ</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    // onClick={() => navigate(`/giangvien/cauhoi/${item.id}`)}
                  >
                    <IoInformationCircle size={24} />
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-2 py-2 px-4 rounded-lg transition duration-300"
                    // onClick={() => handleDeleteClick(item.id)}
                  >
                    <IoTrashSharp size={24} />
                  </button>
                </td>
              {/* </tr>
            ))}  */}
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

      {/* <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        questionId={selectedQuestionId}
      /> */}
    </div>
  );
};

export default ExamCreation;
