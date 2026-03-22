import React from "react";
import { MessageSquare } from "lucide-react";

const StaffReviewsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-400 rounded-2xl mb-4">
          <MessageSquare size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Đánh giá</h2>
        <p className="text-slate-400 text-sm">Tính năng đang được phát triển.</p>
      </div>
    </div>
  );
};

export default StaffReviewsPage;
