import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-gray-200">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-bold text-gray-800">Oops!</span>
          </div>
        </div>
        
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          Trang bạn tìm kiếm không tồn tại
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Xin lỗi, nhưng trang bạn đang tìm không tồn tại. Có thể bạn đã nhập sai địa chỉ hoặc trang đã được chuyển đi.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 text-white font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;