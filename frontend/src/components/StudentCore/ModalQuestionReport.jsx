import { MdClose } from 'react-icons/md';

const ModalQuestionReport = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-lg p-6 w-96 max-w-md relative flex flex-col justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onClose}
            >
              <MdClose size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Báo lỗi câu hỏi <span>1</span></h2>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-md p-2 mb-4"
              placeholder="Nhập mô tả lỗi..."
            ></textarea>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalQuestionReport;