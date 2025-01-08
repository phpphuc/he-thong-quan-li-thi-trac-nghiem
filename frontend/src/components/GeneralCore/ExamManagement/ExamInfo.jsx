import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { IoTrashSharp, IoArrowBackOutline, IoInformationCircle } from "react-icons/io5";
import DeleteModal from "../../common/DeleteModal";
import Notification from "../../common/Notification";
import axiosInstance from "../../../utils/axiosConfig";

const ExamInfo = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axiosInstance.get(
          `/teachers/exams/${id}`
        );
        console.log(response.data)
        setExam(response.data.exam);
      } catch (err) {
        console.log(err.message || "Something went wrong");
      }
    };

    fetchExam();
  }, [id]);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/exams/${id}`);
      setNotification({
        isVisible: true,
        message: "Xóa kỳ thi thành công!",
        bgColor: "green",
        icon: <IoCheckmarkDone />,
      });
      setIsDeleteModalOpen(false);
      navigate("/giangvien/kythi");
    } catch (err) {
      console.log(err.message || "Error deleting exam");
      setNotification({
        isVisible: true,
        message: "Đã xảy ra lỗi khi xóa kỳ thi! Hãy thử lại sau.",
        bgColor: "red",
        icon: <ShieldX />,
      });
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="w-full h-full max-w-5xl mx-auto mt-8 bg-gray-100 px-10 py-5 font-nunito">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {exam ? `${exam.id} - ${exam.test_name}` : "Loading..."}
          </h1>
        </div>
        <div className="flex items-center justify-center">
          <div className="mr-6">
            <button
              onClick={() => navigate(`/giangvien/chinhsuadethi/${id}`)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              <FaEdit size={24} />
            </button>
          </div>
          <div>
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 hover:bg-red-700 text-white font-bold ml-2 py-2 px-4 rounded-lg transition duration-300"
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
      />

      {exam && ( <div className="bg-white rounded-2xl p-6 mb-8 shadow">
              <h2 className="text-2xl font-bold mb-4">Thông tin đề thi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-semibold">Mã đề:</span> {exam.id}</p>
                  <p><span className="font-semibold">Tên bộ đề:</span> {exam.test_name}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Môn học:</span> {exam.subject.name}</p>
                  <p><span className="font-semibold">Ngày tạo:</span> {new Date(exam.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Cấu trúc:</span> {exam.type}</p>
                  <p><span className="font-semibold">Thời gian:</span> {exam.time} phút</p>
                </div>
                <div>
                  <p><span className="font-semibold">Giảng viên:</span> {exam.teacher.name}</p>
                  <p><span className="font-semibold">Email:</span> {exam.teacher.email}</p>
                </div>
              </div>
              {/* <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                  onClick={() => navigate(`/giangvien/chitietdethi/${exam.id}`)}
                >
                  <IoInformationCircle size={24} />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold ml-2 py-2 px-4 rounded-lg transition duration-300"
                  onClick={handleDeleteClick}
                >
                  <IoTrashSharp size={24} />
                </button>
              </div> */}
            </div>)}
            {exam && (
        <div className="overflow-x-auto max-h-[500px] bg-white rounded-2xl">
          <div className="px-12 py-6">
            <div className="overflow-x-auto max-h-[470px] bg-white rounded-2xl">

               <table className="w-full border-collapse">
                <thead>
                  <tr className="text-center">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Nội dung</th>
                    <th className="px-4 py-2">Ngày tạo</th>
                    <th className="px-4 py-2">Độ khó</th>
                    <th className="px-4 py-2 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                   {exam.questions.map((question) => (
                      <tr key={question.id} className="border-b">
                        <td className="px-4 py-2 text-center">{question.id}</td>
                        <td className="px-4 py-2">{question.question}</td>
                        <td className="px-4 py-2 text-center">
                          {new Date(question.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center">{question.level}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                            onClick={() => navigate(`/giangvien/cauhoi/${question.id}`)}
                          >
                            <IoInformationCircle size={24} />
                          </button>
                          {/* <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold ml-2 py-2 px-4 rounded-lg transition duration-300"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <IoTrashSharp size={24} />
                          </button> */}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      )}     <div className="text-center mt-12">
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

export default ExamInfo;