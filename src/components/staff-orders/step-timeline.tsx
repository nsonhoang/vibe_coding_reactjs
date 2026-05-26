import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Order } from "@/services/order-service";

interface StepTimelineProps {
  status: Order["status"];
}

export const StepTimeline: React.FC<StepTimelineProps> = React.memo(({ status }) => {
  const getStepIndex = (currentStatus: Order["status"]) => {
    switch (currentStatus) {
      case "PENDING": return 0;
      case "PROCESSING": return 1;
      case "SHIPPED": return 2;
      case "DELIVERED":
      case "COMPLETED": return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(status);
  const isCancelled = status === "CANCELLED";

  const steps = [
    { label: "Chờ duyệt", status: "PENDING" },
    { label: "Đóng gói", status: "PROCESSING" },
    { label: "Đang giao", status: "SHIPPED" },
    { label: "Hoàn thành", status: "COMPLETED" },
  ];

  if (isCancelled) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-450 rounded-xl p-3.5 flex items-center gap-3 shadow-xs animate-pulse">
        <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
        <div>
          <p className="font-extrabold text-xs uppercase tracking-wider">Đơn hàng này đã bị hủy</p>
          <p className="text-[10px] font-semibold opacity-90 mt-0.5">Quy trình đóng gói và giao vận đã dừng lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-border/60 rounded-xl p-4.5 shadow-xs">
      <div className="flex items-center justify-between relative w-full px-3">
        {/* Background Line */}
        <div className="absolute top-1/2 left-[5%] right-[5%] h-0.5 bg-border/60 -translate-y-1/2 z-0" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-[5%] h-0.5 bg-primary -translate-y-1/2 transition-all duration-500 ease-in-out z-0"
          style={{ width: `${(currentStepIndex / 3) * 90}%` }}
        />

        {/* Step Nodes */}
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          return (
            <div key={idx} className="flex flex-col items-center relative z-10 flex-1">
              <div className={`w-7.5 h-7.5 rounded-full border-2 flex items-center justify-center font-bold text-[10px] transition-all duration-300 ${
                isCompleted 
                  ? "bg-primary border-primary text-primary-foreground shadow-sm scale-105" 
                  : isActive 
                  ? "bg-card border-primary text-primary shadow-[0_0_12px_rgba(var(--primary),0.35)] font-black scale-110" 
                  : "bg-card border-border text-muted-foreground"
              }`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest mt-2 transition-colors duration-300 ${
                isActive ? "text-primary font-black scale-105" : "text-muted-foreground/90"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

StepTimeline.displayName = "StepTimeline";
