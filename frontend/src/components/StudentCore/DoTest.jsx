import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import axiosInstance from "../../utils/axiosConfig";
import { useAuth } from "../auth/AuthContext";

const DoTest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [examData, setExamData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const { studentCurrentView, setStudentCurrentView } = useAuth();

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        // let studentId = JSON.parse(localStorage.getItem("user")).id;
        const response = await axiosInstance.get(`students/exams/${id}`);
        // const response = await axiosInstance.get(`/students/${studentId}/exams/${id}`);
        const exam = response.data.exam;
        setExamData(exam);
        // setTimeLeft(exam.time * 60);
        setTimeLeft(response.data.exam.time_left);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exam:", error);
        alert("Có lỗi xảy ra khi tải bài thi!");
      }
    };

    fetchExamData();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && examData) {
      handleSubmit();
    }
  }, [timeLeft, examData]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.keys(userAnswers).map((questionId) => ({
        question_id: parseInt(questionId),
        answer: userAnswers[questionId],
      }));
      // console.log({
      //   student_id: JSON.parse(localStorage.getItem("user")).id,
      //   answers: formattedAnswers,
      // })

    const studentId = parseInt(JSON.parse(localStorage.getItem("user")).id);
      const response = await axiosInstance.post(`/exams/${id}/submit`, {
        student_id: studentId,
        answers: formattedAnswers,
      });

    const { score, total } = response.data;
    alert(`Bài thi đã được nộp! \nĐiểm của bạn: ${score}/${total}`);

    navigate("/sinhvien");
    // setStudentCurrentView("baithi");
    // navigate("/sinhvien");
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Có lỗi xảy ra khi nộp bài thi!");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  const isSubmitDisabled = Object.keys(userAnswers).length === 0;

  return (
    <div className="w-full h-full max-w-4xl mx-auto bg-gray-100 px-10 py-5 font-nunito">
      <h1 className="text-2xl font-bold mb-4">{examData.test_name}</h1>
      <div className="flex items-center mb-4">
        <Clock size={24} />
        <span className="ml-2 text-xl">{formatTime(timeLeft)}</span>
      </div>
      {examData.questions.map((question) => (
        <div key={question.id} className="mb-6">
          <h2 className="text-lg font-semibold">{question.question}</h2>
          <div className="mt-2">
            <div className="mb-3 flex items-center">
              <input
                type="radio"
                name={`question_${question.id}`}
                value="A"
                checked={userAnswers[question.id] === "A"}
                onChange={() => handleAnswerChange(question.id, "A")}
              />
              <span className="ml-2">{question.answer_a}</span>
            </div>
            <div className="mb-3 flex items-center">
              <input
                type="radio"
                name={`question_${question.id}`}
                value="B"
                checked={userAnswers[question.id] === "B"}
                onChange={() => handleAnswerChange(question.id, "B")}
              />
              <span className="ml-2">{question.answer_b}</span>
            </div>
            <div className="mb-3 flex items-center">
              <input
                type="radio"
                name={`question_${question.id}`}
                value="C"
                checked={userAnswers[question.id] === "C"}
                onChange={() => handleAnswerChange(question.id, "C")}
              />
              <span className="ml-2">{question.answer_c}</span>
            </div>
            <div className="mb-3 flex items-center">
              <input
                type="radio"
                name={`question_${question.id}`}
                value="D"
                checked={userAnswers[question.id] === "D"}
                onChange={() => handleAnswerChange(question.id, "D")}
              />
              <span className="ml-2">{question.answer_d}</span>
            </div>
          </div>
        </div>
      ))}
      <button
        // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
      >
        Nộp bài
      </button>
    </div>
  );
};

export default DoTest;