interface TimelineCardProps {
  event: string;
  time: string;
  isModern?: boolean;
  primaryColor?: string;
}

export const TimelineCardKanan = ({ event, time, isModern = false, primaryColor = '#DC2626' }: TimelineCardProps) => {
  return (
    <div className={`rounded-lg hover:scale-102 transition-transform duration-300 ease-in-out relative flex 
      ${isModern
        ? "bg-[#111] text-white border-gray-800"
        : "text-red border-red"
      } 
      w-[13rem] h-[5rem] sm:w-[16rem] sm:h-[6rem] md:w-[18rem] md:h-[7rem] lg:w-[20rem] lg:h-[7rem] xl:w-[22rem] xl:h-[8rem] 
      shadow-2xl justify-center items-center border font-bebas`}
      style={{
        boxShadow: isModern ? `0 0 15px ${primaryColor}33` : 'none',
        backgroundColor: !isModern ? `${primaryColor}33` : '#111',
        borderColor: primaryColor
      }}
    >
      {/* Content */}
      <div className="text-center lowercase px-2">
        <p className={`text-xl md:text-2xl xl:text-3xl`} style={!isModern ? { color: primaryColor } : { color: '#f3f4f6' }}>{event}</p>
        <p className={`md:text-lg`} style={!isModern ? { color: '#000' } : { color: primaryColor }}>{time}</p>
      </div>
    </div>
  );
};

export const TimelineCardKiri = ({ event, time, isModern = false, primaryColor = '#DC2626' }: TimelineCardProps) => {
  return (
    <div className={`rounded-lg hover:scale-102 transition-transform duration-300 ease-in-out relative flex 
      ${isModern
        ? "bg-[#111] text-white border-gray-800"
        : "text-red border-red"
      } 
      sm:w-[16rem] sm:h-[6rem] md:w-[18rem] md:h-[7rem] lg:w-[20rem] lg:h-[7rem] xl:w-[22rem] xl:h-[8rem] 
      justify-center shadow-2xl items-center border font-bebas rotate-y-180`}
      style={{
        boxShadow: isModern ? `0 0 15px ${primaryColor}33` : 'none',
        backgroundColor: !isModern ? `${primaryColor}33` : '#111',
        borderColor: primaryColor
      }}
    >
      {/* Content */}
      <div className="text-center rotate-y-180 px-2">
        <p className={`text-xl md:text-2xl xl:text-3xl`} style={!isModern ? { color: primaryColor } : { color: '#f3f4f6' }}>{event}</p>
        <p className={`md:text-lg`} style={!isModern ? { color: '#000' } : { color: primaryColor }}>{time}</p>
      </div>
    </div>
  );
};
