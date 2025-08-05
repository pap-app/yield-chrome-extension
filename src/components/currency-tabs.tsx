import { motion } from "framer-motion";

interface CurrencyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "all", label: "All" },
  { id: "usdc", label: "USDC" },
  { id: "eurc", label: "EURC" },
  { id: "xlm", label: "XLM" },
];

export default function CurrencyTabs({ activeTab, onTabChange }: CurrencyTabsProps) {
  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
            activeTab === tab.id
              ? "text-white"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-black dark:bg-white rounded-full"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}