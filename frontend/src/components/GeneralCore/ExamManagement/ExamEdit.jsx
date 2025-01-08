import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBackOutline, IoCheckmarkDone } from "react-icons/io5";
import { ShieldX } from "lucide-react";
import { IoMdAdd } from "react-icons/io";
import Notification from "../../common/Notification";
import axiosInstance from "../../../utils/axiosConfig";
import dayjs from "dayjs";

const ExamEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialData = {
    test_name: "",
    subject_id: "",
    teacher_id: 1,
    time: "",
    examtype: "NORMAL",
    Qtype1: 0,
    Qtype2: 0,
    Qtype3: 0,
    Qnumber: 1,
    start_time: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    bgColor: "",
    icon: null,
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axiosInstance.get(`/teachers/exams/${id}`);
        const exam = response.data.exam;
        setFormData({
          test_name: exam.test_name,
          subject_id: exam.subject.id,
          subject_name: exam.subject.name,
          teacher_id: exam.teacher_id,
          time: exam.time,
          examtype: exam.examtype,
          Qtype1: exam.Qtype1,
          Qtype2: exam.Qtype2,
          Qtype3: exam.Qtype3,
          Qnumber: exam.Qnumber,
          start_time: dayjs(exam.start_time).format('YYYY-MM-DDTHH:mm'),
        });
        console.log("Exam data: ", exam);
      } catch (error) {
        console.log("Error fetching exam:", error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/teachers/subjects');
        setSubjects(response.data.subjects);
      } catch (error) {
        console.log("Error fetching subjects:", error);
      }
    };

    fetchExam();
    fetchSubjects();
  }, [id]);

  const handleSubmit = async () => {
    if (!formData.test_name.trim()) {
      setNotification({
        isVisible: true,
        message: "Vui lòng điền đầy đủ tên kỳ thi!",
        bgColor: "red",
        icon: <ShieldX />,
      });
      return;
    }

    if (!formData.time) {
      setNotification({
        isVisible: true,
        message: "Vui lòng điền thời gian làm bài!",
        bgColor: "red",
        icon: <ShieldX />,
      });
      return;
    }

    if (!formData.subject_id) {
      setNotification({
        isVisible: true,
        message: "Vui lòng chọn môn học!",
        bgColor: "red",
        icon: <ShieldX />,
      });
      return;
    }

    if (!formData.start_time.trim()) {
      setNotification({
        isVisible: true,
        message: "Vui lòng điền thời gian bắt đầu!",
        bgColor: "red",
        icon: <ShieldX />,
      });
      return;
    }

    const formattedStartTime = dayjs(formData.start_time).format('YYYY-MM-DD HH:mm:ss');

    try {
      console.log("formData to update exam: ", { ...formData, start_time: formattedStartTime });
      await axiosInstance.patch(`/exams/${id}`, { ...formData, start_time: formattedStartTime });
      setNotification({
        isVisible: true,
        message: "Cập nhật kỳ thi thành công!",
        bgColor: "green",
        icon: <IoCheckmarkDone />,
      });
      navigate(`/giangvien/chitietdethi/${id}`);
    } catch (error) {
      setNotification({
        isVisible: true,
        message: "Có lỗi xảy ra khi cập nhật kỳ thi!",
        bgColor: "red",
        icon: <ShieldX />,
      });
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full max-w-4xl mx-auto mt-8 bg-gray-100 px-10 py-5 font-nunito">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold hidden">
          Tiêu đề:{" "}
          <input
            type="text"
            value={formData.test_name}
            placeholder=""
            disabled
            className="border border-gray-300 rounded px-2 py-1"
          />
        </h1>
      </div>

      <div className="overflow-x-auto max-h-[500px] bg-white rounded-2xl">
        <div className="px-12 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <input
                  type="text"
                  value={formData.test_name}
                  onChange={(e) =>
                    setFormData({ ...formData, test_name: e.target.value })
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-96 font-semibold"
                  placeholder="Nhập tên kỳ thi"
                />
              </div>
              <div className="mr-4 flex items-center">
                <p className="font-semibold mr-2">Thời gian:</p>
                <input
                  type="number"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: parseInt(e.target.value) })
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-24"
                  placeholder="Phút"
                />
              </div>
            </div>
            <select
              disabled
              value={formData.subject_id}
              onChange={(e) => {
                const selectedSubject = subjects.find(sub => sub.id === parseInt(e.target.value));
                setFormData({
                  ...formData,
                  subject_id: parseInt(e.target.value),
                  subject_name: selectedSubject ? selectedSubject.name : "",
                });
              }}
              className="border border-gray-300 rounded px-2 py-1 font-semibold mb-6"
            >
              <option value="">Chọn môn học</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <div className="flex items-center mb-4">
              <p className="font-semibold mr-2">Cấu trúc:</p>
              <select
                disabled
                value={formData.examtype}
                onChange={(e) =>{
                  const filteredExamTypes = formData.subject_id
                    ? examStructures.filter(structure => structure.subject_id === parseInt(formData.subject_id))
                    : [];
                  setFormData({ ...formData, examtype: e.target.value })
                }
                }
                className="border border-gray-300 rounded px-2 py-1"
              >
                  <option >
                    {formData.examtype}
                  </option>
{/* ))} */}
              </select>
            </div>
            <div className="flex items-center mb-4">
              <p className="font-semibold mr-2">Số câu hỏi loại 1:</p>
              <input
                disabled
                type="number"
                value={formData.Qtype1}
                onChange={(e) =>
                  setFormData({ ...formData, Qtype1: parseInt(e.target.value) })
                }
                className="border border-gray-300 rounded px-2 py-1 w-24"
              />
            </div>
            <div className="flex items-center mb-4">
              <p className="font-semibold mr-2">Số câu hỏi loại 2:</p>
              <input
                disabled
                type="number"
                value={formData.Qtype2}
                onChange={(e) =>
                  setFormData({ ...formData, Qtype2: parseInt(e.target.value) })
                }
                className="border border-gray-300 rounded px-2 py-1 w-24"
              />
            </div>
            <div className="flex items-center mb-4">
              <p className="font-semibold mr-2">Số câu hỏi loại 3:</p>
              <input
                disabled
                type="number"
                value={formData.Qtype3}
                onChange={(e) =>
                  setFormData({ ...formData, Qtype3: parseInt(e.target.value) })
                }
                className="border border-gray-300 rounded px-2 py-1 w-24"
              />
            </div>
            <div className="flex items-center mb-4">
              <p className="font-semibold mr-2">Tổng số câu hỏi:</p>
              <input
                disabled
                type="number"
                value={formData.Qnumber}
                onChange={(e) =>
                  setFormData({ ...formData, Qnumber: parseInt(e.target.value) })
                }
                className="border border-gray-300 rounded px-2 py-1 w-24"
              />
            </div>
            <div className="flex items-center mb-4">
              <p className="font-semibold mr-2">Thời gian bắt đầu:</p>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-1"
              />
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
              className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              <div className="flex items-center justify-center">
                Cập nhật
                <IoMdAdd size={24} className="ml-1 mb-0.5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamEdit;