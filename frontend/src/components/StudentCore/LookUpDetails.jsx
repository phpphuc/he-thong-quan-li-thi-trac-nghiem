import { useState, useEffect } from "react";
import { MdOutlineReport } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import ModalQuestionReport from "./ModalQuestionReport";
import axiosInstance from "../../utils/axiosConfig";
import { useParams } from "react-router-dom";

const DoTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [examDetails, setExamDetails] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axiosInstance.get(`/students/completed-exams/${id}`);
        const data = await response.data;
        setExamDetails(data.exam_details);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };

    fetchExamDetails();
  }, [id]);

  const handleReportClick = () => {
    setShowModal(true);
  };

  if (!examDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full max-w-4xl mx-auto mt-8 bg-gray-100 px-10 py-5 font-nunito">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">
            Bài thi môn <span>{examDetails.subject.name}</span>
          </h1>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-blue-600 font-bold mr-12">
            Kết quả: <span>{examDetails.score}</span>/10
          </div>
          <div className="text-blue-600 font-bold mr-12">
            Câu đúng: <span>{examDetails.total_questions}</span>/40
          </div>
        </div>
      </div>

      {/* Nội dung bài thi */}
      <div className="overflow-x-auto max-h-[480px] bg-white rounded-2xl">
        <div className="px-12 py-6">
          {/* Các câu hỏi và câu trả lời */}
          {examDetails.questions.map((question, index) => (
            <div className="mb-6" key={question.id}>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">
                  <span>{index + 1}</span>
                  <span>. {question.question_text}</span>
                </h2>
                <button
                  className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  onClick={handleReportClick}
                >
                  <MdOutlineReport size={24} className="mr-2" />
                  <span>Báo lỗi</span>
                </button>
              </div>
              <div>
                <div className="mb-3 flex items-center">
                  <input type="radio" name={`id__answer--${question.id}`} checked={question.selected_answer === "A"} readOnly />
                  <span className="ml-2">
                    A. {question.answer_a}
                  </span>
                </div>
                <div className="mb-3 flex items-center">
                  <input type="radio" name={`id__answer--${question.id}`} checked={question.selected_answer === "B"} readOnly />
                  <span className="ml-2">
                    B. {question.answer_b}
                  </span>
                </div>
                <div className="mb-3 flex items-center">
                  <input type="radio" name={`id__answer--${question.id}`} checked={question.selected_answer === "C"} readOnly />
                  <span className="ml-2">
                    C. {question.answer_c}
                  </span>
                </div>
                <div className="mb-3 flex items-center">
                  <input type="radio" name={`id__answer--${question.id}`} checked={question.selected_answer === "D"} readOnly />
                  <span className="ml-2">
                    D. {question.answer_d}
                  </span>
                </div>
                <div className={`ml-2 ${question.is_correct ? 'text-green-500' : 'text-red-500'}`}>
                  {question.is_correct ? 'Correct' : `Incorrect, correct answer is ${question.rightanswer}`}
                </div>
              </div>
            </div>
          ))}

          {/* Modal popup báo lỗi */}
          <ModalQuestionReport
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>

      <div className="text-center mt-5">
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
  );
};

export default DoTest;