import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type NotificationProps = {
  id: string;
  title: string;
  description: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
};

const getTypeStyles = (type: string = "info") => {
  switch (type) {
    case "success":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-500",
        icon: "check_circle",
      };
    case "error":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-500",
        icon: "error",
      };
    case "warning":
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-500",
        icon: "warning",
      };
    default:
      return {
        bgColor: "bg-blue-100",
        textColor: "text-blue-500",
        icon: "info",
      };
  }
};

const ToastNotification = ({
  id,
  title,
  description,
  type = "info",
  duration = 5000,
  onClose,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { dismissToast } = useToast();
  const { bgColor, textColor, icon } = getTypeStyles(type);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
      dismissToast(id);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-4 flex items-start max-w-xs ${
        isVisible ? "animate-bounce" : "opacity-0 transition-opacity duration-300"
      }`}
    >
      <div className="flex-shrink-0 mr-3">
        <div
          className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}
        >
          <span className="material-icons">{icon}</span>
        </div>
      </div>
      <div>
        <h4 className="text-gray-800 font-medium">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="text-xs text-gray-500 mt-1">Just now</div>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <span className="material-icons text-sm">close</span>
      </button>
    </div>
  );
};

export default ToastNotification;
