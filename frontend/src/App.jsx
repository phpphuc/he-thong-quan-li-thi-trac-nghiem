import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/pages/LoginPage/Login";
import NotFound from "./components/pages/NotFoundPage/NotFound";

// Trang dành cho sinh viên
import StudentPage from "./components/pages/StudentPage/StudentPage";
import Test from "./components/pages/StudentPage/Test";
import LookUp from "./components/pages/StudentPage/LookUp";

// Trang dành cho giảng viên
import TeacherPage from "./components/pages/TeacherPage/TeacherPage";
import QuestionDetail from "./components/pages/TeacherPage/QuestionDetail";
import EditQuestion from "./components/pages/TeacherPage/EditQuestion";
import CreateNewQuestion from "./components/pages/TeacherPage/CreateNewQuestion";
import ExamDetail from "./components/pages/TeacherPage/ExamPage/ExamDetail";
import CreateExam from "./components/pages/TeacherPage/ExamPage/CreateExam";
import EditExam from "./components/pages/TeacherPage/ExamPage/EditExam";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/sinhvien/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<StudentPage />} />
                <Route path="baithi/:id" element={<Test />} />
                <Route path="tracuu/:id" element={<LookUp />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/giangvien/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<TeacherPage />} />
                <Route path="cauhoi/:id" element={<QuestionDetail />} />
                <Route path="chinhsuacauhoi/:id" element={<EditQuestion />} />
                <Route path="taomoicauhoi" element={<CreateNewQuestion />} />
                {/* <Route path="chitietkythi" element={<ExamDetail/>}/> */}
                {/* <Route path="chinhsuakythi" element={<CreateExam/>}/> */}
                <Route path="chitietdethi/:id" element={<ExamDetail/>}/>
                <Route path="chinhsuadethi/:id" element={<EditExam/>}/>
                <Route path="taomoidethi/" element={<CreateExam/>}/>
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
