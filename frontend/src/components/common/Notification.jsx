import { X } from "lucide-react";
import { IoWarning } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const Notification = ({ message, isVisible, onClose, bgColor, icon }) => {
  const bgColorClass =
    {
      green: "bg-green-200",
      red: "bg-red-200",
      yellow: "bg-yellow-200",
    }[bgColor] || "bg-yellow-200";

  const iconBgColorClass =
    {
      green: "bg-green-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
    }[bgColor] || "bg-yellow-500";

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 20 }}
          exit={{ opacity: 0, y: 0 }}
          className={`fixed top-12 right-8 ${bgColorClass} text-gray-800 px-4 py-2 rounded-md shadow-lg z-50 flex items-center space-x-2`}
        >
          <div className={`${iconBgColorClass} text-white rounded-full p-1`}>
            {icon ? icon : <IoWarning size={24} />}
          </div>
          <div>
            <h3 className="text-lg font-medium">Thông báo</h3>
            <p>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
