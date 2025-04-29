import { useState, useEffect } from "react";
import { RefreshCw, CheckCircle } from "lucide-react";

export default function OrderStatusUpdate({ onClose }) {
  const [stage, setStage] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage(1);
      setTimeout(() => {
        setStage(2);
        setTimeout(() => {
          onClose();
        }, 1000);
      }, 1000);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {stage === 0 && (
        <div className="flex flex-col items-center">
          <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="mt-4 text-lg">Updating order status...</p>
        </div>
      )}
      {stage === 1 && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <RefreshCw className="w-16 h-16 text-blue-500" />
            <CheckCircle className="absolute -right-2 -bottom-2 w-8 h-8 text-green-500 animate-bounce" />
          </div>
          <p className="mt-4 text-lg">Status updated!</p>
        </div>
      )}
      {stage === 2 && (
        <div className="flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <p className="mt-4 text-lg">Order successfully updated</p>
        </div>
      )}
    </div>
  );
}