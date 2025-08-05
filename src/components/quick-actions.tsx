import { Plus, ArrowUp, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const { toast } = useToast();

  const handleDeposit = () => {
    toast({
      title: "Deposit Modal",
      description: "Deposit functionality would open here",
    });
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdraw Modal", 
      description: "Withdraw functionality would open here",
    });
  };

  const handleOptimize = () => {
    toast({
      title: "AI Portfolio Optimization",
      description: "Running AI optimization algorithm...",
    });
  };

  return (
    <div className="px-4 pb-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleDeposit}
          className="bg-brand-green hover:bg-brand-green-dark text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 transform hover:scale-[0.98] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Deposit</span>
        </button>
        
        <button 
          onClick={handleWithdraw}
          className="bg-bg-secondary hover:bg-gray-50 text-text-primary font-medium py-3 px-4 rounded-xl border border-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2 transform hover:scale-[0.98] active:scale-95"
        >
          <ArrowUp className="w-4 h-4" />
          <span>Withdraw</span>
        </button>
      </div>
      
      <button 
        onClick={handleOptimize}
        className="w-full mt-3 bg-gradient-to-r from-brand-green to-brand-green-dark hover:from-brand-green-dark hover:to-brand-green text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-[0.98] active:scale-95"
      >
        <Wand2 className="w-4 h-4" />
        <span>AI Optimize Portfolio</span>
      </button>
    </div>
  );
}
