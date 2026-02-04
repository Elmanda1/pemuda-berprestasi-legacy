interface TimelineCardProps {
  event: string;
  time: string;
  isModern?: boolean;
}

export const TimelineCardKanan = ({ event, time, isModern = false }: TimelineCardProps) => {
  return (
    <div className={`rounded-lg hover:scale-102 transition-transform duration-300 ease-in-out relative flex 
      ${isModern
        ? "bg-[#111] text-white border-gray-800 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
        : "bg-[#F5B700]/20 text-red border-red"
      } 
      w-[13rem] h-[5rem] sm:w-[16rem] sm:h-[6rem] md:w-[18rem] md:h-[7rem] lg:w-[20rem] lg:h-[7rem] xl:w-[22rem] xl:h-[8rem] 
      shadow-2xl justify-center items-center border font-bebas`}
    >
      {/* Content */}
      <div className="text-center lowercase px-2">
        <p className={`${isModern ? "text-gray-100" : "text-red"} text-xl md:text-2xl xl:text-3xl`}>{event}</p>
        <p className={`${isModern ? "text-red-500 font-bold" : "text-black"} md:text-lg`}>{time}</p>
      </div>
    </div>
  );
};

export const TimelineCardKiri = ({ event, time, isModern = false }: TimelineCardProps) => {
  return (
    <div className={`rounded-lg hover:scale-102 transition-transform duration-300 ease-in-out relative flex 
      ${isModern
        ? "bg-[#111] text-white border-gray-800 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
        : "bg-[#F5B700]/20 text-red border-red"
      } 
      sm:w-[16rem] sm:h-[6rem] md:w-[18rem] md:h-[7rem] lg:w-[20rem] lg:h-[7rem] xl:w-[22rem] xl:h-[8rem] 
      justify-center shadow-2xl items-center border font-bebas rotate-y-180`}
    >
      {/* Content */}
      <div className="text-center rotate-y-180 px-2">
        <p className={`${isModern ? "text-gray-100" : "text-red"} text-xl md:text-2xl xl:text-3xl`}>{event}</p>
        <p className={`${isModern ? "text-red-500 font-bold" : "text-black"} md:text-lg`}>{time}</p>
      </div>
    </div>
  );
};
