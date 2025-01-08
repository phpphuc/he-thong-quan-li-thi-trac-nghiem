import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";
import {
  IoTrashSharp,
  IoArrowBackOutline,
  IoCheckmarkDone,
} from "react-icons/io5";
import { ShieldX } from "lucide-react";
import DeleteModal from "../common/DeleteModal";
import Notification from "../common/Notification";
import axiosInstance from "../../utils/axiosConfig";

const QuestionInfo = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [questionDetail, setQuestionDetail] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
  });
  const navigate = useNavigate();

  const handleDeleteClick = (questionId) => {
    setSelectedQuestionId(questionId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (questionId) => {
    try {
      await axiosInstance.delete(
        `/questions/${questionId}`
      );
      setNotification({
        isVisible: true,
        message: "Xóa câu hỏi thành công!",
        bgColor: "green",
        icon: <IoCheckmarkDone />,
      });
      setIsDeleteModalOpen(false);
      window.history.back();
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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get(
          "/questions"
        );
        setQuestions(response.data);
      } catch (err) {
        console.log(err.message || "Something went wrong");
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      // Tìm question với id tương ứng
      const foundQuestion = questions.find(
        (question) => question.id === parseInt(id, 10)
      );
      setQuestionDetail(foundQuestion);
    }
  }, [questions, id]);

  return (
    <div className="w-full h-full max-w-4xl mx-auto mt-8 bg-gray-100 px-10 py-5 font-nunito">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {id} - <span>{questionDetail?.question}</span>
          </h1>
        </div>
        <div className="flex items-center justify-center">
          <div className="mr-6">
            <button
              onClick={() => navigate(`/giangvien/chinhsuacauhoi/${id}`)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              <FaEdit size={24} />
            </button>
          </div>
          <div>
            <button
              onClick={() => handleDeleteClick(id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-2 py-2 px-4 rounded-lg transition duration-300"
            >
              <IoTrashSharp size={24} />
            </button>
          </div>
        </div>
      </div>

      <Notification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        bgColor={notification.bgColor}
        icon={notification.icon}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        questionId={selectedQuestionId}
      />

      {/* Chi tiết câu hỏi */}
      <div className="overflow-x-auto max-h-[500px] bg-white rounded-2xl">
        <div className="px-12 py-6">
          <div className="mb-6">
            <h2 className="font-semibold mb-2">
              Tên môn học: <span>{questionDetail?.subject_name}</span>
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold">
                  Câu hỏi: <span>{questionDetail?.question}</span>
                </h2>
              </div>
              <div className="mr-4">
                <p className="font-semibold">
                  Độ khó:{" "}
                  <span className="font-normal mr-2">
                    {questionDetail?.level}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center">
                <input type="radio" name="id__answer--4" />
                <span className="ml-2">{questionDetail?.answer_a}</span>
                {questionDetail?.rightanswer === "A" && (
                  <FaCheck size={20} className="text-green-500 ml-2 mb-1" />
                )}
              </div>
              <div className="mb-3 flex items-center">
                <input type="radio" name="id__answer--4" />
                <span className="ml-2">{questionDetail?.answer_b}</span>
                {questionDetail?.rightanswer === "B" && (
                  <FaCheck size={20} className="text-green-500 ml-2 mb-1" />
                )}
              </div>
              <div className="mb-3 flex items-center">
                <input type="radio" name="id__answer--4" />
                <span className="ml-2">{questionDetail?.answer_c}</span>
                {questionDetail?.rightanswer === "C" && (
                  <FaCheck size={20} className="text-green-500 ml-2 mb-1" />
                )}
              </div>
              <div className="mb-3 flex items-center">
                <input type="radio" name="id__answer--4" />
                <span className="ml-2">{questionDetail?.answer_d}</span>
                {questionDetail?.rightanswer === "D" && (
                  <FaCheck size={20} className="text-green-500 ml-2 mb-1" />
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              <div className="flex items-center justify-center">
                <IoArrowBackOutline size={20} className="mr-1" />
                Quay lại
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionInfo;
