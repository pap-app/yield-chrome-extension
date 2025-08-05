import { motion } from "framer-motion";

interface TimePeriodSelectorProps {
  activePeriod: string;
  onPeriodChange: (period: string) => void;
}

const periods = [
  { id: "1d", label: "1D" },
  { id: "1w", label: "1W" },
  { id: "1m", label: "1M" },
  { id: "1y", label: "1Y" },
  { id: "max", label: "MAX" },
];

export default function TimePeriodSelector({ activePeriod, onPeriodChange }: TimePeriodSelectorProps) {
  return (
    <div className="flex items-center justify-center space-x-1 mt-4">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => onPeriodChange(period.id)}
          className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
            activePeriod === period.id
              ? "text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {activePeriod === period.id && (
            <motion.div
              layoutId="activePeriod"
              className="absolute inset-0 bg-black dark:bg-white rounded-md"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{period.label}</span>
        </button>
      ))}
    </div>
  );
}