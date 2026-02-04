import { useState } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";

type FaqCardProps = {
  question: string;
  answer: string;
  isModern?: boolean;
};

const FaqCard = ({ question, answer, isModern = false }: FaqCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`w-full border-b-2 px-8 py-5 cursor-pointer group transition-colors duration-300
      ${isModern
        ? "border-gray-800 hover:bg-white/5"
        : "border-yellow"
      }`}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`font-bebas text-2xl sm:text-3xl md:text-4xl lg:text-4xl leading-none group-hover:scale-103 transition-discrete duration-300 pr-4
          ${isModern ? "text-gray-200 group-hover:text-white" : "text-red"}`}
        >
          {question}
        </div>
        <div
          className={`transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"
            }`}
        >
          {isOpen ? (
            <CircleMinus size={28} className={isModern ? "text-red-500" : "text-black"} />
          ) : (
            <CirclePlus size={28} className={isModern ? "text-gray-500 group-hover:text-red-500" : "text-black"} />
          )}
        </div>
      </div>


      {/* Body (animasi expand/collapse) */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-40 mt-4" : "max-h-0"
          }`}
      >
        <div className={`font-plex text-sm md:text-lg ${isModern ? "text-gray-400" : "text-black"}`}>
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FaqCard;
