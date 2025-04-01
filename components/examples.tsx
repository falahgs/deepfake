import { motion } from "framer-motion";

interface Example {
  title: string;
  description: string;
  prompt: string;
}

const examples: Example[] = [
  {
    title: "Count letters",
    description: "Count occurrences of a letter in a word",
    prompt: "How many 'r's are in the word strawberry?",
  },
  {
    title: "Math Problem",
    description: "Solve step by step math problems",
    prompt: "If a train travels 120 km in 2 hours, what is its average speed?",
  },
  {
    title: "Logic Puzzle",
    description: "Solve logic puzzles systematically",
    prompt: "If all A are B, and some B are C, what can we conclude about A and C?",
  },
  {
    title: "Scientific Analysis",
    description: "Break down scientific concepts",
    prompt: "Explain how photosynthesis works, step by step.",
  }
];

export function Examples({ onSelectExample }: { onSelectExample: (prompt: string) => void }) {
  return (
    <div className="hidden lg:block w-64 p-4 bg-gray-50 dark:bg-zinc-800/30 min-h-screen">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Examples</h2>
      <div className="space-y-3">
        {examples.map((example, index) => (
          <motion.div
            key={example.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="cursor-pointer"
            onClick={() => onSelectExample(example.prompt)}
          >
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{example.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{example.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 