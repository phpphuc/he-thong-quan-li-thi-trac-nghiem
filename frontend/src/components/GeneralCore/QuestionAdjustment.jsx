import { useState, useEffect, useMemo, useCallback } from "react";
import { FaEdit, FaCheck } from "react-icons/fa";
import { IoArrowBackOutline, IoCheckmarkDone } from "react-icons/io5";
import { ShieldX } from "lucide-react";
import Notification from "../common/Notification";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

const QuestionAdjustment = () => {
  const initialData = useMemo(
    () => ({
      subject_id: "1",
      subject_name: "",
      teacher_id: 0,
      question: "",
      level: "Nhận biết",
      rightanswer: "A",
      answer_a: "",
      answer_b: "",
      answer_c: "",
      answer_d: "",
    }),
    []
  );

  const [formData, setFormData] = useState(initialData);
  const [selectedAnswer, setSelectedAnswer] = useState("A");
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
  });
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);

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

  // Filter để chỉ lấy đúng những trường dữ liệu giống như initialData
  const filterQuestionData = useCallback(
    (questionData) => {
      return Object.keys(initialData).reduce((acc, key) => {
        acc[key] =
          questionData[key] !== undefined
            ? questionData[key]
            : initialData[key];
        return acc;
      }, {});
    },
    [initialData]
  );

  useEffect(() => {
    if (questions.length > 0) {
      const foundQuestion = questions.find(
        (question) => question.id === parseInt(id, 10)
      );
      if (foundQuestion) {
        const filteredData = filterQuestionData(foundQuestion);
        setFormData(filteredData);
        setSelectedAnswer(foundQuestion.rightanswer);
      }
    }
  }, [questions, id, filterQuestionData]);

  const handleAnswerChange = (answer) => {
    setSelectedAnswer(answer);
    setFormData({ ...formData, rightanswer: answer });
  };

  const handleSubmit = async () => {
    if (!formData.question.trim()) {
      setNotification({
        isVisible: true,
        message: "Vui lòng điền đầy đủ câu hỏi!",
      });
      return;
    }

    if (
      !formData.answer_a.trim() ||
      !formData.answer_b.trim() ||
      !formData.answer_c.trim() ||
      !formData.answer_d.trim()
    ) {
      setNotification({
        isVisible: true,
        message: "Vui lòng điền đầy đủ các phương án trả lời!",
      });
      return;
    }

    if (!formData.rightanswer) {
      setNotification({
        isVisible: true,
        message: "Vui lòng chọn đáp án đúng!",
      });
      return;
    }

    try {
      await axiosInstance.put(`/questions/${id}`, formData);
      setNotification({
        isVisible: true,
        message: "Cập nhật câu hỏi thành công!",
        bgColor: "green",
        icon: <IoCheckmarkDone />,
      });
    } catch (error) {
      setNotification({
        isVisible: true,
        message: "Có lỗi xảy ra khi cập nhật câu hỏi!",
        bgColor: "red",
        icon: <ShieldX />,
      });
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full max-w-4xl mx-auto mt-8 bg-gray-100 px-10 py-5 font-nunito">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          {id} - {formData.question}
        </h1>
      </div>

      <div className="overflow-x-auto max-h-[500px] bg-white rounded-2xl">
        <div className="px-12 py-6">
          <div className="mb-6">
            <span className="font-semibold">Tên môn học: </span>
            <input
              type="text"
              value={formData.subject_name}
              onChange={(e) =>
                setFormData({ ...formData, subject_name: e.target.value })
              }
              className="border border-gray-300 rounded px-2 py-1 w-96 mb-3 font-semibold"
              placeholder="Nhập tên môn học"
              disabled
            />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold">
                  <span className="font-semibold">Câu hỏi: </span>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-96"
                    placeholder="Nhập câu hỏi"
                  />
                </h2>
              </div>
              <div className="mr-4 flex items-center">
                <p className="font-semibold mr-2">Độ khó:</p>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="Nhận biết">Nhận biết</option>
                  <option value="Thông hiểu">Thông hiểu</option>
                  <option value="Vận dụng">Vận dụng</option>
                </select>
              </div>
            </div>
            <div>
              {["A", "B", "C", "D"].map((letter) => (
                <div key={letter} className="mb-3 flex items-center">
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedAnswer === letter}
                    onChange={() => handleAnswerChange(letter)}
                  />
                  <input
                    type="text"
                    value={formData[`answer_${letter.toLowerCase()}`]}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [`answer_${letter.toLowerCase()}`]: e.target.value,
                      });
                    }}
                    className="ml-2 w-96 border border-gray-300 rounded px-2 py-1"
                    placeholder={`Phương án ${letter}`}
                  />
                  {selectedAnswer === letter && (
                    <FaCheck size={20} className="text-green-500 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Notification
            message={notification.message}
            isVisible={notification.isVisible}
            onClose={() =>
              setNotification({ ...notification, isVisible: false })
            }
            bgColor={notification.bgColor}
            icon={notification.icon}
          />

          <div className="text-center mt-12 flex items-center justify-center">
            <button
              onClick={() => window.history.back()}
              className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              <div className="flex items-center justify-center">
                <IoArrowBackOutline size={20} className="mr-1" />
                Quay lại
              </div>
            </button>
            <button
              onClick={handleSubmit}
              className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              <div className="flex items-center justify-center">
                Cập nhật
                <FaEdit size={20} className="ml-2 mb-0.5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionAdjustment;
